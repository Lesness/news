package org.example.dto;

import java.time.LocalDate;

public class NewsResponse {
    private Long id;
    private String title;
    private String content;
    private LocalDate publishDate;
    private String author;

    // Конструктор
    public NewsResponse(Long id, String title, String content, LocalDate publishDate, String author) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.publishDate = publishDate;
        this.author = author;
    }

    // Геттеры и Сеттеры
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDate getPublishDate() { return publishDate; }
    public void setPublishDate(LocalDate publishDate) { this.publishDate = publishDate; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
}