package com.xdpsx.auction.schedule;

import com.xdpsx.auction.dto.notification.NotificationRequest;
import com.xdpsx.auction.model.Auction;
import com.xdpsx.auction.model.Bid;
import com.xdpsx.auction.model.enums.BidStatus;
import com.xdpsx.auction.repository.AuctionRepository;
import com.xdpsx.auction.repository.BidRepository;
import com.xdpsx.auction.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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
    private final SimpMessagingTemplate messagingTemplate;

    @Scheduled(fixedRate = 60000)
//    @Scheduled(cron = "0 * * * * ?")
    @Transactional
    public void handleEndedAuctions() {
        log.info("Checking end of auctions");
        List<Auction> endedAuctions = auctionRepository.findEndingAuction();

        for (Auction auction : endedAuctions) {
            messagingTemplate.convertAndSend("/topic/auction/" + auction.getId() + "/end", true);

            Bid highestBid =  bidRepository.findHighestBidByAuctionId(auction.getId()).orElse(null);
            if (highestBid != null) {
                highestBid.setStatus(BidStatus.WON);
                bidRepository.save(highestBid);

                NotificationRequest winnerNotification = NotificationRequest.builder()
                        .title("Bid Winner")
                        .message("You are the bid winner of " + auction.getName())
                        .userId(highestBid.getBidder().getId())
                        .build();
                notificationService.pushNotification(winnerNotification);
            }

            NotificationRequest sellerNotification = NotificationRequest.builder()
                    .title("Bid Ending")
                    .message("Your auction: %s has ended".formatted(auction.getName()))
                    .userId(auction.getSeller().getId())
                    .build();
            notificationService.pushNotification(sellerNotification);
            auction.setEnd(true);
            auctionRepository.save(auction);
        }
    }
}
