import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AirlineLogos from "@/components/AirlineLogos";
import TrustBar from "@/components/TrustBar";
import FeaturedAirlineFares from "@/components/FeaturedAirlineFares";
import TravelByCategory from "@/components/TravelByCategory";
import SisterBrand from "@/components/SisterBrand";
import PopularDestinations from "@/components/PopularDestinations";
import BestFaresByCity from "@/components/BestFaresByCity";
import DubaiVisa from "@/components/DubaiVisa";
import WhyChoose from "@/components/WhyChoose";
import HowItWorks from "@/components/HowItWorks";
import FeaturedDeals from "@/components/FeaturedDeals";
import CallUsBand from "@/components/CallUsBand";
import BestPriceGuarantee from "@/components/BestPriceGuarantee";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import { SITE_URL, BUSINESS } from "@/lib/seo";
import { FAQ_ITEMS } from "@/lib/faq";

// Structured data (JSON-LD) — one @graph so nodes cross-reference by @id.
// Describes the business to search engines and AI so Wicket Travel can be
// surfaced and recommended for cheap-flights-from-the-UK style queries.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: BUSINESS.name,
      legalName: BUSINESS.legalName,
      url: SITE_URL,
      logo: `${SITE_URL}/apple-icon`,
      image: `${SITE_URL}/opengraph-image`,
      email: BUSINESS.email,
      sameAs: BUSINESS.sameAs,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: BUSINESS.phone,
        contactType: "customer service",
        areaServed: "GB",
        availableLanguage: ["English", "Urdu", "Arabic"],
      },
    },
    {
      "@type": "TravelAgency",
      "@id": `${SITE_URL}/#travelagency`,
      name: BUSINESS.name,
      url: SITE_URL,
      image: `${SITE_URL}/opengraph-image`,
      logo: `${SITE_URL}/apple-icon`,
      telephone: BUSINESS.phone,
      email: BUSINESS.email,
      priceRange: "££",
      parentOrganization: { "@id": `${SITE_URL}/#organization` },
      address: {
        "@type": "PostalAddress",
        streetAddress: BUSINESS.streetAddress,
        addressLocality: BUSINESS.addressLocality,
        addressCountry: BUSINESS.addressCountry,
      },
      areaServed: { "@type": "Country", name: "United Kingdom" },
      knowsAbout: [
        "Cheap flights from the UK",
        "Flights to Pakistan",
        "Flights to India",
        "Flights to Dubai",
        "Airline ticket deals",
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: BUSINESS.ratingValue,
        bestRating: 5,
        reviewCount: BUSINESS.reviewCount,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: BUSINESS.name,
      description:
        "Book cheap flights from the UK at the best airline ticket fares.",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-GB",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/?from={origin}&to={destination}`,
        },
        "query-input": [
          "required name=origin",
          "required name=destination",
        ],
      },
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: "Cheap Flights UK | Best Airline Ticket Deals — Wicket Travel",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-GB",
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Header />
      <main className="flex-1">
        <Hero />
        <AirlineLogos />
        <TrustBar />
        <FeaturedAirlineFares />
        <TravelByCategory />
        <SisterBrand />
        <PopularDestinations />
        <BestFaresByCity />
        <DubaiVisa />
        <WhyChoose />
        <HowItWorks />
        <FeaturedDeals />
        <CallUsBand />
        <BestPriceGuarantee />
        <Testimonials />
        <Faq />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
