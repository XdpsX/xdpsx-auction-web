package com.xdpsx.auction.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "categories")
public class Category extends AbstractAuditEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    private String slug;

    private boolean published;

    @OneToOne
    private Media image;

    @OneToMany
    private List<Auction> auctions;

    public String getImgUrl(){
        if (image == null){
            return null;
        }
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path(String.format("/medias/%1$s/file/%2$s", image.getId(), image.getFileName()))
                .build().toUriString();
    }
}
