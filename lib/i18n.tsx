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
  "cta.findDeals": "Find Deals",
  "cta.searchDeals": "Search Deals",
  "hero.badge": "Compare 500+ travel partners in one search",
  "hero.title": "Compare cheap flights, hotels &",
  "hero.accent": "car rentals",
  "hero.subline":
    "Wicket Travel searches hundreds of sites at once to find you the lowest price — then sends you straight to the best deal. No markups, no hidden fees, ever.",
  "hero.helper": "Free to compare · We never add booking fees · Prices update in real time",
  "tab.flights": "Flights",
  "tab.hotels": "Hotels",
  "tab.cars": "Car Rental",
  "cat.eyebrow": "Browse & book",
  "cat.title": "Everything you need for the perfect trip",
  "cat.lead":
    "Whatever you're planning, we compare it. Pick a category and let Wicket find you the cheapest way to go.",
  "cat.packages": "Packages",
  "dest.eyebrow": "Popular right now",
  "dest.title": "Trending destinations travelers love",
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
  "news.title": "Never miss a price drop",
  "news.lead":
    "Join 800,000+ smart travelers and get the cheapest flight, hotel and car-rental deals delivered to your inbox. No spam — just savings.",
  "news.placeholder": "you@example.com",
  "news.button": "Get deal alerts",
  "cookie.title": "We value your privacy",
  "cookie.body":
    "We use cookies to compare prices, remember your preferences and improve your experience. Choose how we use them.",
  "cookie.accept": "Accept all",
  "cookie.reject": "Reject",
  "cookie.prefs": "Preferences",
  "chat.title": "Wicket Assistant",
  "chat.subtitle": "Typically replies instantly",
  "chat.greeting":
    "Hi! 👋 I'm the Wicket travel assistant. Ask me about flights, hotels, car rentals or our best-price promise.",
  "chat.placeholder": "Type your message…",
  "lang.title": "Choose your language",
  "sticky.text": "Compare flights, hotels & car rentals",
  "sticky.cta": "Search Deals",
};

const es: Dict = {
  "nav.flights": "Vuelos",
  "nav.hotels": "Hoteles",
  "nav.cars": "Alquiler de coches",
  "nav.deals": "Ofertas",
  "nav.about": "Nosotros",
  "nav.contact": "Contacto",
  "cta.findDeals": "Ver ofertas",
  "cta.searchDeals": "Buscar ofertas",
  "hero.badge": "Compara más de 500 socios de viaje en una búsqueda",
  "hero.title": "Compara vuelos, hoteles y",
  "hero.accent": "alquiler de coches baratos",
  "hero.subline":
    "Wicket Travel busca en cientos de sitios a la vez para encontrarte el precio más bajo y te lleva directamente a la mejor oferta. Sin recargos ni comisiones ocultas.",
  "hero.helper": "Comparar es gratis · Nunca añadimos comisiones · Precios en tiempo real",
  "tab.flights": "Vuelos",
  "tab.hotels": "Hoteles",
  "tab.cars": "Coches",
  "cat.eyebrow": "Explora y reserva",
  "cat.title": "Todo lo que necesitas para el viaje perfecto",
  "cat.lead":
    "Sea lo que sea que planees, lo comparamos. Elige una categoría y deja que Wicket te encuentre la forma más barata de viajar.",
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
    "Usamos cookies para comparar precios, recordar tus preferencias y mejorar tu experiencia. Elige cómo las usamos.",
  "cookie.accept": "Aceptar todo",
  "cookie.reject": "Rechazar",
  "cookie.prefs": "Preferencias",
  "chat.title": "Asistente Wicket",
  "chat.subtitle": "Normalmente responde al instante",
  "chat.greeting":
    "¡Hola! 👋 Soy el asistente de viajes de Wicket. Pregúntame sobre vuelos, hoteles, alquiler de coches o nuestra garantía del mejor precio.",
  "chat.placeholder": "Escribe tu mensaje…",
  "lang.title": "Elige tu idioma",
  "sticky.text": "Compara vuelos, hoteles y coches",
  "sticky.cta": "Buscar ofertas",
};

const fr: Dict = {
  "nav.flights": "Vols",
  "nav.hotels": "Hôtels",
  "nav.cars": "Location de voiture",
  "nav.deals": "Offres",
  "nav.about": "À propos",
  "nav.contact": "Contact",
  "cta.findDeals": "Voir les offres",
  "cta.searchDeals": "Rechercher",
  "hero.badge": "Comparez plus de 500 partenaires en une recherche",
  "hero.title": "Comparez vols, hôtels et",
  "hero.accent": "location de voitures pas chers",
  "hero.subline":
    "Wicket Travel recherche des centaines de sites à la fois pour vous trouver le prix le plus bas, puis vous dirige vers la meilleure offre. Sans majoration ni frais cachés.",
  "hero.helper": "Comparaison gratuite · Aucuns frais ajoutés · Prix en temps réel",
  "tab.flights": "Vols",
  "tab.hotels": "Hôtels",
  "tab.cars": "Voitures",
  "cat.eyebrow": "Explorer et réserver",
  "cat.title": "Tout ce qu'il faut pour le voyage parfait",
  "cat.lead":
    "Quel que soit votre projet, nous le comparons. Choisissez une catégorie et laissez Wicket vous trouver le trajet le moins cher.",
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
    "Nous utilisons des cookies pour comparer les prix, mémoriser vos préférences et améliorer votre expérience. Choisissez comment nous les utilisons.",
  "cookie.accept": "Tout accepter",
  "cookie.reject": "Refuser",
  "cookie.prefs": "Préférences",
  "chat.title": "Assistant Wicket",
  "chat.subtitle": "Répond généralement instantanément",
  "chat.greeting":
    "Bonjour ! 👋 Je suis l'assistant voyage de Wicket. Posez-moi vos questions sur les vols, hôtels, locations de voitures ou notre garantie du meilleur prix.",
  "chat.placeholder": "Écrivez votre message…",
  "lang.title": "Choisissez votre langue",
  "sticky.text": "Comparez vols, hôtels et voitures",
  "sticky.cta": "Rechercher",
};

const ar: Dict = {
  "nav.flights": "رحلات الطيران",
  "nav.hotels": "الفنادق",
  "nav.cars": "تأجير السيارات",
  "nav.deals": "العروض",
  "nav.about": "من نحن",
  "nav.contact": "اتصل بنا",
  "cta.findDeals": "اكتشف العروض",
  "cta.searchDeals": "ابحث عن العروض",
  "hero.badge": "قارن بين أكثر من 500 شريك سفر في بحث واحد",
  "hero.title": "قارن رحلات الطيران والفنادق و",
  "hero.accent": "تأجير السيارات بأرخص الأسعار",
  "hero.subline":
    "يبحث Wicket Travel في مئات المواقع في آنٍ واحد ليجد لك أقل سعر، ثم يوجّهك مباشرةً إلى أفضل عرض. بدون أي زيادات أو رسوم خفية.",
  "hero.helper": "المقارنة مجانية · لا نضيف أي رسوم حجز · أسعار محدّثة لحظيًا",
  "tab.flights": "رحلات الطيران",
  "tab.hotels": "الفنادق",
  "tab.cars": "السيارات",
  "cat.eyebrow": "تصفّح واحجز",
  "cat.title": "كل ما تحتاجه لرحلة مثالية",
  "cat.lead":
    "مهما كانت خططك، نحن نقارنها. اختر فئة ودع Wicket يجد لك أرخص طريقة للسفر.",
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
    "نستخدم ملفات تعريف الارتباط لمقارنة الأسعار وتذكّر تفضيلاتك وتحسين تجربتك. اختر كيفية استخدامنا لها.",
  "cookie.accept": "قبول الكل",
  "cookie.reject": "رفض",
  "cookie.prefs": "التفضيلات",
  "chat.title": "مساعد Wicket",
  "chat.subtitle": "يردّ عادةً على الفور",
  "chat.greeting":
    "مرحبًا! 👋 أنا مساعد السفر من Wicket. اسألني عن رحلات الطيران والفنادق وتأجير السيارات أو ضمان أفضل سعر.",
  "chat.placeholder": "اكتب رسالتك…",
  "lang.title": "اختر لغتك",
  "sticky.text": "قارن رحلات الطيران والفنادق والسيارات",
  "sticky.cta": "ابحث عن العروض",
};

const ur: Dict = {
  "nav.flights": "پروازیں",
  "nav.hotels": "ہوٹل",
  "nav.cars": "کرایہ پر گاڑی",
  "nav.deals": "ڈیلز",
  "nav.about": "ہمارے بارے میں",
  "nav.contact": "رابطہ",
  "cta.findDeals": "ڈیلز تلاش کریں",
  "cta.searchDeals": "ڈیلز تلاش کریں",
  "hero.badge": "ایک تلاش میں 500 سے زائد سفری شراکت داروں کا موازنہ کریں",
  "hero.title": "سستی پروازوں، ہوٹلوں اور",
  "hero.accent": "کرایہ کی گاڑیوں کا موازنہ کریں",
  "hero.subline":
    "Wicket Travel ایک ساتھ سینکڑوں سائٹس تلاش کرتا ہے تاکہ آپ کو کم ترین قیمت ملے، پھر آپ کو سیدھا بہترین ڈیل پر لے جاتا ہے۔ کوئی اضافی یا چھپی فیس نہیں۔",
  "hero.helper": "موازنہ مفت ہے · ہم کبھی بکنگ فیس نہیں لگاتے · قیمتیں فوری اپ ڈیٹ",
  "tab.flights": "پروازیں",
  "tab.hotels": "ہوٹل",
  "tab.cars": "گاڑیاں",
  "cat.eyebrow": "دیکھیں اور بُک کریں",
  "cat.title": "بہترین سفر کے لیے ہر وہ چیز جو آپ کو چاہیے",
  "cat.lead":
    "آپ جو بھی منصوبہ بنائیں، ہم اس کا موازنہ کرتے ہیں۔ ایک زمرہ منتخب کریں اور Wicket کو سب سے سستا راستہ تلاش کرنے دیں۔",
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
    "ہم قیمتوں کا موازنہ کرنے، آپ کی ترجیحات یاد رکھنے اور تجربہ بہتر بنانے کے لیے کوکیز استعمال کرتے ہیں۔ منتخب کریں کہ ہم انہیں کیسے استعمال کریں۔",
  "cookie.accept": "سب قبول کریں",
  "cookie.reject": "مسترد کریں",
  "cookie.prefs": "ترجیحات",
  "chat.title": "Wicket اسسٹنٹ",
  "chat.subtitle": "عام طور پر فوراً جواب دیتا ہے",
  "chat.greeting":
    "ہیلو! 👋 میں Wicket کا سفری اسسٹنٹ ہوں۔ مجھ سے پروازوں، ہوٹلوں، کرایہ کی گاڑیوں یا بہترین قیمت کی ضمانت کے بارے میں پوچھیں۔",
  "chat.placeholder": "اپنا پیغام لکھیں…",
  "lang.title": "اپنی زبان منتخب کریں",
  "sticky.text": "پروازوں، ہوٹلوں اور گاڑیوں کا موازنہ کریں",
  "sticky.cta": "ڈیلز تلاش کریں",
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
