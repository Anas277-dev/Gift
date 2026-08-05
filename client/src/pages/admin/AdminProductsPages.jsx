import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Upload } from 'lucide-react';
import { productsAPI, categoriesAPI } from '../../api/endpoints';
import toast from 'react-hot-toast';

const CITIES = [
  'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Gujranwala', 'Sialkot', 'Peshawar', 'Hyderabad'
];

export function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState('50');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [deliverableCities, setDeliverableCities] = useState(CITIES);
  const [isFeatured, setIsFeatured] = useState(false);

  const fetchProducts = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        productsAPI.getProducts({ search }),
        categoriesAPI.getAll(),
      ]);
      if (pRes.success) setProducts(pRes.products);
      if (cRes.success) {
        setCategories(cRes.categories);
        if (cRes.categories.length > 0 && !categoryId) {
          setCategoryId(cRes.categories[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setPrice('');
    setSalePrice('');
    setSku(`SKU-${Date.now().toString().slice(-6)}`);
    setStock('50');
    setImageUrl('https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80');
    setDeliverableCities(CITIES);
    setIsFeatured(false);
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setName(p.name);
    setDescription(p.description);
    setPrice(p.price);
    setSalePrice(p.salePrice || '');
    setSku(p.sku);
    setStock(p.stock);
    setCategoryId(p.categoryId);
    setImageUrl(p.images && p.images[0] ? p.images[0] : '');
    setDeliverableCities(p.deliverableCities || CITIES);
    setIsFeatured(p.isFeatured);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!name || !price || !categoryId) {
      toast.error('Please fill in required fields');
      return;
    }

    const payload = {
      name,
      description,
      price: parseFloat(price),
      salePrice: salePrice ? parseFloat(salePrice) : null,
      sku,
      stock: parseInt(stock, 10),
      categoryId,
      images: [imageUrl],
      deliverableCities,
      isFeatured,
    };

    try {
      if (editingProduct) {
        await productsAPI.adminUpdate(editingProduct.id, payload);
        toast.success('Product updated!');
      } else {
        await productsAPI.adminCreate(payload);
        toast.success('Product created!');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productsAPI.adminDelete(id);
      toast.error('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-xs text-gray-500">Manage catalog prices, city deliverability, and inventory</p>
        </div>

        <button
          onClick={openCreateModal}
          className="gradient-teal text-white font-bold px-4 py-2.5 rounded-full text-xs flex items-center gap-2 shadow-md hover:opacity-95"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Search products by name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-full py-2.5 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-700"
        />
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase bg-gray-50">
              <th className="p-4">Product</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Price (PKR)</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Deliverable Cities</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={p.images && p.images[0] ? p.images[0] : 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100'}
                    alt={p.name}
                    className="w-10 h-10 rounded-lg object-cover border flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 line-clamp-1">{p.name}</p>
                    <span className="text-[10px] text-teal-700 font-semibold">{p.category?.name}</span>
                  </div>
                </td>
                <td className="p-4 font-mono text-gray-500">{p.sku}</td>
                <td className="p-4 font-bold text-gray-900 whitespace-nowrap">
                  {p.salePrice ? (
                    <span>
                      <span className="text-teal-800">PKR {p.salePrice.toLocaleString()}</span>{' '}
                      <span className="text-gray-400 line-through text-[10px]">PKR {p.price.toLocaleString()}</span>
                    </span>
                  ) : (
                    `PKR ${p.price.toLocaleString()}`
                  )}
                </td>
                <td className="p-4 font-bold whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${p.stock <= 5 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-700'}`}>
                    {p.stock} in stock
                  </span>
                </td>
                <td className="p-4 text-[10px] text-gray-500 whitespace-nowrap">
                  {p.deliverableCities ? p.deliverableCities.slice(0, 3).join(', ') + (p.deliverableCities.length > 3 ? '...' : '') : 'All'}
                </td>
                <td className="p-4 text-right space-x-2 whitespace-nowrap">
                  <button onClick={() => openEditModal(p)} className="p-1.5 text-gray-600 hover:text-teal-700">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-600 hover:text-rose-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 space-y-4 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 border rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-gray-50 border rounded-xl p-2.5 font-semibold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-50 border rounded-xl p-2.5"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Regular Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-gray-50 border rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Sale Price (Optional)</label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="w-full bg-gray-50 border rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-gray-50 border rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-gray-50 border rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Deliverable Cities</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-gray-50 p-3 rounded-xl max-h-36 overflow-y-auto">
                  {CITIES.map((city) => (
                    <label key={city} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={deliverableCities.includes(city)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setDeliverableCities([...deliverableCities, city]);
                          } else {
                            setDeliverableCities(deliverableCities.filter((c) => c !== city));
                          }
                        }}
                      />
                      {city}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="feat"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
                <label htmlFor="feat" className="font-bold text-gray-800">
                  Highlight on Homepage (Featured Deal)
                </label>
              </div>

              <button
                type="submit"
                className="w-full gradient-teal text-white font-bold py-3 rounded-full text-xs shadow-md mt-4"
              >
                Save Product Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
