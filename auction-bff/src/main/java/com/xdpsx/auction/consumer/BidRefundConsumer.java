package com.xdpsx.auction.consumer;

import com.xdpsx.auction.constant.ErrorCode;
import com.xdpsx.auction.exception.NotFoundException;
import com.xdpsx.auction.mapper.WalletMapper;
import com.xdpsx.auction.model.Bid;
import com.xdpsx.auction.model.Wallet;
import com.xdpsx.auction.repository.BidRepository;
import com.xdpsx.auction.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Slf4j
@Service
@RequiredArgsConstructor
public class BidRefundConsumer {
    private final WalletMapper walletMapper;
    private final BidRepository bidRepository;
    private final WalletRepository walletRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public void handleRefundBid(MapRecord<String, String, String> message) {
        String bidId = message.getValue().get("bidId");
        if (bidId == null) {
            throw new IllegalArgumentException("Invalid bid ID");
        }

        Bid bid = bidRepository.findById(Long.valueOf(bidId))
                .orElseThrow(() -> new NotFoundException(ErrorCode.BID_NOT_FOUND, bidId));
        BigDecimal securityDeposit = bid.getAmount().multiply(BigDecimal.valueOf(0.10));
        Wallet wallet = walletRepository.findByOwnerId(bid.getBidder().getId())
                .orElseThrow(() -> new NotFoundException(ErrorCode.WALLET_NOT_FOUND, bid.getBidder().getId()));

        wallet.setBalance(wallet.getBalance().add(securityDeposit));
        Wallet savedWallet = walletRepository.save(wallet);

        bid.setRefund(true);
        bidRepository.save(bid);

         messagingTemplate.convertAndSend("/topic/wallet/" + wallet.getId(), walletMapper.toWalletDto(savedWallet));
    }
}
