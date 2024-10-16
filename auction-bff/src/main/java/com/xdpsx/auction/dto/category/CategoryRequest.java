package com.xdpsx.auction.dto.category;

import com.xdpsx.auction.validation.FileTypeConstraint;
import com.xdpsx.auction.validation.ImgSizeConstraint;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import static com.xdpsx.auction.constant.FileConstants.CATEGORY_IMAGE_MIN_WIDTH;
import static org.springframework.http.MediaType.*;

@Setter
@Getter
public class CategoryRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String slug;

    private boolean isPublished;

    @ImgSizeConstraint(minWidth = CATEGORY_IMAGE_MIN_WIDTH)
    @FileTypeConstraint(allowedTypes = {IMAGE_JPEG_VALUE, IMAGE_PNG_VALUE})
    private MultipartFile file;

    public void setSlug(String slug) {
        this.slug = slug.trim().replace(" ", "-");
    }

}
