import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/common/ProductCard';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useAuthStore } from '../../store/useAuthStore';
import { authAPI } from '../../api/endpoints';
import toast from 'react-hot-toast';

export function Wishlist() {
  const { wishlist } = useWishlistStore();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-900">My Wishlist ({wishlist.length})</h1>
      {wishlist.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-100">
          <p className="text-gray-500 text-xs">Your wishlist is empty. Save products by clicking the heart icon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // New address state
  const [label, setLabel] = useState('Home');
  const [city, setCity] = useState('Lahore');
  const [addressLine, setAddressLine] = useState('');
  const [phone, setPhone] = useState('');

  const fetchAddresses = async () => {
    try {
      const res = await authAPI.getAddresses();
      if (res.success) setAddresses(res.addresses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!addressLine || !phone) return;
    try {
      const res = await authAPI.addAddress({ label, city, addressLine, phone, isDefault: addresses.length === 0 });
      if (res.success) {
        toast.success('Address saved!');
        setAddressLine('');
        setPhone('');
        fetchAddresses();
      }
    } catch (err) {
      toast.error('Failed to add address');
    }
  };

  const handleDelete = async (id) => {
    try {
      await authAPI.deleteAddress(id);
      toast.error('Address deleted');
      fetchAddresses();
    } catch (err) {
      toast.error('Failed to delete address');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <h1 className="font-display text-2xl font-bold text-gray-900">Saved Delivery Addresses</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <h3 className="font-bold text-gray-900 text-sm">Add New Address</h3>
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Address Label</label>
            <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Home / Office / Mom's House" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">City</label>
            <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold">
              {['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Gujranwala', 'Sialkot', 'Peshawar', 'Hyderabad'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Street Address</label>
            <input required type="text" value={addressLine} onChange={(e) => setAddressLine(e.target.value)} placeholder="House #, Street..." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Contact Phone</label>
            <input required type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+92 300 1234567" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs" />
          </div>
          <button type="submit" className="w-full gradient-teal text-white font-bold py-2.5 rounded-full text-xs shadow-md">
            Save Address
          </button>
        </form>

        <div className="space-y-3">
          <h3 className="font-bold text-gray-900 text-sm">Saved Addresses</h3>
          {addresses.length === 0 ? (
            <p className="text-xs text-gray-500">No saved addresses.</p>
          ) : (
            addresses.map((a) => (
              <div key={a.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-start text-xs">
                <div>
                  <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">{a.label}</span>
                  <p className="font-bold text-gray-900 pt-1">{a.city}</p>
                  <p className="text-gray-600">{a.addressLine}</p>
                  <p className="text-gray-400">Phone: {a.phone}</p>
                </div>
                <button onClick={() => handleDelete(a.id)} className="text-rose-500 font-bold">Delete</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export function Profile() {
  const { user, updateUser } = useAuthStore();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.updateProfile({ name, phone });
      if (res.success) {
        updateUser({ name, phone });
        toast.success('Profile updated successfully');
      }
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-900">Account Profile</h1>
      <form onSubmit={handleUpdate} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">Email (Cannot be changed)</label>
          <input type="text" disabled value={user?.email || ''} className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-xs text-gray-500 font-semibold" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">Full Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">Mobile Phone</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs" />
        </div>
        <button type="submit" disabled={loading} className="w-full gradient-teal text-white font-bold py-3 rounded-full text-xs shadow-md">
          {loading ? 'Saving...' : 'Save Profile Changes'}
        </button>
      </form>
    </div>
  );
}
