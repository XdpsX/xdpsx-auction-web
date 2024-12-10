package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.constant.ErrorCode;
import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.notification.NotificationRequest;
import com.xdpsx.auction.dto.order.CreateOrderDto;
import com.xdpsx.auction.dto.order.CreateOrderRequest;
import com.xdpsx.auction.dto.order.OrderDetailsDto;
import com.xdpsx.auction.dto.order.OrderDto;
import com.xdpsx.auction.dto.payment.InitPaymentRequest;
import com.xdpsx.auction.dto.payment.InitPaymentResponse;
import com.xdpsx.auction.dto.transaction.TransactionRequest;
import com.xdpsx.auction.exception.BadRequestException;
import com.xdpsx.auction.exception.NotFoundException;
import com.xdpsx.auction.mapper.OrderMapper;
import com.xdpsx.auction.mapper.PageMapper;
import com.xdpsx.auction.model.*;
import com.xdpsx.auction.model.enums.*;
import com.xdpsx.auction.repository.AuctionRepository;
import com.xdpsx.auction.repository.BidRepository;
import com.xdpsx.auction.repository.OrderRepository;
import com.xdpsx.auction.security.CustomUserDetails;
import com.xdpsx.auction.security.UserContext;
import com.xdpsx.auction.service.*;
import com.xdpsx.auction.service.producer.AuctionProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.ZonedDateTime;
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
    private final PaymentService paymentService;
    private final AuctionRepository auctionRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final AuctionProducer auctionProducer;

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

        bid.setStatus(BidStatus.PAID);
        bid.getAuction().setStatus(AuctionStatus.COMPLETED);
        bidRepository.save(bid);

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
                .title("Payment Auction")
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
    @Transactional
    public InitPaymentResponse createOrderPaymentLink(CreateOrderDto request, String ipAddress) {
        CustomUserDetails userDetails = userContext.getLoggedUser();
        Bid bid = bidRepository.findByIdAndBidderAndStatus(request.getBidId(), userDetails.getId(), BidStatus.WON)
                .orElseThrow(() -> new NotFoundException(ErrorCode.BID_NOT_FOUND, request.getBidId()));
        BigDecimal amount = bid.getAmount().subtract(bid.getTransaction().getAmount());
        amount = amount.setScale(0, RoundingMode.DOWN);

        ShippingInfo shippingInfo = ShippingInfo.builder()
                .recipient(request.getRecipient())
                .mobileNumber(request.getMobileNumber())
                .shippingAddress(request.getShippingAddress())
                .build();

        Order order = Order.builder()
                .trackNumber(UUID.randomUUID().toString())
                .totalAmount(bid.getAmount())
                .status(OrderStatus.Creating)
                .shippingInfo(shippingInfo)
                .note(request.getNote())
                .user(new User(userDetails.getId()))
                .seller(bid.getAuction().getSeller())
                .auction(bid.getAuction())
                .paymentMethod(PaymentMethod.fromValue(request.getPaymentMethod()))
                .build();

        Order savedOrder = orderRepository.save(order);

        bid.setStatus(BidStatus.PAID);
        bid.getAuction().setStatus(AuctionStatus.COMPLETED);
        bidRepository.save(bid);

        InitPaymentRequest initPaymentRequest = InitPaymentRequest.builder()
                .amount(amount)
                .txnRef(String.valueOf(savedOrder.getId()))
                .requestId(String.valueOf(savedOrder.getId()))
                .ipAddress(ipAddress)
                .prefixReturn("orders")
                .build();
        return paymentService.init(initPaymentRequest);
    }

    @Override
    public OrderDto createOrderExternalPaymentCallback(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.ORDER_NOT_FOUND, orderId));

        order.setStatus(OrderStatus.Pending);
        Order savedOrder = orderRepository.save(order);
        return OrderMapper.INSTANCE.toOrderDto(savedOrder);
    }

    @Override
    public InitPaymentResponse continueOrderPayment(Long orderId, String ipAddress) {
        Order order = orderRepository.findByUserIdAndOrderIdAndStatus(userContext.getLoggedUser().getId(), orderId, OrderStatus.Creating)
                .orElseThrow(() -> new NotFoundException(ErrorCode.ORDER_NOT_FOUND, orderId));

        BigDecimal amount = order.getTotalAmount().multiply(BigDecimal.valueOf(1).subtract(SECURITY_FEE_RATE));
        amount = amount.setScale(0, RoundingMode.DOWN);

        InitPaymentRequest initPaymentRequest = InitPaymentRequest.builder()
                .amount(amount)
                .txnRef(String.valueOf(order.getId()))
                .requestId(String.valueOf(order.getId()))
                .ipAddress(ipAddress)
                .prefixReturn("orders")
                .build();
        return paymentService.init(initPaymentRequest);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public PageResponse<OrderDto> getPageOrders(int pageNum, int pageSize, String keyword, String sort, OrderStatus status) {
        Page<Order> orderPage = orderRepository.findPageOrders(
                keyword, status, PageRequest.of(pageNum - 1, pageSize, getSort(sort))
        );
        return PageMapper.toPageResponse(orderPage, OrderMapper.INSTANCE::toOrderDto);
    }


    @Override
    public PageResponse<OrderDto> getUserOrders(Long userId, int pageNum, int pageSize,
                                                      String keyword, String sort, OrderStatus status) {
        Page<Order> orderPage = orderRepository.findUserOrders(
                userId, keyword, status, PageRequest.of(pageNum - 1, pageSize, getSort(sort))
        );
        return PageMapper.toPageResponse(orderPage, OrderMapper.INSTANCE::toOrderDto);
    }

    @Override
    public PageResponse<OrderDto> getSellerOrders(Long sellerId, int pageNum, int pageSize, String keyword, String sort, OrderStatus status) {
        Page<Order> orderPage = orderRepository.findSellerOrders(
                sellerId, keyword, status, PageRequest.of(pageNum - 1, pageSize, getSort(sort))
        );
        return PageMapper.toPageResponse(orderPage, OrderMapper.INSTANCE::toOrderDto);
    }

    @Override
    public OrderDto cancelOrder(Long orderId, Long userId) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.ORDER_NOT_FOUND, orderId));
        if (!order.isCanCancel()) {
            throw new BadRequestException("Order can not be cancelled");
        }
        order.setStatus(OrderStatus.Cancelled);
        order.setReason("User cancels order");

        TransactionRequest transactionUser = TransactionRequest.builder()
                .userId(userId)
                .type(TransactionType.DEPOSIT)
                .amount(order.getTotalAmount().multiply(BigDecimal.valueOf(1).subtract(SECURITY_FEE_RATE)))
                .description("Cancel order #" + order.getTrackNumber())
                .build();
        transactionService.createTransaction(transactionUser);

        TransactionRequest transactionSeller = TransactionRequest.builder()
                .userId(order.getSeller().getId())
                .type(TransactionType.DEPOSIT)
                .amount(order.getTotalAmount().multiply(SECURITY_FEE_RATE))
                .description("Compensation amount due to the user canceling the order #" + order.getTrackNumber())
                .build();
        transactionService.createTransaction(transactionSeller);

        NotificationRequest notificationSeller = NotificationRequest.builder()
                .userId(order.getSeller().getId())
                .title("Your Order has been Cancelled")
                .message("Order #%s has been cancelled".formatted(order.getTrackNumber()))
                .build();
        notificationService.pushNotification(notificationSeller);


        Order savedOrder = orderRepository.save(order);
        return OrderMapper.INSTANCE.toOrderDto(savedOrder);
    }

    @Override
    public OrderDto updateOrderStatus(Long orderId, Long sellerId) {
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
        return OrderMapper.INSTANCE.toOrderDto(savedOrder);
    }

    @Override
    public OrderDto confirmOrderDelivered(Long orderId, Long userId) {
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
                .description("Payment for order #" + order.getTrackNumber())
                .build();
        transactionService.createTransaction(transactionSeller);

        NotificationRequest notificationSeller = NotificationRequest.builder()
                .userId(order.getSeller().getId())
                .title("Your Order has been confirmed")
                .message("Order %s has been confirmed".formatted(order.getTrackNumber()))
                .build();
        notificationService.pushNotification(notificationSeller);
        return OrderMapper.INSTANCE.toOrderDto(savedOrder);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public OrderDetailsDto getOrderDetails(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(ErrorCode.ORDER_NOT_FOUND, id));
        return OrderMapper.INSTANCE.toOrderDetailsDto(order);
    }

    @Override
    public OrderDetailsDto getUserOrderDetails(Long userId, Long orderId) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.ORDER_NOT_FOUND, orderId));
        return OrderMapper.INSTANCE.toOrderDetailsDto(order);
    }

    @Override
    public OrderDetailsDto getSellerOrderDetails(Long sellerId, Long orderId) {
        Order order = orderRepository.findByIdAndSellerId(orderId, sellerId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.ORDER_NOT_FOUND, orderId));
        return OrderMapper.INSTANCE.toOrderDetailsDto(order);
    }

    @Override
    @Transactional
    public OrderDto buyNowAuction(Long auctionId, CreateOrderRequest request) {
        Auction auction = auctionRepository.findLiveAuction(auctionId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.AUCTION_NOT_FOUND, auctionId));
        if (!auction.isSealedBidAuction()) {
            throw new BadRequestException("Can not buy now English Auction");
        }
        CustomUserDetails userDetails = userContext.getLoggedUser();
        walletService.validateWalletBalance(userDetails.getId(), auction.getStartingPrice());

        handlePayForBidder(auction.getStartingPrice(), userDetails.getId(), auction.getName());
        handlePayForSeller(auction.getSeller().getId(), auction.getName());

        ShippingInfo shippingInfo = ShippingInfo.builder()
                .recipient(request.getRecipient())
                .mobileNumber(request.getMobileNumber())
                .shippingAddress(request.getShippingAddress())
                .build();
        Order order = Order.builder()
                .trackNumber(UUID.randomUUID().toString())
                .totalAmount(auction.getStartingPrice())
                .status(OrderStatus.Pending)
                .shippingInfo(shippingInfo)
                .note(request.getNote())
                .user(new User(userDetails.getId()))
                .seller(auction.getSeller())
                .auction(auction)
                .paymentMethod(PaymentMethod.INTERNAL_WALLET)
                .build();
        Order savedOrder = orderRepository.save(order);

        auction.setStatus(AuctionStatus.COMPLETED);
        auction.setEndingTime(ZonedDateTime.now());
        Auction savedAuction = auctionRepository.save(auction);
        auctionProducer.produceAuctionEnd(savedAuction.getId());
        messagingTemplate.convertAndSend("/topic/auction/" + auction.getId() + "/end", userDetails.getId());
        return OrderMapper.INSTANCE.toOrderDto(savedOrder);
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
