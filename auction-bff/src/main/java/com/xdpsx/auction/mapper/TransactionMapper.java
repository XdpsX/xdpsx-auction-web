package com.xdpsx.auction.mapper;

import com.xdpsx.auction.dto.transaction.TransactionResponse;
import com.xdpsx.auction.model.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface TransactionMapper {
    TransactionMapper INSTANCE = Mappers.getMapper(TransactionMapper.class);

    TransactionResponse toResponse(Transaction transaction);
}
