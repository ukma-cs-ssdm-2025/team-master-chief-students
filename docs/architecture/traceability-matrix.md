| Requirement ID | Type |                       Description                           |                        Components                    |
|----------------|------|-------------------------------------------------------------|------------------------------------------------------|
| FR-001         | FR   | Авторизація користувачів за логіном і паролем               | Frontend, Backend (Auth Service), Database, Security |
| FR-002         | FR   | Додавання нової витрати                                     | Frontend, Backend (Expense Service), Database        |
| FR-003         | FR   | Перегляд списку витрат                                      | Frontend, Backend, Database                          |
| FR-004         | FR   | Пошук витрат за ключовим словом                             | Frontend, Backend, Database                          |
| FR-005         | FR   | Перегляд статистики витрат у вигляді діаграм                | Frontend, Backend (Analytics Service), Cache (Redis) |
| FR-006         | FR   | Пошук витрат за сумою                                       | Frontend, Backend, Database                          |
| FR-007         | FR   | Експорт витрат у формат CSV                                 | Frontend, Backend, Database                          |
| FR-008         | FR   | Експорт витрат у формат PDF                                 | Frontend, Backend, Database                          |
| FR-009         | FR   | Управління користувачами: додавання, блокування, видалення  | Frontend, Backend (User Service), Database, Security |
| FR-010         | FR   | Відображення повідомлення при відсутності результатів пошуку| Frontend                                             |
| FR-011         | FR   | Оновлення діаграми при зміні періоду фільтрації             | Frontend, Backend (Analytics Service), Cache         |
| PERF-001       | NFR  | p95 latency ≤ 300 ms при навантаженні 500 rps               | Backend, Cache, Deployment/Infra                     |
| PERF-002       | NFR  | Час генерації експорту ≤ 2 сек для списку до 10 000 витрат  | Backend, Database                                    |
| REL-001        | NFR  | Uptime ≥ 99.5%                                              | Deployment/Infra (Docker, Nginx, CI/CD)              |
| REL-002        | NFR  | Відновлення після збою ≤ 5 хв                               | Deployment/Infra, Database (Backups), Cache          |
| SEC-001        | NFR  | Паролі зберігаються у хешованому вигляді                    | Backend (Auth Service), Database                     |
| SEC-002        | NFR  | Використання HTTPS для всіх запитів                         | Deployment/Infra (Nginx, TLS)                        |
| SEC-003        | NFR  | Сесії з автозавершенням після 15 хв. неактивності           | Backend, Cache (Redis sessions)                      |
| USAB-001       | NFR  | Інтерфейс адаптивний                                        | Frontend                                             |
| USAB-002       | NFR  | Локалізація українською та англійською                      | Frontend                                             |
| COMP-001       | NFR  | Підтримка сучасних браузерів                                | Frontend                                             |
| MAINT-001      | NFR  | Код покритий тестами ≥ 70%                                  | Backend, Frontend                                    |
| MAINT-002      | NFR  | Використання CI/CD для автоматичного деплою                 | Deployment/Infra                                     |
| DATA-001       | NFR  | Дані експорту у форматі UTF-8                               | Backend (Export Module)                              |
| DATA-002       | NFR  | Усі операції з даними логуються                             | Backend, Database                                    |
