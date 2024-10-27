package com.xdpsx.auction.controller;

import com.xdpsx.auction.dto.PageResponse;
import com.xdpsx.auction.dto.category.CategoryDetailsDto;
import com.xdpsx.auction.dto.category.CategoryRequest;
import com.xdpsx.auction.dto.category.CategoryResponse;
import com.xdpsx.auction.dto.error.ErrorDetailsDto;
import com.xdpsx.auction.dto.error.ErrorDto;
import com.xdpsx.auction.model.Media;
import com.xdpsx.auction.service.CategoryService;
import com.xdpsx.auction.service.MediaService;
import com.xdpsx.auction.validation.FileTypeConstraint;
import com.xdpsx.auction.validation.ImgSizeConstraint;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static com.xdpsx.auction.constant.FileConstants.*;
import static com.xdpsx.auction.constant.PageConstant.*;
import static org.springframework.http.MediaType.*;

@RestController
@RequiredArgsConstructor
@Validated
public class CategoryController {
    private final CategoryService categoryService;
    private final MediaService mediaService;

    @GetMapping("/public/categories")
    ResponseEntity<List<CategoryResponse>> listPublishedCategories(){
        List<CategoryResponse> response = categoryService.listPublishedCategories();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/backoffice/categories/{id}")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "OK",
                    content = @Content(schema = @Schema(implementation = CategoryDetailsDto.class))),
            @ApiResponse(responseCode = "404", description = "Not Found",
                    content = @Content(schema = @Schema(implementation = ErrorDto.class)))
    })
    ResponseEntity<CategoryDetailsDto> getCategoryById(@PathVariable Integer id){
        CategoryDetailsDto response = categoryService.getCategoryById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/backoffice/categories/paging")
    ResponseEntity<PageResponse<CategoryDetailsDto>> getPageCategories(
            @RequestParam(defaultValue = PAGE_NUM, required = false) int pageNum,
            @RequestParam(defaultValue = PAGE_SIZE, required = false) @Max(MAX_PAGE_SIZE) int pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) Boolean hasPublished
    ){
        PageResponse<CategoryDetailsDto> response = categoryService.getPageCategories(pageNum, pageSize, keyword, sort, hasPublished);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/backoffice/categories")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Created",
                    content = @Content(schema = @Schema(implementation = CategoryDetailsDto.class))),
            @ApiResponse(responseCode = "404, 409", description = "Not Found, Duplicated",
                    content = @Content(schema = @Schema(implementation = ErrorDto.class))),
            @ApiResponse(responseCode = "400", description = "Bad Request",
                    content = @Content(schema = @Schema(implementation = ErrorDetailsDto.class)))
    })
    ResponseEntity<CategoryDetailsDto> createCategory(@Valid @RequestBody CategoryRequest request){
        CategoryDetailsDto response = categoryService.createCategory(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/backoffice/categories/{id}")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "OK",
                    content = @Content(schema = @Schema(implementation = CategoryDetailsDto.class))),
            @ApiResponse(responseCode = "404, 409", description = "Not Found, Duplicated",
                    content = @Content(schema = @Schema(implementation = ErrorDto.class))),
            @ApiResponse(responseCode = "400", description = "Bad Request",
                    content = @Content(schema = @Schema(implementation = ErrorDetailsDto.class)))
    })
    ResponseEntity<CategoryDetailsDto> updateCategory(@PathVariable Integer id,
                                                    @Valid @RequestBody CategoryRequest request){
        CategoryDetailsDto response = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/backoffice/categories/{id}")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "No Content"),
            @ApiResponse(responseCode = "404, 409", description = "Not Found, In Use",
                    content = @Content(schema = @Schema(implementation = ErrorDto.class)))
    })
    ResponseEntity<Void> deleteCategory(@PathVariable Integer id){
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/backoffice/categories/upload", consumes = MULTIPART_FORM_DATA_VALUE)
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Created",
                    content = @Content(schema = @Schema(implementation = Media.class))),
            @ApiResponse(responseCode = "400", description = "Bad Request",
                    content = @Content(schema = @Schema(implementation = ErrorDetailsDto.class)))
    })
    ResponseEntity<Media> uploadCategoryImage(
            @RequestParam
            @ImgSizeConstraint(minWidth = CATEGORY_IMAGE_MIN_WIDTH)
            @FileTypeConstraint(allowedTypes = {IMAGE_JPEG_VALUE, IMAGE_PNG_VALUE})
                MultipartFile file){
        Media image = mediaService.saveMedia(file, CATEGORY_IMAGE_FOLDER, CATEGORY_IMAGE_MIN_WIDTH);
        return new ResponseEntity<>(image, HttpStatus.CREATED);
    }
}
