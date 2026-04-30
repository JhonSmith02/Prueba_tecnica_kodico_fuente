// src/types/index.ts

export interface Product {
  id: number;
  name: string;
  basePrice: number;
  finalPrice?: number;
  appliedOffer?: string | null;
}

export interface CreateOfferPayload {
  name: string;
  startDate: string;
  endDate: string;
  discountType: 'DIRECT' | 'PERCENTAGE';
  discountValue: number;
  productIds: number[];
}