package com.xdpsx.auction.controller;

import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.notification.NotificationDto;
import com.xdpsx.auction.security.UserContext;
import com.xdpsx.auction.service.NotificationService;
import jakarta.validation.constraints.Max;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.xdpsx.auction.constant.PageConstant.*;

@RestController
@RequiredArgsConstructor
public class NotificationController {
    private final UserContext userContext;
    private final NotificationService notificationService;

    @GetMapping({"/storefront/notifications", "/backoffice/notifications"})
    ResponseEntity<PageResponse<NotificationDto>> getUserNotifications(
            @RequestParam(defaultValue = PAGE_NUM, required = false) int pageNum,
            @RequestParam(defaultValue = PAGE_SIZE, required = false) @Max(MAX_PAGE_SIZE) int pageSize
    ) {

        PageResponse<NotificationDto> response = notificationService.getUserNotifications(pageNum, pageSize, userContext.getLoggedUser().getId());
        return ResponseEntity.ok(response);
    }
}
