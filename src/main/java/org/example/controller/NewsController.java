package org.example.controller;

import jakarta.validation.Valid;
import org.example.dto.NewsRequest;
import org.example.dto.NewsResponse;
import org.example.service.NewsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class NewsController {

    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @PostMapping
    public ResponseEntity<NewsResponse> createNews(@Valid @RequestBody NewsRequest request) {
        NewsResponse createdNews = newsService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdNews);
    }

    @GetMapping
    public ResponseEntity<List<NewsResponse>> getAllNews() {
        return ResponseEntity.ok(newsService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsResponse> getNewsById(@PathVariable Long id) {
        return ResponseEntity.ok(newsService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NewsResponse> updateNews(@PathVariable Long id, @Valid @RequestBody NewsRequest request) {
        return ResponseEntity.ok(newsService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNews(@PathVariable Long id) {
        newsService.delete(id);
        return ResponseEntity.noContent().build();
    }
}