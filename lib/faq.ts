/**
 * Homepage FAQ — shared between the visible <Faq> section and the FAQPage
 * JSON-LD in app/page.tsx so the structured data always matches what users see
 * (a Google requirement for FAQ rich results). Answers are plain text and
 * naturally weave in primary keywords: cheap flights from the UK, best airline
 * fares, ATOL-style protection, UK departures and 24/7 support.
 */
export type FaqItem = { question: string; answer: string };

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How does Wicket Travel find cheap flights from the UK?",
    answer:
      "We search the best available fares across the world's leading airlines — British Airways, Emirates, Qatar Airways, Virgin Atlantic and more — on departures from Heathrow, Manchester, Birmingham, Gatwick, Luton and Edinburgh, then connect you straight to the best deal. There are no hidden booking fees, so the fare you see is the fare you pay.",
  },
  {
    question: "Can I book flights from the UK to Pakistan, India or Dubai?",
    answer:
      "Yes. Popular routes to Pakistan (Karachi, Lahore, Islamabad), India (Delhi, Mumbai) and Dubai are among our most-booked, with trusted carriers flying direct and one-stop from major UK cities. Enter your route and dates to see the best airline ticket deals available right now.",
  },
  {
    question: "Are the airline tickets I book trusted and protected?",
    answer:
      "Every ticket is with a fully-licensed, trusted airline — never an unknown reseller. Bookings are handled with ATOL-style financial protection and bank-level 256-bit SSL security, giving you complete peace of mind from search to confirmation.",
  },
  {
    question: "Do you charge hidden booking or card fees?",
    answer:
      "No. Wicket Travel never adds surprise booking fees at checkout. We're on your side, not the seller's, and our Best-Price Guarantee means if you find the same fare cheaper elsewhere we'll help you match it.",
  },
  {
    question: "How do I book by phone or get support?",
    answer:
      "Our UK travel specialists are available 24/7. Call +44 7417 564704 or message us on WhatsApp any time, day or night, and a real person will help you find the best available fares and tailor your trip.",
  },
  {
    question: "Do you also book hotels and car rentals?",
    answer:
      "Flights are our focus. Hotels, resorts, holiday packages and car rentals are handled by our sister brand, Wicket Travel Holidays, so you can plan the whole journey with the same trusted team and best-price promise.",
  },
];
