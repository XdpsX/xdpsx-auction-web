package com.xdpsx.auction.model;

import com.xdpsx.auction.model.enums.NotificationType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;

    private boolean isRead;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    @ManyToOne
    private User user;

    @CreationTimestamp
    private ZonedDateTime createdAt;

}
