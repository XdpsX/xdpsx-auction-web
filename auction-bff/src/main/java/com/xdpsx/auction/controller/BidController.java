package com.xdpsx.auction.controller;

import com.xdpsx.auction.dto.bid.BidRequest;
import com.xdpsx.auction.dto.bid.BidResponse;
import com.xdpsx.auction.service.BidService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class BidController {
    private final BidService bidService;

    @PostMapping("/storefront/auctions/{auctionId}/bids")
    ResponseEntity<BidResponse> placeBid(@PathVariable("auctionId") Long auctionId,
                                         @Valid @RequestBody BidRequest bidRequest) {
        BidResponse response = bidService.placeBid(auctionId, bidRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
