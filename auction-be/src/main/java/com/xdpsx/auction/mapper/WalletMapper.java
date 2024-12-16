package com.xdpsx.auction.mapper;

import com.xdpsx.auction.dto.wallet.WalletDto;
import com.xdpsx.auction.model.Wallet;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface WalletMapper {
    WalletMapper INSTANCE = Mappers.getMapper(WalletMapper.class);

    @Mapping(target = "ownerId", source = "entity.owner.id")
    WalletDto toWalletDto(Wallet entity);
}
