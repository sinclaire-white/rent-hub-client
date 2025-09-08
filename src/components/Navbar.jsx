"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Bell, Menu, X, LogOut, User, LayoutDashboard, PlusSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { ModeToggle } from "./ModeToggle";
import Swal from "sweetalert2";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState("renter"); // default role
  const [notifications, setNotifications] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch("/data/notifications.json")
      .then((res) => res.json())
      .then((data) => setNotifications(data.filter((n) => n.role === role)));
  }, [role]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    Swal.fire({
      icon: "success",
      title: "Signed Out",
      text: "You have successfully signed out.",
      showConfirmButton: false,
      timer: 2000,
    });
    router.push("/");
  };

  // Base routes visible to everyone
  const baseRoutes = [
    { href: "/", label: "Home" },
    { href: "/all-products", label: "Products" },
  ];

  // Extra routes only for logged-in users
  const privateRoutes = [
    { href: "/dashboard/add-product", label: "Add Product", icon: <PlusSquare className="w-4 h-4" /> },
    { href: `/dashboard/${role}`, label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  ];

  // Choose routes based on session
  const routes = status === "authenticated" ? [...baseRoutes, ...privateRoutes] : baseRoutes;

  return (
    <header className="sticky top-0 z-50 border-b bg-white dark:bg-gray-900 shadow-sm">
      <nav className="flex items-center justify-between px-4 md:px-8 h-16">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
          Rentify
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {routes.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                pathname === r.href
                  ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {r.label}
            </Link>
          ))}

          {/* Always show Dark Mode Toggle */}
          <ModeToggle />


          {status === "authenticated" ? (
            <>
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  {notifications.length === 0 ? (
                    <DropdownMenuItem>No notifications</DropdownMenuItem>
                  ) : (
                    notifications.map((n) => <DropdownMenuItem key={n.id}>{n.text}</DropdownMenuItem>)
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <span className="hidden sm:inline">{session.user?.name || "Profile"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2">
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/${role}`} className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link
              href="/register"
              className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
            >
              Register
            </Link>
          )}

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <User className="w-5 h-5" /> <span className="hidden sm:inline">Profile</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2">
                  <User className="w-4 h-4" /> My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard`} className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 cursor-pointer">
                <LogOut className="w-4 h-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex flex-col gap-2 px-4 py-3">
            {routes.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  pathname === r.href
                    ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {r.label}
              </Link>
            ))}

            {/* Always show Dark Mode Toggle */}
            <ModeToggle />

            {status === "authenticated" ? (
              <>
                <button
                  onClick={() => { setMobileOpen(false); handleSignOut(); }}
                  className="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-left transition"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
              >
                Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
