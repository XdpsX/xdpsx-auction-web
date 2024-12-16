package com.xdpsx.auction.dto.report;

import java.math.BigDecimal;
import java.math.RoundingMode;

public record StatisticsCount(
        long totalCount,
        long currentMonthCount,
        long prevMonthCount,
        double percentageChange
) {

    public StatisticsCount(long totalCount, long currentMonthCount, long prevMonthCount) {
        this(totalCount, currentMonthCount, prevMonthCount, calculatePercentageChange(currentMonthCount, prevMonthCount));
    }

    private static double calculatePercentageChange(long currentMonthCount, long prevMonthCount) {
        if (prevMonthCount == 0) {
            return currentMonthCount > 0 ? 100.0 : 0.0; //  100% nếu có trong tháng hiện tại, còn lại là 0%
        }
        double percentageChange = ((double) (currentMonthCount - prevMonthCount) / prevMonthCount) * 100;
        BigDecimal roundedPercentageChange = new BigDecimal(percentageChange).setScale(2, RoundingMode.HALF_UP);
        return roundedPercentageChange.doubleValue();
    }
}
