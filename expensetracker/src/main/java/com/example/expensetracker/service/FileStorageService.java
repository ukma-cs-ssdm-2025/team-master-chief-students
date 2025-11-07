package com.example.expensetracker.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;

public interface FileStorageService {
    String store(MultipartFile file);
    
    void delete(String filename);
    
    Path load(String filename);
    
    Resource loadAsResource(String filename);
}
