package org.example.service;

import org.example.dto.NewsRequest;
import org.example.dto.NewsResponse;
import org.example.entity.News;
import org.example.repository.NewsRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class NewsService {

    private final NewsRepository newsRepository;

    public NewsService(NewsRepository newsRepository) {
        this.newsRepository = newsRepository;
    }

    public NewsResponse create(NewsRequest request) {
        News news = new News();
        news.setTitle(request.getTitle());
        news.setContent(request.getContent());
        news.setPublishDate(request.getPublishDate());
        news.setAuthor(request.getAuthor());

        News savedNews = newsRepository.save(news);
        return mapToResponse(savedNews);
    }

    public List<NewsResponse> findAll() {
        return newsRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public NewsResponse findById(Long id) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Новость с ID " + id + " не найдена"));
        return mapToResponse(news);
    }

    public NewsResponse update(Long id, NewsRequest request) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Новость с ID " + id + " не найдена"));

        news.setTitle(request.getTitle());
        news.setContent(request.getContent());
        news.setPublishDate(request.getPublishDate());
        news.setAuthor(request.getAuthor());

        News updatedNews = newsRepository.save(news);
        return mapToResponse(updatedNews);
    }

    public void delete(Long id) {
        if (!newsRepository.existsById(id)) {
            throw new NoSuchElementException("Новость с ID " + id + " не найдена");
        }
        newsRepository.deleteById(id);
    }

    // Вспомогательный метод маппинга Entity -> DTO
    private NewsResponse mapToResponse(News news) {
        return new NewsResponse(
                news.getId(),
                news.getTitle(),
                news.getContent(),
                news.getPublishDate(),
                news.getAuthor()
        );
    }
}