// Locale-independent data for the home page. Text lives in messages/<locale>.json.
// SAMPLE DATA: replace with real partner salons before launch.
export const CONFIG = {
  // TODO: set TrimCircle's WhatsApp Business number (country code, no +). Used for the owners CTA.
  whatsappNumber: '919799776261',
  siteUrl: 'https://trimcircle.in', // TODO: confirm domain (used for canonical + hreflang)
  country: 'India', // salons are listed city by city across India
};

export const CATEGORIES = [
  { key: 'men', from: 80, photo: 'cat-men' },
  { key: 'women', from: 50, photo: 'cat-women' },
  { key: 'kids', from: 60, photo: 'cat-kids' },
  { key: 'bridal', from: 2500, photo: 'cat-bridal' },
  { key: 'unisex', from: 150, photo: 'cat-unisex' },
  { key: 'spa', from: 300, photo: 'cat-spa' },
];

export const LOOKS = [
  { price: 150, photo: 'look-1' },
  { price: 450, photo: 'look-2' },
  { price: 120, photo: 'look-3' },
  { price: 100, photo: 'look-4' },
  { price: 3500, photo: 'look-5' },
  { price: 1800, photo: 'look-6' },
];

// Cities in the same order as messages.citySec.list (that list holds the translated names).
export const CITIES = ['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Agra', 'Chandigarh'];
// For each entry of messages.areas: which city it is in (index into CITIES).
export const AREA_CITY = [0, 1, 2, 8, 9, 10, 5, 3, 4, 6, 7, 10];

// SAMPLE salons. areaIndex points into messages.areas (translated); slug = the salon page URL (/salon/<slug>/);
// geo = [lat, lng] for "Use my location" distance sorting; rating/reviews are sample numbers.
export const SALONS = [
  { slug: 'royal-cuts', name: 'Royal Cuts', areaIndex: 0, geo: [28.6519, 77.1909], open: true, from: 120, tags: ['men', 'kids'], deal: 'kidsFree', rating: 4.7, reviews: 214, phone: '+910000000001', photo: 'salon-1' },
  { slug: 'gulmohar-beauty-studio', name: 'Gulmohar Beauty Studio', areaIndex: 2, geo: [12.9352, 77.6245], open: true, from: 50, tags: ['women', 'bridal'], deal: 'weekday', rating: 4.8, reviews: 342, phone: '+910000000002', photo: 'salon-2' },
  { slug: 'little-stars-kids-salon', name: 'Little Stars Kids Salon', areaIndex: 1, geo: [19.0596, 72.8295], open: false, opensAt: '11:00', from: 100, tags: ['kids'], deal: 'firstVisit', rating: 4.6, reviews: 128, phone: '+910000000003', photo: 'salon-3' },
  { slug: 'shringaar-bridal-lounge', name: 'Shringaar Bridal Lounge', areaIndex: 8, geo: [13.0850, 80.2101], open: true, from: 2500, tags: ['bridal', 'women'], deal: 'bridalTrial', rating: 4.9, reviews: 96, phone: '+910000000004', photo: 'salon-4' },
  { slug: 'studio-eleven-unisex', name: 'Studio Eleven Unisex', areaIndex: 3, geo: [26.8530, 75.8050], open: true, from: 150, tags: ['unisex', 'men', 'women'], deal: null, rating: 4.4, reviews: 187, phone: '+910000000005', photo: 'salon-5' },
  { slug: 'nawab-hair-salon', name: 'Nawab Hair Salon', areaIndex: 5, geo: [27.2046, 78.0156], open: false, opensAt: '10:30', from: 80, tags: ['men'], deal: 'firstVisit', rating: 4.5, reviews: 263, phone: '+910000000006', photo: 'salon-6' },
  { slug: 'the-barber-room', name: 'The Barber Room', areaIndex: 0, geo: [28.6448, 77.1880], open: true, from: 150, tags: ['men'], deal: null, rating: 4.6, reviews: 158, phone: '+910000000007', photo: 'cat-men' },
  { slug: 'glow-ladies-parlour', name: 'Glow Ladies Parlour', areaIndex: 0, geo: [28.6560, 77.1985], open: false, opensAt: '10:00', from: 60, tags: ['women', 'bridal'], deal: 'weekday', rating: 4.5, reviews: 301, phone: '+910000000008', photo: 'cat-women' },
  { slug: 'bandra-blowout-studio', name: 'Bandra Blowout Studio', areaIndex: 1, geo: [19.0640, 72.8350], open: true, from: 200, tags: ['unisex', 'men', 'women'], deal: 'firstVisit', rating: 4.7, reviews: 412, phone: '+910000000009', photo: 'cat-unisex' },
  { slug: 'tiny-trims', name: 'Tiny Trims', areaIndex: 2, geo: [12.9300, 77.6200], open: true, from: 90, tags: ['kids', 'men'], deal: 'kidsFree', rating: 4.8, reviews: 176, phone: '+910000000010', photo: 'cat-kids' },
  { slug: 'banjara-spa-salon', name: 'Banjara Spa & Salon', areaIndex: 7, geo: [17.4126, 78.4482], open: true, from: 300, tags: ['women', 'unisex', 'spa'], deal: null, rating: 4.6, reviews: 233, phone: '+910000000011', photo: 'cat-spa' },
  { slug: 'pink-city-bridal', name: 'Pink City Bridal', areaIndex: 3, geo: [26.8580, 75.8120], open: false, opensAt: '11:30', from: 3000, tags: ['bridal', 'women'], deal: 'bridalTrial', rating: 4.9, reviews: 84, phone: '+910000000012', photo: 'cat-bridal' },
];

export const HERO_PHOTOS = ['hero-1', 'hero-2', 'hero-3'];
export const STEP_PHOTOS = ['step-1', 'step-2', 'step-3'];
