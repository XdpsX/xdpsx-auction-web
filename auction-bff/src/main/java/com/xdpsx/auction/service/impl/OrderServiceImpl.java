package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.order.OrderSellerDto;
import com.xdpsx.auction.dto.order.OrderUserDto;
import com.xdpsx.auction.mapper.OrderMapper;
import com.xdpsx.auction.mapper.PageMapper;
import com.xdpsx.auction.model.Order;
import com.xdpsx.auction.model.enums.OrderStatus;
import com.xdpsx.auction.repository.OrderRepository;
import com.xdpsx.auction.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;

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
