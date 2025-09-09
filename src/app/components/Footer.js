'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-base-200 dark:bg-base-300 text-base-content">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          
          {/* Column 1 - Branding */}
          <div>
            <h2 className="text-2xl font-bold mb-3">RentHub</h2>
            <p className="text-sm opacity-80 leading-relaxed">
              Your trusted rental marketplace.  
              Rent properties, vehicles, tools, and more — 
              all in one place with secure payments and AI-powered insights.
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="link link-hover">Home</Link></li>
              <li><Link href="/rent-posts" className="link link-hover">Listings</Link></li>
              <li><Link href="/about" className="link link-hover">About</Link></li>
              <li><Link href="/contact" className="link link-hover">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3 - Categories */}
          <div>
            <h3 className="font-semibold mb-3">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="link link-hover">Properties & Living</Link></li>
              <li><Link href="#" className="link link-hover">Vehicles</Link></li>
              <li><Link href="#" className="link link-hover">Land & Nature</Link></li>
              <li><Link href="#" className="link link-hover">Events & Venues</Link></li>
              
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h3 className="font-semibold mb-3">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} /> support@renthub.com
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} /> +880 123 456 789
              </li>
            </ul>

            {/* Social Media inside contact */}
            <div className="flex gap-4 mt-4">
              <a href="https://www.facebook.com" target="_blank" rel="noreferrer"
                 className="hover:text-blue-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noreferrer"
                 className="hover:text-sky-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer"
                 className="hover:text-pink-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer"
                 className="hover:text-blue-700 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="https://www.youtube.com" target="_blank" rel="noreferrer"
                 className="hover:text-red-600 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-base-300  text-center text-sm opacity-70">
          © {new Date().getFullYear()} RentHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
