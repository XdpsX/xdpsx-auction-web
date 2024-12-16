package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.constant.ErrorCode;
import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.transaction.TransactionMessage;
import com.xdpsx.auction.dto.transaction.TransactionRequest;
import com.xdpsx.auction.dto.transaction.TransactionResponse;
import com.xdpsx.auction.dto.transaction.UpdateTransactionDto;
import com.xdpsx.auction.exception.NotFoundException;
import com.xdpsx.auction.mapper.PageMapper;
import com.xdpsx.auction.mapper.TransactionMapper;
import com.xdpsx.auction.model.Transaction;
import com.xdpsx.auction.model.Wallet;
import com.xdpsx.auction.model.enums.TransactionType;
import com.xdpsx.auction.repository.TransactionRepository;
import com.xdpsx.auction.repository.WalletRepository;
import com.xdpsx.auction.service.TransactionService;
import com.xdpsx.auction.service.producer.TransactionProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {
    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final TransactionProducer transactionProducer;

    @Override
    public TransactionResponse createTransaction(TransactionRequest request) {
        Wallet wallet = getWalletByUserId(request.getUserId());
        Transaction transaction = Transaction.builder()
                .amount(request.getAmount())
                .type(request.getType())
                .description(request.getDescription())
                .wallet(wallet)
                .build();
        Transaction savedTransaction = transactionRepository.save(transaction);
        pushTransactionMessage(savedTransaction);
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

        TransactionMessage message = TransactionMessage.builder()
                .amount(savedTransaction.getAmount().subtract(oldAmount))
                .type(savedTransaction.getType())
                .walletId(savedTransaction.getWallet().getId())
                .build();
        pushTransactionMessage(message);

        return TransactionMapper.INSTANCE.toResponse(savedTransaction);
    }

    @Override
    public PageResponse<TransactionResponse> getUserTransactions(Long userId, int pageNum, int pageSize, String sort,
                                                                 TransactionType type) {
        Wallet wallet = getWalletByUserId(userId);
        Page<Transaction> transactionPage = transactionRepository.findWalletTransactions(
                wallet.getId(), type, PageRequest.of(pageNum - 1, pageSize, getSort(sort))
        );
        return PageMapper.toPageResponse(transactionPage, TransactionMapper.INSTANCE::toResponse);
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



    private Wallet getWalletByUserId(Long userId) {
        return walletRepository.findByOwnerId(userId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.WALLET_NOT_FOUND, userId));
    }

    private Sort getSort(String sortParam) {
        if (sortParam == null) {
            return Sort.by("updatedAt").descending();
        }

        return switch (sortParam) {
            case "amount" -> Sort.by("amount").ascending();
            case "-amount" -> Sort.by("amount").descending();
            case "date" -> Sort.by("updatedAt").ascending();
            default -> Sort.by("updatedAt").descending();
        };
    }

}
