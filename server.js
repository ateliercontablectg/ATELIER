const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const emailRoutes = require('./email');  // ← CAMBIADO: sin carpeta routes/

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
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
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
