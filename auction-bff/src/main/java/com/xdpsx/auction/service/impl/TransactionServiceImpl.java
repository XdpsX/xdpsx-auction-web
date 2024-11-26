package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.constant.CacheKey;
import com.xdpsx.auction.constant.ErrorCode;
import com.xdpsx.auction.constant.VNPayCode;
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
import com.xdpsx.auction.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {
    private final UserContext userContext;
    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final KafkaTemplate<String, String> kafkaTemplate;

    @Transactional
    @Override
    public TransactionResponse deposit(String transactionId, String responseCode) {
        Wallet wallet = getUserWallet();

        String amountStr = redisTemplate.opsForValue().get(CacheKey.getTransactionKey(transactionId));
        if (amountStr == null) {
            throw new NotFoundException(ErrorCode.TRANSACTION_NOT_FOUND, transactionId);
        }
        BigDecimal amount = BigDecimal.valueOf(Double.parseDouble(amountStr));

        Transaction transaction = Transaction.builder()
                .amount(amount)
                .type(TransactionType.DEPOSIT)
                .status(TransactionStatus.COMPLETED)
                .wallet(wallet)
                .build();

        VNPayCode code = VNPayCode.fromCode(responseCode);
        if (code != null) {
            transaction.setStatus(code.getStatus());
            transaction.setDescription(code.getMessage());
            if (code.getStatus().equals(TransactionStatus.COMPLETED)) {
                wallet.setBalance(wallet.getBalance().add(transaction.getAmount()));
            }
            walletRepository.save(wallet);
        }

        Transaction savedTransaction = transactionRepository.save(transaction);
        redisTemplate.delete(CacheKey.getTransactionKey(transactionId));
        return TransactionResponse.builder()
                .id(savedTransaction.getId())
                .type(savedTransaction.getType())
                .amount(savedTransaction.getAmount())
                .status(savedTransaction.getStatus())
                .description(savedTransaction.getDescription())
                .createdAt(savedTransaction.getCreatedAt())
                .updatedAt(savedTransaction.getUpdatedAt())
                .build();
    }

    @Override
    public void createTransaction(TransactionRequest request) {
        Wallet wallet = getUserWallet();
        Transaction transaction = Transaction.builder()
                .amount(request.getAmount())
                .type(request.getType())
                .description(request.getDescription())
                .status(TransactionStatus.PENDING)
                .wallet(wallet)
                .build();
        Transaction savedTransaction = transactionRepository.save(transaction);
        kafkaTemplate.send("transaction-topic", String.valueOf(savedTransaction.getId()));
    }

    private Wallet getUserWallet() {
        CustomUserDetails userDetails = userContext.getLoggedUser();
        return walletRepository.findByOwnerId(userDetails.getId())
                .orElseThrow(() -> new NotFoundException(ErrorCode.WALLET_NOT_FOUND, userDetails.getId()));
    }

}
