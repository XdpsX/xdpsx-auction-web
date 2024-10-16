package com.xdpsx.auction.controller;

import com.xdpsx.auction.dto.auction.AuctionCreateDto;
import com.xdpsx.auction.dto.auction.AuctionDto;
import com.xdpsx.auction.service.AuctionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auctions")
@RequiredArgsConstructor
public class AuctionController {
    private final AuctionService auctionService;

    @PostMapping
    public ResponseEntity<AuctionDto> createAuction(@Valid @ModelAttribute AuctionCreateDto request){
        return new ResponseEntity<>(auctionService.createAuction(request), HttpStatus.CREATED);
    }
}
