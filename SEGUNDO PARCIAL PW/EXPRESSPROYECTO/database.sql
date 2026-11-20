PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS talleres (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  descripcion TEXT NOT NULL DEFAULT '',
  instructor TEXT NOT NULL DEFAULT 'Por confirmar',
  fecha TEXT,
  cupo INTEGER NOT NULL CHECK (cupo > 0)
);

CREATE TABLE IF NOT EXISTS asistencias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  taller_id INTEGER NOT NULL REFERENCES talleres(id) ON DELETE CASCADE,
  nombre_alumno TEXT NOT NULL,
  boleta TEXT NOT NULL,
  fecha TEXT NOT NULL DEFAULT (date('now')),
  UNIQUE (taller_id, boleta)
);

CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  correo TEXT NOT NULL UNIQUE,
  contrasena TEXT NOT NULL,
  boleta TEXT NOT NULL UNIQUE,
  rol TEXT NOT NULL DEFAULT 'alumno'
);