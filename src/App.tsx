import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartWishlistProvider } from './context/CartWishlistContext';
import { ConfiguratorProvider, useConfigurator } from './context/ConfiguratorContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AuthModal } from './components/auth/AuthModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { WishlistDrawer } from './components/wishlist/WishlistDrawer';
import { AiChatbotDrawer } from './components/ai/AiChatbotDrawer';
import { HomePage } from './pages/HomePage';
import { ConfiguratorStep1 } from './pages/ConfiguratorStep1';
import { ConfiguratorStep2 } from './pages/ConfiguratorStep2';
import { ConfiguratorResult } from './pages/ConfiguratorResult';
import { AiEnquiryTriage } from './components/ai/AiEnquiryTriage';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { AboutPage } from './pages/AboutPage';

type AppView = 'home' | 'configurator' | 'enquiries' | 'dashboard' | 'about';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const { activeStep, setActiveStep } = useConfigurator();

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartDesigning = () => {
    setCurrentView('configurator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-porcelain text-ink selection:bg-brass/20 selection:text-ink">
      {/* Global Navigation Bar */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      {/* Main Dynamic Viewport */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage onStartDesigning={handleStartDesigning} />
        )}

        {currentView === 'configurator' && (
          <div className="py-6">
            {activeStep === 1 && (
              <ConfiguratorStep1 
                onBack={() => handleNavigate('home')}
                onNext={() => { setActiveStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              />
            )}
            {activeStep === 2 && (
              <ConfiguratorStep2 
                onBack={() => { setActiveStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                onNext={() => { setActiveStep(3); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              />
            )}
            {activeStep === 3 && (
              <ConfiguratorResult 
                onBackToConfigurator={() => { setActiveStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                onNavigateToDashboard={() => handleNavigate('dashboard')}
              />
            )}
          </div>
        )}

        {currentView === 'enquiries' && (
          <AiEnquiryTriage onBack={() => handleNavigate('home')} />
        )}

        {currentView === 'dashboard' && (
          <UserDashboard 
            onBack={() => handleNavigate('home')}
            onLaunchProject={() => setCurrentView('configurator')} 
          />
        )}

        {currentView === 'about' && (
          <AboutPage onBack={() => handleNavigate('home')} />
        )}
      </main>

      {/* Global Footer with Mandatory Case Study Disclaimer */}
      <Footer onNavigate={handleNavigate} />

      {/* Modals & Persistent Global AI Widgets */}
      <AuthModal />
      <CartDrawer />
      <WishlistDrawer />
      <AiChatbotDrawer />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <CartWishlistProvider>
        <ConfiguratorProvider>
          <AppContent />
        </ConfiguratorProvider>
      </CartWishlistProvider>
    </AuthProvider>
  );
}

export default App;
