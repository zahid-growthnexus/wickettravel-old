/**
 * A compact, client-side directory of major world airports used to power the
 * From / To autocomplete in the flight search widget. No network calls — the
 * list is filtered locally as the traveler types.
 *
 * `metro: true` entries are city-wide codes ("All Paris Airports") that group
 * several airports under one search; they're surfaced first so a traveler can
 * search a whole city in one go.
 */
export type Airport = {
  /** IATA code (airport e.g. LHR, or metro e.g. PAR). */
  code: string;
  /** City / metro name. */
  city: string;
  /** Airport name (omitted for metro/all-airports entries). */
  name?: string;
  country: string;
  /** True for city-wide "All <city> Airports" codes. */
  metro?: boolean;
};

export const AIRPORTS: Airport[] = [
  // Metro (all-airports) codes first
  { code: "LON", city: "London", country: "UK", metro: true },
  { code: "PAR", city: "Paris", country: "France", metro: true },
  { code: "NYC", city: "New York", country: "USA", metro: true },
  { code: "TYO", city: "Tokyo", country: "Japan", metro: true },
  { code: "MIL", city: "Milan", country: "Italy", metro: true },

  // United Kingdom & Ireland
  { code: "LHR", city: "London", name: "Heathrow", country: "UK" },
  { code: "LGW", city: "London", name: "Gatwick", country: "UK" },
  { code: "STN", city: "London", name: "Stansted", country: "UK" },
  { code: "MAN", city: "Manchester", name: "Manchester", country: "UK" },
  { code: "EDI", city: "Edinburgh", name: "Edinburgh", country: "UK" },
  { code: "BHX", city: "Birmingham", name: "Birmingham", country: "UK" },
  { code: "DUB", city: "Dublin", name: "Dublin", country: "Ireland" },

  // Europe
  { code: "CDG", city: "Paris", name: "Charles de Gaulle", country: "France" },
  { code: "ORY", city: "Paris", name: "Orly", country: "France" },
  { code: "AMS", city: "Amsterdam", name: "Schiphol", country: "Netherlands" },
  { code: "FRA", city: "Frankfurt", name: "Frankfurt", country: "Germany" },
  { code: "MUC", city: "Munich", name: "Munich", country: "Germany" },
  { code: "MAD", city: "Madrid", name: "Barajas", country: "Spain" },
  { code: "BCN", city: "Barcelona", name: "El Prat", country: "Spain" },
  { code: "FCO", city: "Rome", name: "Fiumicino", country: "Italy" },
  { code: "MXP", city: "Milan", name: "Malpensa", country: "Italy" },
  { code: "ZRH", city: "Zurich", name: "Zurich", country: "Switzerland" },
  { code: "LIS", city: "Lisbon", name: "Humberto Delgado", country: "Portugal" },
  { code: "IST", city: "Istanbul", name: "Istanbul", country: "Turkey" },
  { code: "ATH", city: "Athens", name: "Eleftherios Venizelos", country: "Greece" },

  // Middle East
  { code: "DXB", city: "Dubai", name: "Dubai Intl", country: "UAE" },
  { code: "AUH", city: "Abu Dhabi", name: "Zayed Intl", country: "UAE" },
  { code: "DOH", city: "Doha", name: "Hamad Intl", country: "Qatar" },
  { code: "BAH", city: "Manama", name: "Bahrain Intl", country: "Bahrain" },
  { code: "JED", city: "Jeddah", name: "King Abdulaziz", country: "Saudi Arabia" },
  { code: "RUH", city: "Riyadh", name: "King Khalid", country: "Saudi Arabia" },

  // South Asia
  { code: "DEL", city: "Delhi", name: "Indira Gandhi", country: "India" },
  { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji", country: "India" },
  { code: "BLR", city: "Bengaluru", name: "Kempegowda", country: "India" },
  { code: "MAA", city: "Chennai", name: "Chennai Intl", country: "India" },
  { code: "HYD", city: "Hyderabad", name: "Rajiv Gandhi", country: "India" },
  { code: "KHI", city: "Karachi", name: "Jinnah Intl", country: "Pakistan" },
  { code: "LHE", city: "Lahore", name: "Allama Iqbal", country: "Pakistan" },
  { code: "ISB", city: "Islamabad", name: "Islamabad Intl", country: "Pakistan" },
  { code: "CMB", city: "Colombo", name: "Bandaranaike", country: "Sri Lanka" },

  // Asia-Pacific
  { code: "SIN", city: "Singapore", name: "Changi", country: "Singapore" },
  { code: "HKG", city: "Hong Kong", name: "Hong Kong Intl", country: "Hong Kong" },
  { code: "BKK", city: "Bangkok", name: "Suvarnabhumi", country: "Thailand" },
  { code: "KUL", city: "Kuala Lumpur", name: "KLIA", country: "Malaysia" },
  { code: "HND", city: "Tokyo", name: "Haneda", country: "Japan" },
  { code: "NRT", city: "Tokyo", name: "Narita", country: "Japan" },
  { code: "SYD", city: "Sydney", name: "Kingsford Smith", country: "Australia" },

  // Americas & Africa
  { code: "JFK", city: "New York", name: "John F. Kennedy", country: "USA" },
  { code: "EWR", city: "Newark", name: "Liberty", country: "USA" },
  { code: "LAX", city: "Los Angeles", name: "Los Angeles Intl", country: "USA" },
  { code: "ORD", city: "Chicago", name: "O'Hare", country: "USA" },
  { code: "YYZ", city: "Toronto", name: "Pearson", country: "Canada" },
  { code: "GRU", city: "São Paulo", name: "Guarulhos", country: "Brazil" },
  { code: "JNB", city: "Johannesburg", name: "O. R. Tambo", country: "South Africa" },
  { code: "CAI", city: "Cairo", name: "Cairo Intl", country: "Egypt" },
];

/** Human-readable label, e.g. "All Paris Airports (PAR), France" or
 *  "London Heathrow (LHR), UK". */
export function formatAirport(a: Airport): string {
  if (a.metro) return `All ${a.city} Airports (${a.code}), ${a.country}`;
  return `${a.city} ${a.name} (${a.code}), ${a.country}`;
}

/** Filter the directory by a free-text query (city, airport name, code or
 *  country). Returns [] for queries under 2 characters. Metro codes rank first,
 *  then code-prefix matches, capped to a short list for a tidy dropdown. */
export function searchAirports(query: string, limit = 7): Airport[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const scored = AIRPORTS.map((a) => {
    const code = a.code.toLowerCase();
    const city = a.city.toLowerCase();
    const name = (a.name ?? "").toLowerCase();
    const country = a.country.toLowerCase();

    let score = -1;
    if (code === q) score = 0;
    else if (code.startsWith(q)) score = 1;
    else if (city.startsWith(q)) score = 2;
    else if (name.startsWith(q) || country.startsWith(q)) score = 3;
    else if (city.includes(q) || name.includes(q) || country.includes(q)) score = 4;

    // Nudge metro/all-airports entries up so a city search shows them first.
    if (score >= 0 && a.metro) score -= 0.5;
    return { a, score };
  }).filter((s) => s.score >= 0);

  scored.sort((x, y) => x.score - y.score);
  return scored.slice(0, limit).map((s) => s.a);
}
