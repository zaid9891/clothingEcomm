import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  featured: boolean;
  brand: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/products/${product._id}`}>
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.images[0] || 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          {product.featured && (
            <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Featured
            </span>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            <Link to={`/products/${product._id}`} className="hover:text-blue-600 transition-colors">
              {product.name}
            </Link>
          </h3>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">4.5</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 capitalize">{product.brand}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <Link
            to={`/products/${product._id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Add to Cart</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;