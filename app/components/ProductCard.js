import Image from "next/image";
import Link from 'next/link';

export default function ProductCard({ product }) {
  return (
    <Link 
      href={`/products/${product.id}`}
      className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
    >
      <div className="relative aspect-square w-full">
          <Image
            src={product.img_filepath}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            onError={() => setImgError(true)}
          />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
          {product.name}
        </h3>
        <div className="text-gray-500 text-sm mb-1">Seller: {product.username}</div>
        <p className="text-blue-600 font-bold mt-1">
          ${parseFloat(product.price).toFixed(2)}
        </p>
      </div>
    </Link>
  );
} 