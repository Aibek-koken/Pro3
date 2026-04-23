# 🛡️ BioSecurity Risk Dashboard — Гайд по запуску

## Что это за проект?

**BioSecurity Risk Dashboard** — это полнофункциональное веб-приложение для мониторинга рисков пандемий и инфекционных заболеваний в режиме реального времени.

### 🎯 Основные возможности

- **Отслеживание глобальных рисков** — данные по COVID-19 и Mpox для 250 стран
- **Расчет рисков на основе ML** — машинное обучение для предсказания распространения болезней
- **Проверка симптомов** — персональная оценка риска на основе симптомов пользователя
- **Анализ трендов** — графики динамики развития эпидемий по странам
- **Прогнозирование** — предсказания на 7, 14 и 30 дней
- **Актуальные новости** — сбор новостей о здравоохранении из Google News

---

## 📦 Архитектура проекта

Проект состоит из **3 основных компонентов**:

```
┌─────────────────────────────────────────────────────┐
│          🖥️  FRONTEND (React/TypeScript)            │
│              http://localhost:5173                  │
│   - Dashboard с картой рисков                       │
│   - Проверка симптомов (HealthShield)              │
│   - Анализ трендов (PandemicRadar)                 │
└─────────────────────────────────────────────────────┘
                         ↓ API calls
┌─────────────────────────────────────────────────────┐
│         🔧 BACKEND (Spring Boot Java)               │
│              http://localhost:8080                  │
│   - REST API для получения данных                  │
│   - Кеширование новостей                           │
│   - Хранение истории проверок в PostgreSQL         │
└─────────────────────────────────────────────────────┘
                         ↓ proxy
┌─────────────────────────────────────────────────────┐
│      🤖 ML API (FastAPI Python)                     │
│              http://localhost:8000                  │
│   - Модели машинного обучения                      │
│   - Расчет риск-оценок                             │
│   - Анализ трендов и прогнозирование              │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│     📊 Данные (CSV + Database)                     │
│   - 250 стран × 2 болезни × 700K+ строк          │
│   - PostgreSQL для истории пользователей           │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Быстрый старт (3 команды)

### 1️⃣ Подготовка: скомпилировать Java бэкенд

```bash
cd /Users/kuanyszarylkasyn/Desktop/Projects/soe_project-main
mvn clean package
```

**Ожидаемый результат:**
```
[INFO] BUILD SUCCESS
[INFO] Total time:  7 s
[INFO] Finished at: 2026-04-23T14:40:44+05:00
```

---

### 2️⃣ Запуск ML API (Python/FastAPI) — Терминал 1

```bash
cd /Users/kuanyszarylkasyn/Desktop/Projects/soe_project-main
source venv/bin/activate
./venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
```

**Ожидаемый вывод:**
```
✅ combined_features.csv свежий — пересборка не нужна
Uvicorn running on http://0.0.0.0:8000
```

✅ **ML API готов на порту 8000**

---

### 3️⃣ Запуск Spring Boot бэкенда (Java) — Терминал 2

```bash
cd /Users/kuanyszarylkasyn/Desktop/Projects/soe_project-main
java -jar target/biosecurity-dashboard-0.0.1-SNAPSHOT.jar
```

**Ожидаемый вывод:**
```
2026-04-23T14:44:24 INFO Started BiosecurityApplication in 16.8 seconds
Tomcat started on port 8080 (http)
```

✅ **Backend готов на порту 8080**

---

### 4️⃣ Запуск фронтенда (React/Vite) — Терминал 3

```bash
cd /Users/kuanyszarylkasyn/Desktop/Projects/soe_project-main
npm install  # (один раз)
npm run dev
```

**Ожидаемый вывод:**
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

✅ **Frontend готов на порту 5173**

---

## ✅ Проверка что всё работает

После запуска всех 3 компонентов откройте браузер:

```
http://localhost:5173
```

### Тест API endpoints:

```bash
# 1. Получить список стран
curl http://localhost:8080/api/countries

# 2. Риск по стране
curl -X POST http://localhost:8080/api/risk/country \
  -H "Content-Type: application/json" \
  -d '{"country":"Kazakhstan","date":"2024-01-01"}'

# 3. Тренды
curl "http://localhost:8080/api/trends/Kazakhstan?months=6"

# 4. Новости
curl "http://localhost:8080/api/news/Kazakhstan"
```

---

## 🗂️ Структура проекта

```
soe_project-main/
├── src/main/java/com/biosecurity/      # Java Spring Boot код
│   ├── controller/                      # REST API endpoints
│   ├── service/                         # Бизнес-логика
│   ├── dto/                             # Data Transfer Objects
│   ├── config/                          # Конфигурация (CORS, ML API)
│   └── entity/                          # JPA сущности (БД)
│
├── src/                                 # React/TypeScript фронтенд
│   ├── pages/                           # HealthShield, PandemicRadar
│   ├── components/                      # UI компоненты
│   ├── hooks/                           # Custom React hooks
│   └── api/                             # Запросы к бэкенду
│
├── main.py                              # FastAPI ML API (Python)
├── startup.py                           # Загрузка и обработка данных
│
├── data/                                # Данные
│   ├── raw/                             # Исходные CSV из OWID
│   ├── processed/                       # Обработанные данные
│   └── features/                        # Features для моделей
│
├── models/                              # Сохраненные ML модели
│   ├── risk_classifier.pkl
│   ├── anomaly_detector.pkl
│   ├── forecast_7d.pkl, 14d, 30d
│   └── label_encoders
│
├── pom.xml                              # Maven config (Java)
├── package.json                         # NPM config (React)
├── requirements.txt                     # Python зависимости
└── docker-compose.yml                   # PostgreSQL (опционально)
```

---

## 🛠️ Требования к окружению

| Компонент | Требование | Статус |
|-----------|-----------|---------|
| **Java** | JDK 17+ | ✅ Установлено |
| **Python** | Python 3.9+ | ✅ Установлено (venv) |
| **Node.js** | Node 16+ | ✅ Установлено |
| **Maven** | 3.6+ | ✅ Установлено |
| **PostgreSQL** | 12+ (опционально) | ⚠️ Требуется для продакшена |

---

## 📡 API Endpoints

### Backend (Spring Boot) на `http://localhost:8080`

| Метод | Endpoint | Описание |
|-------|----------|---------|
| `GET` | `/api/countries` | Список всех 250 стран |
| `POST` | `/api/risk/country` | Риск для конкретной страны |
| `POST` | `/api/risk/user` | Риск на основе симптомов пользователя |
| `GET` | `/api/trends/{country}` | Тренды эпидемии по стране |
| `GET` | `/api/news/{country}` | Новости по здравоохранению |

### ML API (FastAPI) на `http://localhost:8000`

| Метод | Endpoint | Описание |
|-------|----------|---------|
| `GET` | `/countries` | Список стран |
| `GET` | `/diseases` | Доступные болезни |
| `POST` | `/risk/country` | Расчет риска для страны |
| `POST` | `/risk/user` | Расчет риска по симптомам |
| `GET` | `/trends/{country}` | Исторические тренды |
| `GET` | `/health` | Статус API |

---

## 🔧 Отладка

### Если ML API не запускается:

```bash
# Проверить что Python 3.9+ установлен
python3 --version

# Пересоздать venv
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Запустить
./venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
```

### Если Java бэкенд не компилируется:

```bash
# Проверить Java версию (нужна 17+)
java -version

# Полная пересборка
mvn clean package -DskipTests
```

### Если фронтенд не подключается к API:

1. Убедитесь что оба сервера запущены (8080 и 8000)
2. Проверьте CORS config в `src/main/java/com/biosecurity/config/CorsConfig.java`
3. Откройте DevTools (F12) и посмотрите Network tab

---

## 📊 Структура данных

### Болезни в системе:
- **COVID-19** — 558,258 записей
- **Mpox (обезьянья оспа)** — 160,599 записей

### Метрики для каждой страны/даты:
- `new_cases` — новые случаи
- `new_deaths` — смерти
- `new_cases_per_100k` — на 100k населения
- `cases_lag_7d`, `14d`, `21d` — отставание (lag features)
- `growth_ratio_7d` — темп роста
- `season_enc` — сезон (закодирован)

### Risk Score содержит:
```json
{
  "country": "Kazakhstan",
  "date": "2024-01-01",
  "risk_score": 22.2,
  "risk_level": "LOW",
  "breakdown": {
    "classification": 4.5,
    "forecast_trend": 7.1,
    "anomaly_signal": 10.6
  },
  "forecast": { "7d": 0, "14d": 0, "30d": 0 }
}
```

---

## 🚢 Production deployment

Для запуска в продакшене:

1. **Настроить PostgreSQL:**
   ```bash
   docker-compose up -d  # или свой PostgreSQL сервер
   ```

2. **Обновить переменные окружения:**
   ```properties
   # src/main/resources/application.properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/biosecurity
   spring.datasource.username=your_user
   spring.datasource.password=your_password
   ml.api.base-url=https://your-app.railway.app  # для Railway/другого хостинга
   ```

3. **Собрать production JAR:**
   ```bash
   mvn clean package -Dspring.profiles.active=prod
   ```

4. **Собрать Docker образ:**
   ```bash
   docker build -t biosecurity-dashboard .
   docker run -p 8080:8080 biosecurity-dashboard
   ```

---

## 📝 Лицензия и статус

- **Статус**: Working prototype ✅
- **Последняя обновка**: 2026-04-23
- **Данные актуальны до**: 2026-02-28

---

## 💡 Что дальше?

- [ ] Добавить авторизацию пользователей
- [ ] Настроить WebSocket для real-time обновлений
- [ ] Добавить больше болезней в мониторинг
- [ ] Улучшить ML модели (добавить LSTM для временных рядов)
- [ ] Развернуть на Railway или другом облачном сервисе
- [ ] Добавить мобильное приложение (React Native)

---

**Готово! Проект полностью настроен и запущен. 🚀**
