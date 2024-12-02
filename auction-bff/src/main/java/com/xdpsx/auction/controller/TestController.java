package com.xdpsx.auction.controller;

import com.xdpsx.auction.dto.bid.BidResponse;
import com.xdpsx.auction.mapper.BidMapper;
import com.xdpsx.auction.model.Bid;
import com.xdpsx.auction.model.enums.BidStatus;
import com.xdpsx.auction.repository.BidRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZonedDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/test")
public class TestController {
    private final BidRepository bidRepository;

    @GetMapping("/bids/won-expired")
    ResponseEntity<?> getWonExpired() {
        ZonedDateTime oneDayAgo = ZonedDateTime.now().minusDays(1);
        List<Bid> bids = bidRepository.findBidsOlderThanAndWithStatus(BidStatus.WON, oneDayAgo);
        List<BidResponse> response = bids.stream().map(
                BidMapper.INSTANCE::toResponse
        ).toList();
        return ResponseEntity.ok(response);
    }
}
