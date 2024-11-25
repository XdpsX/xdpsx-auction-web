package com.xdpsx.auction.controller;

import com.xdpsx.auction.constant.VNPayParams;
import com.xdpsx.auction.dto.transaction.TransactionResponse;
import com.xdpsx.auction.exception.BadRequestException;
import com.xdpsx.auction.service.PaymentService;
import com.xdpsx.auction.service.TransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class TransactionController {

    private final TransactionService transactionService;
    private final PaymentService paymentService;

    @PostMapping("/storefront/transactions/deposit")
    ResponseEntity<TransactionResponse> deposit(@RequestParam Map<String, String> params) {
        log.info("[Ipn] Params: {}", params);
        if (!paymentService.verifyIpn(params)){
            throw new BadRequestException("Invalid IPN");
        }
        var txnRef = params.get(VNPayParams.TXN_REF);
        var responseCode = params.get(VNPayParams.RESPONSE_CODE);
        return new ResponseEntity<>(transactionService.deposit(txnRef, responseCode), HttpStatus.CREATED);
    }

}
