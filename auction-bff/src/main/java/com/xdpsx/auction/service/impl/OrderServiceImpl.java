package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.constant.ErrorCode;
import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.notification.NotificationRequest;
import com.xdpsx.auction.dto.order.CreateOrderDto;
import com.xdpsx.auction.dto.order.OrderDto;
import com.xdpsx.auction.dto.order.OrderSellerDto;
import com.xdpsx.auction.dto.order.OrderUserDto;
import com.xdpsx.auction.dto.transaction.TransactionRequest;
import com.xdpsx.auction.exception.BadRequestException;
import com.xdpsx.auction.exception.NotFoundException;
import com.xdpsx.auction.mapper.OrderMapper;
import com.xdpsx.auction.mapper.PageMapper;
import com.xdpsx.auction.model.Bid;
import com.xdpsx.auction.model.Order;
import com.xdpsx.auction.model.ShippingInfo;
import com.xdpsx.auction.model.User;
import com.xdpsx.auction.model.enums.*;
import com.xdpsx.auction.repository.BidRepository;
import com.xdpsx.auction.repository.OrderRepository;
import com.xdpsx.auction.security.CustomUserDetails;
import com.xdpsx.auction.security.UserContext;
import com.xdpsx.auction.service.NotificationService;
import com.xdpsx.auction.service.OrderService;
import com.xdpsx.auction.service.TransactionService;
import com.xdpsx.auction.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

import static com.xdpsx.auction.constant.BidConstants.SECURITY_FEE_RATE;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final TransactionService transactionService;
    private final NotificationService notificationService;
    private final BidRepository bidRepository;
    private final UserContext userContext;
    private final WalletService walletService;

    @Override
    @Transactional
    public OrderDto createOrder(CreateOrderDto request) {
        CustomUserDetails userDetails = userContext.getLoggedUser();
        Bid bid = bidRepository.findByIdAndBidderAndStatus(request.getBidId(), userDetails.getId(), BidStatus.WON)
                .orElseThrow(() -> new NotFoundException(ErrorCode.BID_NOT_FOUND, request.getBidId()));

        BigDecimal amount = bid.getAmount().subtract(bid.getTransaction().getAmount());
        walletService.validateWalletBalance(userDetails.getId(), amount);

        handlePayForBidder(amount, userDetails.getId(), bid.getAuction().getName());
        handlePayForSeller(bid.getAuction().getSeller().getId(), bid.getAuction().getName());

        bid.setStatus(BidStatus.PAID);
        bid.getAuction().setStatus(AuctionStatus.COMPLETED);
        bidRepository.save(bid);

        ShippingInfo shippingInfo = ShippingInfo.builder()
                .recipient(request.getRecipient())
                .mobileNumber(request.getMobileNumber())
                .shippingAddress(request.getShippingAddress())
                .build();
        Order order = Order.builder()
                .trackNumber(UUID.randomUUID().toString())
                .totalAmount(bid.getAmount())
                .status(OrderStatus.Pending)
                .shippingInfo(shippingInfo)
                .note(request.getNote())
                .user(new User(userDetails.getId()))
                .seller(bid.getAuction().getSeller())
                .auction(bid.getAuction())
                .paymentMethod(PaymentMethod.INTERNAL_WALLET)
                .build();
        Order savedOrder = orderRepository.save(order);
        return OrderMapper.INSTANCE.toOrderDto(savedOrder);
    }

    private void handlePayForBidder(BigDecimal amount, Long bidderId, String auctionName) {
        TransactionRequest transactionBidder = TransactionRequest.builder()
                .amount(amount)
                .type(TransactionType.WITHDRAW)
                .description("Payment for the auction: " + auctionName)
                .userId(bidderId)
                .build();
        transactionService.createTransaction(transactionBidder);

        NotificationRequest bidderNotification = NotificationRequest.builder()
                .title("Payment Bid")
                .message("Your payment for the product: %s has been successfully processed. Thank you for your purchase!".formatted(auctionName))
                .userId(bidderId)
                .build();
        notificationService.pushNotification(bidderNotification);
    }

    private void handlePayForSeller(Long sellerId, String auctionName) {
        NotificationRequest sellerNotification = NotificationRequest.builder()
                .title("New Payment Received")
                .message("You have received a new payment for the auction: %s".formatted(auctionName))
                .userId(sellerId)
                .build();
        notificationService.pushNotification(sellerNotification);
    }


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
                .type(TransactionType.DEPOSIT)
                .amount(order.getTotalAmount().multiply(BigDecimal.valueOf(1).subtract(SECURITY_FEE_RATE)))
                .description("User cancels order")
                .build();
        transactionService.createTransaction(transactionUser);

        TransactionRequest transactionSeller = TransactionRequest.builder()
                .userId(order.getSeller().getId())
                .type(TransactionType.DEPOSIT)
                .amount(order.getTotalAmount().multiply(SECURITY_FEE_RATE))
                .description("User cancels order")
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
