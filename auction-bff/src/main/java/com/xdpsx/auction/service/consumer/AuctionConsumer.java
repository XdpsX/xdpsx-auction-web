package com.xdpsx.auction.service.consumer;

import com.xdpsx.auction.model.Auction;
import com.xdpsx.auction.model.AuctionInvertedIndex;
import com.xdpsx.auction.repository.AuctionInvertedIndexRepository;
import com.xdpsx.auction.repository.AuctionRepository;
import com.xdpsx.auction.util.TextProcessor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuctionConsumer {
    private final AuctionRepository auctionRepository;
    private final AuctionInvertedIndexRepository auctionInvertedIndexRepository;

    @KafkaListener(topics = "auction-tfidf-topic", groupId = "auction-push-group", concurrency = "1")
    public void handleAuctionTfIDF(Long auctionId){
        log.info("AuctionTfIDF: {}", auctionId);
        Auction auction = auctionRepository.findById(auctionId)
                .orElse(null);

        if (auction != null) {
            String cleanedDescription = TextProcessor.processDescription(auction.getDescription());
            String cleanedName = TextProcessor.processName(auction.getName());
            auction.setCleanedDescription(cleanedDescription);
            auctionRepository.save(auction);

            // Tiến hành xử lý các từ khóa từ title và description
            Set<String> termsTitle = extractTerms(cleanedName);
            Set<String> termsDescription = extractTerms(cleanedDescription);

            // Cập nhật inverted index
            termsTitle.forEach(term -> updateInvertedIndex(term, auctionId, true));
            termsDescription.forEach(term -> updateInvertedIndex(term, auctionId, false));
        }
    }

    private Set<String> extractTerms(String text) {
        Set<String> terms = new HashSet<>();
        if (text != null) {
            String[] words = text
//                    .toLowerCase()
                    .split("\\s+");
            //                terms.add(word.replaceAll("[^a-zA-Z0-9]", ""));
            terms.addAll(Arrays.asList(words));
        }
        return terms;
    }

    private void updateInvertedIndex(String term, Long auctionId, boolean isTitle) {
        AuctionInvertedIndex invertedIndex = auctionInvertedIndexRepository.findById(term)
                .orElse(new AuctionInvertedIndex(term, "", ""));

        String auctionIdList = isTitle ? invertedIndex.getAuctionIdsTitle() : invertedIndex.getAuctionIdsDescription();

        String updatedAuctionIdList = auctionId.toString();
        if (auctionIdList != null && !auctionIdList.isEmpty()) {
            Set<String> auctionIdSet = new HashSet<>(Arrays.asList(auctionIdList.split(",")));

            auctionIdSet.add(String.valueOf(auctionId));

            updatedAuctionIdList = String.join(",", auctionIdSet);
        }

        if (isTitle) {
            invertedIndex.setAuctionIdsTitle(updatedAuctionIdList);
        } else {
            invertedIndex.setAuctionIdsDescription(updatedAuctionIdList);
        }

        auctionInvertedIndexRepository.save(invertedIndex);
    }
}
