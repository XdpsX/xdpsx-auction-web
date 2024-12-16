package com.xdpsx.auction.dto.report;

import java.math.BigDecimal;
import java.math.RoundingMode;

public record StatisticsAmount (
        BigDecimal totalCount,
        BigDecimal currentMonthCount,
        BigDecimal prevMonthCount,
        double percentageChange
) {
    public StatisticsAmount(BigDecimal totalCount, BigDecimal currentMonthCount, BigDecimal prevMonthCount) {
        this(
                totalCount == null ? BigDecimal.valueOf(0) : totalCount,
                currentMonthCount == null ? BigDecimal.valueOf(0) : currentMonthCount,
                prevMonthCount == null ? BigDecimal.valueOf(0) : prevMonthCount,
                calculatePercentageChange(currentMonthCount, prevMonthCount));
    }

    private static double calculatePercentageChange(BigDecimal currentMonthCount, BigDecimal prevMonthCount) {
        if (prevMonthCount == null) {
            prevMonthCount = BigDecimal.valueOf(0);
        }
        if (currentMonthCount == null) {
            currentMonthCount = BigDecimal.valueOf(0);
        }
        if (prevMonthCount.compareTo(BigDecimal.ZERO) == 0) {
            return currentMonthCount.compareTo(BigDecimal.ZERO) > 0 ? 100.0 : 0.0;
        }

        BigDecimal difference = currentMonthCount.subtract(prevMonthCount);
        BigDecimal percentageChange = difference.divide(prevMonthCount, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));

        return percentageChange.setScale(2, RoundingMode.HALF_UP).doubleValue();
    }
}
