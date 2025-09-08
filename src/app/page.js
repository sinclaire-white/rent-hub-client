
'use client';



import Link from 'next/link';
import CategoriesSection from './components/Categories';
import Banner from "@/components/ui/Banner";
import FeaturedListings from './components/FeaturedListings';
import PopularListings from './components/PopularListings';
import TopRatedListings from './components/TopRatedListings';
import BecomeOwnerSection from './components/BecomeOwner';
import Testimonials from './components/Testimonials';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-base-100 dark:bg-base-200">
      <Banner />
      <main className="flex-grow container mx-auto px-4 max-w-7xl">
         
        <CategoriesSection></CategoriesSection>

import BecomeOwnerSection from "./components/BecomeOwner";
import Categories from "./components/Categories";
import FeaturedListings from "./components/FeaturedListings";
import Footer from "./components/Footer";
import Newsletter from "./components/Newsletter";
import PopularListings from "./components/PopularListings";
import TopRatedListings from "./components/TopRatedListings";

export default function Home() {
  return (
    <div>
      <main className="mx-auto max-w-7xl">
        <Categories></Categories>

        <FeaturedListings></FeaturedListings>
        <PopularListings></PopularListings>
        <TopRatedListings></TopRatedListings>
        <BecomeOwnerSection></BecomeOwnerSection>
        <Newsletter></Newsletter>
      </main>
      <Footer></Footer>
    </div>
  );
}

