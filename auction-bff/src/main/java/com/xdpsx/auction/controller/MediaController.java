package com.xdpsx.auction.controller;

import com.xdpsx.auction.dto.media.MediaDto;
import com.xdpsx.auction.model.Media;
import com.xdpsx.auction.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/medias")
@RequiredArgsConstructor
public class MediaController {
    private final MediaService mediaService;

    @GetMapping("/{id}/file/{fileName}")
    public ResponseEntity<InputStreamResource> getMedia(@PathVariable Long id, @PathVariable String fileName){
        MediaDto mediaDto = mediaService.getFile(id, fileName);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentType(mediaDto.getMediaType())
                .body(new InputStreamResource(mediaDto.getContent()));
    }

//    @PostMapping
//    public ResponseEntity<?> uploadFile(@RequestParam MultipartFile file){
//        Media media = mediaService.saveMedia(file, null);
//        return ResponseEntity.ok(media);
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<?> deleteFile(@PathVariable Long id){
//        mediaService.deleteMedia(id);
//        return ResponseEntity.noContent().build();
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<?> getMediaUrlById(@PathVariable Long id){
//        return ResponseEntity.ok(mediaService.getMediaUrl(id));
//    }
}
