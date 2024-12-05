package com.xdpsx.auction.schedule;

import com.xdpsx.auction.dto.notification.NotificationRequest;
import com.xdpsx.auction.dto.transaction.TransactionRequest;
import com.xdpsx.auction.model.Auction;
import com.xdpsx.auction.model.Bid;
import com.xdpsx.auction.model.enums.AuctionStatus;
import com.xdpsx.auction.model.enums.BidStatus;
import com.xdpsx.auction.model.enums.TransactionType;
import com.xdpsx.auction.repository.AuctionRepository;
import com.xdpsx.auction.repository.BidRepository;
import com.xdpsx.auction.service.NotificationService;
import com.xdpsx.auction.service.TransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class AuctionScheduler {
    private final NotificationService notificationService;
    private final AuctionRepository auctionRepository;
    private final BidRepository bidRepository;
    private final TransactionService transactionService;

    @Scheduled(fixedRate = 60000)
    // @Scheduled(cron = "0 * * * * ?")
    @Transactional
    public void handleEndedAuctions() {
        log.info("Checking end of auctions");
        List<Auction> endedAuctions = auctionRepository.findEndingAuction();

        for (Auction auction : endedAuctions) {
            List<Bid> allBids = bidRepository.findBidsByAuctionIdOrderByAmountDesc(auction.getId());
            if (!allBids.isEmpty()) {
                for (int i = 0; i < allBids.size(); i++) {
                    Bid bid = allBids.get(i);
                    if (i == 0) { // highestBid
                        bid.setStatus(BidStatus.WON);
                        handleWinningBid(bid, auction);
                    } else {
                        bid.setStatus(BidStatus.LOST);
                        handleLostBid(bid, auction);
                    }
                }
            }
            bidRepository.saveAll(allBids);

            NotificationRequest sellerNotification = NotificationRequest.builder()
                    .title("Bid Ending")
                    .message("Your auction: %s has ended".formatted(auction.getName()))
                    .userId(auction.getSeller().getId())
                    .build();
            notificationService.pushNotification(sellerNotification);

            auction.setStatus(AuctionStatus.END);
            auctionRepository.save(auction);
        }
    }

    private void handleWinningBid(Bid bid, Auction auction) {
        NotificationRequest winnerNotification = NotificationRequest.builder()
                .title("Won Bid")
                .message("You are the winning bidder of the auction " + auction.getName())
                .userId(bid.getBidder().getId())
                .build();
        notificationService.pushNotification(winnerNotification);
    }

    private void handleLostBid(Bid bid, Auction auction) {
        NotificationRequest lostNotification = NotificationRequest.builder()
                .title("Lost Bid")
                .message("You lost the bid in the auction: " + auction.getName())
                .userId(bid.getBidder().getId())
                .build();
        notificationService.pushNotification(lostNotification);

        // Refund
        TransactionRequest transactionRequest = TransactionRequest.builder()
                .amount(bid.getTransaction().getAmount())
                .type(TransactionType.DEPOSIT)
                .description("Refund for bid in auction: " + bid.getAuction().getName())
                .userId(bid.getBidder().getId())
                .build();
        transactionService.createTransaction(transactionRequest);
    }
}
