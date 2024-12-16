package com.xdpsx.auction.dto.media;

import lombok.Builder;
import lombok.Getter;
import org.springframework.http.MediaType;

import java.io.InputStream;

@Getter
@Builder
public class MediaDto {
    private InputStream content;
    private MediaType mediaType;
}
