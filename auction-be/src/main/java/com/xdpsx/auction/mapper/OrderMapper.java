package com.xdpsx.auction.mapper;

import com.xdpsx.auction.dto.order.OrderDetailsDto;
import com.xdpsx.auction.dto.order.OrderDto;
import com.xdpsx.auction.model.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface OrderMapper {
    OrderMapper INSTANCE = Mappers.getMapper(OrderMapper.class);

    @Mapping(target = "shippingInfo", source = "entity.shippingInfo")
    @Mapping(target = "auction", source = "entity.auction")
    OrderDto toOrderDto(Order entity);

    @Mapping(target = "shippingInfo", source = "entity.shippingInfo")
    @Mapping(target = "auction", source = "entity.auction")
    @Mapping(target = "seller", source = "entity.seller.sellerDetails")
    OrderDetailsDto toOrderDetailsDto(Order entity);

}
