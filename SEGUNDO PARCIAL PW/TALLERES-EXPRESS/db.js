const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const db = new DatabaseSync(process.env.DB_FILE || path.join(__dirname, 'datos.sqlite'));
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
db.exec(`
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
`);

if (db.prepare('SELECT COUNT(*) AS total FROM talleres').get().total === 0) {
  const insert = db.prepare(
    'INSERT INTO talleres (nombre, descripcion, instructor, fecha, cupo) VALUES (?, ?, ?, ?, ?)'
  );
  insert.run('Programación Web', 'Construye aplicaciones web modernas con JavaScript.', 'Por confirmar', '2026-11-15', 25);
  insert.run('Bases de Datos', 'Diseño de tablas, consultas y respaldos.', 'Por confirmar', '2026-11-20', 20);
}

module.exports = db;
