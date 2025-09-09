'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Menu, X, LogOut, LogIn, UserPlus } from 'lucide-react';
import Swal from 'sweetalert2';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [pathname]);

  const routes = [
    { href: '/', label: 'Home' },
    { href: '/rent-posts', label: 'Listings' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/how-it-works', label: 'How It Works' },
  ];

  const loggedInRoutes = [
    { href: '/', label: 'Home' },
    { href: '/rent-posts', label: 'Listings' },
    { href: '/add-rent-posts', label: 'Give Rent' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/my-bookings', label: 'My Bookings' },
  ];

  const navLinks = session ? loggedInRoutes : routes;

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, log out',
    });

    if (result.isConfirmed) {
      signOut();
      Swal.fire('Logged Out!', 'You have been logged out.', 'success');
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b shadow-sm bg-base-100 border-base-200">
      <div className="flex items-center h-16 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <div className="flex-1 flex-shrink-0">
          <Link href="/" className="text-xl font-bold transition-transform sm:text-2xl hover:scale-105">
            RentHub
          </Link>
        </div>

        {/* Center: Desktop Nav Links (hidden on mobile) */}
        <div className="justify-center flex-grow-0 hidden mx-auto sm:flex">
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            {navLinks.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className={`relative px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base font-medium transition-all duration-300 ease-in-out rounded-full ${
                  pathname === r.href
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-500 hover:bg-primary/10 hover:text-primary'
                }`}
                aria-label={`Maps to ${r.label}`}
              >
                {r.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Theme & Auth */}
        <div className="flex items-center justify-end flex-1 flex-shrink-0 gap-2 sm:gap-3">
          <div className="hidden sm:flex">
            <ThemeToggle />
          </div>

          {session ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="hidden text-white border-none sm:flex btn btn-sm bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden lg:inline">Logout</span>
            </motion.button>
          ) : (
            <>
              <Link href="/login" className="hidden sm:inline-flex">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-white border-none btn btn-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  aria-label="Log in"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden lg:inline">Login</span>
                </motion.button>
              </Link>
              <Link href="/register" className="hidden sm:inline-flex">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-white border-none btn btn-sm bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  aria-label="Register"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden lg:inline">Register</span>
                </motion.button>
              </Link>
            </>
          )}

          <button
            className="btn btn-ghost btn-square sm:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 right-0 z-50 w-64 h-full overflow-y-auto shadow-xl sm:w-72 bg-base-100 sm:hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-base-200">
              <span className="text-lg font-bold">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="btn btn-ghost btn-square"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col gap-2 p-4">
              {navLinks.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block w-full px-3 py-2 text-base font-medium transition-all duration-300 ease-in-out rounded-full ${
                    pathname === r.href
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-500 hover:bg-primary/10 hover:text-primary'
                  }`}
                  aria-label={`Maps to ${r.label}`}
                >
                  {r.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-4 p-4 mt-auto border-t border-base-200">
              <div className='w-full'>
                <ThemeToggle />
              </div>
              {session ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full text-white border-none btn btn-sm bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  aria-label="Log out"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </motion.button>
              ) : (
                <>
                  <Link href="/login" className="w-full">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full text-white border-none btn btn-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                      onClick={() => setMobileOpen(false)}
                      aria-label="Log in"
                    >
                      <LogIn className="w-4 h-4" />
                      Login
                    </motion.button>
                  </Link>
                  <Link href="/register" className="w-full">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full text-white border-none btn btn-sm bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      onClick={() => setMobileOpen(false)}
                      aria-label="Register"
                    >
                      <UserPlus className="w-4 h-4" />
                      Register
                    </motion.button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="fixed inset-0 z-40 bg-black sm:hidden"
          onClick={() => setMobileOpen(false)}
        ></motion.div>
      )}
    </nav>
  );
}