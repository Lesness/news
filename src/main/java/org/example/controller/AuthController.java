package org.example.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.dto.AuthRequest;
import org.example.dto.AuthResponse;
import org.example.dto.RegisterRequest;
import org.example.dto.UserResponse;
import org.example.service.AuthService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    private final Map<String, Long> bruteForceCache = new ConcurrentHashMap<>();
    private static final long LOCK_TIME_MS = 60000;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Пользователь успешно зарегистрирован"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        String ip = httpRequest.getRemoteAddr();
        long now = System.currentTimeMillis();

        if (bruteForceCache.containsKey(ip) && bruteForceCache.get(ip) > now) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of("error", "Слишком много попыток входа. Доступ заблокирован на 1 минуту."));
        }

        try {
            AuthResponse response = authService.login(request);
            bruteForceCache.remove(ip);

            // Устанавливаем refreshToken в httpOnly Cookie
            setRefreshTokenCookie(httpResponse, response.getRefreshToken(), 7 * 24 * 60 * 60);

            // В теле ответа отдаем только accessToken
            return ResponseEntity.ok(Map.of("accessToken", response.getAccessToken()));
        } catch (Exception e) {
            bruteForceCache.put(ip, System.currentTimeMillis() + LOCK_TIME_MS);
            throw e;
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = extractRefreshTokenFromCookie(request);
        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Refresh cookie отсутствует"));
        }

        AuthResponse authResponse = authService.refresh(refreshToken);
        setRefreshTokenCookie(response, authResponse.getRefreshToken(), 7 * 24 * 60 * 60);

        return ResponseEntity.ok(Map.of("accessToken", authResponse.getAccessToken()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = extractRefreshTokenFromCookie(request);
        if (refreshToken != null) {
            authService.logout(refreshToken);
        }
        // Очищаем куку
        setRefreshTokenCookie(response, "", 0);
        return ResponseEntity.ok(Map.of("message", "Вы успешно вышли из системы."));
    }

    // ТЗ: GET /api/users/me — профиль текущего пользователя
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        return ResponseEntity.ok(new UserResponse(userDetails.getUsername(), roles));
    }

    private void setRefreshTokenCookie(HttpServletResponse response, String value, long maxAge) {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", value)
                .httpOnly(true)
                .secure(false) // Поставить true в продакшене (с HTTPS)
                .path("/auth")
                .maxAge(maxAge)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private String extractRefreshTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        return Arrays.stream(request.getCookies())
                .filter(c -> "refreshToken".equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }
}