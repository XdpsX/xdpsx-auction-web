package com.xdpsx.auction.controller;

import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.transaction.TransactionRequest;
import com.xdpsx.auction.dto.transaction.TransactionResponse;
import com.xdpsx.auction.model.enums.TransactionType;
import com.xdpsx.auction.security.UserContext;
import com.xdpsx.auction.service.TransactionService;
import io.swagger.v3.oas.annotations.Hidden;
import jakarta.validation.constraints.Max;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

import static com.xdpsx.auction.constant.PageConstant.*;

@RestController
@RequiredArgsConstructor
@Slf4j
public class TransactionController {
    private final UserContext userContext;
    private final TransactionService transactionService;

    @GetMapping({"/storefront/users/me/transactions", "/backoffice/users/me/transactions"})
    ResponseEntity<PageResponse<TransactionResponse>> getMyTransactions(
            @RequestParam(defaultValue = PAGE_NUM, required = false) int pageNum,
            @RequestParam(defaultValue = PAGE_SIZE, required = false) @Max(MAX_PAGE_SIZE) int pageSize,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) TransactionType type
    ){

        PageResponse<TransactionResponse> response = transactionService.getUserTransactions(
                userContext.getLoggedUser().getId(), pageNum, pageSize, sort, type
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/test/transactions/create")
    @Hidden
    ResponseEntity<TransactionResponse> create() {
        TransactionRequest test = TransactionRequest.builder()
                .amount(BigDecimal.valueOf(50000))
                .description("Test transaction")
                .type(TransactionType.DEPOSIT)
                .userId(1L)
                .build();
        TransactionResponse response = transactionService.createTransaction(test);
        return ResponseEntity.ok(response);
    }

}
