package com.xdpsx.auction.controller;

import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.order.OrderSellerDto;
import com.xdpsx.auction.dto.order.OrderUserDto;
import com.xdpsx.auction.model.enums.OrderStatus;
import com.xdpsx.auction.security.UserContext;
import com.xdpsx.auction.service.OrderService;
import jakarta.validation.constraints.Max;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.xdpsx.auction.constant.PageConstant.*;

@RestController
@RequiredArgsConstructor
public class OrderController {
    private final UserContext userContext;
    private final OrderService orderService;

    @GetMapping("/storefront/users/me/orders")
    ResponseEntity<PageResponse<OrderSellerDto>> getUserOrders(
            @RequestParam(defaultValue = PAGE_NUM, required = false) int pageNum,
            @RequestParam(defaultValue = PAGE_SIZE, required = false) @Max(MAX_PAGE_SIZE) int pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) OrderStatus status
    ){

        PageResponse<OrderSellerDto> response = orderService.getUserOrders(
                userContext.getLoggedUser().getId(), pageNum, pageSize, keyword, sort, status
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/backoffice/sellers/me/orders")
    ResponseEntity<PageResponse<OrderUserDto>> getSellerOrders(
            @RequestParam(defaultValue = PAGE_NUM, required = false) int pageNum,
            @RequestParam(defaultValue = PAGE_SIZE, required = false) @Max(MAX_PAGE_SIZE) int pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) OrderStatus status
    ){

        PageResponse<OrderUserDto> response = orderService.getSellerOrders(
                userContext.getLoggedUser().getId(), pageNum, pageSize, keyword, sort, status
        );
        return ResponseEntity.ok(response);
    }
}
