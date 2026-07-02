Дополнительная проверка на права:
Мы логинимся с правами студента и пробуем затронуть и использовать команды для администраторов, и вот результат:
<img width="1185" height="682" alt="image" src="https://github.com/user-attachments/assets/a7d35170-c8e0-4f0f-905b-3cfac5b7757f" />

<img width="1187" height="642" alt="Снимок экрана 2026-07-02 171724" src="https://github.com/user-attachments/assets/36c258cb-24f2-49e6-9559-e392ca44d1b1" />

<img width="1186" height="680" alt="Снимок экрана 2026-07-02 171818" src="https://github.com/user-attachments/assets/ea87d20c-b9ff-4779-94bc-43951a1b3245" />

<img width="1191" height="636" alt="Снимок экрана 2026-07-02 170110" src="https://github.com/user-attachments/assets/116df794-2a4d-498b-bb8d-945258b6a9dc" />
Проверена атака alg:none — результат зафиксирован:
Сперва получаем наш валидный токен после авторизации, после мы копируем и заходи на сайт jwt.io, вставляем из буфера обмена наш валидный токен и в encoder-е меняем Token Type на none и копируем готовый токен из Encoded JWT
<img width="1525" height="717" alt="image" src="https://github.com/user-attachments/assets/9186922f-f09f-4341-965e-aac02d1b3cbe" />
После в приложении Insomnia создаем запрос(в моем случае get), и в вкладке auth -> Bearer Token -> Token -> Вставляем токен и жмем кнопку Send. Вуаля, и наша проверка успешно пройдена, и защита успешно сработала
<img width="1190" height="682" alt="image" src="https://github.com/user-attachments/assets/e9f59931-5bd3-45aa-8199-48a4e04ce8ce" />

