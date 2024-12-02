package com.xdpsx.auction.schedule;

import com.xdpsx.auction.dto.notification.NotificationRequest;
import com.xdpsx.auction.dto.transaction.TransactionRequest;
import com.xdpsx.auction.model.Auction;
import com.xdpsx.auction.model.Bid;
import com.xdpsx.auction.model.User;
import com.xdpsx.auction.model.enums.AuctionStatus;
import com.xdpsx.auction.model.enums.BidStatus;
import com.xdpsx.auction.model.enums.TransactionStatus;
import com.xdpsx.auction.model.enums.TransactionType;
import com.xdpsx.auction.repository.BidRepository;
import com.xdpsx.auction.service.NotificationService;
import com.xdpsx.auction.service.TransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class BidScheduler {

    private final BidRepository bidRepository;
    private final TransactionService transactionService;
    private final NotificationService notificationService;

//    @Scheduled(fixedRate = 60000)
    @Scheduled(cron = "0 * * * * ?")
    @Transactional
    public void handleExpiredWonBids() {
        List<Bid> expiredWonBids = getExpiredWonBids();

        for (Bid bid : expiredWonBids) {
            Auction auction = bid.getAuction();
            User seller = auction.getSeller();

            auction.setStatus(AuctionStatus.NO_PAYMENT);
            bid.setStatus(BidStatus.NO_PAID);
            bidRepository.save(bid);

            TransactionRequest transactionSeller = TransactionRequest.builder()
                    .amount(bid.getTransaction().getAmount())
                    .type(TransactionType.DEPOSIT)
                    .status(TransactionStatus.COMPLETED)
                    .description("Security fee of auction " + auction.getName())
                    .userId(seller.getId())
                    .build();
            transactionService.createTransaction(transactionSeller);

            NotificationRequest notificationUser = NotificationRequest.builder()
                    .title("Your won bid was expired")
                    .message("You've lost your security fee")
                    .userId(bid.getBidder().getId())
                    .build();
            notificationService.pushNotification(notificationUser);

            NotificationRequest notificationSeller = NotificationRequest.builder()
                    .title("The auction has not been paid")
                    .message("Your auction %s has not been paid. You've received a security fee".formatted(auction.getName()))
                    .userId(seller.getId())
                    .build();
            notificationService.pushNotification(notificationSeller);
        }
    }

    private List<Bid> getExpiredWonBids() {
        ZonedDateTime oneDayAgo = ZonedDateTime.now().minusDays(1);
        return bidRepository.findBidsOlderThanAndWithStatus(BidStatus.WON, oneDayAgo);
    }
}
