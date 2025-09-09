'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import StatCard from './components/StatCard';
import ChartCard from './components/ChartCard';

export default function DashboardHome() {
    const { data: session } = useSession();

    const [role, setRole] = useState('renter');
    const [stats, setStats] = useState({
        totalRentals: 0,
        totalUsers: 0,
        avgPrice: 0,
    });
    const [users, setUsers] = useState([]);
    const [rentals, setRentals] = useState([]);
    const [orders, setOrders] = useState([]);
    const [chartData, setChartData] = useState([]);
    // Fetch users (admin only)
    useEffect(() => {
        if (session?.user?.role !== 'admin') return;

        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/users', { cache: 'no-store' });
                if (!res.ok) throw new Error('Failed to fetch users');
                const data = await res.json();
                setUsers(data);
            } catch (err) {
                console.error(err);
                toast.error('Failed to load users');
            }
        };

        fetchUsers();
    }, [session]);

    // Fetch rentals
    useEffect(() => {
        if (!session?.user) return;

        const fetchRentals = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/rent-posts`,
                    { cache: 'no-store' },
                );
                if (!res.ok) throw new Error('Failed to fetch rentals');
                const data = await res.json();
                setRentals(data);

                const totalRentals = data.length;
                const totalUsers = new Set(data.map((r) => r.email)).size;
                const avgPrice =
                    data.reduce((acc, r) => acc + (r.price || 0), 0) /
                    (data.length || 1);

                setStats({ totalRentals, totalUsers, avgPrice });

                const chartData = data.map((r) => ({
                    name: r.title,
                    value: r.price || 0,
                }));
                setChartData(chartData);
            } catch (error) {
                console.error(error);
                toast.error('Failed to load rentals');
            }
        };

        fetchRentals();
    }, [session]);

    // Fetch orders (user only)
    useEffect(() => {
        if (session?.user?.email) {
            fetch(`/api/bookings?email=${session.user.email}`)
                .then((res) => {
                    if (!res.ok) throw new Error('Failed to fetch orders');
                    return res.json();
                })
                .then((data) => setOrders(data))
                .catch((err) => {
                    console.error('Fetch error:', err);
                    toast.error('Failed to load orders');
                });
        }
    }, [session?.user?.email]);

    useEffect(() => {
        if (session?.user?.role) setRole(session.user.role);
    }, [session]);

    const rentPrice = rentals.map(rental => rental.rentPrice);

    return (
        <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Total Rentals" value={stats.totalRentals} />
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    color="bg-green-500"
                />
                <StatCard
                    title="Average Price"
                    value={`৳${stats.avgPrice.toFixed(2)}`}
                    color="bg-purple-500"
                />
            </div>
            <ChartCard
                data={rentals.map((rental) => ({
                    name: rental.title,
                    value: rental.rentPrice,
                }))}
                title="Rental Prices"
            />
        </div>
    );
}
