package com.xdpsx.auction.controller;

import com.xdpsx.auction.constant.VNPayParams;
import com.xdpsx.auction.dto.payment.InitPaymentResponse;
import com.xdpsx.auction.dto.transaction.TransactionRequest;
import com.xdpsx.auction.dto.transaction.TransactionResponse;
import com.xdpsx.auction.exception.BadRequestException;
import com.xdpsx.auction.service.PaymentService;
import com.xdpsx.auction.service.TransactionService;
import com.xdpsx.auction.util.RequestUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
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
    ResponseEntity<InitPaymentResponse> deposit(@Valid @RequestBody TransactionRequest request,
                                                HttpServletRequest httpServletRequest) {
        var ipAddress = RequestUtil.getIpAddress(httpServletRequest);
        request.setIpAddress(ipAddress);
        return new ResponseEntity<>(
                transactionService.deposit(request),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/storefront/transactions/deposit/callback")
    ResponseEntity<TransactionResponse> depositCallback(@RequestParam Map<String, String> params) {
        log.info("[Ipn] Params: {}", params);
        if (!paymentService.verifyIpn(params)){
            throw new BadRequestException("Invalid IPN");
        }
        var txnRef = params.get(VNPayParams.TXN_REF);
        var transactionId = Long.parseLong(txnRef);
        var responseCode = params.get(VNPayParams.RESPONSE_CODE);
        return ResponseEntity.ok(transactionService.depositCallback(transactionId, responseCode));
    }

}
