const db = require('./db');

const SELECT_TALLER = `
  SELECT t.*, COUNT(a.id) AS inscritos
  FROM talleres t LEFT JOIN asistencias a ON a.taller_id = t.id
`;

const Talleres = {
  listar() {
    return db.prepare(`${SELECT_TALLER} GROUP BY t.id ORDER BY t.fecha, t.id`).all();
  },
  obtener(id) {
    return db.prepare(`${SELECT_TALLER} WHERE t.id = ? GROUP BY t.id`).get(id);
  },
  crear({ nombre, descripcion, instructor, fecha, cupo }) {
    const result = db.prepare(
      'INSERT INTO talleres (nombre, descripcion, instructor, fecha, cupo) VALUES (?, ?, ?, ?, ?)'
    ).run(nombre, descripcion, instructor, fecha, cupo);
    return Talleres.obtener(Number(result.lastInsertRowid));
  },
};

const Asistencias = {
  porTaller(tallerId) {
    return db.prepare(
      'SELECT id, nombre_alumno, boleta, fecha FROM asistencias WHERE taller_id = ? ORDER BY id'
    ).all(tallerId);
  },
  porBoleta(boleta) {
    return db.prepare(`
      SELECT t.id, t.nombre AS nombre_taller, t.instructor, t.fecha, t.cupo,
             a.nombre_alumno, a.fecha AS fecha_inscripcion
      FROM asistencias a JOIN talleres t ON t.id = a.taller_id
      WHERE a.boleta = ? ORDER BY t.fecha, t.id
    `).all(boleta);
  },
  inscribir({ tallerId, nombre, boleta }) {
    db.exec('BEGIN IMMEDIATE');
    try {
      const taller = Talleres.obtener(tallerId);
      if (!taller) {
        db.exec('ROLLBACK');
        return { ok: false, status: 404, message: 'Taller no encontrado.' };
      }
      if (taller.inscritos >= taller.cupo) {
        db.exec('ROLLBACK');
        return { ok: false, status: 409, message: 'El taller ya no tiene lugares.' };
      }
      const result = db.prepare(
        'INSERT INTO asistencias (taller_id, nombre_alumno, boleta) VALUES (?, ?, ?)'
      ).run(tallerId, nombre, boleta);
      db.exec('COMMIT');
      return { ok: true, data: { id: Number(result.lastInsertRowid), taller_id: tallerId, nombre_alumno: nombre } };
    } catch (error) {
      db.exec('ROLLBACK');
      if (String(error.message).includes('UNIQUE')) {
        return { ok: false, status: 409, message: 'Esa boleta ya está inscrita en este taller.' };
      }
      throw error;
    }
  },
};

const COLUMNAS_PUBLICAS = 'id, nombre, correo, boleta, rol';
const Usuarios = {
  listar() {
    return db.prepare(`SELECT ${COLUMNAS_PUBLICAS} FROM usuarios ORDER BY id`).all();
  },
  obtenerPorId(id) {
    return db.prepare(`SELECT ${COLUMNAS_PUBLICAS} FROM usuarios WHERE id = ?`).get(Number(id));
  },
  crear({ nombre, correo, contrasena, boleta, rol }) {
    const result = db.prepare(
      'INSERT INTO usuarios (nombre, correo, contrasena, boleta, rol) VALUES (?, ?, ?, ?, ?)'
    ).run(nombre, correo, contrasena, boleta, rol || 'alumno');
    return Usuarios.obtenerPorId(Number(result.lastInsertRowid));
  },
  eliminar(id) {
    return db.prepare('DELETE FROM usuarios WHERE id = ?').run(Number(id)).changes > 0;
  },
  perfilPorBoleta(boleta) {
    const usuario = db.prepare(
      'SELECT nombre, boleta, rol FROM usuarios WHERE boleta = ?'
    ).get(boleta);
    if (usuario) return { ...usuario, registrado: true };
    const asistencia = db.prepare(
      'SELECT nombre_alumno AS nombre, boleta FROM asistencias WHERE boleta = ? ORDER BY id LIMIT 1'
    ).get(boleta);
    return asistencia ? { ...asistencia, rol: 'alumno', registrado: false } : null;
  },
};

module.exports = { Talleres, Asistencias, Usuarios };
