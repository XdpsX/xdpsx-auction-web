package com.xdpsx.auction.controller;

import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.wallet.WithdrawRequestDto;
import com.xdpsx.auction.security.UserContext;
import com.xdpsx.auction.service.WalletService;
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
    private final WalletService walletService;

    @GetMapping("/storefront/wallets/me/withdraw")
    ResponseEntity<PageResponse<WithdrawRequestDto>> getMyWithdrawRequests(
            @RequestParam(defaultValue = PAGE_NUM, required = false) int pageNum,
            @RequestParam(defaultValue = PAGE_SIZE, required = false) @Max(MAX_PAGE_SIZE) int pageSize,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) Integer status) {
        PageResponse<WithdrawRequestDto> response = walletService.getUserWithdrawRequests(
                userContext.getLoggedUser().getId(), pageNum, pageSize, sort, status);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/storefront/withdraw/{id}/cancel")
    ResponseEntity<Void> cancelWithdraw(@PathVariable Long id) {
        walletService.cancelWithdraw(userContext.getLoggedUser().getId(), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/backoffice/withdraw")
    ResponseEntity<PageResponse<WithdrawRequestDto>> getAllWithdraw(
            @RequestParam(defaultValue = PAGE_NUM, required = false) int pageNum,
            @RequestParam(defaultValue = PAGE_SIZE, required = false) @Max(MAX_PAGE_SIZE) int pageSize,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) List<Integer> statuses) {
        PageResponse<WithdrawRequestDto> response = walletService.getAllWithdrawRequests(
                pageNum, pageSize, sort, statuses
        );
        return ResponseEntity.ok(response);
    }
}
