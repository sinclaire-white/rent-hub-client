'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function DashboardLayout({ children }) {
    const { data: session } = useSession();

    return (
        <div className="flex">
            <aside className="w-64 p-4 border-r">
                <p className="mb-4">Role: {session?.user.role}</p>
                <nav className="space-y-2">
                    <Link href="/dashboard">Dashboard Home</Link>
                    {session?.user.role === 'admin' && (
                        <Link href="/dashboard/admin">Admin Panel</Link>
                    )}
                    {session?.user.role === 'vendor' && (
                        <Link href="/dashboard/vendor">Vendor Panel</Link>
                    )}
                    {session?.user.role === 'user' && (
                        <Link href="/dashboard/user">User Panel</Link>
                    )}
                </nav>
            </aside>
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}
