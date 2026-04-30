import { Request, Response } from 'express';
import { createProductService, getProductsWithActiveOffersService } from '../services/product.service.js';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, basePrice } = req.body;
    const newProduct = await createProductService(name, basePrice);
    res.status(201).json({ message: 'Producto creado exitosamente', data: newProduct });
  } catch (_error) {
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await getProductsWithActiveOffersService();
    res.json({ data: products });
  } catch (_error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};