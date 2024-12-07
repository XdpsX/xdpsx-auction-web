package com.xdpsx.auction.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "auction_images")
public class AuctionImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Auction auction;

    @ManyToOne
    private Media media;

    public String getUrl(){
        if (media == null){
            return null;
        }
        return media.getUrl();
    }

    public Long getId(){
        return media.getId();
    }
}
