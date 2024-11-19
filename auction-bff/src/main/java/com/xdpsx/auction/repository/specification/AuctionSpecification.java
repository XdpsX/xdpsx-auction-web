package com.xdpsx.auction.repository.specification;

import com.xdpsx.auction.model.Auction;
import jakarta.persistence.criteria.Order;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;

import static com.xdpsx.auction.constant.PageConstant.*;

@Component
public class AuctionSpecification extends AbstractSpecification<Auction> {

    public Specification<Auction> getAllAuctionsSpec(String name, String sort, Boolean published) {
        return Specification.where(hasName(name))
                .and(hasTrashed(false))
                .and(hasPublished(published))
                .and(getSortSpec(sort));
    }

    public Specification<Auction> getUserAuctionsSpec(String name, String sort, Boolean published, Long userId) {
        return Specification.where(hasName(name))
                .and(hasSeller(userId))
                .and(hasTrashed(false))
                .and(hasPublished(published))
                .and(getSortSpec(sort));
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
