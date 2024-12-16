package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.transaction.TransactionRequest;
import com.xdpsx.auction.dto.wallet.UpdateWithdrawStatus;
import com.xdpsx.auction.dto.wallet.WithdrawRequestDto;
import com.xdpsx.auction.exception.BadRequestException;
import com.xdpsx.auction.exception.NotFoundException;
import com.xdpsx.auction.mapper.PageMapper;
import com.xdpsx.auction.model.WithdrawRequest;
import com.xdpsx.auction.model.enums.TransactionType;
import com.xdpsx.auction.model.enums.WithdrawStatus;
import com.xdpsx.auction.repository.WithdrawRequestRepository;
import com.xdpsx.auction.service.TransactionService;
import com.xdpsx.auction.service.WithdrawService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WithdrawServiceImpl implements WithdrawService {
    private final WithdrawRequestRepository withdrawRequestRepository;
    private final TransactionService transactionService;

    @Override
    public PageResponse<WithdrawRequestDto> getUserWithdrawRequests(Long userId, int pageNum, int pageSize, String sort, Integer status) {
        PageRequest pageRequest = PageRequest.of(pageNum-1, pageSize, getSort(sort));
        WithdrawStatus withdrawStatus = (status != null) ? WithdrawStatus.fromValue(status) : null;
        Page<WithdrawRequest> withdrawRequestsPage = withdrawRequestRepository.findByUserIdAndOptionalStatus(userId, withdrawStatus, pageRequest);
        return PageMapper.toPageResponse(withdrawRequestsPage, WithdrawRequestDto::fromWithdrawRequest);
    }


    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public PageResponse<WithdrawRequestDto> getAllWithdrawRequests(int pageNum, int pageSize, String sort, List<WithdrawStatus> statuses) {
        Page<WithdrawRequest> withdrawRequestPage = withdrawRequestRepository.findByStatusIn(
                statuses, PageRequest.of(pageNum - 1, pageSize, getSort(sort))
        );
        return PageMapper.toPageResponse(withdrawRequestPage, WithdrawRequestDto::fromWithdrawRequest);
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
                .amount(withdrawRequest.getAmount())
                .description("Cancel withdraw")
                .type(TransactionType.DEPOSIT).build();
        transactionService.createTransaction(transactionRequest);
    }

    @Override
    @Transactional
    public WithdrawRequestDto updateStatus(Long id, UpdateWithdrawStatus request) {
        WithdrawRequest withdrawRequest = withdrawRequestRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Withdraw request is not found"));
        withdrawRequest.setStatus(request.getStatus());
        withdrawRequest.setReason(request.getReason());
        WithdrawRequest savedWithdrawRequest = withdrawRequestRepository.save(withdrawRequest);

        if (savedWithdrawRequest.getStatus().equals(WithdrawStatus.REJECTED)) {
            TransactionRequest transactionRequest = TransactionRequest.builder()
                    .amount(savedWithdrawRequest.getAmount())
                    .description("Withdraw request is rejected")
                    .type(TransactionType.DEPOSIT)
                    .userId(savedWithdrawRequest.getUser().getId())
                    .build();
            transactionService.createTransaction(transactionRequest);
        }

        return WithdrawRequestDto.fromWithdrawRequest(savedWithdrawRequest);
    }
}
