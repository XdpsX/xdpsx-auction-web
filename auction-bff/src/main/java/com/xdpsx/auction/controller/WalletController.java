package com.xdpsx.auction.controller;

import com.xdpsx.auction.dto.wallet.WalletDto;
import com.xdpsx.auction.security.UserContext;
import com.xdpsx.auction.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class WalletController {
    private final UserContext userContext;
    private final WalletService walletService;

    @GetMapping({"/storefront/wallets/me", "/backoffice/wallets/me"})
    ResponseEntity<WalletDto> getCurrentUserWallet() {

        WalletDto response = walletService.getWalletByOwnerId(userContext.getLoggedUser().getId());
        return ResponseEntity.ok(response);
    }
}
