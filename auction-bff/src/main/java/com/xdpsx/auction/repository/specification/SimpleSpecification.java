package com.xdpsx.auction.repository.specification;

import jakarta.persistence.criteria.Order;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import static com.xdpsx.auction.constant.PageConstant.*;

@Component
public class SimpleSpecification<T> {

    public Specification<T> getSimpleSpec(String name, String sort, Boolean hasPublished) {
        return Specification.where(hasName(name))
                .and(hasPublished(hasPublished))
                .and(getSortSpec(sort));
    }

    public Specification<T> getSortSpec(String sort) {
        if (sort == null) return null;

        boolean asc = !sort.startsWith("-");
        String sortField = asc ? sort : sort.substring(1);
        return switch (sortField) {
            case NAME_SORT_FIELD:
                yield sortByName(asc);
            case DATE_SORT_FIELD:
                yield sortByDateWithUpdate(asc);
            default:
                throw new IllegalStateException("Unexpected value: " + sortField);
        };
    }

    public Specification<T> hasName(String name) {
        return (root, query, builder) -> {
            if (name == null || name.isEmpty()) {
                return builder.conjunction();
            }
            return builder.like(builder.lower(root.get("name")), "%" + name.toLowerCase() + "%");
        };
    }

    public Specification<T> hasPublished(Boolean hasPublished) {
        return (root, query, criteriaBuilder) -> {
            if (hasPublished == null) return criteriaBuilder.conjunction();
            return criteriaBuilder.equal(root.get("isPublished"), hasPublished);
        };
    }

    public Specification<T> sortByDateWithUpdate(boolean asc) {
        return (root, query, criteriaBuilder) -> {
            assert query != null;
            Order order = criteriaBuilder.desc(criteriaBuilder.coalesce(root.get("updatedAt"), root.get("createdAt")));
            if (asc){
                order = criteriaBuilder.asc(criteriaBuilder.coalesce(root.get("updatedAt"), root.get("createdAt")));
            }
            query.orderBy(order);
            return criteriaBuilder.conjunction();
        };
    }

    public Specification<T> sortByName(boolean asc) {
        return (root, query, criteriaBuilder) -> {
            assert query != null;
            Order order = criteriaBuilder.desc(root.get("name"));
            if (asc){
                order = criteriaBuilder.asc(root.get("name"));
            }
            query.orderBy(order);
            return criteriaBuilder.conjunction();
        };
    }
}
