package org.example;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.nio.file.Paths;

@SpringBootApplication
public class NewsApplication {

    public static void main(String[] args) {
        // Находим абсолютный путь к корню проекта, где лежит наш .env
        String projectRoot = Paths.get(".").toAbsolutePath().normalize().toString();

        // Явно передаем путь в конфигурацию dotenv
        Dotenv dotenv = Dotenv.configure()
                .directory(projectRoot)
                .ignoreIfMissing()
                .load();

        dotenv.entries().forEach(entry ->
                System.setProperty(entry.getKey(), entry.getValue())
        );

        // Запуск самого Spring Boot приложения
        SpringApplication.run(NewsApplication.class, args);
    }
}