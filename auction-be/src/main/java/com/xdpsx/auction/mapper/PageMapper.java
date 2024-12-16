package com.xdpsx.auction.mapper;

import com.xdpsx.auction.dto.PageResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

public class PageMapper {
    public static <T, R> PageResponse<R> toPageResponse(Page<T> page, Function<T, R> mapper) {
        List<R> responses = page.getContent().stream()
                .map(mapper)
                .collect(Collectors.toList());
        return PageResponse.<R>builder()
                .items(responses)
                .pageNum(page.getNumber() + 1)
                .pageSize(page.getSize())
                .totalItems(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }
}
