import { useEffect, useState } from 'react';
import { Star, ShoppingCart, Minus, Plus, Package, Shield, Truck } from 'lucide-react';
import { supabase, Product, Review } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailsPageProps {
  productId: string;
  onNavigate: (page: string, productId?: string) => void;
}

export const ProductDetailsPage = ({ productId, onNavigate }: ProductDetailsPageProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'nutrition' | 'reviews'>('description');
  const [isAdding, setIsAdding] = useState(false);

  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [productId]);

  const fetchProduct = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching product:', error);
    } else if (data) {
      setProduct(data);
      fetchRelatedProducts(data.category);
    }
    setLoading(false);
  };

  const fetchRelatedProducts = async (category: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .neq('id', productId)
      .limit(4);

    if (!error && data) {
      setRelatedProducts(data);
    }
  };

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, users(full_name)')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setReviews(data as any);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      onNavigate('login');
      return;
    }

    setIsAdding(true);
    try {
      await addToCart(productId, quantity);
      setQuantity(1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C896]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <button
            onClick={() => onNavigate('shop')}
            className="px-6 py-2 bg-[#00C896] text-white rounded-lg hover:opacity-90"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate('shop')}
          className="text-[#00C896] hover:underline mb-6"
        >
          ← Back to Shop
        </button>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <div className="aspect-square rounded-lg overflow-hidden">
              <img
                src={product.images[0] || 'https://via.placeholder.com/600'}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-6">
              <div>
                <div className="text-sm text-[#00C896] font-semibold mb-2">{product.brand}</div>
                <h1 className="text-3xl font-bold text-[#1A1A1A] mb-4">{product.title}</h1>

                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating.toFixed(1)} ({product.review_count} reviews)
                  </span>
                </div>

                <div className="flex items-baseline space-x-3 mb-6">
                  <span className="text-4xl font-bold text-[#1A1A1A]">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.compare_at_price && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ₹{product.compare_at_price.toLocaleString()}
                      </span>
                      <span className="text-lg font-semibold text-red-500">
                        {Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>

                {product.stock > 0 ? (
                  <div className="text-green-600 font-medium mb-6">
                    In Stock ({product.stock} available)
                  </div>
                ) : (
                  <div className="text-red-600 font-medium mb-6">Out of Stock</div>
                )}
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-3 hover:bg-gray-100 transition-colors"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || isAdding}
                  className="flex-1 py-3 bg-gradient-to-r from-[#00C896] to-[#1A1A1A] text-white rounded-lg font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
                </button>
              </div>

              <div className="space-y-3 pt-6 border-t">
                <div className="flex items-center space-x-3 text-sm">
                  <Truck className="w-5 h-5 text-[#00C896]" />
                  <span className="text-gray-700">Free shipping on orders above ₹999</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Shield className="w-5 h-5 text-[#00C896]" />
                  <span className="text-gray-700">100% genuine & authentic products</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Package className="w-5 h-5 text-[#00C896]" />
                  <span className="text-gray-700">Easy returns within 7 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-8">
              {['description', 'ingredients', 'nutrition', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`py-4 font-semibold capitalize border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-[#00C896] text-[#00C896]'
                      : 'border-transparent text-gray-600 hover:text-[#00C896]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8">
            {activeTab === 'description' && (
              <div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">Product Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">Ingredients</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.ingredients || 'Ingredients information not available.'}
                </p>
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">Nutrition Facts</h3>
                {product.nutrition_facts ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(product.nutrition_facts).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 capitalize">{key}</div>
                        <div className="text-lg font-bold text-[#1A1A1A]">{value as string}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-700">Nutrition facts not available.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-6">Customer Reviews</h3>
                {reviews.length === 0 ? (
                  <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-[#1A1A1A]">{review.users?.full_name}</h4>
                            <div className="flex items-center space-x-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h5 className="font-semibold text-[#1A1A1A] mb-2">{review.title}</h5>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
