package com.example.expensetracker.service.impl;

import com.example.expensetracker.exception.FileStorageException;
import com.example.expensetracker.exception.ValidationException;
import com.example.expensetracker.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/webp",
            "application/pdf"
    );

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            ".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf"
    );

    private final Path rootLocation;

    public FileStorageServiceImpl(@Value("${file.upload-dir}") String uploadDir) {
        this.rootLocation = Paths.get(uploadDir);
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new FileStorageException("Could not initialize storage", e);
        }
    }

    @Override
    public String store(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new ValidationException("Failed to store empty file.");
            }

            // Validate content type
            String contentType = file.getContentType();
            if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
                throw new ValidationException(
                        "File type not allowed. Allowed types: JPEG, PNG, GIF, WEBP, PDF. " +
                        "Received: " + (contentType != null ? contentType : "unknown")
                );
            }

            // Validate file extension
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
                if (!ALLOWED_EXTENSIONS.contains(extension)) {
                    throw new ValidationException(
                            "File extension not allowed. Allowed extensions: .jpg, .jpeg, .png, .gif, .webp, .pdf. " +
                            "Received: " + extension
                    );
                }
            } else {
                throw new ValidationException("File must have a valid extension.");
            }

            String uniqueFilename = UUID.randomUUID() + extension;

            Path destinationFile = this.rootLocation.resolve(uniqueFilename).normalize().toAbsolutePath();

            if (!destinationFile.getParent().equals(this.rootLocation.toAbsolutePath())) {
                throw new ValidationException("Cannot store file outside current directory.");
            }

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }

            return uniqueFilename;

        } catch (IOException e) {
            throw new FileStorageException("Failed to store file.", e);
        }
    }

    @Override
    public void delete(String filename) {
        try {
            if (filename == null || filename.isEmpty()) {
                return;
            }

            Path fileToDelete = this.rootLocation.resolve(filename).normalize().toAbsolutePath();

            if (!fileToDelete.getParent().equals(this.rootLocation.toAbsolutePath())) {
                throw new ValidationException("Cannot delete file outside current directory.");
            }

            Files.deleteIfExists(fileToDelete);

        } catch (IOException e) {
            throw new FileStorageException("Failed to delete file: " + filename, e);
        }
    }

    @Override
    public Path load(String filename) {
        return rootLocation.resolve(filename).normalize().toAbsolutePath();
    }

    @Override
    public Resource loadAsResource(String filename) {
        try {
            Path file = load(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new FileStorageException("Could not read file: " + filename);
            }
        } catch (java.net.MalformedURLException e) {
            throw new FileStorageException("Could not read file (Malformed URL): " + filename, e);
        }
    }
}

