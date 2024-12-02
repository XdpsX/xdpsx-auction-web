package com.xdpsx.auction.service;

import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.order.OrderSellerDto;
import com.xdpsx.auction.dto.order.OrderUserDto;
import com.xdpsx.auction.model.enums.OrderStatus;

public interface OrderService {
    PageResponse<OrderSellerDto> getUserOrders(Long userId, int pageNum, int pageSize,
                                               String keyword, String sort, OrderStatus status);
    PageResponse<OrderUserDto> getSellerOrders(Long sellerId, int pageNum, int pageSize,
                                               String keyword, String sort, OrderStatus status);

    OrderSellerDto cancelOrder(Long orderId, Long userId);
}
