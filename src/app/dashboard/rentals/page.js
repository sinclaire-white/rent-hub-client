'use client';

import { CustomButton } from '@/app/components/CustomButton';
import { Input } from '@/app/components/Input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/app/components/Table';
import { useToast } from '@/app/components/useToast';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function ManageRentals() {
    const { data: session } = useSession();
    const { toast } = useToast();
    const [rentals, setRentals] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchRentals = async () => {
        try {
            const url = new URL(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/rent-posts`,
            );
            if (search) url.searchParams.append('search', search);

            const res = await fetch(url.toString(), { cache: 'no-store' });
            if (!res.ok) throw new Error('Failed to fetch rentals');

            const data = await res.json();
            setRentals(data || []);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching rentals:', error);
            toast({
                title: 'Error',
                description: 'Failed to load rentals',
                variant: 'destructive',
            });
        } 
    };

    useEffect(() => {
        if (session?.user?.role === 'admin') fetchRentals();
    }, [session, page, search]);

    const handleAction = async (id, status) => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/rent-posts/${id}`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status }),
                },
            );
            if (!res.ok) throw new Error(`Failed to update rental`);

            toast({ title: 'Success', description: `Rental ${status}` });

            setRentals((prev) =>
                prev.map((r) => (r._id === id ? { ...r, status } : r)),
            );
        } catch (error) {
            console.error(`Error updating rental:`, error);
            toast({
                title: 'Error',
                description: `Failed to update rental`,
                variant: 'destructive',
            });
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this rental?')) return;
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/rent-posts/${id}`,
                {
                    method: 'DELETE',
                },
            );
            if (!res.ok) throw new Error('Failed to delete rental');

            toast({ title: 'Success', description: 'Rental deleted' });

            setRentals((prev) => prev.filter((r) => r._id !== id));
        } catch (error) {
            console.error('Error deleting rental:', error);
            toast({
                title: 'Error',
                description: 'Failed to delete rental',
                variant: 'destructive',
            });
        }
    };

    if (!session || session.user?.role !== 'admin') {
        return <div className="text-center p-6">Access Denied</div>;
    }

    console.log(rentals)
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4 text-base-200">
                Custom Rentals Management
            </h1>

            <div className="mb-4 text-base-100">
                <Input
                    placeholder="Search by title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-md"
                />
            </div>

            {/* Table Wrapper */}
            {/* <div className="overflow-x-auto border rounded-lg shadow-sm bg-white">
                <Table className="min-w-[700px]">
                    <TableHeader className="sticky top-0 bg-gray-100 z-10 shadow">
                        <TableRow>
                            <TableHead className="text-gray-700">
                                Title
                            </TableHead>
                            <TableHead className="text-gray-700">
                                User Email
                            </TableHead>
                            <TableHead className="text-gray-700">
                                Status
                            </TableHead>
                            <TableHead className="text-gray-700">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rentals.map((rental) => (
                            <TableRow
                                key={rental._id}
                                className="bg-white hover:bg-gray-50 text-gray-700"
                            >
                                <TableCell>{rental.title}</TableCell>
                                <TableCell>{rental.email}</TableCell>
                                <TableCell className="capitalize">
                                    {rental.status || 'pending'}
                                </TableCell>
                                <TableCell className="flex flex-wrap gap-2">
                                    <CustomButton
                                        onClick={() =>
                                            handleAction(rental._id, 'approved')
                                        }
                                        disabled={rental.status === 'approved'}
                                    >
                                        Accept
                                    </CustomButton>
                                    <CustomButton
                                        onClick={() =>
                                            handleAction(rental._id, 'rejected')
                                        }
                                        disabled={rental.status === 'rejected'}
                                        variant="outline"
                                    >
                                        Reject
                                    </CustomButton>
                                    <CustomButton
                                        onClick={() => handleDelete(rental._id)}
                                        variant="destructive"
                                    >
                                        🗑 Delete
                                    </CustomButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div> */}

            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr className="text-base-200">
                            <th>Title & Category</th>
                            <th>User Email</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rentals.map((rental) => (
                            <tr className="text-base-100" key={rental._id}>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle h-12 w-12">
                                                <Image
                                                    src={rental.imageUrl.replace(
                                                        'i.ibb.co.com',
                                                        'i.ibb.co',
                                                    )}
                                                    alt={rental.title}
                                                    width={100}
                                                    height={100}
                                                ></Image>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold">
                                                {rental.title}
                                            </div>
                                            <div className="text-sm opacity-50">
                                                {rental.category}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>{rental.email}</td>
                                <td>{rental.status || 'pending'}</td>
                                <td className='flex gap-3'>
                                    <button
                                        className="btn btn-ghost btn-xs btn-outline"
                                        onClick={() =>
                                            handleAction(rental._id, 'approved')
                                        }
                                        disabled={rental.status === 'approved'}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className="btn btn-ghost btn-outline btn-xs"
                                        onClick={() =>
                                            handleAction(rental._id, 'rejected')
                                        }
                                        disabled={rental.status === 'rejected'}
                                    >
                                        Reject
                                    </button>
                                    <button
                                        className="btn btn-ghost btn-outline btn-xs"
                                        onClick={() => handleDelete(rental._id)}
                                    >
                                        🗑 Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between mt-4 items-center">
                <CustomButton
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Previous
                </CustomButton>
                <span>
                    Page {page} of {totalPages}
                </span>
                <CustomButton
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </CustomButton>
            </div>
        </div>
    );
}
