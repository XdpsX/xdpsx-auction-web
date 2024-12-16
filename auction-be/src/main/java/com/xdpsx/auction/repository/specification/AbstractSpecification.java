package com.xdpsx.auction.repository.specification;

import jakarta.persistence.criteria.Order;
import org.springframework.data.jpa.domain.Specification;

public abstract class AbstractSpecification<T> {

    public Specification<T> hasName(String name) {
        return (root, query, builder) -> {
            if (name == null || name.isEmpty()) {
                return builder.conjunction();
            }
            return builder.like(builder.lower(root.get("name")), "%" + name.toLowerCase() + "%");
        };
    }

    public Specification<T> hasPublished(Boolean published) {
        return (root, query, criteriaBuilder) -> {
            if (published == null) return criteriaBuilder.conjunction();
            return criteriaBuilder.equal(root.get("published"), published);
        };
    }

    public Specification<T> sortByCreatedDate(boolean asc) {
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
