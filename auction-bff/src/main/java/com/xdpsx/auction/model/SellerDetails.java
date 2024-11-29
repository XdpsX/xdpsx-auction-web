package com.xdpsx.auction.model;

import com.xdpsx.auction.model.enums.SellerRegisterStatus;
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
@Table(name = "seller_details")
public class SellerDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String address;

    private String mobilePhone;

    @OneToOne
    private Media avatar;

    @Enumerated(EnumType.STRING)
    private SellerRegisterStatus status;

    @OneToOne(fetch = FetchType.LAZY)
    private User user;

    @CreationTimestamp
    private ZonedDateTime createdAt;

    public String getAvatarUrl(){
        if (avatar == null){
            return null;
        }
        return avatar.getUrl();
    }
}
