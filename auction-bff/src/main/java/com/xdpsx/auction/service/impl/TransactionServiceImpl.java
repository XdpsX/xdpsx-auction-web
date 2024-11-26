package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.constant.CacheKey;
import com.xdpsx.auction.constant.ErrorCode;
import com.xdpsx.auction.constant.VNPayCode;
import com.xdpsx.auction.dto.transaction.TransactionMessage;
import com.xdpsx.auction.dto.transaction.TransactionRequest;
import com.xdpsx.auction.dto.transaction.TransactionResponse;
import com.xdpsx.auction.dto.transaction.UpdateTransactionDto;
import com.xdpsx.auction.exception.NotFoundException;
import com.xdpsx.auction.mapper.TransactionMapper;
import com.xdpsx.auction.model.Transaction;
import com.xdpsx.auction.model.Wallet;
import com.xdpsx.auction.model.enums.TransactionStatus;
import com.xdpsx.auction.model.enums.TransactionType;
import com.xdpsx.auction.repository.TransactionRepository;
import com.xdpsx.auction.repository.WalletRepository;
import com.xdpsx.auction.security.CustomUserDetails;
import com.xdpsx.auction.security.UserContext;
import com.xdpsx.auction.service.TransactionService;
import com.xdpsx.auction.service.producer.TransactionProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
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
    private final TransactionProducer transactionProducer;

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
    public TransactionResponse createTransaction(TransactionRequest request) {
        Wallet wallet = getUserWallet();
        Transaction transaction = Transaction.builder()
                .amount(request.getAmount())
                .type(request.getType())
                .description(request.getDescription())
                .status(request.getStatus())
                .wallet(wallet)
                .build();
        Transaction savedTransaction = transactionRepository.save(transaction);
        if (savedTransaction.getStatus() == TransactionStatus.COMPLETED) {
            pushTransactionMessage(savedTransaction);
        }
        return TransactionMapper.INSTANCE.toResponse(savedTransaction);
    }

    @Override
    public TransactionResponse updateTransaction(Long transactionId, UpdateTransactionDto request) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.TRANSACTION_NOT_FOUND, transactionId));
        BigDecimal oldAmount = transaction.getAmount();
        transaction.setAmount(request.getAmount());
        transaction.setDescription(request.getDescription());
        Transaction savedTransaction = transactionRepository.save(transaction);
        if (savedTransaction.getType().equals(TransactionType.SECURITY_FEE)) {
            TransactionMessage message = TransactionMessage.builder()
                    .amount(savedTransaction.getAmount().subtract(oldAmount))
                    .type(savedTransaction.getType())
                    .walletId(savedTransaction.getWallet().getId())
                    .build();
            pushTransactionMessage(message);
        }
        return TransactionMapper.INSTANCE.toResponse(savedTransaction);
    }

    private void pushTransactionMessage(Transaction transaction) {
        TransactionMessage message = TransactionMessage.builder()
                .amount(transaction.getAmount())
                .type(transaction.getType())
                .walletId(transaction.getWallet().getId())
                .build();
        transactionProducer.produceTransaction(message);
    }

    private void pushTransactionMessage(TransactionMessage transaction) {
        transactionProducer.produceTransaction(transaction);
    }

    private Wallet getUserWallet() {
        CustomUserDetails userDetails = userContext.getLoggedUser();
        return walletRepository.findByOwnerId(userDetails.getId())
                .orElseThrow(() -> new NotFoundException(ErrorCode.WALLET_NOT_FOUND, userDetails.getId()));
    }

}
