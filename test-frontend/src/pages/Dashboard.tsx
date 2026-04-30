import { useEffect, useState } from 'react';
import { api } from '../api/axios';
import type { Product } from '../types/intex.js';

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price);
  };

  if (loading) return <div className="text-center mt-20 text-gray-500">Cargando inventario POS...</div>;

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Catálogo de Productos</h2>
        <p className="text-gray-500 text-sm mt-1">Gestión de precios y ofertas activas (Módulo POS)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                ID: {product.id}
              </span>
            </div>

            <div className="space-y-2">
              {product.appliedOffer ? (
                <>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-400 line-through">Base: {formatPrice(product.basePrice)}</span>
                    <span className="text-2xl font-bold text-green-600">{formatPrice(product.finalPrice!)}</span>
                  </div>
                  <div className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-md border border-orange-100">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    Oferta Activa: {product.appliedOffer}
                  </div>
                </>
              ) : (
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Precio de venta</span>
                  <span className="text-2xl font-bold text-gray-800">{formatPrice(product.basePrice)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}