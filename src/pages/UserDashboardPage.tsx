import { useEffect, useState } from 'react';
import { Package, User as UserIcon } from 'lucide-react';
import { Order, fetchOrdersByUserId } from '../lib/firebaseApi';
import { useAuth } from '../contexts/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';

interface UserDashboardPageProps {
  onNavigate: (page: string) => void;
}

const UserDashboardContent = ({ onNavigate }: UserDashboardPageProps) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    setLoading(true);
    try {
        const data = await fetchOrdersByUserId(user.id);
        setOrders(data || []);
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C896]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1A1A1A]">My Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.full_name}!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#00C896] to-[#1A1A1A] rounded-full flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#1A1A1A]">{user?.full_name}</h3>
                  <p className="text-sm text-gray-600">{user?.role}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  <span className="font-medium">Phone:</span> {user?.phone || 'Not provided'}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Member since:</span>{' '}
                  {user && new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#1A1A1A]">My Orders</h2>
                <Package className="w-6 h-6 text-[#00C896]" />
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">You haven't placed any orders yet</p>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="px-6 py-2 bg-[#00C896] text-white rounded-lg hover:opacity-90"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-[#1A1A1A]">
                            Order #{order.order_number}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(order.created_at).toLocaleDateString()} at{' '}
                            {new Date(order.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Total Amount</p>
                          <p className="font-semibold text-[#1A1A1A]">
                            ₹{order.total.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Payment Status</p>
                          <p className="font-semibold text-[#1A1A1A] capitalize">
                            {order.payment_status}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Payment Method</p>
                          <p className="font-semibold text-[#1A1A1A] uppercase">
                            {order.payment_method}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Items</p>
                          <p className="font-semibold text-[#1A1A1A]">
                            {/* This is a placeholder for item count calculation */}
                            {Math.round(order.subtotal / 2500)} items
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const UserDashboardPage = (props: UserDashboardPageProps) => {
  return (
    <ProtectedRoute onUnauthorized={() => props.onNavigate('login')}>
      <UserDashboardContent {...props} />
    </ProtectedRoute>
  );
};