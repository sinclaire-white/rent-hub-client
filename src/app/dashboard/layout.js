'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; 
import { useEffect } from 'react'; 
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import AdminSidebar from './components/admin/Sidebar';
import VendorSidebar from './components/vendor/Sidebar';
import UserSidebar from './components/user/Sidebar';

export default function DashboardLayout({ children }) {
    const router = useRouter(); 
    const { data: session, status } = useSession();

   
    useEffect(() => {
        if (status === 'loading') return; 

        if (status === 'unauthenticated' || !session) {
            router.push('/auth/signin'); 
            return;
        }
    }, [status, session, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-lg text-gray-600">
                    Loading Dashboard...
                </div>
            </div>
        );
    }

    if (!session) {
        return null; 
    }

    const role = session.user?.role || 'renter';
    let SidebarComponent = UserSidebar;
    if (role === 'admin') SidebarComponent = AdminSidebar;
    else if (role === 'owner') SidebarComponent = VendorSidebar;

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Fixed Sidebar */}
            <div className="w-64 h-screen fixed top-16 left-0 bg-white shadow-md">
                <SidebarComponent />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col ml-64">
                {/* <Header user={session.user} /> */}
                <main className="flex-1 p-6 overflow-y-auto">{children}</main>
                {/* <Footer /> */}
            </div>
        </div>
    );
}
