package com.xdpsx.auction.controller;

import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.order.CreateOrderDto;
import com.xdpsx.auction.dto.order.OrderDto;
import com.xdpsx.auction.dto.order.OrderSellerDto;
import com.xdpsx.auction.dto.order.OrderUserDto;
import com.xdpsx.auction.model.enums.OrderStatus;
import com.xdpsx.auction.security.UserContext;
import com.xdpsx.auction.service.OrderService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.xdpsx.auction.constant.PageConstant.*;

@RestController
@RequiredArgsConstructor
public class OrderController {
    private final UserContext userContext;
    private final OrderService orderService;

    @PostMapping("/storefront/orders")
    ResponseEntity<?> createOrder(@Valid @RequestBody CreateOrderDto request) {
        OrderDto response =  orderService.createOrder(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

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

    @PutMapping("/storefront/orders/{id}/cancel")
    ResponseEntity<OrderSellerDto> cancelOrder(
            @PathVariable Long id
    ){
        OrderSellerDto response = orderService.cancelOrder(id, userContext.getLoggedUser().getId());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/backoffice/orders/{id}/update-status")
    ResponseEntity<OrderUserDto> updateOrderStatus(
            @PathVariable Long id
    ){
        OrderUserDto response = orderService.updateOrderStatus(id, userContext.getLoggedUser().getId());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/storefront/orders/{id}/confirm")
    ResponseEntity<OrderSellerDto> confirmOrderDelivered(
            @PathVariable Long id
    ){
        OrderSellerDto response = orderService.confirmOrderDelivered(id, userContext.getLoggedUser().getId());
        return ResponseEntity.ok(response);
    }

}
