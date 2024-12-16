package com.xdpsx.auction.security;

import com.xdpsx.auction.model.*;
import com.xdpsx.auction.model.enums.AuthProvider;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;
import java.util.Set;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomUserDetails implements UserDetails, OAuth2User {
    private Long id;
    private String name;
    private String email;
    private String password;
    private String mobileNumber;
    private String address;
    private String avatarUrl;
    private boolean enabled;
    private boolean locked;
    private SellerDetails sellerDetails;
    private AuthProvider provider;
    private Set<Role> roles;
    private Map<String, Object> attributes;

    public static CustomUserDetails fromUser(User user) {
        return CustomUserDetails.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .password(user.getPassword())
                .address(user.getAddress())
                .mobileNumber(user.getMobileNumber())
                .avatarUrl(user.getAvatarUrl())
                .enabled(user.isEnabled())
                .locked(user.isLocked())
                .sellerDetails(user.getSellerDetails())
                .provider(user.getProvider())
                .roles(user.getRoles())
                .build();
    }


    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(Role.PREFIX + role.getName()))
                .toList();
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !locked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    public boolean isAdmin() {
        return roles.stream()
                .anyMatch(role -> role.getName().equals(Role.ADMIN));
    }
}
