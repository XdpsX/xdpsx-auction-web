package com.xdpsx.auction.dto.category;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CategoryRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String slug;

    private boolean published;

    private Long imageId;

    public void setSlug(String slug) {
        this.slug = slug.trim().replace(" ", "-");
    }

}
