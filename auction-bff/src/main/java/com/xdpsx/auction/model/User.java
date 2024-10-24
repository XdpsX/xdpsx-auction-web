package com.xdpsx.auction.model;

import com.xdpsx.auction.model.enums.AuthProvider;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

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

    public String getAvatarUrl(){
        if (avatar == null){
            return null;
        }
        if (provider.equals(AuthProvider.SYSTEM)){
            return ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path(String.format("/medias/%1$s/file/%2$s", avatar.getId(), avatar.getFileName()))
                    .build().toUriString();
        }
        return avatar.getFilePath();
    }

}
