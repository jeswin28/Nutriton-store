import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { AuthPage } from './pages/AuthPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

type Page = 'home' | 'shop' | 'product' | 'login' | 'cart' | 'checkout' | 'order-success' | 'dashboard' | 'admin' | 'about' | 'contact';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');

  const handleNavigate = (page: string, id?: string) => {
    setCurrentPage(page as Page);
    if (page === 'product' && id) {
      setSelectedProductId(id);
    }
    if (page === 'order-success' && id) {
      setOrderId(id);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'shop':
        return <ShopPage onNavigate={handleNavigate} />;
      case 'product':
        return <ProductDetailsPage productId={selectedProductId} onNavigate={handleNavigate} />;
      case 'login':
        return <AuthPage onNavigate={handleNavigate} />;
      case 'cart':
        return <CartPage onNavigate={handleNavigate} />;
      case 'checkout':
        return <CheckoutPage onNavigate={handleNavigate} />;
      case 'order-success':
        return <OrderSuccessPage orderId={orderId} onNavigate={handleNavigate} />;
      case 'dashboard':
        return <UserDashboardPage onNavigate={handleNavigate} />;
      case 'admin':
        return <AdminDashboardPage onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          {currentPage !== 'login' && <Header onNavigate={handleNavigate} currentPage={currentPage} />}
          <main className="flex-grow">
            {renderPage()}
          </main>
          {currentPage !== 'login' && <Footer onNavigate={handleNavigate} />}
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;