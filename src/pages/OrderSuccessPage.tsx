import { useEffect, useState } from 'react';
import { CheckCircle, Package, Home } from 'lucide-react';
import { Order, fetchOrderById } from '../lib/firebaseApi';

interface OrderSuccessPageProps {
  orderId: string;
  onNavigate: (page: string) => void;
}

export const OrderSuccessPage = ({ orderId, onNavigate }: OrderSuccessPageProps) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
        const data = await fetchOrderById(orderId);
        setOrder(data);
    } catch (error) {
        console.error('Error fetching order:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C896]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-2 bg-[#00C896] text-white rounded-lg hover:opacity-90"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-4">
            Order Placed Successfully!
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-left">
                <p className="text-sm text-gray-600 mb-1">Order Number</p>
                <p className="text-lg font-bold text-[#1A1A1A]">{order.order_number}</p>
              </div>

              <div className="text-left">
                <p className="text-sm text-gray-600 mb-1">Order Date</p>
                <p className="text-lg font-bold text-[#1A1A1A]">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="text-left">
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-lg font-bold text-[#1A1A1A]">
                  ₹{order.total.toLocaleString()}
                </p>
              </div>

              <div className="text-left">
                <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                <p className="text-lg font-bold text-green-600 capitalize">
                  {order.payment_status}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-green-800">
              A confirmation email has been sent to your registered email address with order details and tracking information.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3 bg-gradient-to-r from-[#00C896] to-[#1A1A1A] text-white rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
            >
              <Package className="w-5 h-5" />
              <span>Track Order</span>
            </button>

            <button
              onClick={() => onNavigate('home')}
              className="px-6 py-3 bg-white border-2 border-[#00C896] text-[#00C896] rounded-lg font-bold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};