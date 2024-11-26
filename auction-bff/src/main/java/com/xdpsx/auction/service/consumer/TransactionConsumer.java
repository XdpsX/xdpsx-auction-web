package com.xdpsx.auction.service.consumer;

import com.xdpsx.auction.mapper.WalletMapper;
import com.xdpsx.auction.model.Transaction;
import com.xdpsx.auction.model.Wallet;
import com.xdpsx.auction.model.enums.TransactionStatus;
import com.xdpsx.auction.repository.TransactionRepository;
import com.xdpsx.auction.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionConsumer {
    private final WalletMapper walletMapper;
    private final TransactionRepository transactionRepository;
    private final WalletRepository walletRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @KafkaListener(topics = "transaction-topic", groupId = "wallet-balance-group", concurrency = "1")
    @Transactional
    public void handleTransactionEvent(String message) {
        log.info("Kafka - Transaction id: {}", message);
        Long transactionId = Long.valueOf(message);
        Transaction transaction = transactionRepository.findById(transactionId).orElse(null);
        if (transaction != null && transaction.getStatus().equals(TransactionStatus.PENDING)) {
            Wallet wallet = transaction.getWallet();
            BigDecimal newBalance = wallet.getBalance().add(getAmount(transaction));
            wallet.setBalance(newBalance);

            transaction.setStatus(TransactionStatus.COMPLETED);
            transactionRepository.save(transaction);

            Wallet savedWallet = walletRepository.save(wallet);
            messagingTemplate.convertAndSend("/topic/wallet/" + wallet.getId(), walletMapper.toWalletDto(savedWallet));
        } else {
            log.error("Transaction id={} not found", transactionId);
        }
    }

    private BigDecimal getAmount(Transaction transaction) {
        return switch (transaction.getType()) {
            case BID_PAID, SECURITY_FEE, WITHDRAW -> transaction.getAmount().multiply(BigDecimal.valueOf(-1));
            default -> transaction.getAmount();
        };
    }
}
