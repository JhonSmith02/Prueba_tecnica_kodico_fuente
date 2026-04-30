import { prisma } from '../config/prisma.js';
import { DiscountFactory } from '../strategies/discount.strategy.js';

export const createProductService = async (name: string, basePrice: number) => {
  return await prisma.product.create({ data: { name, basePrice } });
};

export const getProductsWithActiveOffersService = async () => {
  const currentDate = new Date();

  // Traemos los productos y filtramos solo las ofertas que estén activas HOY
  const products = await prisma.product.findMany({
    include: {
      activeOffers: {
        where: {
          offer: {
            startDate: { lte: currentDate },
            endDate: { gte: currentDate }
          }
        },
        include: { offer: true }
      }
    }
  });

  // Calculamos el precio final usando nuestro Patrón Strategy
  return products.map(product => {
    let finalPrice = product.basePrice;
    let appliedOffer = null;

    if (product.activeOffers.length > 0) {
      const offerData = product.activeOffers[0].offer;
      appliedOffer = offerData.name;
      
      const strategy = DiscountFactory.getStrategy(offerData.discountType);
      
      // Le pasamos cantidad 1 porque estamos viendo el precio unitario en el catálogo
      finalPrice = strategy.calculateTotal(product.basePrice, 1, offerData.discountValue);
    }

    return {
      id: product.id,
      name: product.name,
      basePrice: product.basePrice,
      finalPrice,
      appliedOffer
    };
  });
};