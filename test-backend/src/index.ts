import express from 'express';
import cors from 'cors';
import { prisma } from './config/prisma.js';
import productRoutes from './routes/product.routes.js';
import offerRoutes from './routes/offer.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/offers', offerRoutes);

app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', message: 'Servidor y BD funcionando' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error en BD' });
  }
});

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));