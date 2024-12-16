package com.xdpsx.auction.controller;

import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.notification.NotificationDto;
import com.xdpsx.auction.security.UserContext;
import com.xdpsx.auction.service.NotificationService;
import jakarta.validation.constraints.Max;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

import static com.xdpsx.auction.constant.PageConstant.*;

@RestController
@RequiredArgsConstructor
public class NotificationController {
    private final UserContext userContext;
    private final NotificationService notificationService;

    @GetMapping({"/storefront/notifications", "/backoffice/notifications"})
    ResponseEntity<?> getUserNotifications(
            @RequestParam(defaultValue = PAGE_NUM, required = false) int pageNum,
            @RequestParam(defaultValue = PAGE_SIZE, required = false) @Max(MAX_PAGE_SIZE) int pageSize
    ) {
        PageResponse<NotificationDto> notifications = notificationService.getUserNotifications(pageNum, pageSize, userContext.getLoggedUser().getId());
        long unreadCount = notificationService.countUnreadNotifications(userContext.getLoggedUser().getId());

        Map<String, Object> response = new HashMap<>();
        response.put("notifications", notifications);
        response.put("unreadCount", unreadCount);
        return ResponseEntity.ok(response);
    }

    @PutMapping({"/storefront/notifications/{id}/read", "/backoffice/notifications/{id}/read"})
    ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping({"/storefront/notifications/all/read", "/backoffice/notifications/all/read"})
    ResponseEntity<Void> markAsReadAll() {
        notificationService.markAsReadAll(userContext.getLoggedUser().getId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/test/notifications/create")
    ResponseEntity<Void> createNotificationTest() {
        notificationService.pushNotificationTest();
        return ResponseEntity.ok().build();
    }
}
