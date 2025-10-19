# NutriShop - Complete E-Commerce Setup Guide

## Overview

NutriShop is a full-featured e-commerce platform for nutrition and fitness supplements, built with React, TypeScript, Tailwind CSS, and Supabase.

## Features Implemented

### Frontend
- **Home Page**: Hero section, featured products, testimonials, highlights
- **Shop Page**: Product grid with filters (category, brand, price), sorting
- **Product Details**: Image gallery, tabs (description, ingredients, nutrition, reviews), related products
- **Cart & Checkout**: Full shopping cart with quantity management, secure checkout with payment simulation
- **User Dashboard**: Order history, profile management
- **Admin Dashboard**: Product management (CRUD), order management, analytics
- **Static Pages**: About Us, Contact with form

### Backend (Supabase)
- **Authentication**: Email/password with JWT
- **Database Tables**:
  - users (with role-based access)
  - products (with full catalog features)
  - cart_items
  - orders & order_items
  - addresses
  - reviews
- **Row Level Security**: Comprehensive RLS policies
- **Functions**: Auto-generate order numbers, update product ratings

### Tech Stack
- React 18 + TypeScript
- Tailwind CSS for styling
- Supabase for backend (PostgreSQL)
- Lucide React for icons
- Vite for building

## Getting Started

### 1. Prerequisites
- Node.js 18+ installed
- Supabase account (already configured)

### 2. Environment Setup

Your `.env` file should contain:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Create Admin User

To create an admin user:

1. Sign up through the app at `/login`
2. After signing up, run this SQL in Supabase SQL Editor:

```sql
UPDATE users
SET role = 'admin'
WHERE id = 'YOUR_USER_ID_HERE';
```

Or create a new admin user directly:

```sql
-- First, create the auth user through the app signup
-- Then update their role in the database
UPDATE users SET role = 'admin' WHERE id = (
  SELECT id FROM auth.users WHERE email = 'admin@nutrishop.com'
);
```

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 6. Build for Production

```bash
npm run build
```

## User Roles

### Customer Role (Default)
- Browse products
- Add to cart
- Place orders
- View order history
- Write reviews

### Admin Role
- All customer features
- Access admin dashboard
- Add/edit/delete products
- Manage orders
- View analytics

## Sample Products

The database has been seeded with 10 sample products:
1. Whey Gold Standard (Optimum Nutrition) - ₹2,499
2. Muscle Builder Whey (MuscleBlaze) - ₹4,399
3. Vegan Protein Blend (MyProtein) - ₹2,999
4. Nitro-Tech Whey Gold (MuscleTech) - ₹5,499
5. Micronized Creatine (Optimum Nutrition) - ₹899
6. C4 Pre-Workout (Cellucor) - ₹2,299
7. Gold Standard Pre-Workout (Optimum Nutrition) - ₹1,999
8. Daily Multivitamin (Optimum Nutrition) - ₹799
9. Omega-3 Fish Oil (MuscleBlaze) - ₹899
10. Protein Bars Variety Pack (Quest Nutrition) - ₹1,499

## Color Scheme

- Primary Green: `#00C896`
- Deep Charcoal: `#1A1A1A`
- Background: `#FFFFFF` and `#F9FAFB`

## Key Features Highlights

### Shopping Experience
- Real-time cart updates
- Free shipping on orders above ₹999
- Multiple filters and sorting options
- Product ratings and reviews
- Related products suggestions

### Security
- Row Level Security on all tables
- JWT-based authentication
- Secure checkout flow
- Role-based access control

### Payment Simulation
- Simulated payment flow (no real transactions)
- Multiple payment methods (Card, UPI, COD)
- Order confirmation and tracking

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   └── ProtectedRoute.tsx
├── contexts/          # React contexts
│   ├── AuthContext.tsx
│   └── CartContext.tsx
├── lib/              # Utilities and configs
│   └── supabase.ts
├── pages/            # Page components
│   ├── HomePage.tsx
│   ├── ShopPage.tsx
│   ├── ProductDetailsPage.tsx
│   ├── AuthPage.tsx
│   ├── CartPage.tsx
│   ├── CheckoutPage.tsx
│   ├── OrderSuccessPage.tsx
│   ├── UserDashboardPage.tsx
│   ├── AdminDashboardPage.tsx
│   ├── AboutPage.tsx
│   └── ContactPage.tsx
├── App.tsx           # Main app component
└── main.tsx          # Entry point
```

## Database Schema

### Tables
- `users` - Extended user profiles
- `products` - Product catalog
- `cart_items` - Shopping cart
- `orders` - Order records
- `order_items` - Order line items
- `addresses` - Shipping addresses
- `reviews` - Product reviews

### Key Functions
- `generate_order_number()` - Generates unique order numbers
- `update_product_rating()` - Auto-updates product ratings from reviews

## Support & Contact

For issues or questions:
- Email: support@nutrishop.com
- Phone: +91 98765 43210

## License

This is a demo project for educational purposes.
