package com.xdpsx.auction.service;

import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.seller.SellerInfo;
import com.xdpsx.auction.dto.seller.SellerRequest;
import com.xdpsx.auction.dto.seller.SellerResponse;
import com.xdpsx.auction.model.enums.SellerRegisterStatus;

public interface SellerService {
    SellerInfo registerSeller(SellerRequest request);
    SellerInfo getSellerInfo(Long userId);
    PageResponse<SellerResponse> getPageSeller(int pageNum, int pageSize, String keyword, String sort,
                                               SellerRegisterStatus status);
    SellerResponse updateStatus(Long id, SellerRegisterStatus status);

    PageResponse<SellerResponse> getPageSellerRegisterList(int pageNum, int pageSize, String keyword, String sort);
}
