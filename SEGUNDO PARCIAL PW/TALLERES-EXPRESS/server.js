const express = require('express');
const os = require('node:os');
const path = require('node:path');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const publicDir = path.join(__dirname, 'public');
const sendPage = (file) => (req, res) => res.sendFile(path.join(publicDir, file));

app.use(express.json({ limit: '10kb' }));
app.use('/api/usuarios', require('./rutas/usuarios'));
app.use('/api', require('./rutas/api'));
app.use('/api', (req, res) => res.status(404).json({ success: false, message: 'Ruta no encontrada.' }));

app.get('/', sendPage('index.html'));
app.get('/talleres', sendPage('talleres.html'));
app.get('/talleres/alumnos/perfil', sendPage('asistencia.html'));
app.get('/talleres/:id', sendPage('taller.html'));
app.get('/alumnos/perfil', sendPage('usuarios.html'));
app.get('/mini-servidor/:id', sendPage('mini-servidor.html'));
app.use(express.static(publicDir));
app.use((req, res) => res.status(404).sendFile(path.join(publicDir, '404.html')));
app.use((error, req, res, next) => {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'El cuerpo de la petición no es un JSON válido.' });
  }
  console.error(error);
  return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor listo en http://localhost:${PORT}`);
  for (const interfaces of Object.values(os.networkInterfaces())) {
    for (const network of interfaces || []) {
      if (network.family === 'IPv4' && !network.internal) console.log(`Red: http://${network.address}:${PORT}`);
    }
  }
});
