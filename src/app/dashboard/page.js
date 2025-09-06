<<<<<<< HEAD

=======
>>>>>>> 5be7c9a0987938644751d22e17bcf21ac7c524d5
import Header from './components/common/Header';
import AdminSidebar from './components/admin/Sidebar';
import VendorSidebar from './components/vendor/Sidebar';
import UserSidebar from './components/user/Sidebar';
<<<<<<< HEAD
import { rentals } from '../data/rentals';
import Image from 'next/image';

export default function DashboardPage() {
    const userRole = 'admin'; // পরে auth context থেকে dynamic হবে

=======
import StatsCard from './components/common/StatsCard';
import RentalsTable from './components/admin/RentalsTable';
import Image from 'next/image';

export default async function DashboardPage({
    userRole = 'admin',
    userEmail = '',
}) {
    // API fetch
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/rent-posts`,
        {
            cache: 'no-store',
        },
    );
    const allRentals = await res.json();

    // Sidebar component
>>>>>>> 5be7c9a0987938644751d22e17bcf21ac7c524d5
    let SidebarComponent;
    if (userRole === 'admin') SidebarComponent = AdminSidebar;
    else if (userRole === 'vendor') SidebarComponent = VendorSidebar;
    else SidebarComponent = UserSidebar;

<<<<<<< HEAD
    return (
        <div style={{ display: 'flex' }}>
            <SidebarComponent />
            <div style={{ flex: 1 }}>
                <Header />
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <div
                        style={{
                            padding: '20px',
                            border: '1px solid #ccc',
                            margin: '10px',
                            borderRadius: '8px',
                        }}
                    >
                        <h3>Total Rentals</h3>
                        <p>{rentals.length}</p>
                    </div>
                    <div
                        style={{
                            padding: '20px',
                            border: '1px solid #ccc',
                            margin: '10px',
                            borderRadius: '8px',
                        }}
                    >
                        <h3>Total Users</h3>
                        <p>100</p>
                    </div>
                </div>

                {/* Rentals list */}
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {rentals.map((rental) => (
                        <div
                            key={rental.id}
                            style={{
                                border: '1px solid #ccc',
                                margin: '10px',
                                padding: '10px',
                                width: '250px',
                            }}
                        >
                            <img
                                src={rental.imageUrl}
                                alt={rental.title}
                                style={{
                                    width: '100%',
                                    height: '150px',
                                    objectFit: 'cover',
                                }}
                            />
                            <h3>{rental.title}</h3>
                            <p>
                                {rental.type} - {rental.location}
                            </p>
                            <p>Rent: ৳{rental.rentPrice}</p>
                        </div>
                    ))}
                </div>
=======
    // Filter rentals per role
    let rentals = [];
    if (userRole === '') {
        rentals = allRentals;
    } else if (userRole === 'vendor') {
        rentals = allRentals.filter((r) => r.email === userEmail);
    } else {
        rentals = allRentals.filter(
            (r) => new Date(r.availableFrom) <= new Date(),
        );
    }

    // Stats
    const totalRentals = allRentals.length;
    const totalUsers = 100; // example
    const totalVendors = allRentals.filter((r) => r.type === 'vendor').length;

    return (
        <div className="flex min-h-screen bg-base-200">
            <SidebarComponent />

            <div className="flex-1 p-4">
                <Header />

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                    <StatsCard title="Total Rentals" value={totalRentals} />
                    <StatsCard title="Total Users" value={totalUsers} />
                    <StatsCard title="Total Vendors" value={totalVendors} />
                </div>

                {/* Admin sees table */}
                {/* {userRole === 'admin' && <RentalsTable rentals={rentals} />} */}

                {/* Vendor / User sees cards */}
                {(userRole === 'vendor' || userRole === 'user') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rentals.map((rental) => (
                            <div
                                key={rental._id}
                                className="card bg-base-100 shadow-xl"
                            >
                                <figure>
                                    <Image
                                        src={rental.imageUrl}
                                        alt={rental.title}
                                        width={400}
                                        height={200}
                                        className="w-full h-48 object-cover"
                                    />
                                </figure>
                                <div className="card-body">
                                    <h2 className="card-title">
                                        {rental.title}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        {rental.type} • {rental.location}
                                    </p>
                                    <p className="font-bold">
                                        Rent: ৳{rental.rentPrice}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
>>>>>>> 5be7c9a0987938644751d22e17bcf21ac7c524d5
            </div>
        </div>
    );
}
