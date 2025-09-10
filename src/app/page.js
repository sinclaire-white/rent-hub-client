import Banner from "./components/Banner";
import BecomeOwnerSection from "./components/BecomeOwner";
import Categories from "./components/Categories";
import FeaturedListings from "./components/FeaturedListings";

import Newsletter from "./components/Newsletter";
import PopularListings from "./components/PopularListings";
import TestimonialsSection from "./components/Testimonials";
import TopRatedListings from "./components/TopRatedListings";
import ViewAllListings from "./components/ViewAllListings";

export default function Home() {
  return (
    <div>
      <main className="px-2 mx-auto max-w-7xl md:px-6">
        <Banner></Banner>
        <Categories></Categories>
        <FeaturedListings></FeaturedListings>
        <PopularListings></PopularListings>
        <TopRatedListings></TopRatedListings>
        <ViewAllListings></ViewAllListings>
        <BecomeOwnerSection></BecomeOwnerSection>
        <Newsletter></Newsletter>
        <TestimonialsSection></TestimonialsSection>
      </main>
      
    </div>
  );
}

