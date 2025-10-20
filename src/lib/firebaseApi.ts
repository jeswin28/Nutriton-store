import { Product, UserProfile, CartItem, Order, Review, mockProducts, mockReviews } from './firebaseTypes';
import { db, auth } from './firebaseConfig';
import { doc, getDoc, collection, getDocs, query, where, addDoc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';

// --- MOCK IMPLEMENTATION using a local, simple data store to simulate Firestore data structure ---
// NOTE: This uses localStorage and is NOT a complete, real-time Firestore implementation.

const localStorageGet = (key: string) => JSON.parse(localStorage.getItem(key) || '[]');
const localStorageSet = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));
const uuidv4 = () => String(Date.now() + Math.random()).replace('.', '');

// Initialize data structure in localStorage
if (!localStorage.getItem('products')) localStorageSet('products', mockProducts);
if (!localStorage.getItem('user_profiles')) {
    // Mock admin user profile linked to a hypothetical Firebase UID 'fb-admin-uid'
    const initialAdminProfile: UserProfile = {
        id: 'fb-admin-uid',
        full_name: 'Admin User',
        phone: '+91 00000 00000',
        role: 'admin',
        email: 'admin@nutrishop.com',
        created_at: new Date().toISOString(),
    };
    localStorageSet('user_profiles', [initialAdminProfile]);
}
if (!localStorage.getItem('cart_items')) localStorageSet('cart_items', []);
if (!localStorage.getItem('orders')) localStorageSet('orders', []);
if (!localStorage.getItem('reviews')) localStorageSet('reviews', mockReviews);

// --- User Profile Functions (Firestore: 'users' collection) ---
export const createProfile = async (uid: string, email: string, fullName: string, phone: string | null): Promise<UserProfile> => {
    await new Promise(r => setTimeout(r, 100)); // Simulate API delay
    const newProfile: UserProfile = {
        id: uid,
        full_name: fullName,
        phone,
        role: 'customer',
        email,
        created_at: new Date().toISOString(),
    };
    const profiles = localStorageGet('user_profiles');
    profiles.push(newProfile);
    localStorageSet('user_profiles', profiles);
    return newProfile;
};

export const getProfile = async (uid: string): Promise<UserProfile | null> => {
    await new Promise(r => setTimeout(r, 100)); // Simulate API delay
    const profiles: UserProfile[] = localStorageGet('user_profiles');
    return profiles.find(p => p.id === uid) || null;
};

// --- Product & Review Functions (Firestore: 'products', 'reviews' collections) ---
export const fetchProducts = async (): Promise<Product[]> => {
    await new Promise(r => setTimeout(r, 300));
    return localStorageGet('products');
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
    await new Promise(r => setTimeout(r, 300));
    const products: Product[] = localStorageGet('products');
    return products.find(p => p.id === id) || null;
};

export const fetchRelatedProducts = async (productId: string, category: string): Promise<Product[]> => {
    await new Promise(r => setTimeout(r, 100));
    const products: Product[] = localStorageGet('products');
    return products.filter(p => p.category === category && p.id !== productId).slice(0, 4);
};

export const fetchReviews = async (productId: string): Promise<Review[]> => {
    await new Promise(r => setTimeout(r, 100));
    const reviews: Review[] = localStorageGet('reviews');
    // Note: In real Firestore, we'd fetch the user profile here for 'users.full_name'
    return reviews.filter(r => r.product_id === productId);
};

export const addProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'rating' | 'review_count'>) => {
    console.log('Firebase Mock: Adding Product (Data is ephemeral)');
    await new Promise(r => setTimeout(r, 500));
    return { ...productData, id: uuidv4(), created_at: new Date().toISOString() };
};

export const deleteProduct = async (productId: string) => {
    console.log(`Firebase Mock: Deleting product ${productId} (Data is ephemeral)`);
    await new Promise(r => setTimeout(r, 200));
    return true;
};

// --- Cart Functions (Firestore: 'cart_items' collection) ---
export const fetchUserCart = async (userId: string): Promise<CartItem[]> => {
    await new Promise(r => setTimeout(r, 200));
    const allCartItems: CartItem[] = localStorageGet('cart_items');
    // Filter by user_id and ensure product data is present (denormalized in mock)
    return allCartItems.filter(item => item.user_id === userId);
};

export const saveCartItem = async (userId: string, productId: string, quantity: number, existingItemId?: string): Promise<CartItem> => {
    await new Promise(r => setTimeout(r, 100));
    const products: Product[] = localStorageGet('products');
    const product = products.find(p => p.id === productId)!;
    
    let allCartItems: CartItem[] = localStorageGet('cart_items');
    let item: CartItem;

    if (existingItemId) {
        const index = allCartItems.findIndex(i => i.id === existingItemId);
        item = { ...allCartItems[index], quantity, products: product, created_at: new Date().toISOString() };
        allCartItems[index] = item;
    } else {
        item = {
            id: uuidv4(),
            user_id: userId,
            product_id: productId,
            quantity,
            created_at: new Date().toISOString(),
            products: product,
        };
        allCartItems.push(item);
    }
    localStorageSet('cart_items', allCartItems);
    return item;
};

export const removeCartItem = async (itemId: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 50));
    let allCartItems: CartItem[] = localStorageGet('cart_items');
    allCartItems = allCartItems.filter(item => item.id !== itemId);
    localStorageSet('cart_items', allCartItems);
};

export const clearUserCart = async (userId: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 50));
    let allCartItems: CartItem[] = localStorageGet('cart_items');
    allCartItems = allCartItems.filter(item => item.user_id !== userId);
    localStorageSet('cart_items', allCartItems);
};

// --- Order Functions (Firestore: 'orders' collection) ---
export const generateOrderNumber = (): string => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `ORD-${dateStr}-${randomNum}`;
};

export const createOrder = async (orderData: Omit<Order, 'id' | 'order_number' | 'created_at'>, cartItems: CartItem[]): Promise<Order> => {
    await new Promise(r => setTimeout(r, 1000));
    let orders: Order[] = localStorageGet('orders');

    const newOrder: Order = {
        ...orderData,
        id: uuidv4(),
        order_number: generateOrderNumber(),
        created_at: new Date().toISOString(),
    };
    
    orders.push(newOrder);
    localStorageSet('orders', orders);

    return newOrder;
};

export const fetchOrdersByUserId = async (userId: string): Promise<Order[]> => {
    await new Promise(r => setTimeout(r, 200));
    const orders: Order[] = localStorageGet('orders');
    return orders.filter(o => o.user_id === userId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

export const fetchOrderById = async (orderId: string): Promise<Order | null> => {
    await new Promise(r => setTimeout(r, 200));
    const orders: Order[] = localStorageGet('orders');
    return orders.find(o => o.id === orderId) || null;
};

export const updateOrderStatus = async (orderId: string, status: string): Promise<Order | null> => {
    await new Promise(r => setTimeout(r, 200));
    let orders: Order[] = localStorageGet('orders');
    const index = orders.findIndex(o => o.id === orderId);
    
    if (index > -1) {
        orders[index] = { ...orders[index], status: status as Order['status'] };
        localStorageSet('orders', orders);
        return orders[index];
    }
    return null;
};