package com.xdpsx.auction.service.impl;

import com.xdpsx.auction.constant.ErrorCode;
import com.xdpsx.auction.dto.media.MediaDto;
import com.xdpsx.auction.exception.NotFoundException;
import com.xdpsx.auction.model.Media;
import com.xdpsx.auction.repository.FileSystemRepository;
import com.xdpsx.auction.repository.MediaRepository;
import com.xdpsx.auction.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.InputStream;

@Service
@RequiredArgsConstructor
public class MediaServiceImpl implements MediaService {
    private final FileSystemRepository fileSystemRepository;
    private final MediaRepository mediaRepository;

    @Override
    public Media saveMedia(MultipartFile file, String uploadDir, Integer width) {
        Media media = new Media();
        media.setFileName(file.getOriginalFilename());
        media.setMediaType(file.getContentType());

        String filePath = fileSystemRepository.storeFile(file, uploadDir, width);
        media.setFilePath(filePath);

        return mediaRepository.save(media);
    }

    @Transactional
    @Override
    public void deleteMedia(Long id) {
        Media media = getMedia(id);
        mediaRepository.deleteById(id);
        fileSystemRepository.deleteFile(media.getFilePath());
    }

    @Override
    public String getMediaUrl(Long id) {
        Media media = mediaRepository.findById(id).orElse(null);
        if (media == null){
            return null;
        }
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path(String.format("/medias/%1$s/file/%2$s", media.getId(), media.getFileName()))
                .build().toUriString();
    }

    @Override
    public MediaDto getFile(Long id, String fileName) {
        Media media = mediaRepository.findById(id).orElse(null);
        if (media == null || !fileName.equalsIgnoreCase(media.getFileName())) {
            throw new NotFoundException(ErrorCode.MEDIA_NOT_FOUND, id);
        }
        MediaType mediaType = MediaType.valueOf(media.getMediaType());
        InputStream fileContent = fileSystemRepository.getFile(media.getFilePath());

        return MediaDto.builder()
                .content(fileContent)
                .mediaType(mediaType)
                .build();
    }

    @Override
    public Media getMedia(Long id) {
        return mediaRepository.findById(id).orElseThrow(() -> new NotFoundException(ErrorCode.MEDIA_NOT_FOUND, id));
    }
}
