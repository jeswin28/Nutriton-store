import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer = ({ onNavigate }: FooterProps) => {
  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00C896] to-white rounded-lg flex items-center justify-center">
                <span className="text-[#1A1A1A] font-bold text-xl">NS</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">NutriShop</h3>
                <p className="text-xs text-gray-400">Fuel Your Strength</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Your trusted source for premium nutrition and fitness supplements. Build your best self with science-backed products.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#00C896] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00C896] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00C896] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('shop')}
                  className="text-sm text-gray-400 hover:text-[#00C896] transition-colors"
                >
                  Shop All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-sm text-gray-400 hover:text-[#00C896] transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-sm text-gray-400 hover:text-[#00C896] transition-colors"
                >
                  Contact
                </button>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-[#00C896] transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-[#00C896] transition-colors">
                  Protein Powders
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-[#00C896] transition-colors">
                  Pre-Workout
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-[#00C896] transition-colors">
                  Creatine
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-[#00C896] transition-colors">
                  Vitamins & Minerals
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-[#00C896] transition-colors">
                  Health Snacks
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#00C896] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400">
                  123 Fitness Street, Mumbai, Maharashtra 400001
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#00C896] flex-shrink-0" />
                <span className="text-sm text-gray-400">+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#00C896] flex-shrink-0" />
                <span className="text-sm text-gray-400">support@nutrishop.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              &copy; 2024 NutriShop. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-400 hover:text-[#00C896] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-[#00C896] transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-[#00C896] transition-colors">
                Shipping Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};