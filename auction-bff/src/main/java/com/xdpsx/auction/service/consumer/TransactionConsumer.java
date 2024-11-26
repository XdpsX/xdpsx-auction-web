package com.xdpsx.auction.service.consumer;

import com.xdpsx.auction.dto.transaction.TransactionMessage;
import com.xdpsx.auction.mapper.WalletMapper;
import com.xdpsx.auction.model.Wallet;
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
    private final WalletRepository walletRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @KafkaListener(topics = "transaction-topic", groupId = "wallet-balance-group", concurrency = "1")
    @Transactional
    public void handleTransactionEvent(TransactionMessage transaction) {
        log.info("Consume transaction: {}", transaction);

        Wallet wallet = walletRepository.findById(transaction.getWalletId()).orElse(null);
        if (wallet != null) {
            BigDecimal newBalance = wallet.getBalance().add(getAmount(transaction));
            wallet.setBalance(newBalance);
            Wallet savedWallet = walletRepository.save(wallet);
            messagingTemplate.convertAndSend("/topic/wallet/" + wallet.getId(), walletMapper.toWalletDto(savedWallet));
        }else {
            log.error("Wallet not found: {}", transaction.getWalletId());
        }
    }

    private BigDecimal getAmount(TransactionMessage transaction) {
        return switch (transaction.getType()) {
            case BID_PAID, SECURITY_FEE, WITHDRAW -> transaction.getAmount().multiply(BigDecimal.valueOf(-1));
            default -> transaction.getAmount();
        };
    }
}
