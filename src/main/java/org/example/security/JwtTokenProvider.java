package org.example.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.example.entity.User;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {

    // Секрет берется из окружения (.env)
    // Секрет берется строго из окружения. Если его там нет — приложение выдаст ошибку.
    // Метод .trim() гарантирует очистку от случайных пробелов и переносов строк из .env файла
    // Читаем из System.getProperty, куда Dotenv бережно сложил данные из файла .env
    private final String jwtSecret = System.getProperty("JWT_SECRET") != null ?
            System.getProperty("JWT_SECRET").trim() : null;

    {
        if (jwtSecret == null || jwtSecret.isEmpty()) {
            throw new IllegalStateException("КРИТИЧЕСКАЯ ОШИБКА: Секрет JWT_SECRET не найден в конфигурации!");
        }
    }

    // Добавим проверку прямо в конструктор или блок инициализации
    {
        if (jwtSecret == null || jwtSecret.trim().isEmpty()) {
            throw new IllegalStateException("КРИТИЧЕСКАЯ ОШИБКА: Переменная окружения JWT_SECRET не задана в файле .env!");
        }
    }

    private final long accessTokenValidityInMs = 15 * 60 * 1000; // 15 минут
    private final long refreshTokenValidityInMs = 7L * 24 * 60 * 60 * 1000; // 7 дней

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(User user) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + accessTokenValidityInMs);

        String roles = user.getRoles().stream()
                .map(enumRole -> "ROLE_" + enumRole.name())
                .collect(Collectors.joining(","));

        return Jwts.builder()
                .subject(user.getEmail())
                .claim("roles", roles)
                .issuedAt(now)
                .expiration(validity)
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
    }

    public String generateRefreshToken(User user) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + refreshTokenValidityInMs);

        return Jwts.builder()
                .subject(user.getEmail())
                .issuedAt(now)
                .expiration(validity)
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getEmailFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }
}