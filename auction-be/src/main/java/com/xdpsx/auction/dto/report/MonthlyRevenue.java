package com.xdpsx.auction.dto.report;

import java.math.BigDecimal;

public record MonthlyRevenue(
        String month,
        BigDecimal revenue
) {
}
