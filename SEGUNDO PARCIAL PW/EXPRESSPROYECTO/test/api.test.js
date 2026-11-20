const assert = require('node:assert/strict');
const { mkdtempSync, rmSync } = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { after, before, test } = require('node:test');

const tempDir = mkdtempSync(path.join(os.tmpdir(), 'expressproyecto-'));
process.env.DB_FILE = path.join(tempDir, 'test.sqlite');
const app = require('../SERVER.JS');
const db = require('../db');

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  db.close();
  rmSync(tempDir, { recursive: true, force: true });
  delete process.env.DB_FILE;
});

async function request(url, options) {
  const response = await fetch(`${baseUrl}${url}`, options);
  const body = response.status === 204 ? null : await response.json();
  return { response, body };
}

function json(method, value) {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(value),
  };
}

test('mini-servidor, usuarios, talleres y asistencias funcionan como API JSON', async () => {
  let result = await request('/');
  assert.equal(result.response.status, 200);
  assert.ok(result.body.endpoints.includes('GET /saludo'));

  result = await request('/saludo');
  assert.equal(result.body.mensaje, 'Hola, Express está funcionando.');

  result = await request('/mini-servidor/42');
  assert.equal(result.body.parametro, '42');

  result = await request('/eco', json('POST', { texto: ' Hola ' }));
  assert.equal(result.response.status, 201);
  assert.equal(result.body.eco, 'Hola');

  result = await request('/eco', json('POST', { texto: ' ' }));
  assert.equal(result.response.status, 400);

  result = await request('/eco', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{"texto":',
  });
  assert.equal(result.response.status, 400);

  result = await request('/no-existe');
  assert.equal(result.response.status, 404);
  assert.equal(result.body.success, false);

  result = await request('/api/talleres', json('POST', {
    nombre: 'Taller de prueba',
    descripcion: 'Descripción',
    instructor: 'Docente',
    fecha: '2026-11-15',
    cupo: 1,
  }));
  assert.equal(result.response.status, 201);
  const workshopId = result.body.data.id;

  result = await request('/api/talleres', json('POST', {
    nombre: 'Fecha incorrecta',
    fecha: '2026-02-31',
    cupo: 2,
  }));
  assert.equal(result.response.status, 400);

  result = await request(`/api/talleres/${workshopId}`, json('PUT', {
    nombre: 'Taller actualizado',
    descripcion: 'Actualizado',
    instructor: 'Otra docente',
    fecha: '2026-11-16',
    cupo: 1,
  }));
  assert.equal(result.response.status, 200);
  assert.equal(result.body.data.nombre, 'Taller actualizado');

  result = await request('/api/usuarios', json('POST', {
    nombre: 'Estudiante de prueba',
    correo: 'estudiante@example.com',
    contrasena: 'password-segura',
    boleta: '0000123456',
  }));
  assert.equal(result.response.status, 201);
  const userId = result.body.id;
  assert.equal(result.body.contrasena, undefined);

  result = await request(`/api/usuarios/${userId}`);
  assert.equal(result.response.status, 200);
  assert.equal(result.body.correo, 'estudiante@example.com');
  assert.equal(result.body.contrasena, undefined);

  result = await request('/api/usuarios', json('POST', {
    nombre: 'Con contraseña corta',
    correo: 'corta@example.com',
    contrasena: '1234567',
    boleta: '0000123457',
  }));
  assert.equal(result.response.status, 400);

  result = await request(`/api/usuarios/${userId}`, json('PUT', {
    nombre: 'Estudiante actualizado',
    correo: 'actualizado@example.com',
    boleta: '0000123456',
  }));
  assert.equal(result.response.status, 200);
  assert.equal(result.body.nombre, 'Estudiante actualizado');
  assert.equal(result.body.contrasena, undefined);

  result = await request('/api/asistencias', json('POST', {
    taller_id: workshopId,
    nombre_alumno: 'Estudiante actualizado',
    boleta: '0000123456',
  }));
  assert.equal(result.response.status, 201);

  result = await request('/api/asistencias', json('POST', {
    taller_id: workshopId,
    nombre_alumno: 'Estudiante actualizado',
    boleta: '0000123456',
  }));
  assert.equal(result.response.status, 409);

  result = await request('/api/asistencias', json('POST', {
    taller_id: workshopId,
    nombre_alumno: 'Otra estudiante',
    boleta: '0000123457',
  }));
  assert.equal(result.response.status, 409);

  result = await request(`/api/talleres/${workshopId}/asistencias`);
  assert.equal(result.response.status, 200);
  assert.equal(result.body.data[0].boleta, '0000******');

  result = await request(`/api/alumnos/0000123456/perfil`);
  assert.equal(result.response.status, 200);
  assert.equal(result.body.data.registrado, true);

  result = await request(`/api/usuarios/${userId}`, { method: 'DELETE' });
  assert.equal(result.response.status, 204);

  result = await request(`/api/talleres/${workshopId}`, { method: 'DELETE' });
  assert.equal(result.response.status, 204);

  result = await request(`/api/talleres/${workshopId}`);
  assert.equal(result.response.status, 404);

  result = await request('/api/talleres/no-es-id');
  assert.equal(result.response.status, 400);
});
