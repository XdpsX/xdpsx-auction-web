package com.xdpsx.auction.mapper;

import com.xdpsx.auction.dto.order.OrderSellerDto;
import com.xdpsx.auction.dto.order.OrderUserDto;
import com.xdpsx.auction.model.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface OrderMapper {
    OrderMapper INSTANCE = Mappers.getMapper(OrderMapper.class);

    @Mapping(target = "seller", source = "entity.seller.sellerDetails")
    OrderSellerDto toOrderSellerDto(Order entity);

    @Mapping(target = "user", source = "entity.user")
    OrderUserDto toOrderUserDto(Order entity);
}
