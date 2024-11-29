package com.xdpsx.auction.model;

import com.xdpsx.auction.model.enums.AuthProvider;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User extends AbstractAuditEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    private String password;

    private String mobileNumber;

    private String address;

    @OneToOne(cascade = CascadeType.PERSIST)
    private Media avatar;

    private boolean enabled;

    private boolean verified;

    private boolean locked;

    @Enumerated(EnumType.STRING)
    private AuthProvider provider;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id")
    )
    private Set<Role> roles;

    @OneToMany
    private List<Auction> auctions;

    @OneToOne(mappedBy = "owner", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
    private Wallet wallet;

    @OneToMany
    private List<Bid> bids;

    @OneToMany
    private List<Notification> notifications;

    @OneToOne(mappedBy = "user")
    private SellerDetails sellerDetails;

    public User(Long id) {
        this.id = id;
    }

    public String getAvatarUrl(){
        if (avatar == null){
            return null;
        }
        return avatar.getUrl();
    }

}
