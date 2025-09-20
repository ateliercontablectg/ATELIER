const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const emailRoutes = require('./email');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware CORS configurado para producción
app.use(cors({
  origin: [
    'https://ateliercontablectg.github.io',  // Tu GitHub Pages
    'http://localhost:8000',                 // Desarrollo local
    'http://127.0.0.1:5500',                 // Live Server
    'http://localhost:3000'                  // Backend local
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api', emailRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Backend de Atelier Contable funcionando' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Error interno del servidor' 
  });
});

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ 
    success: false, 
    message: 'Ruta no encontrada' 
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
  console.log(`Accesible localmente: http://localhost:${PORT}`);
  console.log(`Para producción: https://atelier-backend-6vlz.onrender.com`);
});
