import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, CheckCircle2, ShieldCheck, DollarSign, BarChart3, Settings, FolderTree, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import {
  categoriesAPI,
  adminAPI,
  couponsAPI,
  reviewsAPI,
  deliveryAPI,
  authAPI,
} from '../../api/endpoints';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

export function AdminLogin() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('admin@gifto.pk');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.login({ email, password });
      if (res.success) {
        if (res.user.role === 'CUSTOMER') {
          toast.error('Access restricted to store staff and super admin');
          return;
        }
        setAuth(res.user, res.tokens.accessToken);
        toast.success('Authenticated as Admin');
        navigate('/admin/dashboard');
      }
    } catch (err) {
      toast.error('Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl max-w-md w-full space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <span className="text-3xl">👑</span>
          <h1 className="font-display text-2xl font-bold text-gray-900">Gifto Admin Portal</h1>
          <p className="text-xs text-gray-500">Log in with manager or super admin credentials</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-50 border rounded-xl p-3" />
          </div>
          <div>
            <label className="font-bold text-gray-700 block mb-1">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-50 border rounded-xl p-3" />
          </div>
          <button type="submit" disabled={loading} className="w-full gradient-teal text-white font-bold py-3.5 rounded-full text-xs shadow-md">
            {loading ? 'Authenticating...' : 'Sign In to Admin Dashboard'}
          </button>
        </form>

        <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-[11px] text-amber-800 text-center">
          Default Seed Admin: <strong>admin@gifto.pk</strong> / <strong>admin123</strong>
        </div>
      </div>
    </div>
  );
}

export function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [parentId, setParentId] = useState('');

  const fetchCats = async () => {
    const res = await categoriesAPI.getAll();
    if (res.success) setCategories(res.categories || []);
  };

  useEffect(() => { fetchCats(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name) return;
    try {
      await categoriesAPI.adminCreate({
        name,
        description,
        imageUrl,
        parentId: parentId || null,
      });
      toast.success(parentId ? 'Sub-category created! 🍰' : 'Top category created! 📁');
      setName('');
      setDescription('');
      setImageUrl('');
      setParentId('');
      fetchCats();
    } catch (err) {
      toast.error('Failed to create category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await categoriesAPI.adminDelete(id);
      toast.error('Category deleted');
      fetchCats();
    } catch (err) {
      toast.error('Failed to delete category');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Category & Sub-Category Builder</h1>
        <p className="text-xs text-gray-500">Create top categories or assign parent categories to create nested sub-categories (e.g. Lahore Cakes → Layers Bakeshop)</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* Form to Add Category or Sub-Category */}
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3 text-xs">
          <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2">
            Create Category / Sub-Category
          </h3>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Category Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Layers Bakeshop, Red Roses..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Parent Category (Select for Sub-Category)</label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-semibold text-gray-800"
            >
              <option value="">None — (Create as Top-Level Main Category)</option>
              {categories.map((cat) => (
                <React.Fragment key={cat.id}>
                  <option value={cat.id}>📁 {cat.name}</option>
                  {cat.children && cat.children.map((child) => (
                    <option key={child.id} value={child.id}>
                      &nbsp;&nbsp;&nbsp;&nbsp;↳ 🍰 {child.name}
                    </option>
                  ))}
                </React.Fragment>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Description (Optional)</label>
            <textarea
              rows={2}
              placeholder="Short description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Image URL (Optional)</label>
            <input
              type="text"
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
            />
          </div>

          <button
            type="submit"
            className="w-full gradient-teal text-white font-bold py-3 rounded-full text-xs shadow-md mt-2"
          >
            {parentId ? '➕ Save Sub-Category' : '➕ Save Main Category'}
          </button>
        </form>

        {/* Nested Categories Tree Display */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 text-xs">
          <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2">
            Categories & Sub-Categories Tree
          </h3>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📁</span>
                    <strong className="font-bold text-gray-900 text-sm">{cat.name}</strong>
                    <span className="text-[10px] bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded-full">
                      {cat.children ? cat.children.length : 0} sub-categories
                    </span>
                  </div>
                  <button onClick={() => handleDelete(cat.id)} className="text-rose-500 font-bold hover:underline">
                    Delete
                  </button>
                </div>

                {/* Sub-categories nested list */}
                {cat.children && cat.children.length > 0 && (
                  <div className="pl-6 pt-1 space-y-1.5 border-l-2 border-teal-200">
                    {cat.children.map((child) => (
                      <div key={child.id} className="flex justify-between items-center bg-white p-2 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-1.5">
                          <ChevronRight className="w-3 h-3 text-teal-700" />
                          <span className="font-semibold text-gray-800">🍰 {child.name}</span>
                          {child.children && child.children.length > 0 && (
                            <span className="text-[9px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded">
                              ({child.children.length} items)
                            </span>
                          )}
                        </div>
                        <button onClick={() => handleDelete(child.id)} className="text-rose-500 text-[11px]">
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminCustomers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await adminAPI.getCustomers();
      if (res.success) setCustomers(res.customers);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-900">Customer Base ({customers.length})</h1>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-x-auto text-xs">
        <table className="w-full text-left min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase bg-gray-50">
              <th className="p-4 whitespace-nowrap">Customer Name</th>
              <th className="p-4 whitespace-nowrap">Email</th>
              <th className="p-4 whitespace-nowrap">Phone</th>
              <th className="p-4 whitespace-nowrap">Points</th>
              <th className="p-4 whitespace-nowrap">Orders Placed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="p-4 font-bold text-gray-900 whitespace-nowrap">{c.name}</td>
                <td className="p-4 whitespace-nowrap">{c.email}</td>
                <td className="p-4 whitespace-nowrap">{c.phone || 'N/A'}</td>
                <td className="p-4 font-bold text-amber-600 whitespace-nowrap">{c.points} PTS</td>
                <td className="p-4 whitespace-nowrap">{c.orders ? c.orders.length : 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [code, setCode] = useState('');
  const [value, setValue] = useState('10');

  const fetchCoupons = async () => {
    const res = await couponsAPI.adminGetAll();
    if (res.success) setCoupons(res.coupons);
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!code) return;
    try {
      await couponsAPI.adminCreate({ code, value });
      toast.success('Coupon created!');
      setCode('');
      fetchCoupons();
    } catch (err) {
      toast.error('Failed to create coupon');
    }
  };

  const handleDelete = async (id) => {
    try {
      await couponsAPI.adminDelete(id);
      toast.error('Coupon deleted');
      fetchCoupons();
    } catch (err) {
      toast.error('Failed to delete coupon');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-900">Coupons & Discount Codes</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3 text-xs">
          <h3 className="font-bold text-gray-900 text-sm">Create New Coupon</h3>
          <div>
            <label className="font-bold text-gray-700 block mb-1">Coupon Code</label>
            <input type="text" required placeholder="e.g. EID2026" value={code} onChange={(e) => setCode(e.target.value)} className="w-full bg-gray-50 border rounded-xl p-2.5 uppercase" />
          </div>
          <div>
            <label className="font-bold text-gray-700 block mb-1">Discount %</label>
            <input type="number" required value={value} onChange={(e) => setValue(e.target.value)} className="w-full bg-gray-50 border rounded-xl p-2.5" />
          </div>
          <button type="submit" className="w-full gradient-teal text-white font-bold py-2.5 rounded-full text-xs">Save Coupon Code</button>
        </form>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2 text-xs">
          <h3 className="font-bold text-gray-900 text-sm mb-3">Active Coupon Codes</h3>
          {coupons.map((c) => (
            <div key={c.id} className="p-3 bg-gray-50 rounded-xl flex justify-between items-center">
              <div>
                <span className="font-mono font-bold text-teal-800">{c.code}</span>
                <p className="text-[10px] text-gray-500">{c.value}% Off | Min Order PKR {c.minOrderAmount}</p>
              </div>
              <button onClick={() => handleDelete(c.id)} className="text-rose-500 font-bold">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminReviews() {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    const res = await reviewsAPI.adminGetAll();
    if (res.success) setReviews(res.reviews);
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleDelete = async (id) => {
    try {
      await reviewsAPI.adminDelete(id);
      toast.error('Review deleted');
      fetchReviews();
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-900">Review Moderation</h1>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-x-auto text-xs">
        <table className="w-full text-left min-w-[750px]">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase bg-gray-50">
              <th className="p-4 whitespace-nowrap">Product</th>
              <th className="p-4 whitespace-nowrap">User</th>
              <th className="p-4 whitespace-nowrap">Rating</th>
              <th className="p-4 whitespace-nowrap">Comment</th>
              <th className="p-4 text-right whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
            {reviews.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="p-4 font-bold text-gray-900 whitespace-nowrap">{r.product?.name}</td>
                <td className="p-4 whitespace-nowrap">{r.user?.name}</td>
                <td className="p-4 font-bold text-amber-500 whitespace-nowrap">{r.rating} Stars</td>
                <td className="p-4 text-gray-600 min-w-[200px]">{r.comment}</td>
                <td className="p-4 text-right whitespace-nowrap">
                  <button onClick={() => handleDelete(r.id)} className="text-rose-500 font-bold">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminDeliveryZones() {
  const [zones, setZones] = useState([]);
  const [cityName, setCityName] = useState('');
  const [deliveryCharge, setDeliveryCharge] = useState('250');

  const fetchZones = async () => {
    const res = await deliveryAPI.adminGetAll();
    if (res.success) setZones(res.zones);
  };

  useEffect(() => { fetchZones(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!cityName) return;
    try {
      await deliveryAPI.adminCreate({ cityName, deliveryCharge });
      toast.success('City delivery zone added!');
      setCityName('');
      fetchZones();
    } catch (err) {
      toast.error('Failed to add city delivery zone');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deliveryAPI.adminDelete(id);
      toast.error('Zone deleted');
      fetchZones();
    } catch (err) {
      toast.error('Failed to delete zone');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-900">Pakistani City Delivery Zones</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3 text-xs">
          <h3 className="font-bold text-gray-900 text-sm">Add New City Zone</h3>
          <div>
            <label className="font-bold text-gray-700 block mb-1">City Name</label>
            <input type="text" required placeholder="e.g. Abbottabad" value={cityName} onChange={(e) => setCityName(e.target.value)} className="w-full bg-gray-50 border rounded-xl p-2.5" />
          </div>
          <div>
            <label className="font-bold text-gray-700 block mb-1">Delivery Charge (PKR)</label>
            <input type="number" required value={deliveryCharge} onChange={(e) => setDeliveryCharge(e.target.value)} className="w-full bg-gray-50 border rounded-xl p-2.5" />
          </div>
          <button type="submit" className="w-full gradient-teal text-white font-bold py-2.5 rounded-full text-xs">Save Delivery Zone</button>
        </form>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2 text-xs">
          <h3 className="font-bold text-gray-900 text-sm mb-3">Active Delivery Zones</h3>
          {zones.map((z) => (
            <div key={z.id} className="p-3 bg-gray-50 rounded-xl flex justify-between items-center">
              <span className="font-bold text-gray-900">📍 {z.cityName}</span>
              <div className="flex items-center gap-3">
                <span className="font-bold text-teal-800">PKR {z.deliveryCharge}</span>
                <button onClick={() => handleDelete(z.id)} className="text-rose-500 font-bold">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminReports() {
  const [cityData, setCityData] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await adminAPI.getSalesReport();
      if (res.success) setCityData(res.revenueByCity || []);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-900">Sales Reports & City Revenue Breakdown</h1>
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 text-sm">Revenue by Pakistani Delivery City (PKR)</h3>
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cityData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="city" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip formatter={(val) => [`PKR ${val.toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#0F766E" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export function AdminSettings() {
  const [settings, setSettings] = useState({
    SITE_NAME: 'Gifto — Premium Gift Delivery Pakistan',
    CONTACT_PHONE: '+92 300 1234567',
    CONTACT_EMAIL: 'support@gifto.pk',
    SUPPORT_HOURS: '10:00 AM – 12:00 AM PST (7 Days a Week)',
    NTN_NUMBER: 'NTN # 8492019-3',
  });

  useEffect(() => {
    async function load() {
      const res = await adminAPI.getSettings();
      if (res.success) setSettings((prev) => ({ ...prev, ...res.settings }));
    }
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = Object.keys(settings).map((k) => ({ key: k, value: settings[k] }));
      await adminAPI.updateSettings({ settings: payload });
      toast.success('Site settings updated!');
    } catch (err) {
      toast.error('Failed to update site settings');
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-900">Site Settings & Business Profile</h1>
      <form onSubmit={handleSave} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 text-xs">
        <div>
          <label className="font-bold text-gray-700 block mb-1">Site Title</label>
          <input type="text" value={settings.SITE_NAME} onChange={(e) => setSettings({ ...settings, SITE_NAME: e.target.value })} className="w-full bg-gray-50 border rounded-xl p-2.5 font-semibold" />
        </div>
        <div>
          <label className="font-bold text-gray-700 block mb-1">Support Phone / WhatsApp</label>
          <input type="text" value={settings.CONTACT_PHONE} onChange={(e) => setSettings({ ...settings, CONTACT_PHONE: e.target.value })} className="w-full bg-gray-50 border rounded-xl p-2.5" />
        </div>
        <div>
          <label className="font-bold text-gray-700 block mb-1">Support Email</label>
          <input type="text" value={settings.CONTACT_EMAIL} onChange={(e) => setSettings({ ...settings, CONTACT_EMAIL: e.target.value })} className="w-full bg-gray-50 border rounded-xl p-2.5" />
        </div>
        <div>
          <label className="font-bold text-gray-700 block mb-1">Support Hours</label>
          <input type="text" value={settings.SUPPORT_HOURS} onChange={(e) => setSettings({ ...settings, SUPPORT_HOURS: e.target.value })} className="w-full bg-gray-50 border rounded-xl p-2.5" />
        </div>
        <div>
          <label className="font-bold text-gray-700 block mb-1">FBR / NTN Registration Number</label>
          <input type="text" value={settings.NTN_NUMBER} onChange={(e) => setSettings({ ...settings, NTN_NUMBER: e.target.value })} className="w-full bg-gray-50 border rounded-xl p-2.5 font-mono" />
        </div>
        <button type="submit" className="w-full gradient-teal text-white font-bold py-3 rounded-full text-xs shadow-md">
          Save Settings
        </button>
      </form>
    </div>
  );
}
