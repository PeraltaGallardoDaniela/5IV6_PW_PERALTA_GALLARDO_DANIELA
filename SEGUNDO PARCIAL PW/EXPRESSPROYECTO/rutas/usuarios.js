const express = require('express');
const bcrypt = require('bcryptjs');
const { Usuarios } = require('../modelo');
const v = require('../VALIDACIONES.JS');

const router = express.Router();
const errorInterno = (res, error) => {
  console.error(error);
  return res.status(500).json({ error: 'Error interno del servidor.' });
};
const duplicado = (error) => String(error.message).includes('UNIQUE');

router.get('/', (req, res) => {
  try {
    return res.json(Usuarios.listar());
  } catch (error) {
    return errorInterno(res, error);
  }
});
router.get('/:id', (req, res) => {
  try {
    const invalidacion = v.validarId(req.params.id);
    if (invalidacion) return res.status(400).json({ error: invalidacion });
    const usuario = Usuarios.obtenerPorId(req.params.id);
    return usuario ? res.json(usuario) : res.status(404).json({ error: 'Usuario no encontrado.' });
  } catch (error) {
    return errorInterno(res, error);
  }
});
router.post('/', async (req, res) => {
  try {
    const { nombre, correo, contrasena, boleta, rol } = req.body || {};
    if (!nombre || !correo || !contrasena || !boleta) {
      return res.status(400).json({ error: 'Faltan datos obligatorios.' });
    }
    const invalidacion = v.validarNombre(nombre) || v.validarCorreo(correo) || v.validarBoleta(boleta);
    if (invalidacion) return res.status(400).json({ error: invalidacion });
    if (typeof contrasena !== 'string' || contrasena.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
    }
    const usuario = Usuarios.crear({
      nombre: nombre.trim(),
      correo: correo.trim().toLowerCase(),
      contrasena: await bcrypt.hash(contrasena, 10),
      boleta: String(boleta).trim(),
      rol: rol === 'administrador' ? 'administrador' : 'alumno',
    });
    return res.status(201).json(usuario);
  } catch (error) {
    if (duplicado(error)) return res.status(409).json({ error: 'El correo o la boleta ya están registrados.' });
    return errorInterno(res, error);
  }
});
router.put('/:id', async (req, res) => {
  try {
    const invalidacion = v.validarId(req.params.id);
    if (invalidacion) return res.status(400).json({ error: invalidacion });
    const id = Number(req.params.id);
    if (!Usuarios.obtenerPorId(id)) return res.status(404).json({ error: 'Usuario no encontrado.' });

    const { nombre, correo, contrasena, boleta, rol } = req.body || {};
    const error = v.validarNombre(nombre) || v.validarCorreo(correo) || v.validarBoleta(boleta);
    if (error) return res.status(400).json({ error });
    if (contrasena !== undefined && (typeof contrasena !== 'string' || contrasena.length < 8)) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
    }

    const usuario = Usuarios.actualizar(id, {
      nombre: nombre.trim(),
      correo: correo.trim().toLowerCase(),
      boleta: String(boleta).trim(),
      contrasena: contrasena === undefined ? null : await bcrypt.hash(contrasena, 10),
      rol: rol === 'administrador' ? 'administrador' : 'alumno',
    });
    return res.json(usuario);
  } catch (error) {
    if (duplicado(error)) return res.status(409).json({ error: 'El correo o la boleta ya están registrados.' });
    return errorInterno(res, error);
  }
});
router.delete('/:id', (req, res) => {
  try {
    const invalidacion = v.validarId(req.params.id);
    if (invalidacion) return res.status(400).json({ error: invalidacion });
    if (!Usuarios.eliminar(Number(req.params.id))) return res.status(404).json({ error: 'Usuario no encontrado.' });
    return res.status(204).send();
  } catch (error) {
    if (String(error.message).includes('FOREIGN KEY')) {
      return res.status(409).json({ error: 'No se puede eliminar: el usuario tiene registros asociados.' });
    }
    return errorInterno(res, error);
  }
});

module.exports = router;
