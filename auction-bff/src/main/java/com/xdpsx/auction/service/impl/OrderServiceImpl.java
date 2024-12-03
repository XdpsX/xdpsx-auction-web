package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.constant.ErrorCode;
import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.notification.NotificationRequest;
import com.xdpsx.auction.dto.order.OrderSellerDto;
import com.xdpsx.auction.dto.order.OrderUserDto;
import com.xdpsx.auction.dto.transaction.TransactionRequest;
import com.xdpsx.auction.exception.BadRequestException;
import com.xdpsx.auction.exception.NotFoundException;
import com.xdpsx.auction.mapper.OrderMapper;
import com.xdpsx.auction.mapper.PageMapper;
import com.xdpsx.auction.model.Order;
import com.xdpsx.auction.model.enums.OrderStatus;
import com.xdpsx.auction.model.enums.TransactionStatus;
import com.xdpsx.auction.model.enums.TransactionType;
import com.xdpsx.auction.repository.OrderRepository;
import com.xdpsx.auction.service.NotificationService;
import com.xdpsx.auction.service.OrderService;
import com.xdpsx.auction.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

import static com.xdpsx.auction.constant.BidConstants.SECURITY_FEE_RATE;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final TransactionService transactionService;
    private final NotificationService notificationService;

    @Override
    public PageResponse<OrderSellerDto> getUserOrders(Long userId, int pageNum, int pageSize,
                                                      String keyword, String sort, OrderStatus status) {
        Page<Order> orderPage = orderRepository.findUserOrders(
                userId, keyword, status, PageRequest.of(pageNum - 1, pageSize, getSort(sort))
        );
        return PageMapper.toPageResponse(orderPage, OrderMapper.INSTANCE::toOrderSellerDto);
    }

    @Override
    public PageResponse<OrderUserDto> getSellerOrders(Long sellerId, int pageNum, int pageSize, String keyword, String sort, OrderStatus status) {
        Page<Order> orderPage = orderRepository.findSellerOrders(
                sellerId, keyword, status, PageRequest.of(pageNum - 1, pageSize, getSort(sort))
        );
        return PageMapper.toPageResponse(orderPage, OrderMapper.INSTANCE::toOrderUserDto);
    }

    @Override
    public OrderSellerDto cancelOrder(Long orderId, Long userId) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.ORDER_NOT_FOUND, orderId));
        if (!order.isCanCancel()) {
            throw new BadRequestException("Order can not be cancelled");
        }
        order.setStatus(OrderStatus.Cancelled);
        order.setNote("User cancels order");

        TransactionRequest transactionUser = TransactionRequest.builder()
                .userId(userId)
                .type(TransactionType.REFUND)
                .amount(order.getTotalAmount().multiply(BigDecimal.valueOf(1).subtract(SECURITY_FEE_RATE)))
                .description("User cancels order")
                .status(TransactionStatus.COMPLETED)
                .build();
        transactionService.createTransaction(transactionUser);

        TransactionRequest transactionSeller = TransactionRequest.builder()
                .userId(order.getSeller().getId())
                .type(TransactionType.DEPOSIT)
                .amount(order.getTotalAmount().multiply(SECURITY_FEE_RATE))
                .description("User cancels order")
                .status(TransactionStatus.COMPLETED)
                .build();
        transactionService.createTransaction(transactionSeller);

        NotificationRequest notificationSeller = NotificationRequest.builder()
                .userId(order.getSeller().getId())
                .title("Your Order has been cancelled")
                .message("Order %s has been cancelled".formatted(order.getTrackNumber()))
                .build();
        notificationService.pushNotification(notificationSeller);


        Order savedOrder = orderRepository.save(order);
        return OrderMapper.INSTANCE.toOrderSellerDto(savedOrder);
    }

    @Override
    public OrderUserDto updateOrderStatus(Long orderId, Long sellerId) {
        Order order = orderRepository.findByIdAndSellerId(orderId, sellerId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.ORDER_NOT_FOUND, orderId));
        if (!order.isLowerDelivered()) {
            throw new BadRequestException("You could just update lower delivered order");
        }
        order.setStatus(order.getStatus().next());
        Order savedOrder = orderRepository.save(order);
        if (savedOrder.getStatus().equals(OrderStatus.Delivered)) {
            NotificationRequest notificationSeller = NotificationRequest.builder()
                    .userId(order.getUser().getId())
                    .title("Your Order has been delivered")
                    .message("Order %s has been delivered. Please check it".formatted(order.getTrackNumber()))
                    .build();
            notificationService.pushNotification(notificationSeller);
        }
        return OrderMapper.INSTANCE.toOrderUserDto(savedOrder);
    }

    @Override
    public OrderSellerDto confirmOrderDelivered(Long orderId, Long userId) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.ORDER_NOT_FOUND, orderId));
        if (!order.getStatus().equals(OrderStatus.Delivered)) {
            throw new BadRequestException("You could just confirm order delivered");
        }
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
        return OrderMapper.INSTANCE.toOrderSellerDto(savedOrder);
    }

    private Sort getSort(String sortParam) {
        if (sortParam == null) {
            return Sort.by("updatedAt").descending();
        }

        return switch (sortParam) {
            case "amount" -> Sort.by("totalAmount").ascending();
            case "-amount" -> Sort.by("totalAmount").descending();
            case "date" -> Sort.by("updatedAt").ascending();
            default -> Sort.by("updatedAt").descending();
        };
    }
}
