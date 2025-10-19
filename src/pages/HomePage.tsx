import { useEffect, useState } from 'react';
import { Truck, Shield, Headphones, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase, Product } from '../lib/supabase';
import { ProductCard } from '../components/ProductCard';

interface HomePageProps {
  onNavigate: (page: string, productId?: string) => void;
}

export const HomePage = ({ onNavigate }: HomePageProps) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .limit(8);

    if (error) {
      console.error('Error fetching featured products:', error);
    } else {
      setFeaturedProducts(data || []);
    }
    setLoading(false);
  };

  const testimonials = [
    {
      name: 'Rahul Sharma',
      role: 'Fitness Enthusiast',
      rating: 5,
      comment: 'Best quality protein I\'ve ever used! The results are incredible and the taste is amazing.',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=150'
    },
    {
      name: 'Priya Patel',
      role: 'Professional Athlete',
      rating: 5,
      comment: 'Fast delivery and genuine products. NutriShop has become my go-to store for all supplements.',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150'
    },
    {
      name: 'Arjun Kumar',
      role: 'Bodybuilder',
      rating: 5,
      comment: 'Excellent customer service and premium quality supplements. Highly recommended!',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=150'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-gradient-to-br from-[#1A1A1A] via-[#2A2A2A] to-[#00C896] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Fuel Your Strength.<br />
              Build Your Best.
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Premium nutrition and supplements for athletes, bodybuilders, and fitness enthusiasts. Science-backed products you can trust.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => onNavigate('shop')}
                className="px-8 py-4 bg-[#00C896] text-white rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all transform hover:scale-105"
              >
                Shop Now
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="px-8 py-4 bg-white text-[#1A1A1A] rounded-lg font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4 p-6 rounded-lg bg-gray-50 hover:shadow-lg transition-shadow">
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#00C896] to-[#1A1A1A] rounded-full flex items-center justify-center">
                <Truck className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#1A1A1A]">Free Shipping</h3>
                <p className="text-sm text-gray-600">On orders above ₹999</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-6 rounded-lg bg-gray-50 hover:shadow-lg transition-shadow">
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#00C896] to-[#1A1A1A] rounded-full flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#1A1A1A]">100% Genuine</h3>
                <p className="text-sm text-gray-600">Authentic products guaranteed</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-6 rounded-lg bg-gray-50 hover:shadow-lg transition-shadow">
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#00C896] to-[#1A1A1A] rounded-full flex items-center justify-center">
                <Headphones className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#1A1A1A]">24/7 Support</h3>
                <p className="text-sm text-gray-600">Always here to help you</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our top-rated supplements trusted by thousands of athletes and fitness enthusiasts
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C896]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('shop')}
              className="px-8 py-3 bg-gradient-to-r from-[#00C896] to-[#1A1A1A] text-white rounded-lg font-bold hover:opacity-90 transition-opacity"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of satisfied customers who trust NutriShop
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.comment}"</p>
                <div className="flex items-center space-x-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-[#1A1A1A]">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-[#00C896] to-[#1A1A1A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Fitness Journey?
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Get started with premium supplements and expert nutrition guidance
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="px-8 py-4 bg-white text-[#1A1A1A] rounded-lg font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            Start Shopping
          </button>
        </div>
      </section>
    </div>
  );
};
