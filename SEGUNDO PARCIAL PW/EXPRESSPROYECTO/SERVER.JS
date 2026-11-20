const express = require('express');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.disable('x-powered-by');
app.use(express.json({ limit: '10kb' }));
app.use('/api/usuarios', require('./rutas/usuarios'));
app.use('/api', require('./rutas/api'));

app.get('/', (req, res) => res.json({
  nombre: 'API de talleres',
  endpoints: [
    'GET /saludo',
    'POST /eco',
    'GET /mini-servidor/:id',
    'GET, POST /api/talleres',
    'GET, PUT, DELETE /api/talleres/:id',
    'GET /api/talleres/:id/asistencias',
    'POST /api/asistencias',
    'GET, POST /api/usuarios',
    'GET, PUT, DELETE /api/usuarios/:id',
    'GET /api/alumnos/:boleta/perfil',
    'GET /api/alumnos/:boleta/talleres',
  ],
}));

app.get('/saludo', (req, res) => {
  res.json({ mensaje: 'Hola, Express está funcionando.' });
});

app.post('/eco', (req, res) => {
  const { texto } = req.body || {};
  if (typeof texto !== 'string' || !texto.trim()) {
    return res.status(400).json({ error: 'El texto es obligatorio.' });
  }
  return res.status(201).json({ eco: texto.trim() });
});

app.get('/mini-servidor/:id', (req, res) => {
  res.json({
    mensaje: 'Parámetro recibido por Express.',
    parametro: req.params.id,
  });
});

app.use((req, res) => res.status(404).json({
  success: false,
  message: 'Ruta no encontrada.',
}));

app.use((error, req, res, next) => {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'El cuerpo de la petición no es un JSON válido.' });
  }
  if (error.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'El cuerpo de la petición es demasiado grande.' });
  }
  console.error(error);
  return res.status(error.status || 500).json({
    success: false,
    message: error.status ? error.message : 'Error interno del servidor.',
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor listo en http://localhost:${PORT}`);
  });
}

module.exports = app;
