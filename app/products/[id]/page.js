'use client';
import { useEffect, useState } from 'react';
import { redirect, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import getCookie from '../../lib/cookie';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    if (!getCookie("session")) {
      redirect("/login");
    }
  }, []);

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: id,
          name: product.name,
          sessionCookie: getCookie("session")
        }),
      })
      const data = await res.json();
      console.log("data");
      console.log(data);
      window.location.href = data.url
    } catch (err) {
      setError(err.message);
      console.error('Error during checkout:', err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-12">Error: {error}</div>;
  if (!product) return <div className="text-center py-12">Product not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link 
          href="/"
          className="text-blue-600 hover:text-blue-700 mb-6 inline-flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to products
        </Link>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-6">
              <div className="relative aspect-square w-full">
                <Image
                  src={product.img_filepath}
                  alt={product.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
            <div className="flex flex-col md:w-1/2 p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="text-2xl font-bold text-blue-600 mb-4">${parseFloat(product.price).toFixed(2)}</div>
              <div className="text-gray-500 text-sm mb-4">Seller: {product.username}</div>
              <div className="text-gray-600 text-sm mb-4">Quantity Available: {product.quantity}</div>
              <div className="prose max-w-none">
                <p className="text-gray-700">{product.description}</p>
              </div>
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="cursor-pointer mt-auto bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkoutLoading ? 'Processing...' : 'Checkout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 