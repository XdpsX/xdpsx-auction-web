package com.xdpsx.auction.security;

import com.xdpsx.auction.model.Role;
import com.xdpsx.auction.model.User;
import com.xdpsx.auction.model.enums.AuthProvider;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;

@Setter
@Getter
@Builder
public class CustomUserDetails implements UserDetails {
    private Long id;
    private String name;
    private String email;
    private String password;
    private boolean enabled;
    private boolean locked;
    private AuthProvider provider;
    private Set<Role> roles;

    public static CustomUserDetails fromUser(User user) {
        return CustomUserDetails.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .password(user.getPassword())
                .enabled(user.isEnabled())
                .locked(user.isLocked())
                .provider(user.getProvider())
                .roles(user.getRoles())
                .build();
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
}
