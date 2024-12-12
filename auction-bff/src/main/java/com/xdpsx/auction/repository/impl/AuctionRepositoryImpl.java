package com.xdpsx.auction.repository.impl;

import com.xdpsx.auction.model.Auction;
import com.xdpsx.auction.repository.AuctionRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class AuctionRepositoryImpl implements AuctionRepositoryCustom {

    private final EntityManager entityManager;

    public AuctionRepositoryImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public List<Long> findIdsBySpecification(Specification<Auction> spec) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> query = cb.createQuery(Long.class);
        Root<Auction> root = query.from(Auction.class);

        query.select(root.get("id"));
        if (spec != null) {
            query.where(spec.toPredicate(root, query, cb));
        }

        return entityManager.createQuery(query).getResultList();
    }
}
