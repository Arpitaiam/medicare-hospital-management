import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { LogOut, Menu, X, Activity } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const { setPage } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Home', page: 'home' as const },
    { label: 'Doctors', page: 'doctors' as const },
    { label: 'Book Appointment', page: 'book-appointment' as const },
    { label: 'About', page: 'about' as const },
  ];

  const authItems = profile?.role === 'admin'
    ? [{ label: 'Admin Panel', page: 'admin' as const }]
    : [{ label: 'Dashboard', page: 'dashboard' as const }];

  const handleNav = (page: string) => {
    setPage(page as any);
    setMobileOpen(false);
  };

  return (
    <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => handleNav('home')} className="flex items-center gap-2 group">
            <Activity className="w-7 h-7 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
            <span className="text-xl font-bold text-white tracking-tight">MediCare</span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNav(item.page)}
                className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
              >
                {item.label}
              </button>
            ))}
            {user && authItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNav(item.page)}
                className="px-3 py-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 hover:bg-gray-800 rounded-lg transition-all"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <button
                  onClick={() => handleNav('profile')}
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  {profile?.full_name || 'Profile'}
                </button>
                <button
                  onClick={signOut}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNav('auth')}
                className="px-4 py-1.5 text-sm font-medium bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg transition-colors"
              >
                Sign In
              </button>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-gray-300">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-900/95 backdrop-blur-md">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNav(item.page)}
                className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
              >
                {item.label}
              </button>
            ))}
            {user && authItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNav(item.page)}
                className="block w-full text-left px-3 py-2 text-sm text-emerald-400 hover:text-emerald-300 hover:bg-gray-800 rounded-lg transition-all"
              >
                {item.label}
              </button>
            ))}
            <div className="border-t border-gray-800 pt-2 mt-2">
              {user ? (
                <div className="flex items-center justify-between">
                  <button onClick={() => handleNav('profile')} className="text-sm text-gray-300 hover:text-white">
                    {profile?.full_name || 'Profile'}
                  </button>
                  <button onClick={signOut} className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNav('auth')}
                  className="w-full px-4 py-2 text-sm font-medium bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
