package com.xdpsx.auction.dto.report;

public record AdminStatistics(
        StatisticsCount auction,
        StatisticsCount order,
        StatisticsCount user,
        StatisticsCount seller
) {
}
