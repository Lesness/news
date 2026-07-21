1) Истёкший токен
Шаги: Подождать 15 мин (или изменить exp в payload) и отправить запрос со старым токеном.

Ожидается: Ожидается 401. Если 200 — бэкенд не проверяет exp.

Инструмент: Insomnia с ручным токеном
<img width="1194" height="679" alt="Снимок экрана 2026-07-21 144817" src="https://github.com/user-attachments/assets/5e285afa-efc5-401f-8f56-0a94c67c1b41" />
Угроза не найдена

2) Запрос без токена

Шаги: GET /api/news/create, POST /api/news, DELETE /api/news/{id} — без заголовка Authorization.

Ожидается: Ожидается 401. Если пришёл 200 — авторизация не настроена.

Инструмент: Insomnia без токена
<img width="1194" height="681" alt="Снимок экрана 2026-07-21 144952" src="https://github.com/user-attachments/assets/b5a766fb-89b2-4b62-bac3-138e832815cf" />
Угроза не найдена

3) Подделка JWT payload

Шаги: Декодировать токен (base64), изменить поле role с STUDENT на ADMIN, пересобрать и
отправить.

Ожидается: Ожидается 401/403 — невалидная подпись. Если 200 — бэкенд не верифицирует
подпись.

Инструмент: jwt.io, Insomnia
<img width="1527" height="702" alt="Снимок экрана 2026-07-21 145501" src="https://github.com/user-attachments/assets/43c71cf0-be1b-437d-9f8f-4c8dde600dde" />
<img width="1194" height="684" alt="Снимок экрана 2026-07-21 145452" src="https://github.com/user-attachments/assets/af08f214-626c-46b0-ac14-ab5269ba79a2" />
Угроза не найдена

4) Refresh после logout

Шаги: POST /auth/logout, затем POST /auth/refresh с тем же cookie.

Ожидается: Ожидается 401 — токен должен быть инвалидирован в БД.

Инструмент: Insomnia
<img width="1189" height="683" alt="Снимок экрана 2026-07-21 145701" src="https://github.com/user-attachments/assets/0c13e84f-5e19-4310-8b80-31feefa5467f" />
<img width="1193" height="686" alt="Снимок экрана 2026-07-21 145715" src="https://github.com/user-attachments/assets/8d151f83-3cc3-4d59-87b9-73486322ce52" />
Угроза не найдена

5) Повышение роли (IDOR)

Шаги: STUDENT пытается вызвать POST /api/news или DELETE /api/news/{id} со своим токеном.

Ожидается: Ожидается 403 Forbidden — @PreAuthorize блокирует.

Инструмент: Insomnia с токеном STUDENT
<img width="1195" height="678" alt="image" src="https://github.com/user-attachments/assets/733b43f5-dad7-44cb-a4f3-fd5166ca2f7b" />
Угроза не найдена

6) Brute-force пароля

Шаги: Отправить 50+ запросов POST /auth/login с разными паролями за короткое время.

Ожидается: Ожидается: rate-limiting (429) или блокировка. Если нет — отметить как
рекомендацию.

Инструмент: Insomnia
<img width="1194" height="683" alt="image" src="https://github.com/user-attachments/assets/62ea1e54-619a-4c3d-852b-ada6c1cbc97b" />
Угроза не найдена






