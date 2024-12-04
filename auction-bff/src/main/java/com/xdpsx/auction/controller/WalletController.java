package com.xdpsx.auction.controller;

import com.xdpsx.auction.dto.payment.InitPaymentResponse;
import com.xdpsx.auction.dto.transaction.DepositRequest;
import com.xdpsx.auction.dto.wallet.CreateWithdrawRequest;
import com.xdpsx.auction.dto.wallet.WalletDto;
import com.xdpsx.auction.dto.wallet.WithdrawRequestDto;
import com.xdpsx.auction.security.UserContext;
import com.xdpsx.auction.service.PaymentService;
import com.xdpsx.auction.service.WalletService;
import com.xdpsx.auction.util.RequestUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class WalletController {
    private final UserContext userContext;
    private final WalletService walletService;
    private final PaymentService paymentService;

    @GetMapping({"/storefront/wallets/me", "/backoffice/wallets/me"})
    ResponseEntity<WalletDto> getCurrentUserWallet() {
        WalletDto response = walletService.getWalletByOwnerId(userContext.getLoggedUser().getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/storefront/wallets/deposit")
    ResponseEntity<InitPaymentResponse> deposit(@Valid @RequestBody DepositRequest request,
                                                HttpServletRequest httpServletRequest) {
        var ipAddress = RequestUtil.getIpAddress(httpServletRequest);
        request.setIpAddress(ipAddress);
        return ResponseEntity.ok(paymentService.createPayment(request));
    }

    @PostMapping("/storefront/wallets/withdraw")
    ResponseEntity<WithdrawRequestDto> withdraw(@Valid @RequestBody CreateWithdrawRequest request) {
        WithdrawRequestDto response = walletService.createWithdrawRequest(userContext.getLoggedUser().getId(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

}
