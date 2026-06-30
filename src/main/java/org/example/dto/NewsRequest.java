package org.example.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class NewsRequest {

    @NotBlank(message = "Заголовок не может быть пустым")
    @Size(min = 3, max = 100, message = "Заголовок должен быть от 3 до 100 символов")
    private String title;

    @NotBlank(message = "Текст новости не может быть пустым")
    private String content;

    @NotNull(message = "Дата публикации обязательна")
    @PastOrPresent(message = "Дата публикации не может быть в будущем")
    private LocalDate publishDate;

    @NotBlank(message = "Автор обязателен")
    private String author;

    // Геттеры и Сеттеры
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDate getPublishDate() { return publishDate; }
    public void setPublishDate(LocalDate publishDate) { this.publishDate = publishDate; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
}