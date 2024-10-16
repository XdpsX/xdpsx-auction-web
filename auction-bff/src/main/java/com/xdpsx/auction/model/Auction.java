package com.xdpsx.auction.model;

import com.xdpsx.auction.model.enums.AuctionType;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;
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

    private LocalDate startingTime;

    private LocalDate endingTime;

    private AuctionType auctionType;

    @OneToMany(cascade = CascadeType.PERSIST, fetch = FetchType.EAGER, mappedBy = "auction")
    private List<AuctionImage> images;

    @ManyToOne
    private User seller;

    @ManyToOne
    private Category category;

    public String getMainImage(){
        if (images.isEmpty()){
            return null;
        }
        AuctionImage mainImage = images.get(0);
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path(String.format("/medias/%1$s/file/%2$s", mainImage.getMedia().getId(), mainImage.getMedia().getFileName()))
                .build().toUriString();
    }
}
