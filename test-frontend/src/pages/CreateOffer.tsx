import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axios';
import type { Product } from '../types/intex';

export default function CreateOffer() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    productIds: [] as number[]
  });

  useEffect(() => {
    // Cargamos los productos para los checkboxes
    api.get('/products').then(res => setProducts(res.data.data)).catch(console.error);
  }, []);

  const handleCheckbox = (id: number) => {
    setFormData(prev => ({
      ...prev,
      productIds: prev.productIds.includes(id) 
        ? prev.productIds.filter(pId => pId !== id)
        : [...prev.productIds, id]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        discountValue: Number(formData.discountValue)
      };
      await api.post('/offers', payload);
      navigate('/'); // Volvemos al catálogo si hay éxito
    } catch (err: any) {
      // Aquí capturamos la regla de negocio del Backend (Traslape de fechas)
      setError(err.response?.data?.error || 'Error al crear la separata');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Crear Nueva Separata (Oferta)</h2>
        <p className="text-gray-500 text-sm mt-1">Configure las reglas de promoción para el punto de venta.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 font-medium text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Promoción</label>
            <input required type="text" className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ej: Aniversario Supermercado" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
            <input required type="datetime-local" className="w-full border border-gray-300 rounded-md p-2" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin</label>
            <input required type="datetime-local" className="w-full border border-gray-300 rounded-md p-2" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Descuento</label>
            <select className="w-full border border-gray-300 rounded-md p-2" value={formData.discountType} onChange={e => setFormData({...formData, discountType: e.target.value})}>
              <option value="PERCENTAGE">Porcentaje (%)</option>
              <option value="DIRECT">Monto Fijo Directo ($)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valor del Descuento</label>
            <input required type="number" min="1" className="w-full border border-gray-300 rounded-md p-2" value={formData.discountValue} onChange={e => setFormData({...formData, discountValue: e.target.value})} placeholder="Ej: 15" />
          </div>
        </div>

        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">Productos que aplicarán en la oferta</label>
          <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded bg-gray-50">
            {products.map(product => (
              <label key={product.id} className="flex items-center space-x-3 bg-white p-2 border rounded cursor-pointer hover:bg-blue-50 transition">
                <input type="checkbox" className="h-4 w-4 text-blue-600 rounded border-gray-300" checked={formData.productIds.includes(product.id)} onChange={() => handleCheckbox(product.id)} />
                <span className="text-sm text-gray-700 font-medium">{product.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button type="button" onClick={() => navigate('/')} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancelar</button>
          <button type="submit" disabled={formData.productIds.length === 0} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400">Crear Separata</button>
        </div>
      </form>
    </div>
  );
}