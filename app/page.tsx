import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import TravelByCategory from "@/components/TravelByCategory";
import PopularDestinations from "@/components/PopularDestinations";
import WhyChoose from "@/components/WhyChoose";
import HowItWorks from "@/components/HowItWorks";
import FeaturedDeals from "@/components/FeaturedDeals";
import BestPriceGuarantee from "@/components/BestPriceGuarantee";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <TrustBar />
        <TravelByCategory />
        <PopularDestinations />
        <WhyChoose />
        <HowItWorks />
        <FeaturedDeals />
        <BestPriceGuarantee />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
