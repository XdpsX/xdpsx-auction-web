package com.xdpsx.auction.mapper;

import com.xdpsx.auction.dto.wallet.WalletDto;
import com.xdpsx.auction.model.Wallet;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface WalletMapper {
    @Mapping(target = "ownerId", source = "entity.owner.id")
    WalletDto toWalletDto(Wallet entity);
}
