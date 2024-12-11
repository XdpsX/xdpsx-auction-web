package com.xdpsx.auction.controller;

import com.xdpsx.auction.dto.report.AdminStatistics;
import com.xdpsx.auction.dto.report.AuctionTypeCount;
import com.xdpsx.auction.dto.report.MonthlyRevenue;
import com.xdpsx.auction.dto.report.SellerStatistics;
import com.xdpsx.auction.security.CustomUserDetails;
import com.xdpsx.auction.security.UserContext;
import com.xdpsx.auction.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;
    private final UserContext userContext;

    @GetMapping("/backoffice/reports/revenue")
    ResponseEntity<List<MonthlyRevenue>> getMonthlyRevenueLast12Months() {
        CustomUserDetails userDetails = userContext.getLoggedUser();
        if (userDetails.isAdmin()) {
            return ResponseEntity.ok(reportService.calculateMonthlyRevenueLast12Months());
        } else {
            return ResponseEntity.ok(reportService.calculateMonthlyRevenueLast12Months(userDetails.getId()));
        }
    }

    @GetMapping("/backoffice/admin/reports/stats")
    ResponseEntity<AdminStatistics> getAdminStatsCount() {
        return ResponseEntity.ok(reportService.getStatistics());
    }

    @GetMapping("/backoffice/seller/reports/stats")
    ResponseEntity<SellerStatistics> getSellerStatsCount() {
        return ResponseEntity.ok(reportService.getSellerStatistics(userContext.getLoggedUser().getId()));
    }

    @GetMapping("/backoffice/reports/auction")
    ResponseEntity<List<AuctionTypeCount>> getAuctionTypeCount() {
        CustomUserDetails userDetails = userContext.getLoggedUser();
        if (userDetails.isAdmin()) {
            return ResponseEntity.ok(reportService.getAuctionTypeCount());
        } else {
            return ResponseEntity.ok(reportService.getAuctionTypeCount(userDetails.getId()));
        }
    }

}
