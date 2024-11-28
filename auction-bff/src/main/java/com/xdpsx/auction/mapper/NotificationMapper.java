package com.xdpsx.auction.mapper;

import com.xdpsx.auction.dto.notification.NotificationDto;
import com.xdpsx.auction.model.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface NotificationMapper {
    NotificationMapper INSTANCE = Mappers.getMapper(NotificationMapper.class);

    @Mapping(target = "isRead", source = "entity.read")
    NotificationDto toDto(Notification entity);
}
