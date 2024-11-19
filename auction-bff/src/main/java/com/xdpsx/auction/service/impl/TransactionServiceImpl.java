package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.constant.ErrorCode;
import com.xdpsx.auction.constant.VNPayCode;
import com.xdpsx.auction.dto.payment.InitPaymentRequest;
import com.xdpsx.auction.dto.payment.InitPaymentResponse;
import com.xdpsx.auction.dto.transaction.TransactionRequest;
import com.xdpsx.auction.dto.transaction.TransactionResponse;
import com.xdpsx.auction.exception.NotFoundException;
import com.xdpsx.auction.model.Transaction;
import com.xdpsx.auction.model.Wallet;
import com.xdpsx.auction.model.enums.TransactionStatus;
import com.xdpsx.auction.model.enums.TransactionType;
import com.xdpsx.auction.repository.TransactionRepository;
import com.xdpsx.auction.repository.WalletRepository;
import com.xdpsx.auction.security.CustomUserDetails;
import com.xdpsx.auction.security.UserContext;
import com.xdpsx.auction.service.PaymentService;
import com.xdpsx.auction.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {
    private final UserContext userContext;
    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final PaymentService paymentService;

    @Override
    public InitPaymentResponse deposit(TransactionRequest request) {
        CustomUserDetails userDetails = userContext.getLoggedUser();
        Wallet wallet = walletRepository.findByOwnerId(userDetails.getId())
                .orElseThrow(() -> new NotFoundException(ErrorCode.WALLET_NOT_FOUND, userDetails.getId()));

        Transaction transaction = new Transaction();
        transaction.setAmount(request.getAmount());
        transaction.setAmount(request.getAmount());
        transaction.setType(TransactionType.DEPOSIT);
        transaction.setStatus(TransactionStatus.PENDING);
        transaction.setPaymentMethod(request.getPaymentMethod());
        transaction.setWallet(wallet);

        Transaction savedTransaction = transactionRepository.save(transaction);
        InitPaymentRequest initPaymentRequest = InitPaymentRequest.builder()
                .amount(savedTransaction.getAmount())
                .txnRef(String.valueOf(savedTransaction.getId()))
                .requestId(String.valueOf(savedTransaction.getId()))
                .ipAddress(request.getIpAddress())
                .prefixReturn("transactions")
                .build();
        return paymentService.init(initPaymentRequest);
    }

    @Transactional
    @Override
    public TransactionResponse depositCallback(Long transactionId, String responseCode) {
        CustomUserDetails userDetails = userContext.getLoggedUser();
        Wallet wallet = walletRepository.findByOwnerId(userDetails.getId())
                .orElseThrow(() -> new NotFoundException(ErrorCode.WALLET_NOT_FOUND, userDetails.getId()));

        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.TRANSACTION_NOT_FOUND, transactionId));
        if (transaction.getStatus().equals(TransactionStatus.PENDING)) {
            VNPayCode code = VNPayCode.fromCode(responseCode);
            if (code != null) {
                transaction.setStatus(code.getStatus());
                transaction.setDescription(code.getMessage());
                if (code.getStatus().equals(TransactionStatus.COMPLETED)) {
                    wallet.setBalance(wallet.getBalance().add(transaction.getAmount()));
                }
                walletRepository.save(wallet);
            }
        }
        Transaction savedTransaction = transactionRepository.save(transaction);
        return TransactionResponse.builder()
                .id(savedTransaction.getId())
                .type(savedTransaction.getType())
                .amount(savedTransaction.getAmount())
                .paymentMethod(savedTransaction.getPaymentMethod())
                .status(savedTransaction.getStatus())
                .description(savedTransaction.getDescription())
                .createdAt(savedTransaction.getCreatedAt())
                .updatedAt(savedTransaction.getUpdatedAt())
                .build();
    }

}
