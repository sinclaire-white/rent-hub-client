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
                            <thead className="">
                                <tr className="text-gray-800">
                                    <th className="px-4 py-2 text-left">
                                        Order ID
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Product
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Price
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Status
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <motion.tr
                                        key={order.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="border-b text-gray-700 hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-2">
                                            {order.id}
                                        </td>
                                        <td className="px-4 py-2">
                                            {order.product}
                                        </td>
                                        <td className="px-4 py-2">
                                            {order.price} BDT
                                        </td>
                                        <td className="px-4 py-2">
                                            <span
                                                className={`badge ${
                                                    order.status === 'Delivered'
                                                        ? 'badge-success'
                                                        : order.status ===
                                                          'Pending'
                                                        ? 'badge-warning'
                                                        : 'badge-info'
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">
                                            {order.date}
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
                                className="bg-white text-gray-700 rounded-lg shadow p-4"
                            >
                                <p>
                                    <strong>Order ID:</strong> {order.id}
                                </p>
                                <p>
                                    <strong>Product:</strong> {order.product}
                                </p>
                                <p>
                                    <strong>Price:</strong> {order.price} BDT
                                </p>
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
                                <p>
                                    <strong>Date:</strong> {order.date}
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
