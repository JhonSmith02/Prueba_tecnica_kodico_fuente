import { prisma } from '../config/prisma.js';

export const checkOverlappingOffers = async (productIds: number[], startDate: Date, endDate: Date) => {
  return await prisma.offerProduct.findFirst({
    where: {
      productId: { in: productIds },
      offer: {
        OR: [
          { startDate: { lte: endDate }, endDate: { gte: startDate } }
        ]
      }
    }
  });
};

export const createOfferService = async (data: any) => {
  return await prisma.offer.create({
    data: {
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      discountType: data.discountType,
      discountValue: data.discountValue,
      products: {
        create: data.productIds.map((id: number) => ({ product: { connect: { id } } }))
      }
    },
    include: { products: true }
  });
};

