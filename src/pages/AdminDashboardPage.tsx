import { useEffect, useState } from 'react';
import { Package, ShoppingCart, Users, TrendingUp, Plus } from 'lucide-react';
import { Product, Order, fetchProducts, fetchOrdersByUserId, addProduct, deleteProduct, updateOrderStatus } from '../lib/firebaseApi';
import { ProtectedRoute } from '../components/ProtectedRoute';

interface AdminDashboardPageProps {
  onNavigate: (page: string) => void;
}

const AdminDashboardContent = ({ onNavigate }: AdminDashboardPageProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    brand: '',
    category: 'Protein',
    price: '',
    description: '',
    stock: '',
    weight: '',
    flavor: '',
    images: 'https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const [productsData, ordersData] = await Promise.all([
      fetchProducts(),
      fetchOrdersByUserId('mock-admin-id'), // Admin fetches ALL orders (mock implementation fetches all)
    ]);
    
    // In a real Firebase app, products and orders would be fetched via separate APIs/queries

    if (productsData) setProducts(productsData);
    if (ordersData) {
      setOrders(ordersData);
      const revenue = ordersData.reduce((sum, order) => sum + order.total, 0);
      setStats({
        totalProducts: productsData?.length || 0,
        totalOrders: ordersData.length,
        totalRevenue: revenue,
      });
    }

    setLoading(false);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await addProduct({
          ...newProduct,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock),
          images: [newProduct.images],
          is_featured: false,
          ingredients: null,
          nutrition_facts: null,
          weight: newProduct.weight || null,
          flavor: newProduct.flavor || null,
        });

        setShowAddProduct(false);
        fetchData();
        setNewProduct({
            title: '', brand: '', category: 'Protein', price: '', description: '',
            stock: '', weight: '', flavor: '',
            images: 'https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg',
        });
    } catch (error: any) {
        alert('Error adding product: ' + (error.message || 'Unknown error'));
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        await deleteProduct(id);
        fetchData();
    } catch (error: any) {
        alert('Error deleting product: ' + (error.message || 'Unknown error'));
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      fetchData();
    } catch (error: any) {
      alert('Error updating order: ' + (error.message || 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C896]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Products</p>
                <p className="text-3xl font-bold text-[#1A1A1A]">{stats.totalProducts}</p>
              </div>
              <Package className="w-12 h-12 text-[#00C896]" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-[#1A1A1A]">{stats.totalOrders}</p>
              </div>
              <ShoppingCart className="w-12 h-12 text-[#00C896]" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-[#1A1A1A]">
                  ₹{stats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-[#00C896]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#1A1A1A]">Products</h2>
            <button
              onClick={() => setShowAddProduct(!showAddProduct)}
              className="flex items-center space-x-2 px-4 py-2 bg-[#00C896] text-white rounded-lg hover:opacity-90"
            >
              <Plus className="w-5 h-5" />
              <span>Add Product</span>
            </button>
          </div>

          {showAddProduct && (
            <form onSubmit={handleAddProduct} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Product Title *"
                  required
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Brand *"
                  required
                  value={newProduct.brand}
                  onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                />
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                >
                  <option>Protein</option>
                  <option>Pre-Workout</option>
                  <option>Creatine</option>
                  <option>Vitamins</option>
                  <option>Snacks</option>
                </select>
                <input
                  type="number"
                  placeholder="Price *"
                  required
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Stock *"
                  required
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Weight (e.g., 1kg)"
                  value={newProduct.weight}
                  onChange={(e) => setNewProduct({ ...newProduct, weight: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Flavor"
                  value={newProduct.flavor}
                  onChange={(e) => setNewProduct({ ...newProduct, flavor: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                />
                <textarea
                  placeholder="Description *"
                  required
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="px-4 py-2 border rounded-lg col-span-2"
                  rows={3}
                />
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#00C896] text-white rounded-lg hover:opacity-90"
                >
                  Add Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-10 h-10 rounded object-cover mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.title}</div>
                          <div className="text-sm text-gray-500">{product.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Recent Orders</h2>
          <div className="space-y-4">
            {orders.slice(0, 10).map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold">Order #{order.order_number}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{order.total.toLocaleString()}</p>
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      className="mt-1 text-sm border rounded px-2 py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminDashboardPage = (props: AdminDashboardPageProps) => {
  return (
    <ProtectedRoute requireAdmin onUnauthorized={() => props.onNavigate('home')}>
      <AdminDashboardContent {...props} />
    </ProtectedRoute>
  );
};