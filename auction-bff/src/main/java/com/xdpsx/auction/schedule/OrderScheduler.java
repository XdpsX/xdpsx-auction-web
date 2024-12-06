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
                    .build();
            transactionService.createTransaction(transactionSeller);

            NotificationRequest notificationSeller = NotificationRequest.builder()
                    .userId(order.getSeller().getId())
                    .title("Your Order has been confirmed")
                    .message("Order #%s has been confirmed".formatted(order.getTrackNumber()))
                    .build();
            notificationService.pushNotification(notificationSeller);

            NotificationRequest notificationUser = NotificationRequest.builder()
                    .userId(order.getUser().getId())
                    .title("Your Order has been confirmed")
                    .message("Order #%s has been automatically confirmed due to expiration".formatted(order.getTrackNumber()))
                    .build();
            notificationService.pushNotification(notificationUser);
        }
    }

    private List<Order> getExpiredDeliveredOrders() {
        ZonedDateTime twoDaysAgo = ZonedDateTime.now().minusDays(2);
        return orderRepository.findOrderOlderThanAndWithStatus(OrderStatus.Delivered, twoDaysAgo);
    }

    @Scheduled(cron = "0 * * * * ?")
    @Transactional
    public void handleExpiredCreatingOrders() {
        List<Order> expiredCreatingOrders= getExpiredCreatingOrders();

        for (Order order: expiredCreatingOrders) {
            order.setStatus(OrderStatus.Cancelled);
            order.setReason("Payment for expired order");
            Order savedOrder = orderRepository.save(order);

            TransactionRequest transactionSeller = TransactionRequest.builder()
                    .userId(savedOrder.getSeller().getId())
                    .type(TransactionType.DEPOSIT)
                    .amount(savedOrder.getTotalAmount().multiply(SECURITY_FEE_RATE))
                    .description("Payment for auction " + order.getAuction().getName())
                    .build();
            transactionService.createTransaction(transactionSeller);

            NotificationRequest notificationSeller = NotificationRequest.builder()
                    .userId(order.getSeller().getId())
                    .title("The auction has not been paid")
                    .message("Your auction %s has not been paid. You've received a security fee".formatted(order.getAuction().getName()))
                    .build();
            notificationService.pushNotification(notificationSeller);

            NotificationRequest notificationUser = NotificationRequest.builder()
                    .userId(order.getUser().getId())
                    .title("Your Order was expired")
                    .message("Order #%s was expired. You've lost your security fee".formatted(order.getTrackNumber()))
                    .build();
            notificationService.pushNotification(notificationUser);
        }
    }


    private List<Order> getExpiredCreatingOrders() {
        ZonedDateTime twoDaysAgo = ZonedDateTime.now().minusDays(2);
        return orderRepository.findOrderOlderThanAndWithStatus(OrderStatus.Creating, twoDaysAgo);
    }
}
