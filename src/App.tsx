import { useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider, useApp } from './contexts/AppContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Doctors from './pages/Doctors';
import BookAppointment from './pages/BookAppointment';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import About from './pages/About';

function AppContent() {
  const { page, setPage } = useApp();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (user && profile) {
      if (profile.role === 'admin') {
        setPage('admin');
      } else {
        setPage('dashboard');
      }
    }
  }, [user, profile, setPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  const protectedPages = ['dashboard', 'admin', 'profile'];
  if (protectedPages.includes(page) && !user) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <Auth />
      </div>
    );
  }

  if (page === 'admin' && profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (page) {
      case 'home': return <Home />;
      case 'auth': return <Auth />;
      case 'doctors': return <Doctors />;
      case 'book-appointment': return <BookAppointment />;
      case 'dashboard': return <Dashboard />;
      case 'admin': return <Admin />;
      case 'profile': return <Profile />;
      case 'about': return <About />;
      default: return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      {renderPage()}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AppProvider>
  );
}

export default App;