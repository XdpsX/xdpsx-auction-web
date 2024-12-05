package com.xdpsx.auction.controller;

import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.wallet.UpdateWithdrawStatus;
import com.xdpsx.auction.dto.wallet.WithdrawRequestDto;
import com.xdpsx.auction.model.enums.WithdrawStatus;
import com.xdpsx.auction.security.UserContext;
import com.xdpsx.auction.service.WithdrawService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.xdpsx.auction.constant.PageConstant.*;

@Slf4j
@RestController
@RequiredArgsConstructor
public class WithdrawController {
    private final UserContext userContext;
    private final WithdrawService withdrawService;

    @GetMapping("/storefront/wallets/me/withdraw")
    ResponseEntity<PageResponse<WithdrawRequestDto>> getMyWithdrawRequests(
            @RequestParam(defaultValue = PAGE_NUM, required = false) int pageNum,
            @RequestParam(defaultValue = PAGE_SIZE, required = false) @Max(MAX_PAGE_SIZE) int pageSize,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) Integer status) {
        PageResponse<WithdrawRequestDto> response = withdrawService.getUserWithdrawRequests(
                userContext.getLoggedUser().getId(), pageNum, pageSize, sort, status);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/storefront/withdraw/{id}/cancel")
    ResponseEntity<Void> cancelWithdraw(@PathVariable Long id) {
        withdrawService.cancelWithdraw(userContext.getLoggedUser().getId(), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/backoffice/withdraw/list")
    ResponseEntity<PageResponse<WithdrawRequestDto>> getCompletedWithdrawals(
            @RequestParam(defaultValue = PAGE_NUM, required = false) int pageNum,
            @RequestParam(defaultValue = PAGE_SIZE, required = false) @Max(MAX_PAGE_SIZE) int pageSize,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) Integer status) {
        List<WithdrawStatus> statuses = List.of(WithdrawStatus.COMPLETED, WithdrawStatus.REJECTED, WithdrawStatus.CANCELLED);
        if (status != null){
            WithdrawStatus withdrawStatus = WithdrawStatus.fromValue(status);
            statuses = statuses.stream().filter(s -> s.equals(withdrawStatus)).toList();
        }
        PageResponse<WithdrawRequestDto> response = withdrawService.getAllWithdrawRequests(
                pageNum, pageSize, sort, statuses
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/backoffice/withdraw/request-list")
    ResponseEntity<PageResponse<WithdrawRequestDto>> getRequestWithdrawals(
            @RequestParam(defaultValue = PAGE_NUM, required = false) int pageNum,
            @RequestParam(defaultValue = PAGE_SIZE, required = false) @Max(MAX_PAGE_SIZE) int pageSize,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) Integer status) {
        List<WithdrawStatus> statuses = List.of(WithdrawStatus.PENDING, WithdrawStatus.CONFIRMED);
        if (status != null){
            WithdrawStatus withdrawStatus = WithdrawStatus.fromValue(status);
            statuses = statuses.stream().filter(s -> s.equals(withdrawStatus)).toList();
        }
        PageResponse<WithdrawRequestDto> response = withdrawService.getAllWithdrawRequests(
                pageNum, pageSize, sort, statuses
        );
        return ResponseEntity.ok(response);
    }

    @PutMapping("/backoffice/withdraw/{id}/status")
    ResponseEntity<WithdrawRequestDto> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateWithdrawStatus request
            ){
        WithdrawRequestDto response = withdrawService.updateStatus(id, request);
        return ResponseEntity.ok(response);
    }
}
