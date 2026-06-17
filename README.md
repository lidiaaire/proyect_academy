# Elevate Your English | Campus

API REST backend para un sistema de gestión del aprendizaje (LMS) de una academia de inglés profesional. Proyecto de portfolio que demuestra arquitectura por capas, diseño orientado al dominio y desarrollo de APIs con seguridad como prioridad, usando Node.js, Express y MongoDB.

---

## Descripción general

Elevate Your English Campus es un LMS para una academia de inglés profesional. Soporta tres roles — **Admin**, **Teacher** y **Student** — a lo largo de un ciclo académico completo: catálogo de cursos, entrega estructurada de contenido, seguimiento del progreso por lección, evaluaciones de conocimiento, gestión del ciclo de matrícula y reserva de clases particulares.

El backend expone una API RESTful consumida por un cliente frontend independiente. Cada endpoint aplica autenticación JWT y control de acceso basado en roles.

**Stack:** Node.js · Express · MongoDB · Mongoose · bcryptjs · express-validator · jsonwebtoken

---

## Flujo de negocio

```
Admin crea un Course (estado draft)
    └─ añade Units → Lessons → Assessment por Unit
    └─ publica el Course

Admin matricula a un Student (Enrollment)
    └─ el sistema inicializa un LessonProgress por cada Lesson del Course

Student trabaja el Course
    └─ completa Lessons en orden (desbloqueo secuencial por Unit)
    └─ desbloquea el Assessment de la Unit al completar todas sus Lessons
    └─ envía un intento del Assessment → recibe puntuación
    └─ el Course se marca como completado automáticamente cuando el progreso global llega al 100 %

Teacher supervisa a sus Students asignados
    └─ consulta el estado de la Enrollment y el progreso
    └─ revisa el historial de intentos (sin ver las respuestas correctas)

Admin gestiona las reservas de clases particulares entre Students y sus Teachers asignados
```

---

## Arquitectura

La API sigue una arquitectura por capas estricta. Las dependencias fluyen en una única dirección, de la capa más externa hacia la más interna.

```
Petición HTTP
      ↓
[ Routes ]          — Declara endpoints, encadena middlewares, delega al controller
      ↓
[ Validators ]      — Sanitiza y valida la entrada mediante schemas de express-validator
      ↓
[ Middlewares ]     — Aspectos transversales: autenticación, roles, usuario activo
      ↓
[ Controllers ]     — Extrae datos del req, llama al service, devuelve la respuesta HTTP
      ↓
[ Services ]        — Lógica de negocio, reglas de dominio, orquestación de repositories
      ↓
[ Repositories ]    — Acceso a datos exclusivamente; todas las queries viven aquí
      ↓
[ Models ]          — Schemas Mongoose, índices, restricciones de campo
      ↓
MongoDB
```

**Responsabilidades por capa:**

| Capa | Responsabilidad | Nunca contiene |
|------|-----------------|----------------|
| **Controller** | Interfaz HTTP — manejo de req/res, códigos de estado | Reglas de negocio, queries a base de datos |
| **Service** | Lógica de dominio — validaciones, orquestación, semántica de errores | Aspectos HTTP, acceso directo al modelo |
| **Repository** | Construcción de queries, paginación, lista blanca de campos | Reglas de negocio, aspectos HTTP |
| **Model** | Definición del schema, índices, transformaciones de serialización | Cualquier lógica más allá de las restricciones del schema |

**Patrones transversales:**

- `asyncHandler` — envuelve cada controller en un capturador unificado de promesas rechazadas, eliminando el boilerplate de try/catch
- `validate(schema)` — middleware de orden superior que ejecuta las cadenas de express-validator y convierte los fallos en respuestas `ValidationError` estructuradas
- Jerarquía `ApiError` — errores tipados (`NotFoundError`, `ConflictError`, `ForbiddenError`…) que el middleware central `errorHandler` serializa de forma coherente
- `BaseRepository` — clase base CRUD genérica (`findAll`, `create`, `updateById` con `runValidators: true`) extendida por todos los repositories de dominio
- Borrado suave — no hay operaciones `DELETE` a nivel de base de datos; `isActive: false` es el único mecanismo de eliminación para registros accesibles desde la API

---

## Modelo de dominio

```
┌─────────────┐        ┌──────────────────┐        ┌──────────────┐
│    User     │───────▶│  TeacherProfile  │        │    Course    │
│  (admin /   │        │  (disponibilidad,│        │  (unidades,  │
│  teacher /  │        │   bio, etc.)     │        │   lecciones) │
│  student)   │        └──────────────────┘        └──────┬───────┘
└──────┬──────┘                                           │
       │                                            ┌─────▼──────┐
       │  teacher                                   │    Unit    │
       │  asignado                                  └─────┬──────┘
       │                                                  │
       │                                           ┌──────▼──────┐
       │                                           │   Lesson    │
       │                                           └──────┬──────┘
       │                                                  │
       │         ┌──────────────┐           ┌────────────▼──────────┐
       └────────▶│  Enrollment  │           │    LessonProgress     │
                 │  (por Course)│           │  (por Student/Lesson) │
                 └──────┬───────┘           └───────────────────────┘
                        │
                 ┌──────▼───────┐           ┌───────────────────────┐
                 │  Assessment  │──────────▶│  AssessmentAttempt    │
                 │  (por Unit)  │           │  (respuestas + nota)  │
                 └──────────────┘           └───────────────────────┘
```

**Relaciones clave:**

- Un `User` con rol `teacher` puede tener un `TeacherProfile` (bio, disponibilidad)
- Un `User` con rol `student` puede tener un `Teacher` asignado mediante `assignedTeacherId`
- `Enrollment` es la unión entre un `Student` y un `Course` — registra el estado general y el porcentaje de progreso
- `LessonProgress` almacena cada `Lesson` completada por un `Student` — solo append, nunca se revierte
- `AssessmentAttempt` es inmutable tras su envío — guarda un snapshot de las respuestas en el momento de la corrección; el `Assessment` fuente puede evolucionar sin corromper el historial
- `passwordHash` queda excluido de toda serialización mediante `select: false` y `toJSON.transform`

---

## Estructura del proyecto

```
backend/
├── src/
│   ├── server.js                   # Punto de entrada — conecta DB, arranca el servidor Express
│   ├── app.js                      # Configuración Express — stack de middlewares, montaje de rutas
│   │
│   ├── config/
│   │   ├── env.js                  # Valida variables de entorno requeridas, exporta objeto congelado
│   │   ├── database.js             # Conexión Mongoose con manejadores de eventos de ciclo de vida
│   │   └── constants.js            # Enums de dominio: ROLES, COURSE_STATUS, BOOKING_STATUS…
│   │
│   ├── middlewares/
│   │   ├── validate.js             # validate(schema) → [...chains, errorCollector]
│   │   ├── verifyToken.js          # Verificación JWT → popula req.user
│   │   ├── requireRole.js          # Guardia de control de acceso basado en roles
│   │   ├── requireActiveUser.js    # Consulta real a DB: user.isActive debe ser true
│   │   ├── errorHandler.js         # Serializador central de errores (ApiError, CastError, clave duplicada)
│   │   ├── notFound.js             # Manejador 404 para rutas no coincidentes
│   │   └── rateLimiter.js          # express-rate-limit — loginLimiter para el endpoint de autenticación
│   │
│   ├── models/                     # Schemas Mongoose e índices
│   │   ├── user.model.js
│   │   ├── course.model.js
│   │   ├── unit.model.js
│   │   ├── lesson.model.js
│   │   ├── lessonProgress.model.js
│   │   ├── enrollment.model.js
│   │   ├── assessment.model.js
│   │   ├── assessmentAttempt.model.js
│   │   ├── teacherProfile.model.js
│   │   └── classBooking.model.js
│   │
│   ├── repositories/
│   │   ├── base.repository.js      # CRUD genérico — extendido por todos los repositories de dominio
│   │   └── [dominio].repository.js # Un fichero por modelo; solo queries específicas del dominio
│   │
│   ├── modules/                    # Módulos de funcionalidad — un directorio por dominio
│   │   ├── auth/                   # Login, logout, /me, cambio de contraseña
│   │   ├── users/                  # CRUD de usuarios + activar/desactivar
│   │   ├── courses/                # Gestión del catálogo de cursos y su ciclo de vida
│   │   ├── units/                  # Gestión de Units (anidado bajo courses)
│   │   ├── lessons/                # Contenido de Lessons (anidado bajo units)
│   │   ├── enrollments/            # Ciclo de vida de la Enrollment
│   │   ├── progress/               # Seguimiento de LessonProgress y snapshots de progreso
│   │   ├── assessments/            # Definición de Assessments y envío de intentos
│   │   ├── bookings/               # Reserva de clases particulares (Fase 4)
│   │   └── availability/           # Gestión de franjas de disponibilidad del Teacher (Fase 5)
│   │       └── [modulo]/
│   │           ├── *.controller.js
│   │           ├── *.service.js
│   │           ├── *.validator.js
│   │           └── *.routes.js
│   │
│   ├── utils/
│   │   ├── ApiError.js             # Jerarquía de errores tipados (NotFoundError, ConflictError…)
│   │   ├── asyncHandler.js         # Envuelve controllers async — redirige rechazos a next()
│   │   ├── pagination.js           # Helpers build() y toMongoOptions()
│   │   ├── logger.js               # Logger de consola con niveles y colores
│   │   ├── progressCalculator.js   # Utilidad sin estado — agrega datos de Lesson y Assessment
│   │   └── slotExpander.js         # Expande reglas de disponibilidad del Teacher en franjas reservables
│   │
│   └── seeds/
│       ├── index.js                # Runner de seeds — limpia colecciones y ejecuta fases
│       └── phase1.seed.js          # Dataset inicial: usuarios, cursos, unidades, lecciones, matrículas
│
├── tests/
│   ├── validate.test.js
│   ├── user.validator.test.js
│   └── user.routes.test.js
│
├── .env.example
├── .gitignore
├── LICENSE
└── package.json
```

---

## Módulos

| Módulo | Ruta base | Responsabilidad |
|--------|-----------|-----------------|
| **Auth** | `/api/auth` | Login, logout, perfil propio, cambio de contraseña |
| **Users** | `/api/users` | CRUD de Users, activación y desactivación |
| **Courses** | `/api/courses` | Gestión del catálogo de cursos y su ciclo de vida |
| **Units** | `/api/courses/:courseId/units` | Gestión de Units dentro de un Course |
| **Lessons** | `/api/courses/:courseId/units/:unitId/lessons` | Contenido y ordenación de Lessons |
| **Progress** | `/api/progress` | Seguimiento de LessonProgress por Student |
| **Enrollments** | `/api/enrollments` | Ciclo de vida de la Enrollment |
| **Assessments** | `/api/courses/:courseId/units/:unitId/assessment` | Definición y envío de intentos del Assessment |
| **Bookings** | `/api/bookings` | Reserva de clases particulares *(Fase 4)* |
| **Availability** | `/api/teachers` | Gestión de franjas de disponibilidad del Teacher *(Fase 5)* |

### Auth

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| `POST` | `/api/auth/login` | Autenticación y obtención del JWT | Público |
| `POST` | `/api/auth/logout` | Cierre de sesión (descarte del token en el cliente) | Autenticado |
| `GET` | `/api/auth/me` | Perfil propio desde DB en tiempo real | Autenticado |
| `PATCH` | `/api/auth/change-password` | Cambio de contraseña propia | Autenticado |

### Users

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| `GET` | `/api/users` | Listar Users (paginado, filtrable) | Admin, Teacher |
| `GET` | `/api/users/:id` | Detalle de un User | Admin, Teacher |
| `POST` | `/api/users` | Crear User | Admin |
| `PATCH` | `/api/users/:id` | Actualizar perfil | Admin |
| `PATCH` | `/api/users/:id/activate` | Activar User | Admin |
| `PATCH` | `/api/users/:id/deactivate` | Desactivar User | Admin |

### Courses

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| `GET` | `/api/courses` | Listar Courses | Admin, Teacher, Student |
| `GET` | `/api/courses/:id` | Detalle de un Course | Admin, Teacher, Student |
| `POST` | `/api/courses` | Crear Course | Admin |
| `PATCH` | `/api/courses/:id` | Actualizar metadatos del Course | Admin |
| `PATCH` | `/api/courses/:id/publish` | Publicar Course (draft → published) | Admin |
| `PATCH` | `/api/courses/:id/archive` | Archivar Course | Admin |

### Units

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| `GET` | `…/units` | Listar Units de un Course | Admin, Teacher, Student |
| `GET` | `…/units/:id` | Detalle de una Unit | Admin, Teacher, Student |
| `POST` | `…/units` | Crear Unit | Admin |
| `PATCH` | `…/units/reorder` | Reordenar Units dentro del Course | Admin |
| `PATCH` | `…/units/:id` | Actualizar Unit | Admin |
| `DELETE` | `…/units/:id` | Eliminar Unit | Admin |

### Lessons

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| `GET` | `…/lessons` | Listar Lessons de una Unit | Admin, Teacher, Student |
| `GET` | `…/lessons/:id` | Detalle de una Lesson | Admin, Teacher, Student |
| `POST` | `…/lessons` | Crear Lesson | Admin |
| `PATCH` | `…/lessons/reorder` | Reordenar Lessons dentro de la Unit | Admin |
| `PATCH` | `…/lessons/:id` | Actualizar Lesson | Admin |
| `DELETE` | `…/lessons/:id` | Eliminar Lesson | Admin |

### Progress

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| `PATCH` | `/api/progress/lessons/:lessonId/complete` | Marcar Lesson como completada | Student |
| `GET` | `/api/progress/courses/:courseId` | Progreso propio en un Course | Student |
| `GET` | `/api/progress/overview` | Resumen de progreso en todos los cursos activos | Student |
| `GET` | `/api/progress/students/:studentId/courses/:courseId` | Progreso de un Student (vista externa) | Admin, Teacher |
| `GET` | `/api/progress/students/:studentId` | Resumen de progreso de un Student | Admin, Teacher |

### Enrollments

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| `GET` | `/api/enrollments` | Listar Enrollments | Admin, Teacher, Student (propias) |
| `GET` | `/api/enrollments/:id` | Detalle de una Enrollment | Admin, Teacher, Student (propia) |
| `POST` | `/api/enrollments` | Matricular un Student en un Course | Admin |
| `PATCH` | `/api/enrollments/:id/suspend` | Suspender Enrollment | Admin |
| `PATCH` | `/api/enrollments/:id/activate` | Reactivar Enrollment | Admin |

### Assessments

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| `GET` | `…/assessment` | Obtener el Assessment de una Unit | Admin, Teacher, Student* |
| `POST` | `…/assessment` | Crear Assessment para una Unit | Admin |
| `PATCH` | `…/assessment` | Actualizar definición del Assessment | Admin |
| `DELETE` | `…/assessment` | Eliminar Assessment (solo en Courses en draft) | Admin |
| `POST` | `…/assessment/attempts` | Enviar un intento | Student |
| `GET` | `…/assessment/attempts` | Listar todos los intentos | Admin, Teacher, Student (propios) |

*El acceso del Student requiere haber completado todas las Lessons de la Unit.

---

## Reglas de negocio

### Enrollment

- Un Student solo puede matricularse en un Course con estado `published`; los estados `draft` y `archived` rechazan la matriculación.
- El Student debe tener `isActive: true` en el momento de la matrícula.
- La duplicidad (mismo Student + Course) se rechaza en el service y en la base de datos mediante índice único.
- Al crear la Enrollment, el sistema inicializa en bloque todos los registros `LessonProgress` del Course con `status: not_started`.
- El estado `completed` lo asigna el sistema automáticamente — no existe endpoint para forzarlo.
- Una Enrollment con estado `completed` es inmutable; no se acepta ningún cambio posterior.

### LessonProgress

- Los registros se crean en el momento de la matrícula y nunca se eliminan — la finalización es irreversible.
- `completeLesson` es **idempotente**: llamarlo sobre una Lesson ya completada devuelve el estado actual sin efectos secundarios.
- Completar una Lesson requiere tener una Enrollment activa en el Course en el momento de la llamada.

### Desbloqueo secuencial

- Controlado por Unit mediante el flag `unit.sequentialUnlock` (booleano).
- Cuando está activo, un Student no puede completar la Lesson `n` hasta que la Lesson `n − 1` esté `completed`.
- El acceso a cada Unit sigue el mismo patrón: una Unit está bloqueada hasta que se supera el Assessment de la Unit anterior (si existe).

### Assessments

- Cada Unit puede tener como máximo un Assessment; crear un segundo lanza `ConflictError`.
- Un Student solo puede acceder o enviar un Assessment **tras completar todas las Lessons de la Unit**.
- `correctAnswer` nunca se devuelve a Teachers ni Students — solo el Admin lo recibe.
- Un Assessment solo puede eliminarse mientras su Course esté en estado `draft`; la eliminación en cascada afecta a todos sus `AssessmentAttempt`.

### AssessmentAttempts

- El envío requiere: Enrollment activa + todas las Lessons de la Unit completadas + intentos restantes disponibles.
- Un Student que ya ha aprobado (`passed: true`) no puede enviar más intentos.
- Superar `assessment.maxAttempts` se rechaza antes de cualquier corrección.
- `score = floor((respuestas correctas / total preguntas) × 100)`.
- `passed = score ≥ assessment.passingScore`.
- Cada intento se persiste como snapshot inmutable; el Assessment fuente puede evolucionar sin corromper el historial.

### Finalización del Course

- Se activa automáticamente cuando `overallProgress` alcanza el `100 %` al marcar una Lesson como completada.
- El sistema llama internamente a `EnrollmentService.markCompleted()` — no existe endpoint para forzar este estado.

### Reglas de autorización

| Acción | Admin | Teacher | Student |
|--------|-------|---------|---------|
| Gestionar Users, Courses, Units, Lessons | ✅ | ✗ | ✗ |
| Ver cualquier Enrollment o progreso | ✅ | Solo sus Students | Solo datos propios |
| Marcar Lessons como completadas / enviar Assessment | ✅ | ✗ | ✅ (propios) |
| Ver `correctAnswer` | ✅ | ✗ | ✗ |
| Eliminar Assessments | ✅ (solo en draft) | ✗ | ✗ |
| Forzar Enrollment a `completed` | ✗ | ✗ | ✗ (solo el sistema) |

---

## Seguridad y autorización

**Autenticación**

Todas las rutas protegidas requieren un JWT de tipo `Bearer` en la cabecera `Authorization`. El middleware `verifyToken` valida la firma, extrae `{ userId, role }` y popula `req.user`. Los tokens ausentes o mal formados devuelven `401 TOKEN_MISSING`. Los tokens expirados o manipulados devuelven `401 INVALID_TOKEN`.

**Control de acceso basado en roles**

`requireRole(...roles)` se ejecuta tras `verifyToken` y rechaza cualquier petición cuyo `req.user.role` no esté en la lista de roles permitidos (`403 INSUFFICIENT_ROLE`). Los roles disponibles son `admin`, `teacher` y `student`.

**Verificación de cuenta activa**

Los endpoints de escritura incluyen `requireActiveUser`, que realiza una consulta real a la base de datos y rechaza tokens pertenecientes a cuentas desactivadas (`403 ACCOUNT_INACTIVE`). Los endpoints de lectura omiten esta comprobación intencionadamente.

**Seguridad de contraseñas**

- Las contraseñas se hashean con `bcryptjs` (10 rondas) antes de persistirse.
- La entrada está limitada a 72 caracteres en el validator, respetando el límite de truncación silenciosa de bcrypt.
- `passwordHash` queda excluido de todos los resultados de queries mediante `select: false` en el campo Mongoose y un `toJSON.transform` que lo elimina en la serialización (doble defensa).
- `updateUserSchema` bloquea `password` y `passwordHash` en el body del PATCH; los cambios de contraseña pasan por el endpoint dedicado `PATCH /api/auth/change-password`.

**Acceso a campos sensibles**

- `correctAnswer` nunca se devuelve a Teachers ni Students. Los métodos del repository aceptan un flag explícito `includeCorrectAnswers`, que solo se activa dentro de `submitAttempt`.

**Otras protecciones**

- Lista blanca de actualizaciones en todos los repositories — los objetos de actualización se construyen campo a campo, previniendo mass-assignment e inyección NoSQL.
- CORS restringido al origen definido en la variable de entorno `CLIENT_URL`.
- Limitación de peticiones (`loginLimiter`) aplicada a `POST /api/auth/login` — 5 peticiones cada 15 minutos por IP.

---

## Primeros pasos

### Requisitos previos

- Node.js ≥ 18
- MongoDB ≥ 6 en local o una cadena de conexión (Atlas, etc.)

### Instalación

```bash
git clone https://github.com/<tu-usuario>/elevate-your-english-backend.git
cd elevate-your-english-backend
npm install
```

### Variables de entorno

Copia el fichero de ejemplo y completa los valores:

```bash
cp .env.example .env
```

| Variable | Ejemplo | Descripción |
|----------|---------|-------------|
| `PORT` | `4000` | Puerto del servidor HTTP |
| `NODE_ENV` | `development` | `development` \| `production` \| `test` |
| `MONGODB_URI` | `mongodb://localhost:27017/elevate_campus` | Cadena de conexión a MongoDB |
| `JWT_SECRET` | `tu-secreto-minimo-32-caracteres` | Clave de firma para todos los JWT |
| `JWT_TTL_ADMIN` | `8h` | Expiración del token para Admin |
| `JWT_TTL_TEACHER` | `24h` | Expiración del token para Teacher |
| `JWT_TTL_STUDENT` | `7d` | Expiración del token para Student |
| `CLIENT_URL` | `http://localhost:3000` | Origen permitido por CORS |

El servidor termina al arrancar si falta alguna variable requerida.

### Ejecución

```bash
npm run dev     # nodemon — reinicia con cada cambio en ficheros
npm start       # node estándar
```

---

## Datos de prueba

Puebla la base de datos con un dataset inicial representativo para desarrollo local y pruebas manuales.

> **Aviso:** el seed **elimina y recrea** las siguientes colecciones antes de insertar:
> `users`, `courses`, `units`, `lessons`, `assessments`, `enrollments`, `lessonprogresses`, `assessmentattempts`.

```bash
# NODE_ENV debe ser "development" — el seed rechaza ejecutarse en otro entorno
npm run seed
```

El seed conecta a MongoDB, limpia las colecciones indicadas, ejecuta `phase1.seed.js` y desconecta. Las credenciales de los usuarios creados se imprimen por consola al finalizar.

---

## Tests

Los tests operan sobre estructuras en memoria — no se necesita MongoDB en ejecución.

```bash
npm test              # ejecución única (jest --runInBand)
npm run test:watch    # modo interactivo con vigilancia de cambios
```

**Cobertura actual:**

| Suite | Tests | Qué cubre |
|-------|-------|-----------|
| `validate.test.js` | 6 | Middleware `validate()` — paso correcto, forma del error, acumulación de campos |
| `user.validator.test.js` | 38 | Los 4 schemas — campos requeridos, reglas de formato, listas de bloqueo, sanitizadores |
| `user.routes.test.js` | 21 | Número de rutas, existencia método+path, ausencia de shadowing, orden de middlewares, referencias a controllers |
| **Total** | **65** | **0 fallos** |

Las variables de entorno requeridas por la aplicación se definen al inicio de cada fichero de test — no se necesita `.env` para ejecutar los tests.

---

## Limitaciones conocidas

**No implementado aún**

- **Bookings** (`/api/bookings`) — el router está registrado en `app.js` pero vacío. Sin rutas ni lógica.
- **Availability** (`/api/teachers`) — ídem: registrado pero vacío.

**Cobertura de tests**

- Los tests solo cubren el módulo Users (65 tests en 3 suites).
- Auth, Courses, Units, Lessons, Enrollments, Progress y Assessments tienen **cero tests automatizados**.
- No existen tests de integración contra una instancia real de MongoDB; las restricciones de índices Mongoose y la validación a nivel de modelo no se ejercitan en el suite actual.

**Otros**

- Sin subida de ficheros — `avatarUrl` almacena únicamente una URL de imagen alojada externamente.
- `POST /api/auth/logout` es sin estado: confirma la petición pero no invalida el token en servidor. La eliminación del token es responsabilidad del cliente.
- Los datos del seed cubren solo las entidades de la Fase 1; los registros de Booking y Availability no están incluidos.

---

## Hoja de ruta

| Fase | Alcance | Estado |
|------|---------|--------|
| 0 | Infraestructura — Express, config, middlewares, gestión de errores, base repository | ✅ Completa |
| 1 | Users — CRUD completo, activar/desactivar, validators, routes, tests | ✅ Completa |
| 2 | Auth, Courses, Units, Lessons, Enrollments, Progress, Assessments — service + controller + validator + routes | ✅ Implementada |
| 3 | Suites de tests para todos los módulos de la Fase 2 | 🔲 Pendiente |
| 4 | Bookings — ciclo de vida de la reserva de clases particulares | 🔲 Pendiente |
| 5 | Availability — plantillas de disponibilidad del Teacher y expansión de franjas | 🔲 Pendiente |
| 6 | Tests de integración, ampliación del seed, configuración de despliegue | 🔲 Pendiente |

---

## Proceso de desarrollo

Este proyecto sigue un ciclo estricto de **diseño → revisión → implementación → validación**. Cada módulo se diseña y revisa en su totalidad antes de escribir una sola línea de implementación. Ningún módulo se considera cerrado hasta que sus tests pasan con cero fallos.

Las capas se implementan en secuencia — model → repository → service → controller → validator → routes — de forma que cada capa puede testarse de forma aislada antes de construir la siguiente sobre ella.

**Desarrollo asistido por IA**

Las decisiones de arquitectura, los contratos entre capas, las restricciones de seguridad y las reglas de validación se desarrollaron con el apoyo de un asistente de inteligencia artificial (Claude), utilizado como revisor técnico y interlocutor de diseño. Cada decisión se razonó de forma explícita antes de trasladarse al código.

---

*Desarrollado con Node.js · Express · MongoDB · Mongoose*
