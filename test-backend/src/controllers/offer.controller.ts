import { Request, Response } from 'express';
import { checkOverlappingOffers, createOfferService } from '../services/offer.service.js';

export const createOffer = async (req: Request, res: Response) => {
  try {
    const { name, startDate, endDate, discountType, discountValue, productIds } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({ error: 'La fecha de inicio debe ser anterior a la de fin' });
    }

    const overlap = await checkOverlappingOffers(productIds, start, end);
    if (overlap) {
      return res.status(400).json({ 
        error: `El producto ID ${overlap.productId} ya tiene una oferta activa en esas fechas.` 
      });
    }

    const newOffer = await createOfferService({
      name, startDate: start, endDate: end, discountType, discountValue, productIds
    });

    res.status(201).json({ message: 'Separata creada con éxito', data: newOffer });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la separata' });
  }
};