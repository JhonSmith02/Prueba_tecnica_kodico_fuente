import { DiscountFactory, DirectDiscountStrategy, PercentageDiscountStrategy } from '../src/strategies/discount.strategy.js';

describe('Discount Strategy Pattern', () => {
  it('Debe calcular correctamente el descuento directo', () => {
    const strategy = new DirectDiscountStrategy();
    // Precio base 100, cantidad 2, descuento 20 por unidad
    // (100 - 20) * 2 = 160
    const total = strategy.calculateTotal(100, 2, 20);
    expect(total).toBe(160);
  });

  it('Debe calcular correctamente el descuento por porcentaje', () => {
    const strategy = new PercentageDiscountStrategy();
    // Precio base 100, cantidad 2, descuento 15%
    // 100 - 15% = 85. 85 * 2 = 170
    const total = strategy.calculateTotal(100, 2, 15);
    expect(total).toBe(170);
  });

  it('La fábrica debe retornar la estrategia correcta', () => {
    const directStrategy = DiscountFactory.getStrategy('DIRECT');
    const percentStrategy = DiscountFactory.getStrategy('PERCENTAGE');

    expect(directStrategy).toBeInstanceOf(DirectDiscountStrategy);
    expect(percentStrategy).toBeInstanceOf(PercentageDiscountStrategy);
  });

  it('La fábrica debe lanzar error si el tipo no existe', () => {
    expect(() => {
    // @ts-expect-error: Forzando un tipo invalido para el test
      DiscountFactory.getStrategy('INVALID');
    }).toThrow('Tipo de descuento no soportado: INVALID');
  });
});