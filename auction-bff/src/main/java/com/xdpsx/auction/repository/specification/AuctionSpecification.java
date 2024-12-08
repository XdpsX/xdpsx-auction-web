package com.xdpsx.auction.repository.specification;

import com.xdpsx.auction.dto.auction.AuctionTime;
import com.xdpsx.auction.model.Auction;
import com.xdpsx.auction.model.enums.AuctionStatus;
import com.xdpsx.auction.model.enums.AuctionType;
import jakarta.persistence.criteria.Order;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

import static com.xdpsx.auction.constant.PageConstant.*;

@Component
public class AuctionSpecification extends AbstractSpecification<Auction> {

    public Specification<Auction> getAllAuctionsSpec(String name, String sort, Boolean published,
                                                     AuctionType type, AuctionStatus status, AuctionTime time) {
        return Specification.where(hasName(name))
                .and(hasTrashed(false))
                .and(hasPublished(published))
                .and(getSortSpec(sort))
                .and(hasType(type))
                .and(hasStatus(status))
                .and(hasAuctionTime(time));
    }

    public Specification<Auction> getTrashedAuctionsSpec(String name, String sort, Boolean published,
                                                         AuctionType type, AuctionStatus status, AuctionTime time) {
        return Specification.where(hasName(name))
                .and(hasTrashed(true))
                .and(hasPublished(published))
                .and(getSortSpec(sort))
                .and(hasType(type))
                .and(hasStatus(status))
                .and(hasAuctionTime(time));
    }

    public Specification<Auction> getUserAuctionsSpec(String name, String sort, Long userId,
                                                      AuctionType type, AuctionStatus status, AuctionTime time) {
        return Specification.where(hasName(name))
                .and(hasSeller(userId))
                .and(hasTrashed(false))
                .and(hasPublished(true))
                .and(getSortSpec(sort))
                .and(hasType(type))
                .and(hasStatus(status))
                .and(hasAuctionTime(time));
    }

    public Specification<Auction> getCategoryAuctionsSpec(Integer categoryId) {
        return Specification
                .where(hasCategory(categoryId))
                .and(hasTrashed(false))
                .and(hasPublished(true))
                .and(sortByEndingTime(true))
                .and(hasNotEnded());
    }

    private Specification<Auction> hasTrashed(Boolean trashed) {
        return (root, query, criteriaBuilder) -> {
            if (trashed == null) return criteriaBuilder.conjunction();
            return criteriaBuilder.equal(root.get("trashed"), trashed);
        };
    }

    private Specification<Auction> hasSeller(Long userId) {
        return (root, query, criteriaBuilder) -> {
            if (userId == null) return criteriaBuilder.conjunction();
            return criteriaBuilder.equal(root.get("seller").get("id"), userId);
        };
    }

    private Specification<Auction> hasCategory(Integer categoryId) {
        return (root, query, criteriaBuilder) -> {
            if (categoryId == null) return criteriaBuilder.conjunction();
            return criteriaBuilder.equal(root.get("category").get("id"), categoryId);
        };
    }

    private Specification<Auction> hasType(AuctionType type) {
        return (root, query, criteriaBuilder) -> {
            if (type == null) return criteriaBuilder.conjunction();
            return criteriaBuilder.equal(root.get("type"), type);
        };
    }

    private Specification<Auction> hasStatus(AuctionStatus status) {
        return (root, query, criteriaBuilder) -> {
            if (status == null) return criteriaBuilder.conjunction();
            return criteriaBuilder.equal(root.get("status"), status);
        };
    }

    private Specification<Auction> hasStartingPriceBetween(BigDecimal startingPriceFrom, BigDecimal startingPriceTo) {
        return (root, query, criteriaBuilder) -> {
            if (startingPriceFrom == null && startingPriceTo == null) return criteriaBuilder.conjunction();
            if (startingPriceFrom != null && startingPriceTo != null) {
                return criteriaBuilder.between(root.get("startingPrice"), startingPriceFrom, startingPriceTo);
            }
            if (startingPriceFrom != null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("startingPrice"), startingPriceFrom);
            }
            return criteriaBuilder.lessThanOrEqualTo(root.get("startingPrice"), startingPriceTo);
        };
    }

    private Specification<Auction> hasAuctionTime(AuctionTime auctionTime) {
        return (root, query, criteriaBuilder) -> {
            if (auctionTime == null) return criteriaBuilder.conjunction();

            ZonedDateTime now = ZonedDateTime.now();
            return switch (auctionTime) {
                case UPCOMING -> criteriaBuilder.greaterThan(root.get("startingTime"), now);
                case LIVE -> criteriaBuilder.and(
                        criteriaBuilder.lessThanOrEqualTo(root.get("startingTime"), now),
                        criteriaBuilder.greaterThanOrEqualTo(root.get("endingTime"), now)
                );
                case END -> criteriaBuilder.lessThan(root.get("endingTime"), now);
                default -> criteriaBuilder.conjunction();
            };
        };
    }

    private Specification<Auction> getSortSpec(String sort) {
        if (sort == null) return null;

        boolean asc = !sort.startsWith("-");
        String sortField = asc ? sort : sort.substring(1);
        return switch (sortField) {
            case NAME_SORT_FIELD:
                yield sortByName(asc);
            case DATE_SORT_FIELD:
                yield sortByCreatedDate(asc);
            case PRICE_SORT_FIELD:
                yield sortByPrice(asc);
            default:
                throw new IllegalStateException("Unexpected value: " + sortField);
        };
    }

    private Specification<Auction> sortByPrice(boolean asc) {
        return (root, query, criteriaBuilder) -> {
            assert query != null;
            Order order = criteriaBuilder.desc(root.get("startingPrice"));
            if (asc){
                order = criteriaBuilder.asc(root.get("startingPrice"));
            }
            query.orderBy(order);
            return criteriaBuilder.conjunction();
        };
    }

    private Specification<Auction> sortByEndingTime(boolean asc) {
        return (root, query, criteriaBuilder) -> {
            assert query != null;
            Order order = criteriaBuilder.desc(root.get("endingTime"));
            if (asc){
                order = criteriaBuilder.asc(root.get("endingTime"));
            }
            query.orderBy(order);
            return criteriaBuilder.conjunction();
        };
    }

    private Specification<Auction> hasNotEnded() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.greaterThan(root.get("endingTime"), ZonedDateTime.now());
    }

}
