package com.xdpsx.auction.service;

import com.xdpsx.auction.dto.seller.SellerRequest;
import com.xdpsx.auction.dto.seller.SellerResponse;

public interface SellerService {
    SellerResponse registerSeller(SellerRequest request);
    SellerResponse getSellerInfo(Long userId);
}
