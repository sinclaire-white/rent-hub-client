'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();
    const hideNav = pathname.startsWith('/dashboard');
    const hideFooter = pathname.startsWith('/dashboard');

    return (
        <>
            {!hideNav && <Navbar />}
            {children}
            {!hideFooter && <Footer />}
        </>
    );
}
