package com.xdpsx.auction.repository.specification;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import static com.xdpsx.auction.constant.PageConstant.*;

@Component
public class SimpleSpecification<T> extends AbstractSpecification<T> {

    public Specification<T> getSimpleSpec(String name, String sort, Boolean published) {
        return Specification.where(hasName(name))
                .and(hasPublished(published))
                .and(getSortSpec(sort));
    }

    private Specification<T> getSortSpec(String sort) {
        if (sort == null) return null;

        boolean asc = !sort.startsWith("-");
        String sortField = asc ? sort : sort.substring(1);
        return switch (sortField) {
            case NAME_SORT_FIELD:
                yield sortByName(asc);
            case DATE_SORT_FIELD:
                yield sortByCreatedDate(asc);
            default:
                throw new IllegalStateException("Unexpected value: " + sortField);
        };
    }

}
