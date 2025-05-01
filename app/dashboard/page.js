'use client'
import { useState, useEffect, useRef } from 'react';
import getCookie from '../lib/cookie';

export default function Dashboard() {
  const [form, setForm] = useState({ name: '', price: '', description: '', imageFileName: '' });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [username, setUsername] = useState('');
  const imageInputRef = useRef();

  useEffect(() => {
    setUsername(getCookie('username'));
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to fetch products');
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('price', form.price);
      formData.append('description', form.description);
      formData.append('username', username);
      if (imageInputRef.current.files[0]) {
        formData.append('image', imageInputRef.current.files[0]);
      }
      const res = await fetch('/api/products', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add product');
      setSuccess('Product added!');
      setForm({ name: '', price: '', description: '', imageFileName: '' });
      if (imageInputRef.current) imageInputRef.current.value = '';
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  function handleImageChange(e) {
    setForm(f => ({ ...f, imageFileName: e.target.files[0]?.name || '' }));
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="mb-4 text-right text-gray-700 font-semibold">
        Logged in as: <span className="text-blue-700">{username || 'Guest'}</span>
      </div>
      <h1 className="text-2xl font-bold mb-6">Dashboard: Upload Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow" encType="multipart/form-data">
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Product Name"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          required
        />
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Price"
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
          required
        />
        <div>
          <button
            type="button"
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 font-semibold"
            onClick={() => imageInputRef.current && imageInputRef.current.click()}
          >
            Upload Image
          </button>
          <input
            type="file"
            accept="image/*"
            ref={imageInputRef}
            className="hidden"
            onChange={handleImageChange}
          />
          {form.imageFileName && (
            <span className="ml-2 text-sm text-gray-600">{form.imageFileName}</span>
          )}
        </div>
        <textarea
          className="w-full border px-3 py-2 rounded"
          placeholder="Description"
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Product'}
        </button>
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
      </form>
      <h2 className="text-xl font-semibold mt-10 mb-4">Your Products</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-4">
          {products.length === 0 && <div>No products yet.</div>}
          {products.map(p => (
            <div key={p.id} className="border rounded p-4 bg-white flex gap-4 items-center">
              {p.image_url && <img src={p.image_url} alt={p.name} className="w-16 h-16 object-cover rounded" />}
              <div>
                <div className="font-bold">{p.name}</div>
                <div className="text-blue-700 font-semibold">${p.price}</div>
                <div className="text-gray-500 text-sm">{p.description}</div>
                <div className="text-xs text-gray-400">By: {p.username}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 