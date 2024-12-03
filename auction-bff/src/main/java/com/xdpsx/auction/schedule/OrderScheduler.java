package com.xdpsx.auction.schedule;

import com.xdpsx.auction.dto.notification.NotificationRequest;
import com.xdpsx.auction.dto.transaction.TransactionRequest;
import com.xdpsx.auction.model.Order;
import com.xdpsx.auction.model.enums.*;
import com.xdpsx.auction.repository.OrderRepository;
import com.xdpsx.auction.service.NotificationService;
import com.xdpsx.auction.service.TransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;

import static com.xdpsx.auction.constant.BidConstants.SECURITY_FEE_RATE;

@Slf4j
@Component
@RequiredArgsConstructor
public class OrderScheduler {
    private final OrderRepository orderRepository;
    private final TransactionService transactionService;
    private final NotificationService notificationService;

    @Scheduled(cron = "0 * * * * ?")
    @Transactional
    public void handleExpiredDeliveredOrders() {
        List<Order> expiredDeliveredOrders= getExpiredDeliveredOrders();

        for (Order order: expiredDeliveredOrders) {
            order.setStatus(OrderStatus.Completed);
            Order savedOrder = orderRepository.save(order);

            TransactionRequest transactionSeller = TransactionRequest.builder()
                    .userId(savedOrder.getSeller().getId())
                    .type(TransactionType.DEPOSIT)
                    .amount(savedOrder.getTotalAmount().multiply(BigDecimal.valueOf(1).subtract(SECURITY_FEE_RATE)))
                    .description("Payment for auction " + order.getAuction().getName())
                    .status(TransactionStatus.COMPLETED)
                    .build();
            transactionService.createTransaction(transactionSeller);

            NotificationRequest notificationSeller = NotificationRequest.builder()
                    .userId(order.getSeller().getId())
                    .title("Your Order has been confirmed")
                    .message("Order %s has been confirmed".formatted(order.getTrackNumber()))
                    .build();
            notificationService.pushNotification(notificationSeller);

            NotificationRequest notificationUser = NotificationRequest.builder()
                    .userId(order.getUser().getId())
                    .title("Your Order has been confirmed")
                    .message("Order %s has been automatically confirmed due to expiration".formatted(order.getTrackNumber()))
                    .build();
            notificationService.pushNotification(notificationUser);
        }
    }

    private List<Order> getExpiredDeliveredOrders() {
        ZonedDateTime twoDaysAgo = ZonedDateTime.now().minusDays(2);
        return orderRepository.findOrderOlderThanAndWithStatus(OrderStatus.Delivered, twoDaysAgo);
    }
}
