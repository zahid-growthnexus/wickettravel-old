"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Lightweight i18n: a translations dictionary + React context.
 * - English fallback when a key is missing in the active language.
 * - Arabic & Urdu flip layout direction to RTL.
 * - Choice persisted to localStorage (allowed: this is a real Next.js app).
 */

export type Lang = "en" | "es" | "fr" | "ar" | "ur";

export const LANGUAGES: { code: Lang; label: string; native: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", label: "English", native: "English", dir: "ltr" },
  { code: "es", label: "Spanish", native: "Español", dir: "ltr" },
  { code: "fr", label: "French", native: "Français", dir: "ltr" },
  { code: "ar", label: "Arabic", native: "العربية", dir: "rtl" },
  { code: "ur", label: "Urdu", native: "اردو", dir: "rtl" },
];

type Dict = Record<string, string>;

const en: Dict = {
  "nav.flights": "Flights",
  "nav.hotels": "Hotels",
  "nav.cars": "Car Rental",
  "nav.deals": "Deals",
  "nav.about": "About",
  "nav.contact": "Contact",
  "cta.getQuote": "Get Quote",
  "cta.searchDeals": "Search Flights",
  "hero.badge": "Flights · Hotels & Car Rentals",
  "hero.title": "Trusted airline tickets",
  "hero.accent": "at the best fares",
  "hero.subline":
    "We find you the lowest available fares on the world's leading airlines and connect you straight to the best deal — trusted carriers, no hidden booking fees.",
  "hero.helper": "Best available fares · Trusted airlines only · No hidden booking fees",
  "tab.flights": "Flights",
  "tab.hotels": "Hotels",
  "tab.cars": "Car Rental",
  "cat.eyebrow": "Browse & book",
  "cat.title": "Everything you need for the perfect trip",
  "cat.lead":
    "Flights are our focus — and we round out the journey too. Pick a category and let Wicket find you trusted options at the best fares.",
  "fs.return": "Return",
  "fs.oneway": "One way",
  "fs.from": "From",
  "fs.to": "To",
  "fs.swap": "Swap origin and destination",
  "fs.depart": "Depart",
  "fs.returnDate": "Return",
  "fs.travelers": "Travelers",
  "fs.cabin": "Cabin class",
  "fs.airline": "Airline",
  "fs.direct": "Direct flights only",
  "fs.search": "Search Flights",
  "fs.searchPh": "City or airport",
  "fs.moreOptions": "More options",
  "fs.childAges": "Children's ages",
  "fs.age": "Age",
  "fs.noResults": "No airports match — try a city or 3-letter code",
  "fs.routeNudge": "Enter your route to continue",
  "fs.hotelRedirect": "Hotels are handled on our holidays site — opening in a new tab.",
  "airline.any": "Any airline",
  "trust.eyebrow": "Trusted airline partners",
  "trust.line": "Tickets from the world's most trusted airlines.",
  "cat.packages": "Packages",
  "dest.eyebrow": "Popular right now",
  "dest.title": "Trending destinations travelers love",
  "hotels.eyebrow": "Stays worth the trip",
  "hotels.title": "Handpicked hotels & resorts",
  "hotels.lead":
    "From our exclusive resort collection on Wicket Travel Holidays — tap any stay to explore rates and availability on our holidays site.",
  "hotels.cta": "Explore all hotels & resorts",
  "why.eyebrow": "Why Wicket Travel",
  "why.title": "Smarter travel starts with a better search",
  "how.eyebrow": "How it works",
  "how.title": "Find the best price in three steps",
  "deals.eyebrow": "Featured deals",
  "deals.title": "Hand-picked offers, refreshed daily",
  "deals.viewAll": "View all deals",
  "guar.eyebrow": "Trust & security",
  "guar.title": "Book with total confidence",
  "guar.badge": "Best-Price Guarantee",
  "rev.eyebrow": "Loved by travelers",
  "rev.title": "Rated excellent by 2 million+ travelers",
  "rev2.title": "Rated Excellent by real travelers on Trustpilot",
  "rev2.link": "Read our reviews",
  "news.title": "Never miss a price drop",
  "news.lead":
    "Join 800,000+ smart travelers and get the best available airfares from trusted airlines delivered to your inbox. No spam — just great fares.",
  "news.placeholder": "you@example.com",
  "news.button": "Get deal alerts",
  "cookie.title": "We value your privacy",
  "cookie.body":
    "We use cookies to personalize your experience, remember your preferences and improve our service. Choose how we use them.",
  "cookie.accept": "Accept all",
  "cookie.reject": "Reject",
  "cookie.prefs": "Preferences",
  "wa.tooltip": "Chat with us on WhatsApp",
  "lang.title": "Choose your language",
  "sticky.text": "Book trusted airline tickets at the best fares",
  "sticky.cta": "Search Flights",
  "fares.eyebrow": "Featured airlines",
  "fares.title": "Fly with the world's most trusted airlines",
  "fares.lead":
    "Hand-picked airlines flying the routes travelers love most — book real tickets at the best available fares, with no hidden booking fees.",
  "fares.cta": "Search fares",
  "city.eyebrow": "Today's best fares",
  "city.title": "Best flight fares by region",
  "city.lead":
    "Pick a region to see the destinations travelers are booking right now — always at the best available fares from trusted airlines.",
  "city.from": "From",
  "city.soft": "Starting from low fares",
  "city.cta": "Search flights",
  "call.eyebrow": "Talk to a real person",
  "call.title": "Prefer to book by phone? We're here 24/7",
  "call.lead":
    "Our travel specialists can find you the best available fares and tailor your trip — call us any time, day or night.",
  "call.cta": "Call now",
  "call.note": "24/7 support · Trusted airlines · No hidden fees",
  "certs.title": "Booking you can trust",
};

const es: Dict = {
  "nav.flights": "Vuelos",
  "nav.hotels": "Hoteles",
  "nav.cars": "Alquiler de coches",
  "nav.deals": "Ofertas",
  "nav.about": "Nosotros",
  "nav.contact": "Contacto",
  "cta.getQuote": "Obtener cotización",
  "cta.searchDeals": "Buscar vuelos",
  "hero.badge": "Vuelos · Hoteles y coches",
  "hero.title": "Billetes de avión de confianza",
  "hero.accent": "a las mejores tarifas",
  "hero.subline":
    "Encontramos las tarifas más bajas disponibles en las principales aerolíneas del mundo y te conectamos directamente con la mejor oferta. Aerolíneas de confianza, sin comisiones ocultas.",
  "hero.helper": "Mejores tarifas disponibles · Solo aerolíneas de confianza · Sin comisiones ocultas",
  "tab.flights": "Vuelos",
  "tab.hotels": "Hoteles",
  "tab.cars": "Coches",
  "cat.eyebrow": "Explora y reserva",
  "cat.title": "Todo lo que necesitas para el viaje perfecto",
  "cat.lead":
    "Los vuelos son nuestra prioridad, y completamos el resto del viaje. Elige una categoría y deja que Wicket te encuentre opciones de confianza a las mejores tarifas.",
  "fs.return": "Ida y vuelta",
  "fs.oneway": "Solo ida",
  "fs.from": "Desde",
  "fs.to": "Hasta",
  "fs.swap": "Intercambiar origen y destino",
  "fs.depart": "Salida",
  "fs.returnDate": "Regreso",
  "fs.travelers": "Viajeros",
  "fs.cabin": "Clase",
  "fs.airline": "Aerolínea",
  "fs.direct": "Solo vuelos directos",
  "fs.search": "Buscar vuelos",
  "fs.searchPh": "Ciudad o aeropuerto",
  "fs.moreOptions": "Más opciones",
  "fs.childAges": "Edad de los niños",
  "fs.age": "Edad",
  "fs.noResults": "No hay aeropuertos — prueba una ciudad o un código de 3 letras",
  "fs.routeNudge": "Introduce tu ruta para continuar",
  "fs.hotelRedirect": "Los hoteles se gestionan en nuestro sitio de vacaciones — abriendo en una nueva pestaña.",
  "airline.any": "Cualquier aerolínea",
  "trust.eyebrow": "Aerolíneas de confianza",
  "trust.line": "Billetes de las aerolíneas más fiables del mundo.",
  "cat.packages": "Paquetes",
  "dest.eyebrow": "Populares ahora",
  "dest.title": "Destinos de moda que aman los viajeros",
  "why.eyebrow": "Por qué Wicket Travel",
  "why.title": "Viajar mejor empieza con una mejor búsqueda",
  "how.eyebrow": "Cómo funciona",
  "how.title": "Encuentra el mejor precio en tres pasos",
  "deals.eyebrow": "Ofertas destacadas",
  "deals.title": "Ofertas seleccionadas, actualizadas a diario",
  "deals.viewAll": "Ver todas las ofertas",
  "guar.eyebrow": "Confianza y seguridad",
  "guar.title": "Reserva con total confianza",
  "guar.badge": "Garantía del mejor precio",
  "rev.eyebrow": "Amado por los viajeros",
  "rev.title": "Valorado como excelente por más de 2 millones de viajeros",
  "news.title": "No te pierdas ninguna bajada de precio",
  "news.lead":
    "Únete a más de 800.000 viajeros inteligentes y recibe las ofertas más baratas de vuelos, hoteles y coches en tu correo. Sin spam, solo ahorro.",
  "news.placeholder": "tu@ejemplo.com",
  "news.button": "Recibir alertas",
  "cookie.title": "Valoramos tu privacidad",
  "cookie.body":
    "Usamos cookies para personalizar tu experiencia, recordar tus preferencias y mejorar nuestro servicio. Elige cómo las usamos.",
  "cookie.accept": "Aceptar todo",
  "cookie.reject": "Rechazar",
  "cookie.prefs": "Preferencias",
  "wa.tooltip": "Chatea con nosotros por WhatsApp",
  "lang.title": "Elige tu idioma",
  "sticky.text": "Reserva billetes de aerolíneas de confianza a las mejores tarifas",
  "sticky.cta": "Buscar vuelos",
};

const fr: Dict = {
  "nav.flights": "Vols",
  "nav.hotels": "Hôtels",
  "nav.cars": "Location de voiture",
  "nav.deals": "Offres",
  "nav.about": "À propos",
  "nav.contact": "Contact",
  "cta.getQuote": "Obtenir un devis",
  "cta.searchDeals": "Rechercher des vols",
  "hero.badge": "Vols · Hôtels et voitures",
  "hero.title": "Billets d'avion de confiance",
  "hero.accent": "aux meilleurs tarifs",
  "hero.subline":
    "Nous vous trouvons les tarifs les plus bas disponibles sur les plus grandes compagnies aériennes du monde et vous mettons directement en relation avec la meilleure offre. Des compagnies de confiance, sans frais cachés.",
  "hero.helper": "Meilleurs tarifs disponibles · Compagnies de confiance uniquement · Sans frais cachés",
  "tab.flights": "Vols",
  "tab.hotels": "Hôtels",
  "tab.cars": "Voitures",
  "cat.eyebrow": "Explorer et réserver",
  "cat.title": "Tout ce qu'il faut pour le voyage parfait",
  "cat.lead":
    "Les vols sont notre priorité, et nous complétons tout le voyage. Choisissez une catégorie et laissez Wicket vous trouver des options de confiance aux meilleurs tarifs.",
  "fs.return": "Aller-retour",
  "fs.oneway": "Aller simple",
  "fs.from": "De",
  "fs.to": "À",
  "fs.swap": "Inverser le départ et la destination",
  "fs.depart": "Départ",
  "fs.returnDate": "Retour",
  "fs.travelers": "Voyageurs",
  "fs.cabin": "Classe",
  "fs.airline": "Compagnie",
  "fs.direct": "Vols directs uniquement",
  "fs.search": "Rechercher des vols",
  "fs.searchPh": "Ville ou aéroport",
  "fs.moreOptions": "Plus d'options",
  "fs.childAges": "Âge des enfants",
  "fs.age": "Âge",
  "fs.noResults": "Aucun aéroport — essayez une ville ou un code à 3 lettres",
  "fs.hotelRedirect": "Les hôtels sont gérés sur notre site de séjours — ouverture dans un nouvel onglet.",
  "airline.any": "Toutes les compagnies",
  "trust.eyebrow": "Compagnies de confiance",
  "trust.line": "Des billets sur les compagnies aériennes les plus fiables du monde.",
  "cat.packages": "Forfaits",
  "dest.eyebrow": "Populaire en ce moment",
  "dest.title": "Destinations tendance que les voyageurs adorent",
  "why.eyebrow": "Pourquoi Wicket Travel",
  "why.title": "Mieux voyager commence par une meilleure recherche",
  "how.eyebrow": "Comment ça marche",
  "how.title": "Trouvez le meilleur prix en trois étapes",
  "deals.eyebrow": "Offres en vedette",
  "deals.title": "Offres triées sur le volet, actualisées chaque jour",
  "deals.viewAll": "Voir toutes les offres",
  "guar.eyebrow": "Confiance et sécurité",
  "guar.title": "Réservez en toute confiance",
  "guar.badge": "Garantie du meilleur prix",
  "rev.eyebrow": "Plébiscité par les voyageurs",
  "rev.title": "Noté excellent par plus de 2 millions de voyageurs",
  "news.title": "Ne manquez aucune baisse de prix",
  "news.lead":
    "Rejoignez plus de 800 000 voyageurs avisés et recevez les meilleures offres de vols, hôtels et voitures dans votre boîte mail. Pas de spam, que des économies.",
  "news.placeholder": "vous@exemple.com",
  "news.button": "Recevoir les alertes",
  "cookie.title": "Nous respectons votre vie privée",
  "cookie.body":
    "Nous utilisons des cookies pour personnaliser votre expérience, mémoriser vos préférences et améliorer notre service. Choisissez comment nous les utilisons.",
  "cookie.accept": "Tout accepter",
  "cookie.reject": "Refuser",
  "cookie.prefs": "Préférences",
  "wa.tooltip": "Discutez avec nous sur WhatsApp",
  "lang.title": "Choisissez votre langue",
  "sticky.text": "Réservez des billets d'avion de confiance aux meilleurs tarifs",
  "sticky.cta": "Rechercher des vols",
};

const ar: Dict = {
  "nav.flights": "رحلات الطيران",
  "nav.hotels": "الفنادق",
  "nav.cars": "تأجير السيارات",
  "nav.deals": "العروض",
  "nav.about": "من نحن",
  "nav.contact": "اتصل بنا",
  "cta.getQuote": "اطلب عرض سعر",
  "cta.searchDeals": "ابحث عن رحلات",
  "hero.badge": "رحلات · فنادق وسيارات",
  "hero.title": "تذاكر طيران موثوقة",
  "hero.accent": "بأفضل الأسعار",
  "hero.subline":
    "نجد لك أقل الأسعار المتاحة على أكبر شركات الطيران في العالم ونوصلك مباشرةً بأفضل عرض. شركات طيران موثوقة، بدون رسوم خفية.",
  "hero.helper": "أفضل الأسعار المتاحة · شركات طيران موثوقة فقط · بدون رسوم حجز خفية",
  "tab.flights": "رحلات الطيران",
  "tab.hotels": "الفنادق",
  "tab.cars": "السيارات",
  "cat.eyebrow": "تصفّح واحجز",
  "cat.title": "كل ما تحتاجه لرحلة مثالية",
  "cat.lead":
    "رحلات الطيران هي محور تركيزنا، ونكمل لك بقية الرحلة. اختر فئة ودع Wicket يجد لك خيارات موثوقة بأفضل الأسعار.",
  "fs.return": "ذهاب وعودة",
  "fs.oneway": "ذهاب فقط",
  "fs.from": "من",
  "fs.to": "إلى",
  "fs.swap": "تبديل المغادرة والوجهة",
  "fs.depart": "المغادرة",
  "fs.returnDate": "العودة",
  "fs.travelers": "المسافرون",
  "fs.cabin": "الدرجة",
  "fs.airline": "شركة الطيران",
  "fs.direct": "رحلات مباشرة فقط",
  "fs.search": "ابحث عن رحلات",
  "fs.searchPh": "مدينة أو مطار",
  "fs.moreOptions": "خيارات إضافية",
  "fs.childAges": "أعمار الأطفال",
  "fs.age": "العمر",
  "fs.noResults": "لا توجد مطارات — جرّب اسم مدينة أو رمزًا من 3 أحرف",
  "fs.hotelRedirect": "تتم إدارة الفنادق على موقع العطلات لدينا — يُفتح في علامة تبويب جديدة.",
  "airline.any": "أي شركة طيران",
  "trust.eyebrow": "شركات طيران موثوقة",
  "trust.line": "تذاكر من أكثر شركات الطيران موثوقية في العالم.",
  "cat.packages": "الباقات",
  "dest.eyebrow": "الأكثر رواجًا الآن",
  "dest.title": "وجهات شهيرة يعشقها المسافرون",
  "why.eyebrow": "لماذا Wicket Travel",
  "why.title": "السفر الأذكى يبدأ ببحث أفضل",
  "how.eyebrow": "كيف يعمل",
  "how.title": "اعثر على أفضل سعر في ثلاث خطوات",
  "deals.eyebrow": "عروض مميزة",
  "deals.title": "عروض مختارة بعناية، تتجدد يوميًا",
  "deals.viewAll": "عرض كل العروض",
  "guar.eyebrow": "الثقة والأمان",
  "guar.title": "احجز بثقة تامة",
  "guar.badge": "ضمان أفضل سعر",
  "rev.eyebrow": "محبوب من المسافرين",
  "rev.title": "تقييم ممتاز من أكثر من مليوني مسافر",
  "news.title": "لا تفوّت أي انخفاض في الأسعار",
  "news.lead":
    "انضم إلى أكثر من 800,000 مسافر ذكي واحصل على أرخص عروض الطيران والفنادق والسيارات في بريدك. بلا إزعاج، فقط توفير.",
  "news.placeholder": "you@example.com",
  "news.button": "تنبيهات العروض",
  "cookie.title": "نحن نحترم خصوصيتك",
  "cookie.body":
    "نستخدم ملفات تعريف الارتباط لتخصيص تجربتك وتذكّر تفضيلاتك وتحسين خدمتنا. اختر كيفية استخدامنا لها.",
  "cookie.accept": "قبول الكل",
  "cookie.reject": "رفض",
  "cookie.prefs": "التفضيلات",
  "wa.tooltip": "تواصل معنا عبر واتساب",
  "lang.title": "اختر لغتك",
  "sticky.text": "احجز تذاكر طيران موثوقة بأفضل الأسعار",
  "sticky.cta": "ابحث عن رحلات",
};

const ur: Dict = {
  "nav.flights": "پروازیں",
  "nav.hotels": "ہوٹل",
  "nav.cars": "کرایہ پر گاڑی",
  "nav.deals": "ڈیلز",
  "nav.about": "ہمارے بارے میں",
  "nav.contact": "رابطہ",
  "cta.getQuote": "کوٹ حاصل کریں",
  "cta.searchDeals": "پروازیں تلاش کریں",
  "hero.badge": "پروازیں · ہوٹل اور گاڑیاں",
  "hero.title": "بھروسہ مند ایئر لائن ٹکٹ",
  "hero.accent": "بہترین کرایوں پر",
  "hero.subline":
    "ہم آپ کے لیے دنیا کی معروف ترین ایئر لائنز پر دستیاب کم ترین کرایے تلاش کرتے ہیں اور آپ کو سیدھا بہترین ڈیل سے جوڑتے ہیں۔ بھروسہ مند ایئر لائنز، کوئی چھپی فیس نہیں۔",
  "hero.helper": "بہترین دستیاب کرایے · صرف بھروسہ مند ایئر لائنز · کوئی چھپی بکنگ فیس نہیں",
  "tab.flights": "پروازیں",
  "tab.hotels": "ہوٹل",
  "tab.cars": "گاڑیاں",
  "cat.eyebrow": "دیکھیں اور بُک کریں",
  "cat.title": "بہترین سفر کے لیے ہر وہ چیز جو آپ کو چاہیے",
  "cat.lead":
    "پروازیں ہماری ترجیح ہیں، اور ہم پورے سفر کو مکمل کرتے ہیں۔ ایک زمرہ منتخب کریں اور Wicket کو بہترین کرایوں پر بھروسہ مند آپشنز تلاش کرنے دیں۔",
  "fs.return": "واپسی",
  "fs.oneway": "یک طرفہ",
  "fs.from": "کہاں سے",
  "fs.to": "کہاں تک",
  "fs.swap": "روانگی اور منزل تبدیل کریں",
  "fs.depart": "روانگی",
  "fs.returnDate": "واپسی",
  "fs.travelers": "مسافر",
  "fs.cabin": "کلاس",
  "fs.airline": "ایئر لائن",
  "fs.direct": "صرف براہِ راست پروازیں",
  "fs.search": "پروازیں تلاش کریں",
  "fs.searchPh": "شہر یا ہوائی اڈہ",
  "fs.moreOptions": "مزید اختیارات",
  "fs.childAges": "بچوں کی عمریں",
  "fs.age": "عمر",
  "fs.noResults": "کوئی ہوائی اڈہ نہیں — شہر یا 3 حروف کا کوڈ آزمائیں",
  "fs.hotelRedirect": "ہوٹل ہماری ہالیڈیز سائٹ پر ہیں — نئی ٹیب میں کھل رہا ہے۔",
  "airline.any": "کوئی بھی ایئر لائن",
  "trust.eyebrow": "بھروسہ مند ایئر لائنز",
  "trust.line": "دنیا کی سب سے بھروسہ مند ایئر لائنز کے ٹکٹ۔",
  "cat.packages": "پیکجز",
  "dest.eyebrow": "اس وقت مقبول",
  "dest.title": "مشہور مقامات جو مسافروں کو پسند ہیں",
  "why.eyebrow": "Wicket Travel کیوں",
  "why.title": "بہتر سفر کا آغاز بہتر تلاش سے ہوتا ہے",
  "how.eyebrow": "یہ کیسے کام کرتا ہے",
  "how.title": "تین مراحل میں بہترین قیمت تلاش کریں",
  "deals.eyebrow": "نمایاں ڈیلز",
  "deals.title": "منتخب پیشکشیں، روزانہ تازہ",
  "deals.viewAll": "تمام ڈیلز دیکھیں",
  "guar.eyebrow": "اعتماد اور سلامتی",
  "guar.title": "مکمل اعتماد کے ساتھ بُک کریں",
  "guar.badge": "بہترین قیمت کی ضمانت",
  "rev.eyebrow": "مسافروں کا پسندیدہ",
  "rev.title": "20 لاکھ سے زائد مسافروں کی جانب سے بہترین درجہ بندی",
  "news.title": "قیمت میں کمی کبھی نہ چھوڑیں",
  "news.lead":
    "800,000 سے زائد سمجھدار مسافروں میں شامل ہوں اور پروازوں، ہوٹلوں اور گاڑیوں کی سستی ترین ڈیلز اپنے ان باکس میں حاصل کریں۔ کوئی اسپام نہیں، صرف بچت۔",
  "news.placeholder": "you@example.com",
  "news.button": "ڈیل الرٹس حاصل کریں",
  "cookie.title": "ہم آپ کی پرائیویسی کا خیال رکھتے ہیں",
  "cookie.body":
    "ہم آپ کے تجربے کو بہتر بنانے، آپ کی ترجیحات یاد رکھنے اور اپنی سروس بہتر کرنے کے لیے کوکیز استعمال کرتے ہیں۔ منتخب کریں کہ ہم انہیں کیسے استعمال کریں۔",
  "cookie.accept": "سب قبول کریں",
  "cookie.reject": "مسترد کریں",
  "cookie.prefs": "ترجیحات",
  "wa.tooltip": "واٹس ایپ پر ہم سے بات کریں",
  "lang.title": "اپنی زبان منتخب کریں",
  "sticky.text": "بھروسہ مند ایئر لائن ٹکٹ بہترین کرایوں پر بُک کریں",
  "sticky.cta": "پروازیں تلاش کریں",
};

const TRANSLATIONS: Record<Lang, Dict> = { en, es, fr, ar, ur };

type I18nValue = {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

const STORAGE_KEY = "wicket-lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Hydrate from localStorage after mount (avoids SSR mismatch).
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved && saved in TRANSLATIONS) setLangState(saved);
    } catch {
      /* ignore */
    }
  }, []);

  const dir = LANGUAGES.find((l) => l.code === lang)?.dir ?? "ltr";

  // Reflect language + direction on <html>.
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key: string) => TRANSLATIONS[lang][key] ?? TRANSLATIONS.en[key] ?? key,
    [lang]
  );

  const value = useMemo<I18nValue>(() => ({ lang, dir, setLang, t }), [lang, dir, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
