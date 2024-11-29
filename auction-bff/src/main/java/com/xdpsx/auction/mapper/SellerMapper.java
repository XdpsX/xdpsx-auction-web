package com.xdpsx.auction.mapper;

import com.xdpsx.auction.dto.seller.SellerResponse;
import com.xdpsx.auction.model.SellerDetails;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface SellerMapper {
    SellerMapper INSTANCE = Mappers.getMapper(SellerMapper.class);

    SellerResponse toResponse(SellerDetails entity);
}
