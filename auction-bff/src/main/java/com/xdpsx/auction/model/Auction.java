package com.xdpsx.auction.model;

import com.xdpsx.auction.model.enums.AuctionType;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "auctions")
public class Auction extends AbstractAuditEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    private BigDecimal startingPrice;

    private BigDecimal stepPrice;

    private ZonedDateTime startingTime;

    private ZonedDateTime endingTime;

    @Enumerated(EnumType.STRING)
    private AuctionType auctionType;

    private boolean published;

    private boolean trashed;

    @OneToOne
    @JoinColumn(name = "main_image_id")
    private Media mainImage;

    @OneToMany(cascade = CascadeType.PERSIST, mappedBy = "auction")
    private List<AuctionImage> images;

    @ManyToOne
    private User seller;

    @ManyToOne
    private Category category;

    public String getMainImage(){
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path(String.format("/medias/%1$s/file/%2$s", mainImage.getId(), mainImage.getFileName()))
                .build().toUriString();
    }
}
