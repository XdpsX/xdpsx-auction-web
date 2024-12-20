package com.xdpsx.auction.controller;

import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.bid.*;
import com.xdpsx.auction.model.Bid;
import com.xdpsx.auction.model.enums.BidStatus;
import com.xdpsx.auction.repository.BidRepository;
import com.xdpsx.auction.security.CustomUserDetails;
import com.xdpsx.auction.security.UserContext;
import com.xdpsx.auction.service.BidService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.Optional;

import static com.xdpsx.auction.constant.PageConstant.*;

@RestController
@RequiredArgsConstructor
public class BidController {
    private final BidService bidService;
    private final UserContext userContext;
    private final BidRepository bidRepository;

    @PostMapping("/storefront/auctions/{auctionId}/bids")
    ResponseEntity<BidResponseHistory> placeBid(@PathVariable("auctionId") Long auctionId,
                                                @Valid @RequestBody BidRequest bidRequest) {
        BidResponseHistory response = bidService.placeBid(auctionId, bidRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/storefront/auctions/{auctionId}/my-bid")
    ResponseEntity<BidResponse> getMyBid(@PathVariable("auctionId") Long auctionId) {
        BidResponse response = bidService.getMyBidInAuction(auctionId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/storefront/bids/{id}/refund")
    ResponseEntity<BidResponse> refundBid(@PathVariable Long id) {
        BidResponse response = bidService.refundBid(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/storefront/users/me/bids")
    ResponseEntity<PageResponse<BidAuctionDto>> getMyBids(
            @RequestParam(defaultValue = PAGE_NUM, required = false) int pageNum,
            @RequestParam(defaultValue = PAGE_SIZE, required = false) @Max(MAX_PAGE_SIZE) int pageSize,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) BidStatus status
    ){
        CustomUserDetails userDetails = userContext.getLoggedUser();
        PageResponse<BidAuctionDto> response = bidService.getUserBids(userDetails.getId(), pageNum, pageSize, sort, status);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/storefront/users/me/bids/won/{id}")
    ResponseEntity<BidAuctionDto> getMyWonBidDetails(@PathVariable Long id){
        BidAuctionDto response = bidService.getUserWonBidDetails(id, userContext.getLoggedUser().getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/public/auctions/{id}/bid-history")
    ResponseEntity<PageResponse<BidHistory>> getAuctionBidHistories(
            @PathVariable Long id,
            @RequestParam(defaultValue = PAGE_NUM, required = false) int pageNum,
            @RequestParam(defaultValue = PAGE_SIZE, required = false) @Max(MAX_PAGE_SIZE) int pageSize
    ){
        PageResponse<BidHistory> response = bidService.getAuctionBidHistories(id, pageNum, pageSize);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/test/bids/{id}/status")
    public ResponseEntity<?> updateBidStatus(
            @PathVariable Long id,
            @RequestParam BidStatus status
    ) {
        Optional<Bid> optionalBid = bidRepository.findById(id);

        if (optionalBid.isPresent()) {
            Bid bid = optionalBid.get();

            bid.setStatus(status);
            ZonedDateTime twoDaysAgo = ZonedDateTime.now().minusDays(2);
            bid.setCreatedAt(twoDaysAgo);
            bid.setUpdatedAt(twoDaysAgo);

            bidRepository.save(bid);

            return ResponseEntity.ok("Bid updated successfully.");
        } else {
            return ResponseEntity.status(404).body("Bid not found.");
        }
    }
}
