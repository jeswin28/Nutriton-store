import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface CartPageProps {
  onNavigate: (page: string) => void;
}

export const CartPage = ({ onNavigate }: CartPageProps) => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, loading } = useCart();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">Please Sign In</h2>
          <p className="text-gray-600 mb-6">Sign in to view your cart and checkout</p>
          <button
            onClick={() => onNavigate('login')}
            className="px-8 py-3 bg-gradient-to-r from-[#00C896] to-[#1A1A1A] text-white rounded-lg font-bold hover:opacity-90"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C896]"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started</p>
          <button
            onClick={() => onNavigate('shop')}
            className="px-8 py-3 bg-gradient-to-r from-[#00C896] to-[#1A1A1A] text-white rounded-lg font-bold hover:opacity-90"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const shippingFee = cartTotal >= 999 ? 0 : 50;
  const tax = cartTotal * 0.18;
  const total = cartTotal + shippingFee + tax;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex space-x-4">
                  <img
                    src={item.products.images[0] || 'https://via.placeholder.com/150'}
                    alt={item.products.title}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />

                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-[#1A1A1A] mb-1">
                      {item.products.title}
                    </h3>
                    <p className="text-sm text-[#00C896] mb-2">{item.products.brand}</p>
                    <p className="text-xl font-bold text-[#1A1A1A]">
                      ₹{item.products.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-1 font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                        disabled={item.quantity >= item.products.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className={shippingFee === 0 ? 'text-green-600 font-semibold' : ''}>
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                  </span>
                </div>
                {shippingFee > 0 && (
                  <p className="text-xs text-gray-500">
                    Add ₹{(999 - cartTotal).toLocaleString()} more for free shipping
                  </p>
                )}
                <div className="flex justify-between text-gray-700">
                  <span>Tax (18% GST)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-[#1A1A1A]">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('checkout')}
                className="w-full py-3 bg-gradient-to-r from-[#00C896] to-[#1A1A1A] text-white rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => onNavigate('shop')}
                className="w-full py-2 mt-3 text-[#00C896] font-medium hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};