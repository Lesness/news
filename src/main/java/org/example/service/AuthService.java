package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.dto.AuthRequest;
import org.example.dto.AuthResponse;
import org.example.dto.RegisterRequest;
import org.example.entity.RefreshToken;
import org.example.entity.Role;
import org.example.entity.User;
import org.example.repository.RefreshTokenRepository;
import org.example.repository.UserRepository;
import org.example.security.JwtTokenProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Collections;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Пользователь с таким email уже существует");
        }

        Role role;
        try {
            role = Role.valueOf(request.getRole().toUpperCase());
        } catch (Exception e) {
            throw new IllegalArgumentException("Неверно указана роль. Допустимы: STUDENT, ADMIN");
        }

        User user = User.builder()
                .email(request.getEmail())
                // Хешируем пароль строго через BCrypt
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Collections.singleton(role))
                .build();

        userRepository.save(user);
    }

    @Transactional
    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Неверный email или пароль"));

        // Сверяем введенный plain-text пароль с хэшем из БД
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Неверный email или пароль");
        }

        String accessToken = tokenProvider.generateAccessToken(user);
        String refreshToken = tokenProvider.generateRefreshToken(user);

        // По ТЗ мы обязаны сохранять хэш рефреш-токена в PostgreSQL
        RefreshToken rtEntity = RefreshToken.builder()
                .user(user)
                .tokenHash(refreshToken) // В учебных целях пишем сам токен, для продакшена обычно берут SHA-256
                .expiresAt(Instant.now().plusSeconds(7L * 24 * 60 * 60)) // 7 дней
                .revoked(false)
                .build();

        refreshTokenRepository.save(rtEntity);

        return new AuthResponse(accessToken, refreshToken);
    }

    @Transactional
    public AuthResponse refresh(String token) {
        // Проверяем подпись и срок действия токена силами библиотеки jjwt
        if (!tokenProvider.validateToken(token)) {
            throw new BadCredentialsException("Невалидный или истекший Refresh токен");
        }

        RefreshToken refreshTokenEntity = refreshTokenRepository.findByTokenHash(token)
                .orElseThrow(() -> new BadCredentialsException("Refresh токен не найден в базе"));

        // Защита от использования отозванного токена (требование кибербезопасников)
        if (refreshTokenEntity.isRevoked() || refreshTokenEntity.getExpiresAt().isBefore(Instant.now())) {
            throw new BadCredentialsException("Refresh токен отозван или его срок истек");
        }

        User user = refreshTokenEntity.getUser();
        String newAccessToken = tokenProvider.generateAccessToken(user);

        // Старый рефреш по ТЗ остается активным до logout, отдаем новый access
        return new AuthResponse(newAccessToken, token);
    }

    @Transactional
    public void logout(String token) {
        RefreshToken refreshTokenEntity = refreshTokenRepository.findByTokenHash(token)
                .orElseThrow(() -> new NoSuchElementException("Токен не найден"));

        // Инвалидируем токен в БД: ставим статус revoked = true
        refreshTokenEntity.setRevoked(true);
        refreshTokenRepository.save(refreshTokenEntity);
    }
}