
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import IconAwardsPage from './pages/IconAwardsPage';
import FestiveFeastingPage from './pages/FestiveFeastingPage';
import EatDrinkPage from './pages/EatDrinkPage';
import CulturePage from './pages/CulturePage';
import TravelPage from './pages/TravelPage';
import KitchenEssentialsPage from './pages/KitchenEssentialsPage';
import RecipesPage from './pages/RecipesPage';
import PartnershipsPage from './pages/PartnershipsPage';
import EventsPage from './pages/EventsPage';
import MagazinePage from './pages/MagazinePage';
import WinPage from './pages/WinPage';
import AuthorPage from './pages/AuthorPage';
import PremiumPage from './pages/PremiumPage';
import AdminPage from './pages/AdminPage';

const App = () => {
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
      window.scrollTo(0, 0);
    };
    
    // Handle initial load
    handleHashChange();
    
    // Handle hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    // Normalize hash for comparison
    const hash = currentHash.trim();
    const normalizedHash = hash.toLowerCase();
    
    // Article Detail
    if (hash.startsWith('#/article/')) {
      const articleId = hash.split('/')[2];
      return <ArticleDetail id={articleId} />;
    }
    
    // Author Pages
    if (hash.startsWith('#/author/')) {
      const authorSlug = hash.split('/')[2];
      return <AuthorPage authorSlug={authorSlug} />;
    }
    
    // Premium Page
    if (normalizedHash === '#/premium' || normalizedHash === '#premium') {
      return <PremiumPage />;
    }
    
    // Admin Page - check multiple variations (must be before category pages)
    if (
      hash === '#/admin' || 
      hash === '#admin' ||
      normalizedHash === '#/admin' || 
      normalizedHash === '#admin'
    ) {
      return <AdminPage />;
    }
    
    // Category Pages
    const currentSlug = currentHash.replace('#', '').replace('/', '');
    
    switch (currentSlug) {
      case 'icon-awards':
        return <IconAwardsPage />;
      case 'festive-feasting':
        return <FestiveFeastingPage />;
      case 'eat-drink':
        return <EatDrinkPage />;
      case 'culture':
        return <CulturePage />;
      case 'travel':
        return <TravelPage />;
      case 'kitchen-essentials':
        return <KitchenEssentialsPage />;
      case 'recipes':
        return <RecipesPage />;
      case 'partnerships':
        return <PartnershipsPage />;
      case 'events':
        return <EventsPage />;
      case 'magazine':
        return <MagazinePage />;
      case 'win':
        return <WinPage />;
      default:
        // Default Landing Page (Apex Style)
        return <LandingPage />;
    }
  };

  return (
    <div className="font-sans antialiased text-neutral-900 bg-white selection:bg-[#f9b233] selection:text-black">
      <Header />
      {renderPage()}
      <Footer />
    </div>
  );
};

export default App;
