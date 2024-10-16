package com.xdpsx.auction.repository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Objects;

@Slf4j
@Repository
public class FileSystemRepository {
    @Value("${file.directory}")
    private String directory;

    public String storeFile(MultipartFile file, String folderName) {
        String uploadDir = directory;
        if (folderName != null && !folderName.isEmpty()) {
            uploadDir = directory + File.separator + folderName;
        }
        File folder = new File(uploadDir);
        checkExistingDirectory(folder);
        checkPermissions(folder);

        Path filePath = buildFilePath(uploadDir, Objects.requireNonNull(file.getOriginalFilename()));
        try {
            Files.write(filePath, file.getBytes());
        } catch (IOException e) {
            throw new RuntimeException("Failed to write file: " + filePath, e);
        }
        return filePath.toString();
    }

    public InputStream getFile(String filePath) {
        Path path = Paths.get(filePath);
        if (!Files.exists(path)) {
            throw new IllegalStateException(String.format(String.format("Directory %s does not exist.", filePath)));
        }

        try {
            return Files.newInputStream(path);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read file: " + filePath, e);
        }
    }

    public void deleteFile(String filePath) {
        Path path = Paths.get(filePath);
        try {
            if (Files.exists(path)) {
                Files.delete(path);
                log.info("File {} deleted successfully.", filePath);
            } else {
                log.warn("File {} does not exist.", filePath);
                throw new IllegalStateException(String.format("File %s does not exist.", filePath));
            }
        } catch (IOException e) {
            log.error("Failed to delete file: {}", filePath, e);
            throw new RuntimeException("Failed to delete file: " + filePath, e);
        }
    }

    private void checkExistingDirectory(File directory) {
        if (!directory.exists()) {
//            throw new IllegalStateException(String.format("Directory %s does not exist.", directory));
            boolean created = directory.mkdirs();
            if (!created) {
                throw new IllegalStateException(String.format("Failed to create directory %s.", directory));
            }
            log.info("Directory {} created successfully.", directory);
        } else {
            log.info("Directory {} already exists.", directory);
        }
    }

    private void checkPermissions(File directory) {
        if (!directory.canRead() || !directory.canWrite()) {
            throw new IllegalStateException(String.format("Directory %s is not accessible.", directory));
        }
    }

    private Path buildFilePath(String uploadDir, String filename) {
        // Validate the filename
        if (filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
            throw new IllegalArgumentException("Invalid filename");
        }
        Path fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        return fileStorageLocation.resolve(filename);
    }
}


