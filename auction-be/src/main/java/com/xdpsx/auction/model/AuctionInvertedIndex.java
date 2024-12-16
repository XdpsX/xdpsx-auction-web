package com.xdpsx.auction.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.ZonedDateTime;

@Entity
@Table(name = "auction_inverted_index")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuctionInvertedIndex {

    @Id
    private String term;

    private String auctionIdsTitle;

    private String auctionIdsDescription;

    @UpdateTimestamp
    private ZonedDateTime updatedAt;

    public AuctionInvertedIndex(String term, String auctionIdsTitle, String auctionIdsDescription) {
        this.term = term;
        this.auctionIdsTitle = auctionIdsTitle;
        this.auctionIdsDescription = auctionIdsDescription;
    }
}
