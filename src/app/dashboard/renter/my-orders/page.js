'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';

const mockOrders = [
    {
        id: 1,
        product: 'Bike',
        price: 25000,
        status: 'Delivered',
        date: '2025-08-15',
    },
    {
        id: 2,
        product: 'Camera',
        price: 12000,
        status: 'Pending',
        date: '2025-08-10',
    },
];

export default function MyOrders() {
    const { data: session } = useSession();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        setOrders(mockOrders); // replace with API call if needed
    }, []);

     useEffect(() => {
         if (session?.user?.email) {
             fetch(`/api/bookings?email=${session.user.email}`)
                 .then((res) => res.json())
                 .then((data) => setOrders(data))
                 .catch((err) => console.error('Fetch error:', err))
                 
         }
     }, [session?.user?.email]);


    if (!session) {
        return (
            <p className="text-center text-red-500 mt-10">
                Please login to see your orders.
            </p>
        );
    }

    return (
        <div className="bg-base-100 text-base-content min-h-screen p-4 md:p-6 lg:p-8">
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl md:text-3xl font-semibold mb-6 text-center md:text-left"
            >
                My Orders
            </motion.h2>

            {orders.length > 0 ? (
                <>
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto rounded-lg shadow-md bg-white">
                        <table className="table-auto w-full min-w-[600px]">
                            <thead className="bg-gray-100">
                                <tr className='text-black'>
                                    
                                    <th className="px-4 py-2 text-left">Title</th>
                                    <th className="px-4 py-2 text-left">Category</th>
                                    <th className="px-4 py-2 text-left">Price</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <motion.tr
                                        key={order.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-2">{order.title}</td>
                                        <td className="px-4 py-2">{order.category}</td>
                                        <td className="px-4 py-2">{order.rentPrice} BDT</td>
                                        <td className="px-4 py-2">
                                            <span
                                                className={`badge ${
                                                    order.status === 'Delivered'
                                                        ? 'badge-success'
                                                        : order.status === 'Pending'
                                                        ? 'badge-warning'
                                                        : 'badge-info'
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card Layout */}
                    <div className="md:hidden space-y-4">
                        {orders.map((order) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-lg shadow p-4"
                            >
                                <p><strong>Order ID:</strong> {order.title}</p>
                                <p><strong>Product:</strong> {order.category}</p>
                                <p><strong>Price:</strong> {order.rentPrice} BDT</p>
                                <p>
                                    <strong>Status:</strong>{' '}
                                    <span
                                        className={`badge ${
                                            order.status === 'Delivered'
                                                ? 'badge-success'
                                                : order.status === 'Pending'
                                                ? 'badge-warning'
                                                : 'badge-info'
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </p>
                                
                            </motion.div>
                        ))}
                    </div>
                </>
            ) : (
                <p className="text-gray-500 mt-4 h-[300px] flex justify-center items-center">
                    No orders found.
                </p>
            )}
        </div>
    );
}




