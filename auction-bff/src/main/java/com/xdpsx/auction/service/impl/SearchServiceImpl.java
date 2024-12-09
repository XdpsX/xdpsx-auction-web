package com.xdpsx.auction.service.impl;

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
import com.xdpsx.auction.util.TextProcessor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {
    private static final double WEIGHT_NAME = 2.0;
    private static final double WEIGHT_DESCRIPTION = 1.0;

    private final AuctionInvertedIndexRepository invertedIndexRepository;
    private final AuctionRepository auctionRepository;
    private final AuctionSpecification auctionSpec;

    public PageResponse<AuctionResponse> searchAuctions(String keyword, Integer categoryId,
                                                        BigDecimal minPrice, BigDecimal maxPrice, int page, int size,
                                                        AuctionType type, AuctionTime time, String sort) {
        // 1. Lọc theo `categoryId` và `price range`
        Set<Long> filteredAuctions = filterByCriteria(categoryId, minPrice, maxPrice, type, time, sort);

        // 2. Phân tích từ khóa
        Set<String> terms = extractTerms(keyword);

        // 3. Tính toán điểm TF-IDF cho các đấu giá đã lọc
        Map<Long, Double> auctionScores = fetchRelevantAuctions(terms, filteredAuctions);

        // 4. Phân trang kết quả
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

    private Set<String> extractTerms(String keyword) {
        keyword = TextProcessor.processName(keyword);
        return new HashSet<>(Arrays.asList(keyword.split("\\s+")));
    }

    // Lọc các tài liệu theo category và price trước
    private Set<Long> filterByCriteria(Integer categoryId, BigDecimal minPrice, BigDecimal maxPrice,
                                       AuctionType type, AuctionTime time, String sort) {
//        return auctionRepository.findAll().stream()
//                .filter(auction -> (categoryId == null || auction.getCategory().getId().equals(categoryId))
//                        && (minPrice == null || auction.getStartingPrice().compareTo(minPrice) >= 0)
//                        && (maxPrice == null || auction.getStartingPrice().compareTo(maxPrice) <= 0))
//                .map(Auction::getId) // Chỉ lấy ID
//                .collect(Collectors.toSet()); // Lưu vào Set
        return auctionRepository.findAll(auctionSpec.getSearchSpec(categoryId, sort, type, time, minPrice, maxPrice))
                .stream().map(Auction::getId).collect(Collectors.toSet());
    }

    // Tính toán điểm TF-IDF cho các tài liệu đã lọc
    private Map<Long, Double> fetchRelevantAuctions(Set<String> terms, Set<Long> filteredAuctionIds) {
        Map<Long, Double> scores = new HashMap<>();
        long totalDocuments = filteredAuctionIds.size(); // Tổng số tài liệu đã lọc

        for (String term : terms) {
            invertedIndexRepository.findById(term).ifPresent(index -> {
                // Tính IDF riêng cho title và description
                double idfTitle = Math.log((double) totalDocuments / countDocuments(index.getAuctionIdsTitle()));
                double idfDescription = Math.log((double) totalDocuments / countDocuments(index.getAuctionIdsDescription()));

                // Cập nhật điểm số cho các tài liệu liên quan
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

    // Cập nhật điểm số TF-IDF cho các tài liệu đã lọc
    private void updateScoresWithTfIdf(Map<Long, Double> scores, String auctionIds, double idf, double weight, String term, Set<Long> filteredAuctionIds) {
        if (auctionIds == null || auctionIds.isEmpty()) return;

        // Lấy giá trị TF
        Map<Long, Double> tfValues = calculateTf(auctionIds, weight == WEIGHT_NAME, term, filteredAuctionIds);

        for (Map.Entry<Long, Double> entry : tfValues.entrySet()) {
            long auctionId = entry.getKey();
            double tf = entry.getValue();
            double tfIdf = tf * idf * weight;

            // Cập nhật điểm số
            scores.put(auctionId, scores.getOrDefault(auctionId, 0.0) + tfIdf);
        }
    }

    // Tính toán TF cho các tài liệu đã lọc
    private Map<Long, Double> calculateTf(String auctionIds, boolean isTitle, String term, Set<Long> filteredAuctionIds) {
        Map<Long, Double> tfValues = new HashMap<>();
        if (auctionIds == null || auctionIds.isEmpty()) {
            return tfValues;
        }

        // Lấy danh sách auction_id từ chuỗi
        List<Long> auctionIdList = Arrays.stream(auctionIds.split(","))
                .map(Long::parseLong)
                .filter(filteredAuctionIds::contains) // Lọc chỉ những auctionId đã được lọc trước
                .collect(Collectors.toList());

        // Truy vấn nội dung của các auction_id
        List<Auction> auctions = auctionRepository.findAllById(auctionIdList);

        for (Auction auction : auctions) {
            String text = isTitle ? auction.getName() : auction.getCleanedDescription();
            if (text != null) {
                // Đếm số lần từ xuất hiện
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
        String[] words = text.toLowerCase().split("\\s+"); // Tách từ
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
