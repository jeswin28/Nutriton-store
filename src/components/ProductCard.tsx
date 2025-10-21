import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '../lib/firebaseTypes';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onNavigate: (page: string, productId?: string) => void;
}

export const ProductCard = ({ product, onNavigate }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { user, isAdmin } = useAuth(); 
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || isAdmin) { // BLOCK ADMIN ADD TO CART
      if (!user) onNavigate('login');
      return;
    }

    setIsAdding(true);
    try {
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  return (
    <div
      onClick={() => onNavigate('product', product.id)}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
    >
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.images[0] || 'https://via.placeholder.com/400'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {discount}% OFF
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-bold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="text-sm text-[#00C896] font-semibold mb-1">{product.brand}</div>
        <h3 className="text-lg font-bold text-[#1A1A1A] mb-2 line-clamp-2 group-hover:text-[#00C896] transition-colors">
          {product.title}
        </h3>

        <div className="flex items-center space-x-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(product.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-sm text-gray-600 ml-1">({product.review_count})</span>
        </div>

        <div className="flex items-baseline space-x-2 mb-4">
          <span className="text-2xl font-bold text-[#1A1A1A]">
            ₹{product.price.toLocaleString()}
          </span>
          {product.compare_at_price && (
            <span className="text-sm text-gray-500 line-through">
              ₹{product.compare_at_price.toLocaleString()}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAdding || isAdmin} // DISABLED FOR ADMINS
          className="w-full py-2.5 bg-gradient-to-r from-[#00C896] to-[#1A1A1A] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>{isAdmin ? 'Admin View' : (isAdding ? 'Adding...' : 'Add to Cart')}</span>
        </button>
      </div>
    </div>
  );
};