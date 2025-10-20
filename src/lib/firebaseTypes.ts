// Define simplified types for Firebase documents
export type Product = {
  id: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  compare_at_price: number | null;
  description: string;
  ingredients: string | null;
  nutrition_facts: Record<string, any> | null;
  stock: number;
  images: string[];
  weight: string | null;
  flavor: string | null;
  rating: number;
  review_count: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

export type UserProfile = {
  id: string;
  full_name: string;
  phone: string | null;
  role: 'customer' | 'admin';
  email: string;
  created_at: string;
};

export type CartItem = {
  id: string; // Document ID for the cart item
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  products: Product; // Denormalized or joined product data
};

export type Order = {
  id: string;
  order_number: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: string | null;
  subtotal: number;
  shipping_fee: number;
  tax: number;
  total: number;
  shipping_address: Record<string, any>;
  created_at: string;
};

export type Review = {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
  users: {
    full_name: string;
  };
};

// --- MOCK PRODUCT DATA (To simulate Firestore collection data) ---
export const mockProducts: Product[] = [
  { id: 'prod-001', title: 'Whey Gold Standard', brand: 'Optimum Nutrition', category: 'Protein', price: 2499, compare_at_price: 3500, description: 'The world\'s best-selling whey protein powder.', stock: 50, images: ['https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg'], weight: '1kg', flavor: 'Chocolate', rating: 4.8, review_count: 120, is_featured: true, created_at: new Date(Date.now() - 50000).toISOString(), updated_at: new Date().toISOString(), ingredients: 'Protein Blend, Cocoa, Lecithin.', nutrition_facts: { 'Protein': '24g', 'Carbs': '3g', 'Fat': '1g' } },
  { id: 'prod-002', title: 'Muscle Builder Whey', brand: 'MuscleBlaze', category: 'Protein', price: 4399, compare_at_price: 5500, description: 'High-quality whey protein isolate blend designed for serious muscle gain.', stock: 30, images: ['https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg'], weight: '2kg', flavor: 'Mocha', rating: 4.5, review_count: 80, is_featured: true, created_at: new Date(Date.now() - 40000).toISOString(), updated_at: new Date().toISOString(), ingredients: 'Whey Protein Isolate, Maltodextrin.', nutrition_facts: { 'Protein': '30g', 'Carbs': '5g', 'Fat': '2g' } },
  { id: 'prod-003', title: 'Micronized Creatine', brand: 'Optimum Nutrition', category: 'Creatine', price: 899, compare_at_price: null, description: '100% pure creatine monohydrate to support muscle strength and power.', stock: 100, images: ['https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg'], weight: '300g', flavor: 'Unflavored', rating: 4.9, review_count: 200, is_featured: true, created_at: new Date(Date.now() - 30000).toISOString(), updated_at: new Date().toISOString(), ingredients: 'Creatine Monohydrate.', nutrition_facts: { 'Creatine': '5g', 'Calories': '0' } },
  { id: 'prod-004', title: 'C4 Pre-Workout', brand: 'Cellucor', category: 'Pre-Workout', price: 2299, compare_at_price: 2800, description: 'Explosive energy and focus for high-intensity workouts.', stock: 25, images: ['https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg'], weight: '390g', flavor: 'Razz', rating: 4.4, review_count: 50, is_featured: false, created_at: new Date(Date.now() - 20000).toISOString(), updated_at: new Date().toISOString(), ingredients: 'Beta-Alanine, Creatine Nitrate, Caffeine.', nutrition_facts: { 'Caffeine': '150mg' } },
];
export const mockReviews: Review[] = [
    { id: 'rev-001', product_id: 'prod-001', user_id: 'user-1', rating: 5, title: 'Amazing Taste', comment: 'The chocolate flavor is incredible.', created_at: new Date().toISOString(), users: { full_name: 'Rahul Sharma' } },
    { id: 'rev-002', product_id: 'prod-001', user_id: 'user-2', rating: 4, title: 'Great Value', comment: 'Good quality protein for the price.', created_at: new Date().toISOString(), users: { full_name: 'Priya Patel' } },
];