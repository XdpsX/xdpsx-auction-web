package com.xdpsx.auction.service;

import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.order.CreateOrderDto;
import com.xdpsx.auction.dto.order.CreateOrderRequest;
import com.xdpsx.auction.dto.order.OrderDetailsDto;
import com.xdpsx.auction.dto.order.OrderDto;
import com.xdpsx.auction.dto.payment.InitPaymentResponse;
import com.xdpsx.auction.model.enums.OrderStatus;

public interface OrderService {
    OrderDto createOrder(CreateOrderDto request);
    InitPaymentResponse createOrderPaymentLink(CreateOrderDto request, String ipAddress);
    OrderDto createOrderExternalPaymentCallback(Long orderId);
    InitPaymentResponse continueOrderPayment(Long orderId, String ipAddress);
    PageResponse<OrderDto> getPageOrders(int pageNum, int pageSize, String keyword, String sort, OrderStatus status);
    PageResponse<OrderDto> getUserOrders(Long userId, int pageNum, int pageSize,
                                               String keyword, String sort, OrderStatus status);
    PageResponse<OrderDto> getSellerOrders(Long sellerId, int pageNum, int pageSize,
                                               String keyword, String sort, OrderStatus status);
    OrderDto cancelOrder(Long orderId, Long userId);
    OrderDto updateOrderStatus(Long orderId, Long sellerId);
    OrderDto confirmOrderDelivered(Long orderId, Long userId);
    OrderDetailsDto getOrderDetails(Long id);
    OrderDetailsDto getUserOrderDetails(Long userId, Long orderId);
    OrderDetailsDto getSellerOrderDetails(Long sellerId, Long orderId);
    OrderDto buyNowAuction(Long auctionId, CreateOrderRequest request);
}
