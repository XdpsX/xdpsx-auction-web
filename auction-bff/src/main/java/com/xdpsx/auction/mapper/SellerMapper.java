package com.xdpsx.auction.mapper;

import com.xdpsx.auction.dto.seller.SellerInfo;
import com.xdpsx.auction.dto.seller.SellerResponse;
import com.xdpsx.auction.model.SellerDetails;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface SellerMapper {
    SellerMapper INSTANCE = Mappers.getMapper(SellerMapper.class);

    @Mapping(target = "user", source = "entity.user")
    SellerResponse toResponse(SellerDetails entity);

    SellerInfo toInfo(SellerDetails entity);
}
