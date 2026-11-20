function validarBoleta(boleta) {
  const value = boleta == null ? '' : String(boleta).trim();
  if (!value) return 'La boleta es obligatoria.';
  if (!/^\d{10}$/.test(value)) return 'La boleta debe tener exactamente 10 dígitos.';
  return null;
}

function validarNombre(nombre) {
  const value = typeof nombre === 'string' ? nombre.trim() : '';
  if (!value) return 'El nombre es obligatorio.';
  if (value.length < 3) return 'El nombre debe tener al menos 3 caracteres.';
  if (value.length > 100) return 'El nombre no puede pasar de 100 caracteres.';
  return null;
}

function validarCorreo(correo) {
  const value = typeof correo === 'string' ? correo.trim() : '';
  if (!value) return 'El correo es obligatorio.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'El formato del correo no es válido.';
  return null;
}

function validarCupo(cupo) {
  const value = Number(cupo);
  if (!Number.isInteger(value) || value < 1 || value > 500) {
    return 'El cupo debe ser un número entero entre 1 y 500.';
  }
  return null;
}

function ocultarBoleta(boleta) {
  const value = String(boleta || '');
  return value.length < 4 ? '****' : `${value.slice(0, 4)}******`;
}

module.exports = { validarBoleta, validarNombre, validarCorreo, validarCupo, ocultarBoleta };
