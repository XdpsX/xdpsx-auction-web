package com.xdpsx.auction.service;

import com.xdpsx.auction.dto.media.MediaDto;
import com.xdpsx.auction.model.Media;
import org.springframework.web.multipart.MultipartFile;

public interface MediaService {
    Media saveMedia(MultipartFile file, String uploadDir, Integer width);
    void deleteMedia(Long id);
    String getMediaUrl(Long id);
    MediaDto getFile(Long id, String fileName);
    Media getMedia(Long id);
}
