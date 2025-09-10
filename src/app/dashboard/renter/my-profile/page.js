'use client';

import { motion } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';

export default function MyProfile() {
    const { data } = useSession();
    const { name, email, image } = data?.user || {};

    useEffect(() => {
        if (data) toast.success('Your profile loaded!');
    }, [data]);

    return (
        <div className="bg-base-100 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="card w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 text-center"
            >
                {/* Profile Image */}
                <div className="flex justify-center">
                    <motion.img
                        src={image || '/default-avatar.png'}
                        alt="Profile Picture"
                        className="w-32 h-32 rounded-full border-4 border-primary shadow-md object-cover"
                        whileHover={{ scale: 1.05 }}
                    />
                </div>

                {/* Profile Info */}
                <div className="mt-6 space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {name || 'Unknown User'}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-300">{email}</p>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="btn btn-outline btn-primary w-full sm:w-auto">
                        Edit Profile
                    </button>
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="btn btn-outline btn-secondary w-full sm:w-auto"
                    >
                        Logout
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
