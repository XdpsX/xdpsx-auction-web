package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.constant.CacheKey;
import com.xdpsx.auction.constant.ErrorCode;
import com.xdpsx.auction.dto.payment.InitPaymentRequest;
import com.xdpsx.auction.dto.payment.InitPaymentResponse;
import com.xdpsx.auction.dto.transaction.DepositRequest;
import com.xdpsx.auction.dto.transaction.TransactionRequest;
import com.xdpsx.auction.dto.wallet.CreateWithdrawRequest;
import com.xdpsx.auction.dto.wallet.WalletDto;
import com.xdpsx.auction.dto.wallet.WithdrawRequestDto;
import com.xdpsx.auction.exception.BadRequestException;
import com.xdpsx.auction.exception.NotFoundException;
import com.xdpsx.auction.mapper.WalletMapper;
import com.xdpsx.auction.model.User;
import com.xdpsx.auction.model.Wallet;
import com.xdpsx.auction.model.WithdrawRequest;
import com.xdpsx.auction.model.enums.TransactionType;
import com.xdpsx.auction.model.enums.WithdrawStatus;
import com.xdpsx.auction.repository.WalletRepository;
import com.xdpsx.auction.repository.WithdrawRequestRepository;
import com.xdpsx.auction.security.CustomUserDetails;
import com.xdpsx.auction.security.UserContext;
import com.xdpsx.auction.service.OTPService;
import com.xdpsx.auction.service.PaymentService;
import com.xdpsx.auction.service.TransactionService;
import com.xdpsx.auction.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService {
    private final WalletRepository walletRepository;
    private final WithdrawRequestRepository withdrawRequestRepository;
    private final TransactionService transactionService;
    private final RedisTemplate<String, String> redisTemplate;
    private final UserContext userContext;
    private final PaymentService paymentService;
    private final OTPService otpService;

    @Value("${payment.vnpay.timeout}")
    private Integer paymentTimeout;

    @Override
    public InitPaymentResponse createDepositLink(DepositRequest request) {
//        String transactionId = UUID.randomUUID().toString();
        String transactionId = otpService.generateOTP(10);
        BigDecimal amount = request.getAmount().setScale(0, RoundingMode.DOWN);
        redisTemplate.opsForValue().set(
                CacheKey.getTransactionKey(transactionId),
                amount.toString(),
                paymentTimeout,
                TimeUnit.MINUTES
        );

        InitPaymentRequest initPaymentRequest = InitPaymentRequest.builder()
                .amount(amount)
                .txnRef(transactionId)
                .requestId(transactionId)
                .ipAddress(request.getIpAddress())
                .prefixReturn("deposits")
                .build();
        return paymentService.init(initPaymentRequest);
    }


    @Override
    public WalletDto getWalletByOwnerId(Long ownerId) {
        Wallet wallet = walletRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.WALLET_NOT_FOUND, ownerId));
        return WalletMapper.INSTANCE.toWalletDto(wallet);
    }

    @Override
    public void validateWalletBalance(Long userId, BigDecimal checkBalance) {
        Wallet wallet = walletRepository.findByOwnerId(userId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.WALLET_NOT_FOUND, userId));
        if (checkBalance.compareTo(wallet.getBalance()) > 0){
            throw new BadRequestException(ErrorCode.WALLET_NOT_ENOUGH);
        }
    }

    @Transactional
    @Override
    public void deposit(String transactionId) {
        Wallet wallet = getUserWallet();

        String amountStr = redisTemplate.opsForValue().get(CacheKey.getTransactionKey(transactionId));
        if (amountStr == null) {
            throw new NotFoundException(ErrorCode.TRANSACTION_NOT_FOUND, transactionId);
        }
        BigDecimal amount = BigDecimal.valueOf(Double.parseDouble(amountStr));

        TransactionRequest transactionRequest = TransactionRequest.builder()
                .type(TransactionType.DEPOSIT)
                .amount(amount)
                .userId(wallet.getOwner().getId())
                .description("Deposit  money to the wallet")
                .build();

        transactionService.createTransaction(transactionRequest);
        redisTemplate.delete(CacheKey.getTransactionKey(transactionId));
    }


    @Override
    @Transactional
    public WithdrawRequestDto createWithdrawRequest(Long userId, CreateWithdrawRequest request) {
        validateWalletBalance(userId, request.getAmount());

        WithdrawRequest withdrawRequest = WithdrawRequest.builder()
                .bankName(request.getBankName())
                .accountNumber(request.getAccountNumber())
                .holderName(request.getHolderName())
                .amount(request.getAmount())
                .status(WithdrawStatus.PENDING)
                .user(new User(userId))
                .build();
        WithdrawRequest savedWithdrawRequest = withdrawRequestRepository.save(withdrawRequest);

        TransactionRequest transactionRequest = TransactionRequest.builder()
                .type(TransactionType.WITHDRAW)
                .amount(savedWithdrawRequest.getAmount())
                .description("Withdraw")
                .userId(userId)
                .build();
        transactionService.createTransaction(transactionRequest);

        return WithdrawRequestDto.fromWithdrawRequest(savedWithdrawRequest);
    }

    private Wallet getUserWallet() {
        CustomUserDetails userDetails = userContext.getLoggedUser();
        return walletRepository.findByOwnerId(userDetails.getId())
                .orElseThrow(() -> new NotFoundException(ErrorCode.WALLET_NOT_FOUND, userDetails.getId()));
    }

}
