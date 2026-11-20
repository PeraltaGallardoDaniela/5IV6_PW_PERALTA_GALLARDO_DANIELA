const express = require('express');
const { Talleres, Asistencias, Usuarios } = require('../modelo');
const v = require('../VALIDACIONES.JS');

const router = express.Router();
const ok = (res, data, status = 200) => res.status(status).json({ success: true, data });
const fallo = (res, status, message) => res.status(status).json({ success: false, message });
const seguro = (handler) => (req, res) => {
  try {
    return handler(req, res);
  } catch (error) {
    console.error(error);
    return fallo(res, 500, 'Error interno del servidor.');
  }
};

router.get('/talleres', seguro((req, res) => ok(res, Talleres.listar())));
router.get('/talleres/:id', seguro((req, res) => {
  const invalidacion = v.validarId(req.params.id);
  if (invalidacion) return fallo(res, 400, invalidacion);
  const taller = Talleres.obtener(Number(req.params.id));
  return taller ? ok(res, taller) : fallo(res, 404, 'Taller no encontrado.');
}));
router.post('/talleres', seguro((req, res) => {
  const { nombre, descripcion, instructor, fecha, cupo } = req.body || {};
  const cupoFinal = cupo === undefined || cupo === '' ? 15 : cupo;
  const error = v.validarNombre(nombre) || v.validarCupo(cupoFinal) || v.validarFecha(fecha);
  if (error) return fallo(res, 400, error);
  return ok(res, Talleres.crear({
    nombre: nombre.trim(),
    descripcion: typeof descripcion === 'string' ? descripcion.trim() : '',
    instructor: typeof instructor === 'string' && instructor.trim() ? instructor.trim() : 'Por confirmar',
    fecha: typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha) ? fecha : null,
    cupo: Number(cupoFinal),
  }), 201);
}));
router.put('/talleres/:id', seguro((req, res) => {
  const invalidacion = v.validarId(req.params.id);
  if (invalidacion) return fallo(res, 400, invalidacion);
  const id = Number(req.params.id);
  if (!Talleres.obtener(id)) return fallo(res, 404, 'Taller no encontrado.');

  const { nombre, descripcion, instructor, fecha, cupo } = req.body || {};
  const cupoFinal = cupo === undefined || cupo === '' ? 15 : cupo;
  const error = v.validarNombre(nombre) || v.validarCupo(cupoFinal) || v.validarFecha(fecha);
  if (error) return fallo(res, 400, error);
  return ok(res, Talleres.actualizar(id, {
    nombre: nombre.trim(),
    descripcion: typeof descripcion === 'string' ? descripcion.trim() : '',
    instructor: typeof instructor === 'string' && instructor.trim() ? instructor.trim() : 'Por confirmar',
    fecha: fecha || null,
    cupo: Number(cupoFinal),
  }));
}));
router.delete('/talleres/:id', seguro((req, res) => {
  const invalidacion = v.validarId(req.params.id);
  if (invalidacion) return fallo(res, 400, invalidacion);
  return Talleres.eliminar(Number(req.params.id))
    ? res.status(204).send()
    : fallo(res, 404, 'Taller no encontrado.');
}));
router.get('/talleres/:id/asistencias', seguro((req, res) => {
  const invalidacion = v.validarId(req.params.id);
  if (invalidacion) return fallo(res, 400, invalidacion);
  const id = Number(req.params.id);
  if (!Talleres.obtener(id)) return fallo(res, 404, 'Taller no encontrado.');
  return ok(res, Asistencias.porTaller(id).map((asistencia) => ({
    ...asistencia,
    boleta: v.ocultarBoleta(asistencia.boleta),
  })));
}));
router.post('/asistencias', seguro((req, res) => {
  const { taller_id: tallerIdRaw, nombre_alumno: nombre, boleta } = req.body || {};
  const tallerId = Number(tallerIdRaw);
  if (!Number.isInteger(tallerId) || tallerId <= 0) return fallo(res, 400, 'El taller es obligatorio.');
  const error = v.validarNombre(nombre) || v.validarBoleta(boleta);
  if (error) return fallo(res, 400, error);
  const result = Asistencias.inscribir({ tallerId, nombre: nombre.trim(), boleta: String(boleta).trim() });
  return result.ok ? ok(res, result.data, 201) : fallo(res, result.status, result.message);
}));
router.get('/alumnos/:boleta/talleres', seguro((req, res) => {
  const error = v.validarBoleta(req.params.boleta);
  if (error) return fallo(res, 400, error);
  return ok(res, Asistencias.porBoleta(req.params.boleta.trim()));
}));
router.get('/alumnos/:boleta/perfil', seguro((req, res) => {
  const error = v.validarBoleta(req.params.boleta);
  if (error) return fallo(res, 400, error);
  return ok(res, Usuarios.perfilPorBoleta(req.params.boleta.trim()));
}));

module.exports = router;
