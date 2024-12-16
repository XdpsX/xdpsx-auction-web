package com.xdpsx.auction.service;

import com.xdpsx.auction.dto.report.AdminStatistics;
import com.xdpsx.auction.dto.report.AuctionTypeCount;
import com.xdpsx.auction.dto.report.MonthlyRevenue;
import com.xdpsx.auction.dto.report.SellerStatistics;

import java.util.List;

public interface ReportService {
    List<MonthlyRevenue> calculateMonthlyRevenueLast12Months();
    List<MonthlyRevenue> calculateMonthlyRevenueLast12Months(Long sellerId);
    AdminStatistics getStatistics();
    SellerStatistics getSellerStatistics(Long sellerId);
    List<AuctionTypeCount> getAuctionTypeCount();
    List<AuctionTypeCount> getAuctionTypeCount(Long sellerId);
}
