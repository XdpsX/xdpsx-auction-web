package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.constant.ErrorCode;
import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.transaction.TransactionRequest;
import com.xdpsx.auction.dto.wallet.CreateWithdrawRequest;
import com.xdpsx.auction.dto.wallet.WalletDto;
import com.xdpsx.auction.dto.wallet.WithdrawRequestDto;
import com.xdpsx.auction.exception.BadRequestException;
import com.xdpsx.auction.exception.NotFoundException;
import com.xdpsx.auction.mapper.PageMapper;
import com.xdpsx.auction.mapper.WalletMapper;
import com.xdpsx.auction.model.User;
import com.xdpsx.auction.model.Wallet;
import com.xdpsx.auction.model.WithdrawRequest;
import com.xdpsx.auction.model.enums.TransactionStatus;
import com.xdpsx.auction.model.enums.TransactionType;
import com.xdpsx.auction.model.enums.WithdrawStatus;
import com.xdpsx.auction.repository.WalletRepository;
import com.xdpsx.auction.repository.WithdrawRequestRepository;
import com.xdpsx.auction.service.TransactionService;
import com.xdpsx.auction.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService {
    private final WalletRepository walletRepository;
    private final WithdrawRequestRepository withdrawRequestRepository;
    private final TransactionService transactionService;

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
                .status(TransactionStatus.COMPLETED)
                .userId(userId)
                .build();
        transactionService.createTransaction(transactionRequest);

        return WithdrawRequestDto.fromWithdrawRequest(savedWithdrawRequest);
    }

    @Override
    public PageResponse<WithdrawRequestDto> getUserWithdrawRequests(Long userId, int pageNum, int pageSize, String sort, Integer status) {
        PageRequest pageRequest = PageRequest.of(pageNum-1, pageSize, getUserSort(sort));
        WithdrawStatus withdrawStatus = (status != null) ? WithdrawStatus.fromValue(status) : null;
        Page<WithdrawRequest> withdrawRequestsPage = withdrawRequestRepository.findByUserIdAndOptionalStatus(userId, withdrawStatus, pageRequest);
        return PageMapper.toPageResponse(withdrawRequestsPage, WithdrawRequestDto::fromWithdrawRequest);
    }

    @Override
    @Transactional
    public void cancelWithdraw(Long userId, Long withdrawId) {
        WithdrawRequest withdrawRequest = withdrawRequestRepository.findByIdAndUserId(withdrawId, userId)
                .orElseThrow(() -> new NotFoundException("Withdraw request is not found"));
        if (!withdrawRequest.getStatus().equals(WithdrawStatus.PENDING)){
            throw new BadRequestException("Withdraw request is not pending");
        }
        withdrawRequest.setStatus(WithdrawStatus.CANCELLED);
        withdrawRequestRepository.save(withdrawRequest);

        TransactionRequest transactionRequest = TransactionRequest.builder()
                .userId(userId)
                .status(TransactionStatus.COMPLETED)
                .amount(withdrawRequest.getAmount())
                .description("Cancel withdraw")
                .type(TransactionType.DEPOSIT).build();
        transactionService.createTransaction(transactionRequest);
    }

    private Sort getUserSort(String sortParam) {
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
