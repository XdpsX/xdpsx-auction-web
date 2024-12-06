package com.xdpsx.auction.service;

import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.order.CreateOrderDto;
import com.xdpsx.auction.dto.order.OrderDto;
import com.xdpsx.auction.dto.order.OrderSellerDto;
import com.xdpsx.auction.dto.order.OrderUserDto;
import com.xdpsx.auction.model.enums.OrderStatus;

public interface OrderService {
    OrderDto createOrder(CreateOrderDto request);
    PageResponse<OrderSellerDto> getUserOrders(Long userId, int pageNum, int pageSize,
                                               String keyword, String sort, OrderStatus status);
    PageResponse<OrderUserDto> getSellerOrders(Long sellerId, int pageNum, int pageSize,
                                               String keyword, String sort, OrderStatus status);
    OrderSellerDto cancelOrder(Long orderId, Long userId);
    OrderUserDto updateOrderStatus(Long orderId, Long sellerId);
    OrderSellerDto confirmOrderDelivered(Long orderId, Long userId);
}
