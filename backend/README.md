# Elevate Your English | Campus — Backend

API REST del LMS **Elevate Your English Campus**, una plataforma de aprendizaje de inglés con gestión de cursos, reservas de clases, logros, certificados, sesiones en directo y seguimiento de progreso.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Runtime | Node.js |
| Framework | Express 4 |
| Base de datos | MongoDB + Mongoose 8 |
| Autenticación | JWT (`jsonwebtoken`) |
| Validación | express-validator |
| Rate limiting | express-rate-limit |
| Documentación | Swagger UI Express + OpenAPI 3.0 (YAML) |
| Generación de PDF | PDFKit |
| Generación de QR | qrcode |
| Hashing | bcryptjs |
| Tests | Jest + Supertest + mongodb-memory-server |
| Dev server | nodemon |

---

## Arquitectura

El proyecto sigue una arquitectura modular por dominio con separación estricta en capas. Las dependencias fluyen en una única dirección:

```
Routes → Controller → Service → Repository → Model (Mongoose) → MongoDB
```

- **Routes** — declara endpoints, encadena middlewares (auth, roles, validación) y delega al controller.
- **Controller** — recibe la petición HTTP, delega en el servicio y devuelve la respuesta.
- **Service** — contiene la lógica de negocio y orquesta los repositories.
- **Repository** — encapsula las consultas a MongoDB; todos extienden `base.repository.js`.
- **Model** — esquemas Mongoose con índices y restricciones de campo.

Los middlewares transversales (autenticación JWT, control de roles, rate limit, manejo de errores) viven en `src/middlewares/`.

---

## Instalación

**Requisitos previos:** Node.js ≥ 18 y MongoDB ≥ 6.

```bash
# Instalar dependencias
npm install

# Copiar y editar las variables de entorno
cp .env.example .env

# (Opcional) Poblar la base de datos con datos de prueba
npm run seed
```

---

## Variables de entorno

Copia `.env.example` como `.env` y rellena cada valor:

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `PORT` | Puerto del servidor HTTP | `4000` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `MONGODB_URI` | Cadena de conexión a MongoDB | `mongodb://localhost:27017/elevate_campus` |
| `JWT_SECRET` | Clave secreta para firmar tokens JWT | — |
| `JWT_TTL_ADMIN` | Expiración del token para admins | `8h` |
| `JWT_TTL_TEACHER` | Expiración del token para profesores | `24h` |
| `JWT_TTL_STUDENT` | Expiración del token para estudiantes | `7d` |
| `CLIENT_URL` | URL del frontend permitida por CORS | `http://localhost:3000` |

---

## Scripts

```bash
npm start            # Inicia el servidor en producción
npm run dev          # Inicia el servidor con nodemon (recarga automática)
npm run seed         # Puebla la base de datos con datos iniciales
npm test             # Ejecuta todos los tests (--runInBand)
npm run test:watch   # Ejecuta los tests en modo observación
```

---

## Tests

Los tests utilizan `mongodb-memory-server` para levantar una instancia de MongoDB en memoria; no se requiere una base de datos real.

```bash
npm test
```

Los ficheros de test se encuentran en `tests/` con el patrón `**/*.test.js`. Las variables de entorno necesarias se configuran en `tests/setup/env.js`.

Módulos cubiertos con tests de integración: auth, users, courses, units, lessons, enrollments, progress, bookings, availability, achievements, certificates, recommendations, notifications, live sessions, attendance, assignments, submissions, dashboard y teacher analytics.

---

## Swagger

La documentación interactiva de la API está disponible en:

```
http://localhost:4000/api/docs
```

La especificación se genera automáticamente al arrancar el servidor fusionando todos los ficheros `.yaml` de `src/docs/`. Sigue el estándar **OpenAPI 3.0.3** con autenticación Bearer JWT.

---

## Estructura de carpetas

```
backend/
├── src/
│   ├── app.js                  # Configuración de Express y registro de rutas
│   ├── server.js               # Punto de entrada; conexión a MongoDB
│   ├── config/                 # Carga y validación de variables de entorno
│   ├── core/
│   │   └── utils/              # Utilidades compartidas (paginación, etc.)
│   ├── docs/                   # Especificación OpenAPI (YAML) + router Swagger UI
│   ├── middlewares/            # Auth, roles, rate limit, validación y errores
│   ├── models/                 # Esquemas Mongoose
│   ├── modules/                # Módulos de dominio (routes, controller, service, validator)
│   ├── repositories/           # Capa de acceso a datos
│   ├── seeds/                  # Scripts de datos iniciales
│   └── utils/                  # Helpers generales (ApiError, asyncHandler, logger…)
├── tests/                      # Tests de integración por módulo
│   └── setup/                  # Configuración del entorno de test
├── .env.example
├── package.json
└── LICENSE
```

---

## Principales módulos

| Módulo | Ruta base | Descripción |
|---|---|---|
| Auth | `/api/auth` | Login, logout, perfil propio, cambio de contraseña |
| Users | `/api/users` | CRUD de usuarios, activación y desactivación |
| Courses | `/api/courses` | Catálogo de cursos y su ciclo de vida |
| Enrollments | `/api/enrollments` | Ciclo de vida de la matrícula |
| Progress | `/api/progress` | Seguimiento del progreso por lección |
| Bookings | `/api/bookings` | Reserva de clases particulares |
| Availability | `/api/availability` | Disponibilidad de los profesores |
| Achievements | `/api/achievements` | Logros desbloqueados por el estudiante |
| Certificates | `/api/certificates` | Generación y consulta de certificados |
| Recommendations | `/api/recommendations` | Recomendaciones de contenido |
| Notifications | `/api/notifications` | Notificaciones del sistema |
| Live Sessions | `/api/live-sessions` | Sesiones en directo |
| Attendance | `/api/attendance` | Registro de asistencia |
| Assignments | `/api/assignments` | Tareas asignadas |
| Submissions | `/api/submissions` | Entregas de tareas |
| Dashboard | `/api/dashboard` | Resumen del estudiante |
| Teacher Analytics | `/api/teacher-analytics` | Analíticas para el profesor |

---

## Licencia

MIT — © 2026 Lidia García Torregrosa. Véase [LICENSE](LICENSE).
