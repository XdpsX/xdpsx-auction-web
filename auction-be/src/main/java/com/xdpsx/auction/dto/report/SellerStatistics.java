package com.xdpsx.auction.dto.report;

public record SellerStatistics(
        StatisticsCount auction,
        StatisticsCount order,
        StatisticsCount bidder,
        StatisticsAmount withdraw
) {
}
