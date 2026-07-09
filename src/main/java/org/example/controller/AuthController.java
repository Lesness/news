package org.example.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.dto.AuthRequest;
import org.example.dto.AuthResponse;
import org.example.dto.RegisterRequest;
import org.example.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // In-Memory хранилище для демонстрации защиты от Brute-force (простой Rate Limiter)
    private final Map<String, Long> bruteForceCache = new ConcurrentHashMap<>();
    private static final int MAX_ATTEMPTS = 5;
    private static final long LOCK_TIME_MS = 60000; // 1 минута блокировки

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Пользователь успешно зарегистрирован"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request, HttpServletRequest httpRequest) {
        String ip = httpRequest.getRemoteAddr();
        long now = System.currentTimeMillis();

        // Проверяем, не заблокирован ли IP-адрес клиента (Защита кибербеза от Hydra / Burp Suite)
        if (bruteForceCache.containsKey(ip) && bruteForceCache.get(ip) > now) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of("error", "Слишком много попыток входа. Доступ заблокирован на 1 минуту."));
        }

        try {
            AuthResponse response = authService.login(request);
            bruteForceCache.remove(ip); // Сбрасываем счетчик при успешном входе
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Если пароль неверный, увеличиваем штрафное время для этого IP
            bruteForceCache.put(ip, System.currentTimeMillis() + LOCK_TIME_MS);
            throw e; // Прокидываем исключение дальше в ExceptionHandler
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestParam String refreshToken) {
        AuthResponse response = authService.refresh(refreshToken);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(@RequestParam String refreshToken) {
        authService.logout(refreshToken);
        return ResponseEntity.ok(Map.of("message", "Вы успешно вышли из системы. Токен инвалидирован."));
    }
}