'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';

import AdminSidebar from './components/admin/Sidebar';
import VendorSidebar from './components/vendor/Sidebar';
import UserSidebar from './components/user/Sidebar';
import DashboardNavbar from './components/Navabr';
import DashboardFooter from './components/Footer';


export default function DashboardLayout({ children }) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Protect Route
    useEffect(() => {
        if (status === 'loading') return;
        if (status === 'unauthenticated' || !session) {
            router.push('/auth/signin');
        }
    }, [status, session, router]);

    if (status === 'loading') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-100 bg-opacity-90 text-base-content">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600 mb-6"></div>
                    <span className="text-xl font-semibold">
                        Loading dashboard...
                    </span>
                </div>
            </div>
        );
    }

    if (!session) return null;

    const role = session.user?.role || 'renter';
    let SidebarComponent = UserSidebar;
    if (role === 'admin') SidebarComponent = AdminSidebar;
    else if (role === 'owner') SidebarComponent = VendorSidebar;

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 z-40 top-16 left-0 w-64 bg-white shadow-md transform transition-transform duration-200 ease-in-out
                ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0`}
            >
                <SidebarComponent />
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:ml-64">
                <DashboardNavbar onMenuClick={toggleSidebar} />
                <main className="flex-1 p-6 overflow-y-auto">{children}</main>
                <DashboardFooter />
            </div>
        </div>
    );
}
