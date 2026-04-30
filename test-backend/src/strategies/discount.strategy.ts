// src/strategies/discount.strategy.ts

// Retorna el precio TOTAL por esa cantidad de productos.
export interface DiscountStrategy {
  calculateTotal(basePrice: number, quantity: number, discountValue: number): number;
}

//Estrategia actual: Descuento Directo (Aplica por cada unidad)
export class DirectDiscountStrategy implements DiscountStrategy {
  calculateTotal(basePrice: number, quantity: number, discountValue: number): number {
    const unitPrice = Math.max(0, basePrice - discountValue);
    return unitPrice * quantity;
  }
}

// Estrategia actual: Porcentaje (Aplica por cada unidad)
export class PercentageDiscountStrategy implements DiscountStrategy {
  calculateTotal(basePrice: number, quantity: number, discountValue: number): number {
    const discountAmount = basePrice * (discountValue / 100);
    const unitPrice = Math.max(0, basePrice - discountAmount);
    return unitPrice * quantity;
  }
}

// Si mañana te piden un 2x1, el equipo solo tendría que crear esto sin tocar el resto del sistema:
/*
export class TwoForOneStrategy implements DiscountStrategy {
  calculateTotal(basePrice: number, quantity: number, discountValue: number): number {
    // Si lleva 3, paga 2. Si lleva 4, paga 2.
    const payableQuantity = Math.ceil(quantity / 2); 
    return basePrice * payableQuantity;
  }
}
*/

// 4. LA FÁBRICA
export class DiscountFactory {
  static getStrategy(type: 'DIRECT' | 'PERCENTAGE'): DiscountStrategy {
    switch (type) {
      case 'DIRECT':
        return new DirectDiscountStrategy();
      case 'PERCENTAGE':
        return new PercentageDiscountStrategy();
      default:
        throw new Error(`Tipo de descuento no soportado: ${type}`);
    }
  }
}