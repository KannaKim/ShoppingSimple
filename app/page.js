'use client'
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import getCookie from "./lib/cookie";

const products = [
  { id: 1, name: "Red Chair", price: 49.99, userId: "user123", image: "/res/product-1.jpg" },
  { id: 2, name: "Tall Lamp", price: 89.99, userId: "user456", image: "/res/product-1.jpg" },
  { id: 3, name: "Blue Sofa", price: 199.99, userId: "user789", image: "/res/product-1.jpg" },
  { id: 4, name: "Coffee Table", price: 59.99, userId: "user321", image: "/res/product-1.jpg" },
  { id: 5, name: "Small Plant", price: 15.99, userId: "user654", image: "/res/product-1.jpg" },
  { id: 6, name: "Bookshelf", price: 120.00, userId: "user987", image: "/res/product-1.jpg" },
];

function LoginButton({ username, onLogout }) {
  if (username !== "") {
    return (
      <div className="flex items-center gap-2">
        <button className="ml-2 bg-gray-900 text-white px-4 py-2 rounded-md font-semibold shadow-sm cursor-default" disabled>{username}</button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-semibold shadow-sm"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    );
  }
  return (
    <button className="ml-2 bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors font-semibold shadow-sm">
      <Link href="/login" className="flex items-center">
        Login
      </Link>
    </button>
  );
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [username, setUsername] = useState("");
  useEffect(() => {
    setUsername(getCookie("username"));
  }, []);

  // Logout handler: clear the username cookie and update state
  function handleLogout() {
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setUsername("");
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sticky Top Bar */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="text-xl font-bold text-blue-700 tracking-tight">ShopModern</div>
          <form
            className="flex flex-1 mx-6 max-w-md"
            onSubmit={e => { e.preventDefault(); }}
          >
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white shadow-sm"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors font-semibold shadow-sm"
            >
              Search
            </button>
          </form>
          <LoginButton username={username} onLogout={handleLogout} />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">Discover Great Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="flex flex-col items-center bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 p-4 group aspect-square justify-between"
            >
              <div className="w-full flex-1 flex items-center justify-center">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="object-cover rounded-lg w-full h-full max-h-40 group-hover:scale-105 transition-transform bg-gray-100 border"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/200'; }}
                />
              </div>
              <div className="w-full mt-4 flex flex-col items-center">
                <div className="font-semibold text-lg text-gray-900 truncate text-center">{product.name}</div>
                <div className="text-gray-500 text-sm mb-1 truncate text-center">Seller: {product.userId}</div>
                <div className="text-blue-700 font-bold text-xl">${product.price.toFixed(2)}</div>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center text-gray-400 py-12">No products found.</div>
          )}
        </div>
      </main>
    </div>
  );
}
