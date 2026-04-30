// Importamos la instancia que ya funciona en tu app en lugar de crear una nueva
import { prisma } from '../src/config/prisma.js'; 

async function main() {
  console.log('🌱 Iniciando el sembrado de la base de datos (Seeding)...');

  // Usamos upsert para que, si ya existen, no los duplique al reiniciar el contenedor
  const p1 = await prisma.product.upsert({
    where: { id: 1 },
    update: {},
    create: { name: 'Terminal POS Android', basePrice: 850000 },
  });

  const p2 = await prisma.product.upsert({
    where: { id: 2 },
    update: {},
    create: { name: 'Lector de Código de Barras Láser', basePrice: 120000 },
  });

  const p3 = await prisma.product.upsert({
    where: { id: 3 },
    update: {},
    create: { name: 'Impresora Térmica de Recibos 80mm', basePrice: 250000 },
  });

  const p4 = await prisma.product.upsert({
    where: { id: 4 },
    update: {},
    create: { name: 'Cajón Monedero Metálico', basePrice: 180000 },
  });

  console.log('✅ Productos insertados correctamente:', [p1.name, p2.name, p3.name, p4.name]);
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seeding:', e);
    process.exit(1);
  });
