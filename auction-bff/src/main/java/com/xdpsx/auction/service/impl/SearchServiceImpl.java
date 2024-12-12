package com.xdpsx.auction.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xdpsx.auction.constant.CacheKey;
import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.auction.AuctionResponse;
import com.xdpsx.auction.dto.auction.AuctionTime;
import com.xdpsx.auction.mapper.AuctionMapper;
import com.xdpsx.auction.model.Auction;
import com.xdpsx.auction.model.enums.AuctionType;
import com.xdpsx.auction.repository.AuctionInvertedIndexRepository;
import com.xdpsx.auction.repository.AuctionRepository;
import com.xdpsx.auction.repository.specification.AuctionSpecification;
import com.xdpsx.auction.service.SearchService;
import com.xdpsx.auction.util.LevenshteinDistance;
import com.xdpsx.auction.util.TextProcessor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {
    private static final double WEIGHT_NAME = 2.0;
    private static final double WEIGHT_DESCRIPTION = 1.0;
    private static final int MAX_DISTANCE = 2;

    private final AuctionInvertedIndexRepository invertedIndexRepository;
    private final AuctionRepository auctionRepository;
    private final AuctionSpecification auctionSpec;
    private final RedisTemplate<String, Object> redisTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    @Transactional(readOnly = true)
    public PageResponse<AuctionResponse> searchAuctions(String keyword, Integer categoryId,
                                                        BigDecimal minPrice, BigDecimal maxPrice, int page, int size,
                                                        AuctionType type, AuctionTime time, String sort) {
        String cacheKey = CacheKey.getAuctionSearchKey(keyword, categoryId, minPrice, maxPrice, type, time, sort);
        Object cachedData;
        Map<Long, Double> auctionScores = null;

        if (Boolean.TRUE.equals(redisTemplate.hasKey(cacheKey))) {
            cachedData =  redisTemplate.opsForValue().get(cacheKey);
            if (cachedData instanceof String json) {
                log.info("Cahce Strng");
                try {
                    auctionScores = objectMapper.readValue(json, new TypeReference<>() {
                    });
                    log.info("auctionScores Caching{}", auctionScores);
                } catch (Exception e) {
                    log.error("Error deserializing cached data", e);
                }
            }
        }
        if (auctionScores == null) {
            log.info("No Caching");
            Set<Long> filteredAuctions = filterByCriteria(categoryId, minPrice, maxPrice, type, time, sort);

            Set<String> terms = extractTerms(keyword);
            auctionScores = fetchRelevantAuctions(terms, filteredAuctions);

            try {
                String auctionScoresJson = objectMapper.writeValueAsString(auctionScores);
                // Store the JSON string in Redis
                redisTemplate.opsForValue().set(cacheKey, auctionScoresJson);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }

        }

        int totalItems = auctionScores.size();
        int totalPages = (int) Math.ceil((double) totalItems / size);
        List<AuctionResponse> auctions = paginateAndFetch(auctionScores, page - 1, size);

        return PageResponse.<AuctionResponse>builder()
                .items(auctions)
                .pageNum(page)
                .pageSize(size)
                .totalItems(totalItems)
                .totalPages(totalPages)
                .build();
    }

    private Set<Long> filterByCriteria(Integer categoryId, BigDecimal minPrice, BigDecimal maxPrice,
                                       AuctionType type, AuctionTime time, String sort) {
        Specification<Auction> spec = auctionSpec.getSearchSpec(categoryId, sort, type, time, minPrice, maxPrice);
        return new HashSet<>(auctionRepository.findIdsBySpecification(spec));
    }

    private Set<String> extractTerms(String keyword) {
        // preprocessing
        keyword = TextProcessor.processName(keyword);
        Set<String> extractedTerms = new HashSet<>(Arrays.asList(keyword.split("\\s+")));

        // fetch similar terms
        Set<String> terms =  new HashSet<>();
        for (String term : extractedTerms) {
            int minLength = Math.max(1, term.length() - MAX_DISTANCE);
            int maxLength = term.length() + MAX_DISTANCE;

            Set<String> filteredTerms = invertedIndexRepository.findTermsByLength(minLength, maxLength);

            for (String dbTerm : filteredTerms) {
                int distance = LevenshteinDistance.calLevenshteinDistance(term, dbTerm);
                if (distance <= MAX_DISTANCE) {
                    terms.add(dbTerm);
                }
            }
        }
        return terms;
    }


    private Map<Long, Double> fetchRelevantAuctions(Set<String> terms, Set<Long> filteredAuctionIds) {
        Map<Long, Double> scores = new HashMap<>();
        long totalDocuments = filteredAuctionIds.size();

        for (String term : terms) {
            invertedIndexRepository.findById(term).ifPresent(index -> {
                double idfTitle = Math.log((double) totalDocuments / countDocuments(index.getAuctionIdsTitle()));
                double idfDescription = Math.log((double) totalDocuments / countDocuments(index.getAuctionIdsDescription()));

                updateScoresWithTfIdf(scores, index.getAuctionIdsTitle(), idfTitle, WEIGHT_NAME, term, filteredAuctionIds);
                updateScoresWithTfIdf(scores, index.getAuctionIdsDescription(), idfDescription, WEIGHT_DESCRIPTION, term, filteredAuctionIds);
            });
        }

        log.info("auction id {} - score: {}", scores.keySet(), scores.values());
        return scores;
    }

    private int countDocuments(String auctionIds) {
        return auctionIds.isEmpty() ? 0 : auctionIds.split(",").length;
    }

    private void updateScoresWithTfIdf(Map<Long, Double> scores, String auctionIds, double idf, double weight, String term, Set<Long> filteredAuctionIds) {
        if (auctionIds == null || auctionIds.isEmpty()) return;

        Map<Long, Double> tfValues = calculateTf(auctionIds, weight == WEIGHT_NAME, term, filteredAuctionIds);

        for (Map.Entry<Long, Double> entry : tfValues.entrySet()) {
            long auctionId = entry.getKey();
            double tf = entry.getValue();
            double tfIdf = tf * idf * weight;

            scores.put(auctionId, scores.getOrDefault(auctionId, 0.0) + tfIdf);
        }
    }

    private Map<Long, Double> calculateTf(String auctionIds, boolean isTitle, String term, Set<Long> filteredAuctionIds) {
        Map<Long, Double> tfValues = new HashMap<>();
        if (auctionIds == null || auctionIds.isEmpty()) {
            return tfValues;
        }

        List<Long> auctionIdList = Arrays.stream(auctionIds.split(","))
                .map(Long::parseLong)
                .filter(filteredAuctionIds::contains)
                .collect(Collectors.toList());

        List<Auction> auctions = auctionRepository.findAllById(auctionIdList);

        for (Auction auction : auctions) {
            String text = isTitle ? auction.getName() : auction.getCleanedDescription();
            if (text != null) {
                int termFrequency = countOccurrences(text, term);
                int totalWords = text.split("\\s+").length;

                if (termFrequency > 0 && totalWords > 0) {
                    double tf = (double) termFrequency / totalWords;
                    tfValues.put(auction.getId(), tf);
                }
            }
        }

        return tfValues;
    }

    private int countOccurrences(String text, String term) {
        if (text == null || term == null || term.isEmpty()) {
            return 0;
        }
        String[] words = text.toLowerCase().split("\\s+");
        int count = 0;
        for (String word : words) {
            if (word.equals(term)) {
                count++;
            }
        }
        return count;
    }

    private List<AuctionResponse> paginateAndFetch(Map<Long, Double> scores, int page, int size) {
        return scores.entrySet().stream()
                .sorted(Map.Entry.<Long, Double>comparingByValue().reversed())
                .skip((long) page * size)
                .limit(size)
                .map(entry -> auctionRepository.findById(entry.getKey())
                        .map(AuctionMapper.INSTANCE::toResponse).orElse(null))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

}
