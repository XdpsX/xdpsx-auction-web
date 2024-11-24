package com.xdpsx.auction.schedule;

import com.xdpsx.auction.dto.notification.NotificationRequest;
import com.xdpsx.auction.model.Auction;
import com.xdpsx.auction.model.Bid;
import com.xdpsx.auction.model.enums.NotificationType;
import com.xdpsx.auction.repository.AuctionRepository;
import com.xdpsx.auction.repository.BidRepository;
import com.xdpsx.auction.service.NotificationService;
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

    @Scheduled(fixedRate = 60000)
//    @Scheduled(cron = "0 * * * * ?")
    @Transactional
    public void handleEndedAuctions() {
        log.info("Checking end of auctions");
        List<Auction> endedAuctions = auctionRepository.findEndingAuction();

        for (Auction auction : endedAuctions) {
            Bid highestBid =  bidRepository.findHighestBidByAuctionId(auction.getId()).orElse(null);
            if (highestBid != null) {
                highestBid.setWinner(true);
                bidRepository.save(highestBid);

                NotificationRequest winnerNotification = NotificationRequest.builder()
                        .message("You are the bid winner of " + auction.getName())
                        .type(NotificationType.AUCTION)
                        .userId(highestBid.getBidder().getId())
                        .build();
                notificationService.pushNotification(winnerNotification);
            }

            NotificationRequest sellerNotification = NotificationRequest.builder()
                    .message("Your auction: %s has ended".formatted(auction.getName()))
                    .type(NotificationType.AUCTION)
                    .userId(auction.getSeller().getId())
                    .build();
            notificationService.pushNotification(sellerNotification);
            auction.setEnd(true);
            auctionRepository.save(auction);
        }
    }
}
