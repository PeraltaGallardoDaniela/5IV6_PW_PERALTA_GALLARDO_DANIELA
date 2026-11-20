# Aula Abierta: talleres con Express y SQLite

Aplicación web para publicar talleres, administrar inscripciones y consultar perfiles de alumnos. Se ejecuta por separado del proyecto `EXPRESSPROYECTO` existente.

## Requisitos

- Node.js 22.13 o superior (SQLite se incluye en Node).
- npm.

## Iniciar

Desde esta carpeta:

```powershell
npm install
npm start
```

Abre `http://localhost:3000`. Para desarrollo con reinicio automático: `npm run dev`.

La base `datos.sqlite` se crea automáticamente en esta carpeta con dos talleres de ejemplo. Para comenzar desde cero, detén el servidor y elimina `datos.sqlite`, `datos.sqlite-shm` y `datos.sqlite-wal`.

## Páginas

- `/`: inicio y talleres próximos.
- `/talleres`: agenda y formulario para crear talleres.
- `/talleres/:id`: detalle, lista de inscritos e inscripción.
- `/alumnos/perfil`: registro y administración de cuentas.
- `/talleres/alumnos/perfil`: consulta de perfil y talleres inscritos por boleta.
- `/mini-servidor/:id`: ejemplo de parámetro de ruta Express.

## API

- `GET /api/talleres`, `GET /api/talleres/:id`, `POST /api/talleres`.
- `GET /api/talleres/:id/asistencias`, `POST /api/asistencias`.
- `GET /api/alumnos/:boleta/talleres`, `GET /api/alumnos/:boleta/perfil`.
- `GET /api/usuarios`, `GET /api/usuarios/:id`, `POST /api/usuarios`, `DELETE /api/usuarios/:id`.

Las boletas de asistentes se ocultan en las listas públicas. Las contraseñas de usuarios se guardan con bcrypt y nunca se incluyen en las respuestas.
