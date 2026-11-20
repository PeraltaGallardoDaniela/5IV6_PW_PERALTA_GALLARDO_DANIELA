# Proyecto del segundo parcial: API de talleres

Backend académico creado con JavaScript, Express y SQLite. No usa HTML ni plantillas: las rutas responden JSON. Incluye usuarios, talleres, asistencias y el mini-servidor del ejercicio de Express.

## Requisitos

- Node.js 22.13 o superior (`node:sqlite` viene integrado).
- npm.

## Instalación y ejecución

Desde esta carpeta:

```powershell
npm install
npm start
```

El servidor queda en `http://localhost:3000`. Para desarrollo con reinicio automático usa `npm run dev`. Para ejecutar las pruebas automatizadas usa `npm test`.

La base `datos.sqlite` se crea automáticamente con las tablas y dos talleres de ejemplo. Puedes cambiar su ubicación definiendo `DB_FILE` antes de iniciar el servidor.

## Mini-servidor

- `GET /` muestra en JSON las rutas disponibles.
- `GET /saludo` responde un saludo JSON.
- `POST /eco` recibe `{ "texto": "Hola" }` y devuelve el texto.
- `GET /mini-servidor/:id` devuelve el parámetro capturado por Express.

Ejemplo PowerShell:

```powershell
Invoke-RestMethod http://localhost:3000/mini-servidor/42
Invoke-RestMethod -Method Post http://localhost:3000/eco `
  -ContentType 'application/json' -Body '{"texto":"Hola"}'
```

## API

### Usuarios

- `GET /api/usuarios`
- `GET /api/usuarios/:id`
- `POST /api/usuarios` — requiere `nombre`, `correo`, `boleta` y contraseña de al menos 8 caracteres.
- `PUT /api/usuarios/:id`
- `DELETE /api/usuarios/:id`

Las contraseñas se guardan con bcrypt y nunca se incluyen en las respuestas.

### Talleres y asistencias

- `GET /api/talleres`
- `GET /api/talleres/:id`
- `POST /api/talleres`
- `PUT /api/talleres/:id`
- `DELETE /api/talleres/:id` — elimina también sus asistencias.
- `GET /api/talleres/:id/asistencias`
- `POST /api/asistencias` — recibe `taller_id`, `nombre_alumno` y `boleta`.
- `GET /api/alumnos/:boleta/perfil`
- `GET /api/alumnos/:boleta/talleres`

Las boletas deben tener 10 dígitos. La API valida entradas, evita inscripciones duplicadas y no permite exceder el cupo. En las listas de asistencia, la boleta se muestra parcialmente oculta.

## Estructura

- `SERVER.JS`: configuración de Express y endpoints del mini-servidor.
- `rutas/`: endpoints de usuarios, talleres y asistencias.
- `modelo.js`: consultas y operaciones SQLite.
- `db.js`: creación de la base y tablas.
- `VALIDACIONES.JS`: validación de entradas.
- `database.sql`: esquema SQLite equivalente para consulta o creación manual.
- `test/`: pruebas automatizadas de la API.
