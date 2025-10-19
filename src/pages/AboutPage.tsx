import { Award, Target, Heart, Users } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage = ({ onNavigate }: AboutPageProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#1A1A1A] to-[#00C896] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About NutriShop</h1>
          <p className="text-xl text-gray-200">Your trusted partner in fitness and nutrition</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-6">Our Story</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Founded in 2020, NutriShop was born from a passion for fitness and a commitment to providing athletes and fitness enthusiasts with the highest quality supplements available. We understand that achieving your fitness goals requires dedication, hard work, and the right nutrition.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our team of nutrition experts and fitness professionals carefully curate every product we offer, ensuring that each supplement meets our strict quality standards. We partner with leading brands and manufacturers who share our commitment to excellence and authenticity.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Today, we serve thousands of satisfied customers across India, helping them fuel their strength and build their best selves through science-backed nutrition products.
            </p>
          </div>

          <div className="flex items-center justify-center">
            <img
              src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg"
              alt="Fitness"
              className="rounded-xl shadow-2xl w-full h-auto"
            />
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#00C896] to-[#1A1A1A] rounded-full mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Quality</h3>
              <p className="text-gray-600">
                Only authentic, tested, and certified products make it to our shelves
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#00C896] to-[#1A1A1A] rounded-full mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Results</h3>
              <p className="text-gray-600">
                We focus on products that deliver real, measurable results
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#00C896] to-[#1A1A1A] rounded-full mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Care</h3>
              <p className="text-gray-600">
                Your health and satisfaction are our top priorities
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#00C896] to-[#1A1A1A] rounded-full mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Community</h3>
              <p className="text-gray-600">
                Building a supportive fitness community together
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#00C896] to-[#1A1A1A] text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 text-gray-200">
            Join thousands of satisfied customers and transform your fitness goals into reality
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="px-8 py-4 bg-white text-[#1A1A1A] rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
};
