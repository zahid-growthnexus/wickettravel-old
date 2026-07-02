import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AirlineLogos from "@/components/AirlineLogos";
import TrustBar from "@/components/TrustBar";
import FeaturedAirlineFares from "@/components/FeaturedAirlineFares";
import TravelByCategory from "@/components/TravelByCategory";
import PopularDestinations from "@/components/PopularDestinations";
import BestFaresByCity from "@/components/BestFaresByCity";
import WhyChoose from "@/components/WhyChoose";
import HowItWorks from "@/components/HowItWorks";
import FeaturedDeals from "@/components/FeaturedDeals";
import CallUsBand from "@/components/CallUsBand";
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
        <AirlineLogos />
        <TrustBar />
        <FeaturedAirlineFares />
        <TravelByCategory />
        <PopularDestinations />
        <BestFaresByCity />
        <WhyChoose />
        <HowItWorks />
        <FeaturedDeals />
        <CallUsBand />
        <BestPriceGuarantee />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
