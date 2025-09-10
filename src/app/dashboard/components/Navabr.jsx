'use client';

import { Menu } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Swal from 'sweetalert2';

export default function DashboardNavbar({ onMenuClick }) {
    const { data: session } = useSession();

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

    return (
        <nav className="w-full h-16 bg-white shadow flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
            {/* Left: Hamburger for mobile */}
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-md bg-gray-100 hover:bg-gray-200"
                aria-label="Toggle sidebar"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Center: Dashboard title */}
            <Link href="/" className="text-xl font-bold">
                RentHub
            </Link>

            {/* Right: User Info */}
            <div className="flex items-center space-x-4">
                {session?.user?.image ? (
                    <img
                        src={session.user.image}
                        alt={session.user.name}
                        className="w-8 h-8 rounded-full"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700">
                        {session?.user?.name?.[0] || 'U'}
                    </div>
                )}
                <span className="hidden sm:inline text-gray-700 font-medium">
                    {session?.user?.name || 'User'}
                </span>
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}
