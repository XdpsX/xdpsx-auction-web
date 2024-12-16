package com.xdpsx.auction.controller;

import com.xdpsx.auction.constant.VNPayParams;
import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.order.CreateOrderDto;
import com.xdpsx.auction.dto.order.CreateOrderRequest;
import com.xdpsx.auction.dto.order.OrderDetailsDto;
import com.xdpsx.auction.dto.order.OrderDto;
import com.xdpsx.auction.dto.payment.InitPaymentResponse;
import com.xdpsx.auction.exception.BadRequestException;
import com.xdpsx.auction.model.Order;
import com.xdpsx.auction.model.enums.OrderStatus;
import com.xdpsx.auction.repository.OrderRepository;
import com.xdpsx.auction.security.UserContext;
import com.xdpsx.auction.service.OrderService;
import com.xdpsx.auction.service.PaymentService;
import com.xdpsx.auction.util.RequestUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.Map;
import java.util.Optional;

import static com.xdpsx.auction.constant.PageConstant.*;

@RestController
@RequiredArgsConstructor
public class OrderController {
    private final UserContext userContext;
    private final OrderService orderService;
    private final PaymentService paymentService;
    private final OrderRepository orderRepository;

    @PostMapping("/storefront/orders")
    ResponseEntity<OrderDto> createOrder(@Valid @RequestBody CreateOrderDto request) {
        OrderDto response =  orderService.createOrder(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/storefront/orders/external")
    ResponseEntity<InitPaymentResponse> createOrderExternalPaymentLink(@Valid @RequestBody CreateOrderDto request,
                                                                        HttpServletRequest httpServletRequest) {
        var ipAddress = RequestUtil.getIpAddress(httpServletRequest);
        InitPaymentResponse response =  orderService.createOrderPaymentLink(request, ipAddress);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/storefront/orders/external/callback")
    ResponseEntity<OrderDto> createOrderExternalPaymentCallback(@RequestParam Map<String, String> params) {
        if (!paymentService.verifyIpn(params)){
            throw new BadRequestException("Invalid IPN");
        }
        var txnRef = params.get(VNPayParams.TXN_REF);
        OrderDto response =  orderService.createOrderExternalPaymentCallback(Long.parseLong(txnRef));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/storefront/orders/{id}/continue-payment")
    ResponseEntity<InitPaymentResponse> continueOrderPayment(@PathVariable Long id,
                                                             HttpServletRequest httpServletRequest) {
        var ipAddress = RequestUtil.getIpAddress(httpServletRequest);
        InitPaymentResponse response =  orderService.continueOrderPayment(id, ipAddress);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/storefront/users/me/orders")
    ResponseEntity<PageResponse<OrderDto>> getUserOrders(
            @RequestParam(defaultValue = PAGE_NUM, required = false) int pageNum,
            @RequestParam(defaultValue = PAGE_SIZE, required = false) @Max(MAX_PAGE_SIZE) int pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) OrderStatus status
    ){
        PageResponse<OrderDto> response = orderService.getUserOrders(
                userContext.getLoggedUser().getId(), pageNum, pageSize, keyword, sort, status
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/backoffice/sellers/me/orders")
    ResponseEntity<PageResponse<OrderDto>> getSellerOrders(
            @RequestParam(defaultValue = PAGE_NUM, required = false) int pageNum,
            @RequestParam(defaultValue = PAGE_SIZE, required = false) @Max(MAX_PAGE_SIZE) int pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) OrderStatus status
    ){

        PageResponse<OrderDto> response = orderService.getSellerOrders(
                userContext.getLoggedUser().getId(), pageNum, pageSize, keyword, sort, status
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/backoffice/orders")
    ResponseEntity<PageResponse<OrderDto>> getPageOrders(
            @RequestParam(defaultValue = PAGE_NUM, required = false) int pageNum,
            @RequestParam(defaultValue = PAGE_SIZE, required = false) @Max(MAX_PAGE_SIZE) int pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) OrderStatus status
    ){
        PageResponse<OrderDto> response = orderService.getPageOrders(pageNum, pageSize, keyword, sort, status);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/backoffice/orders/{id}")
    ResponseEntity<OrderDetailsDto> getOrderDetails(@PathVariable Long id) {
        OrderDetailsDto response = orderService.getOrderDetails(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/storefront/users/me/orders/{id}")
    ResponseEntity<OrderDetailsDto> getUserOrderDetails(@PathVariable Long id) {
        OrderDetailsDto response = orderService.getUserOrderDetails(userContext.getLoggedUser().getId(), id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/backoffice/sellers/me/orders/{id}")
    ResponseEntity<OrderDetailsDto> getSellerOrderDetails(@PathVariable Long id) {
        OrderDetailsDto response = orderService.getSellerOrderDetails(userContext.getLoggedUser().getId(), id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/storefront/orders/{id}/cancel")
    ResponseEntity<OrderDto> cancelOrder(
            @PathVariable Long id
    ){
        OrderDto response = orderService.cancelOrder(id, userContext.getLoggedUser().getId());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/backoffice/orders/{id}/update-status")
    ResponseEntity<OrderDto> updateOrderStatus(
            @PathVariable Long id
    ){
        OrderDto response = orderService.updateOrderStatus(id, userContext.getLoggedUser().getId());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/storefront/orders/{id}/confirm")
    ResponseEntity<OrderDto> confirmOrderDelivered(
            @PathVariable Long id
    ){
        OrderDto response = orderService.confirmOrderDelivered(id, userContext.getLoggedUser().getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/storefront/auctions/{auctionId}/buy")
    ResponseEntity<OrderDto> buyNowAuction(
            @PathVariable Long auctionId,
            @Valid @RequestBody CreateOrderRequest request) {
        OrderDto response =  orderService.buyNowAuction(auctionId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/test/orders/{id}/update")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status
    ) {
        Optional<Order> optionalOrder = orderRepository.findById(id);

        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();

            order.setStatus(status);
            ZonedDateTime twoDaysAgo = ZonedDateTime.now().minusDays(2);
            order.setCreatedAt(twoDaysAgo);
            order.setUpdatedAt(twoDaysAgo);

            orderRepository.save(order);

            return ResponseEntity.ok("Order updated successfully.");
        } else {
            return ResponseEntity.status(404).body("Order not found.");
        }
    }

}
