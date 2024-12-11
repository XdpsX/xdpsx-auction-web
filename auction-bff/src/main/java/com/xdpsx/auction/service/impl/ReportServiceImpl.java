package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.dto.report.*;
import com.xdpsx.auction.model.Order;
import com.xdpsx.auction.model.enums.AuctionType;
import com.xdpsx.auction.model.enums.OrderStatus;
import com.xdpsx.auction.model.enums.WithdrawStatus;
import com.xdpsx.auction.repository.*;
import com.xdpsx.auction.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.xdpsx.auction.constant.BidConstants.SECURITY_FEE_RATE;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {
    private final OrderRepository orderRepository;
    private final AuctionRepository auctionRepository;
    private final UserRepository userRepository;
    private final SellerDetailsRepository sellerDetailsRepository;
    private final BidRepository bidRepository;
    private final WithdrawRequestRepository withdrawRequestRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public List<MonthlyRevenue> calculateMonthlyRevenueLast12Months() {
        ZonedDateTime twelveMonthsAgo = ZonedDateTime.now().minusMonths(12);
        List<Order> completedOrders = orderRepository.findCompletedOrdersSince(OrderStatus.Completed, twelveMonthsAgo);

        return getMonthlyRevenues(completedOrders, SECURITY_FEE_RATE);
    }

    @PreAuthorize("hasRole('SELLER')")
    @Override
    public List<MonthlyRevenue> calculateMonthlyRevenueLast12Months(Long sellerId) {
        ZonedDateTime twelveMonthsAgo = ZonedDateTime.now().minusMonths(12);
        List<Order> completedOrders =
                orderRepository.findCompletedOrdersForSellerSince(OrderStatus.Completed, twelveMonthsAgo, sellerId);

        return getMonthlyRevenues(completedOrders, BigDecimal.ONE.subtract(SECURITY_FEE_RATE));
    }

    private List<MonthlyRevenue> getMonthlyRevenues(List<Order> completedOrders, BigDecimal rate) {
        Map<String, BigDecimal> monthlyRevenueMap = new HashMap<>();

        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("yyyy-MM");

        for (Order order : completedOrders) {
            String month = order.getUpdatedAt().format(monthFormatter);
            BigDecimal revenue = order.getTotalAmount().multiply(rate);

            monthlyRevenueMap.put(month, monthlyRevenueMap.getOrDefault(month, BigDecimal.ZERO).add(revenue));
        }

        List<MonthlyRevenue> monthlyRevenues = new ArrayList<>();
        for (int i = 0; i < 12; i++) {
            ZonedDateTime monthDate = ZonedDateTime.now().minusMonths(i);
            String month = monthDate.format(monthFormatter);
            BigDecimal revenue = monthlyRevenueMap.getOrDefault(month, BigDecimal.ZERO);
            monthlyRevenues.add(new MonthlyRevenue(month, revenue));
        }

        return monthlyRevenues;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public AdminStatistics getStatistics() {
        return new AdminStatistics(
                getAuctionStatistics(null),
                getOrderStatistics(null),
                getUserStatistics(),
                getSellerStatistics()
        );
    }

    @PreAuthorize("hasRole('SELLER')")
    @Override
    public SellerStatistics getSellerStatistics(Long sellerId) {
        return new SellerStatistics(
                getAuctionStatistics(sellerId),
                getOrderStatistics(sellerId),
                getBidderStatistics(sellerId),
                getWithdrawStatistics(sellerId)
        );
    }

    private StatisticsCount getAuctionStatistics(Long sellerId) {
        ZonedDateTime now = ZonedDateTime.now();
        int currentMonth = now.getMonthValue();
        int currentYear = now.getYear();
        int previousMonth = currentMonth == 1 ? 12 : currentMonth - 1;
        int previousYear = currentMonth == 1 ? currentYear - 1 : currentYear;

        long totalCount; long currentMonthCount; long previousMonthCount;
        if (sellerId == null){
            totalCount = auctionRepository.count();
            currentMonthCount = auctionRepository.countByCreatedAtMonth(currentMonth, currentYear);
            previousMonthCount = auctionRepository.countByCreatedAtMonth(previousMonth, previousYear);

        } else {
            totalCount = auctionRepository.countBySellerId(sellerId);
            currentMonthCount = auctionRepository.countByCreatedAtMonthAndSellerId(currentMonth, currentYear, sellerId);
            previousMonthCount = auctionRepository.countByCreatedAtMonthAndSellerId(previousMonth, previousYear, sellerId);

        }
        return new StatisticsCount(totalCount, currentMonthCount, previousMonthCount);
    }

    private StatisticsCount getOrderStatistics(Long sellerId) {
        ZonedDateTime now = ZonedDateTime.now();
        int currentMonth = now.getMonthValue();
        int currentYear = now.getYear();
        int previousMonth = currentMonth == 1 ? 12 : currentMonth - 1;
        int previousYear = currentMonth == 1 ? currentYear - 1 : currentYear;

        long totalCount; long currentMonthCount; long previousMonthCount;
        if (sellerId == null){
            totalCount = orderRepository.count();
            currentMonthCount = orderRepository.countByCreatedAtMonth(currentMonth, currentYear);
            previousMonthCount = orderRepository.countByCreatedAtMonth(previousMonth, previousYear);

        } else {
            totalCount = orderRepository.countBySellerId(sellerId);
            currentMonthCount = orderRepository.countByCreatedAtMonthAndSellerId(currentMonth, currentYear, sellerId);
            previousMonthCount = orderRepository.countByCreatedAtMonthAndSellerId(previousMonth, previousYear, sellerId);

        }
        return new StatisticsCount(totalCount, currentMonthCount, previousMonthCount);
    }

    private StatisticsCount getUserStatistics() {
        ZonedDateTime now = ZonedDateTime.now();
        int currentMonth = now.getMonthValue();
        int currentYear = now.getYear();
        int previousMonth = currentMonth == 1 ? 12 : currentMonth - 1;
        int previousYear = currentMonth == 1 ? currentYear - 1 : currentYear;

        long totalCount = userRepository.count();
        long currentMonthCount = userRepository.countByCreatedAtMonth(currentMonth, currentYear);
        long previousMonthCount = userRepository.countByCreatedAtMonth(previousMonth,previousYear);

        return new StatisticsCount(totalCount, currentMonthCount, previousMonthCount);
    }

    private StatisticsCount getSellerStatistics() {
        ZonedDateTime now = ZonedDateTime.now();
        int currentMonth = now.getMonthValue();
        int currentYear = now.getYear();
        int previousMonth = currentMonth == 1 ? 12 : currentMonth - 1;
        int previousYear = currentMonth == 1 ? currentYear - 1 : currentYear;

        long totalCount = sellerDetailsRepository.count();
        long currentMonthCount = sellerDetailsRepository.countByCreatedAtMonth(currentMonth, currentYear);
        long previousMonthCount = sellerDetailsRepository.countByCreatedAtMonth(previousMonth,previousYear);

        return new StatisticsCount(totalCount, currentMonthCount, previousMonthCount);
    }

    private StatisticsCount getBidderStatistics(Long sellerId) {
        ZonedDateTime now = ZonedDateTime.now();
        int currentMonth = now.getMonthValue();
        int currentYear = now.getYear();
        int previousMonth = currentMonth == 1 ? 12 : currentMonth - 1;
        int previousYear = currentMonth == 1 ? currentYear - 1 : currentYear;

        long totalCount = bidRepository.countDistinctBiddersBySellerId(sellerId);
        long currentMonthCount = bidRepository.countDistinctBiddersByMonthAndYear(currentMonth, currentYear, sellerId);
        long previousMonthCount = bidRepository.countDistinctBiddersByMonthAndYear(previousMonth,previousYear, sellerId);

        return new StatisticsCount(totalCount, currentMonthCount, previousMonthCount);
    }

    private StatisticsAmount getWithdrawStatistics(Long sellerId) {
        ZonedDateTime now = ZonedDateTime.now();
        int currentMonth = now.getMonthValue();
        int currentYear = now.getYear();
        int previousMonth = currentMonth == 1 ? 12 : currentMonth - 1;
        int previousYear = currentMonth == 1 ? currentYear - 1 : currentYear;

        BigDecimal totalCount = withdrawRequestRepository.sumTotalWithdrawBySeller(sellerId, WithdrawStatus.COMPLETED);
        BigDecimal currentMonthCount =
                withdrawRequestRepository.sumWithdrawByMonthAndSeller(currentMonth, currentYear, sellerId, WithdrawStatus.COMPLETED);
        BigDecimal previousMonthCount =
                withdrawRequestRepository.sumWithdrawByMonthAndSeller(previousMonth,previousYear, sellerId, WithdrawStatus.COMPLETED);

        return new StatisticsAmount(totalCount, currentMonthCount, previousMonthCount);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public List<AuctionTypeCount> getAuctionTypeCount() {
        return List.of(
                new AuctionTypeCount(AuctionType.ENGLISH,
                        auctionRepository.countAuctionsByType(AuctionType.ENGLISH)),
                new AuctionTypeCount(AuctionType.SEALED_BID,
                        auctionRepository.countAuctionsByType(AuctionType.SEALED_BID))
        );
    }

    @PreAuthorize("hasRole('SELLER')")
    @Override
    public List<AuctionTypeCount> getAuctionTypeCount(Long sellerId) {
        return List.of(
                new AuctionTypeCount(AuctionType.ENGLISH,
                        auctionRepository.countAuctionsBySellerIdAndType(sellerId, AuctionType.ENGLISH)),
                new AuctionTypeCount(AuctionType.SEALED_BID,
                        auctionRepository.countAuctionsBySellerIdAndType(sellerId, AuctionType.SEALED_BID))
        );
    }

}
