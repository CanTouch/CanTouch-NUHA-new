/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Hotel, EventItem, Attraction, GalleryItem, MembershipApplication, HomepageConfig } from '../types';

// Helper to check if localStorage is available
const isStorageAvailable = () => {
  try {
    return typeof localStorage !== 'undefined';
  } catch {
    return false;
  }
};

// Keys for localStorage
const KEYS = {
  HOTELS: 'nuha_hotels',
  EVENTS: 'nuha_events',
  ATTRACTIONS: 'nuha_attractions',
  GALLERY: 'nuha_gallery',
  APPLICATIONS: 'nuha_applications',
  CONFIG: 'nuha_homepage_config'
};

// --- PRESETPULSATING REAL DATASETS ---
const PRESET_HOTELS: Hotel[] = [
  {
    id: 'h1',
    hotel_name: 'Chobe Safari Lodge',
    contact_number: '+256 312 260260',
    email: 'reservations@marasa.net',
    description: 'An exquisite five-star safari oasis offering spectacular panoramic views of the River Nile as it rushes past. Features an outdoor tiered swimming pool, wildlife safaris, and fine international dining, setting the gold standard for luxury lodging in Murchison Falls.',
    featured_image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800',
    is_featured: true,
    district: 'Nwoya'
  },
  {
    id: 'h2',
    hotel_name: 'The Churchill Courts Hotel',
    contact_number: '+256 471 432300',
    email: 'info@churchillcourts.co.ug',
    description: 'Gulu City’s signature business and leisure hotel. Churchill Courts combines exceptional Gulu hospitality with contemporary amenities, beautifully manicured health gardens, comprehensive state-of-the-art conference facilities, and pristine suites.',
    featured_image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
    is_featured: true,
    district: 'Gulu'
  },
  {
    id: 'h3',
    hotel_name: 'Gulu Boma Hotel',
    contact_number: '+256 392 001944',
    email: 'gulu@thebomahotels.com',
    description: 'A charming, high-end boutique resort set in a historical colonial-style estate. Surrounded by mature private gardens, it features individual veranda styling, high-timber ceilings, a pool, organic local cuisines, and a serene, quiet atmosphere.',
    featured_image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800',
    is_featured: true,
    district: 'Gulu'
  },
  {
    id: 'h4',
    hotel_name: 'Lira Hotel',
    contact_number: '+256 772 505707',
    email: 'info@lirahotel.co.ug',
    description: 'A prestigious hotel located in Lira City. Renowned for hosting national delegates, it offers elegant accommodations, massive corporate meeting grounds, spacious gardens, and authentic Northern Ugandan traditional recipes crafted by renowned local chefs.',
    featured_image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=800',
    is_featured: true,
    district: 'Lira'
  },
  {
    id: 'h5',
    hotel_name: 'Kidepo Savannah Lodge',
    contact_number: '+256 392 000801',
    email: 'kidepo@naturelodges.biz',
    description: 'Perched on the edge of the scenic Kidepo Valley National Park. Accommodations feature spacious savanna-facing canvas luxury tents and premium grass-thatched cottages that showcase unforgettable sunrise views over Africa\'s absolute wildest plains.',
    featured_image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=800',
    is_featured: false,
    district: 'Kaabong'
  },
  {
    id: 'h6',
    hotel_name: 'Arua Heritage Hotel',
    contact_number: '+256 701 333444',
    email: 'reception@aruaheritage.com',
    description: 'A prestigious business and tourism hub in the heart of Arua City. Offering premium self-contained guest rooms, high-speed fiber internet, private executive meeting suites, and beautiful views of the majestic West Nile plains.',
    featured_image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800',
    is_featured: false,
    district: 'Arua'
  },
  {
    id: 'h7',
    hotel_name: 'Lili Garden Lodge',
    contact_number: '+256 772 555666',
    email: 'lili@kitgumhotels.co.ug',
    description: 'A tranquil hideaway in Kitgum District offering beautiful landscaped flower gardens, peaceful air-conditioned cottages, and high-quality security. It provides an ideal transit rest-stop for safari travelers heading to Kidepo Valley National Park.',
    featured_image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&q=80&w=800',
    is_featured: false,
    district: 'Kitgum'
  }
];

const PRESET_EVENTS: EventItem[] = [
  {
    id: 'e1',
    title: 'Northern Uganda Hospitality & Tourism Summit 2026',
    date: '2026-07-15',
    description: 'The premier annual gathering of hospitality leaders, hoteliers, policy makers, and travel agencies discussing sustainable conservation, eco-tourism growth, and national quality standard benchmarks in Northern Uganda.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    location: 'The Churchill Courts Hotel, Gulu',
    type: 'Conference'
  },
  {
    id: 'e2',
    title: 'Advanced Guest Relations & Culinary Service Training',
    date: '2026-08-04',
    description: 'An intensive, certified capacity-building program sponsored by NUHA to train hotel waitstaff, housekeepers, and chefs on international food handling, modern guest etiquette, and fine-dining logistics.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800',
    location: 'Lira Hotel, Lira',
    type: 'Training Session'
  },
  {
    id: 'e3',
    title: 'Hotel Digital Systems & Revenue Operations Workshop',
    date: '2026-09-10',
    description: 'Expert-led workshop covering channel managers, global OTA integrations, dynamic occupancy-based algorithms, and localized SEO practices to help Northern Uganda hoteliers claim their global reservation share.',
    image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800',
    location: 'Gulu Boma Hotel, Gulu',
    type: 'Workshop'
  },
  {
    id: 'e4',
    title: 'NUHA Executive Board General Meeting',
    date: '2026-10-02',
    description: 'Quarterly general meeting for registered association members to review national tax lobbies, collaborative booking portal updates, community conservation initiatives, and regional hotel security agreements.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
    location: 'Chobe Safari Lodge, Murchison Falls',
    type: 'Industry Meeting'
  }
];

const PRESET_ATTRACTIONS: Attraction[] = [
  {
    id: 'a1',
    title: 'Murchison Falls National Park',
    description: 'Uganda\'s largest and oldest protected safari conservation reserve. Witness the Nile River force itself through a narrow 7-meter gorge to plunge 43 meters below, creating the world\'s most powerful, thunderous waterfall explosion.',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=800',
    location: 'Nwoya / Kiryandongo District'
  },
  {
    id: 'a2',
    title: 'Kidepo Valley National Park',
    description: 'Voted consistently as Africa\'s finest wilderness reserve. Tucked in the rugged Narus Valley between Uganda’s borders, Kidepo features towering dry volcanic crags, endless savannah grass, and is home to lions, leopards, giraffes, and ostriches.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800',
    location: 'Kaabong District'
  },
  {
    id: 'a3',
    title: 'Aruu Waterfalls Plunge',
    description: 'A breath-taking series of cascading waterfalls pouring over sleek, dark Gneiss rock steps nestled inside dense equatorial forest cover. Located in Pader, Aruu forms magnificent natural swimming pools and refreshing breeze-ways.',
    image: 'https://images.unsplash.com/photo-1432406186174-2b24f4a62977?auto=format&fit=crop&q=80&w=800',
    location: 'Pader District'
  },
  {
    id: 'a4',
    title: 'Sir Samuel Baker’s Fort Patiko',
    description: 'A historic military fortress built in 1872 by the British explorer Sir Samuel Baker to suppress the brutal East African slave trade. Located at a scenic hilltop vantage in Gulu, this stone fort showcases ancient lock-up caverns and battle axes.',
    image: 'https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&q=80&w=800',
    location: 'Gulu District'
  }
];

const PRESET_GALLERY: GalleryItem[] = [
  { id: 'g1', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800', category: 'Member Hotels', caption: 'Luxury suite deck view at Chobe Safari Lodge' },
  { id: 'g2', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800', category: 'Member Hotels', caption: 'Prinstine corporate suites at Churchill Courts Gulu' },
  { id: 'g3', image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800', category: 'Member Hotels', caption: 'Poolside garden dining at Gulu Boma Hotel' },
  { id: 'g4', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=800', category: 'Member Hotels', caption: 'Lobby entry and hospitality gardens at Lira Hotel' },
  { id: 'g5', image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=800', category: 'Tourism Attractions', caption: 'The roaring white waters of Murchison Falls' },
  { id: 'g6', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800', category: 'Tourism Attractions', caption: 'Wildlife game viewing in Kidepo Valley' },
  { id: 'g7', image: 'https://images.unsplash.com/photo-1432406186174-2b24f4a62977?auto=format&fit=crop&q=80&w=800', category: 'Tourism Attractions', caption: 'Peaceful cascading steps of Aruu Waterfalls' },
  { id: 'g8', image: 'https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&q=80&w=800', category: 'Tourism Attractions', caption: 'Centuries-old stone ruins at Fort Patiko, Gulu' },
  { id: 'g9', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800', category: 'NUHA Events', caption: 'Attendees during the Annual General Tourism Summit' },
  { id: 'g10', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800', category: 'NUHA Events', caption: 'Culinary service standard training certifications' },
  { id: 'g11', image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800', category: 'NUHA Events', caption: 'Digital systems integration workshop' }
];

const PRESET_APPLICATIONS: MembershipApplication[] = [
  {
    id: 'a_demo_1',
    hotel_name: 'Sir Samuel Baker Heritage Lodge',
    contact_person: 'Okello Jasper',
    phone: '+256 782 123456',
    email: 'jasper@bakerheritagelodge.com',
    district: 'Gulu',
    message: 'We operate a premium heritage boutique lodge located near Fort Patiko. We would love to join NUHA to take part in the digital marketing trainings and cooperate with local agencies.',
    submission_date: '2026-06-02T14:30:00Z',
    status: 'Pending'
  },
  {
    id: 'a_demo_2',
    hotel_name: 'West Nile Imperial Suites',
    contact_person: 'Amina Yasmin',
    phone: '+256 701 987654',
    email: 'info@westnilesuite.com',
    district: 'Arua',
    message: 'Greetings. We recently expanded our suites to 45 deluxe capacities. We are applying to NUHA to receive service quality ratings and list our establishment in your official directory.',
    submission_date: '2026-06-03T09:15:00Z',
    status: 'Pending'
  }
];

const PRESET_CONFIG: HomepageConfig = {
  heroHeadline: 'Strengthening Hospitality. Promoting Tourism. Advancing Northern Uganda.',
  heroSubheadline: 'The premier collective voice uniting stellar hoteliers, luxurious safari lodges, and exquisite boutique retreats across Northern Uganda.',
  heroImage: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=1600',
  aboutOverview: 'The Northern Uganda Hoteliers Association (NUHA) is a collective organisation that represents the interests of hoteliers and hospitality businesses in Northern Uganda. Its primary goals include promoting tourism, enhancing the quality of services in the hospitality sector, and advocating for the interests of its members.',
  aboutVision: 'To be the leading association and principal voice advocating for the hospitality industry in Northern Uganda, promoting sustainable tourism and exceptional hospitality standards that enhance the region\'s appeal as a premier tourist destination.',
  aboutMission: 'To promote and enhance quality standards among members\' facilities and services through capacity building, marketing and advocacy.'
};

// --- DATA ACCESS LAYER ---

export const getDBHotels = (): Hotel[] => {
  if (!isStorageAvailable()) return PRESET_HOTELS;
  const stored = localStorage.getItem(KEYS.HOTELS);
  if (!stored) {
    localStorage.setItem(KEYS.HOTELS, JSON.stringify(PRESET_HOTELS));
    return PRESET_HOTELS;
  }
  return JSON.parse(stored);
};

export const saveDBHotels = (hotels: Hotel[]) => {
  if (isStorageAvailable()) {
    localStorage.setItem(KEYS.HOTELS, JSON.stringify(hotels));
  }
};

export const getDBEvents = (): EventItem[] => {
  if (!isStorageAvailable()) return PRESET_EVENTS;
  const stored = localStorage.getItem(KEYS.EVENTS);
  if (!stored) {
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(PRESET_EVENTS));
    return PRESET_EVENTS;
  }
  return JSON.parse(stored);
};

export const saveDBEvents = (events: EventItem[]) => {
  if (isStorageAvailable()) {
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(events));
  }
};

export const getDBAttractions = (): Attraction[] => {
  if (!isStorageAvailable()) return PRESET_ATTRACTIONS;
  const stored = localStorage.getItem(KEYS.ATTRACTIONS);
  if (!stored) {
    localStorage.setItem(KEYS.ATTRACTIONS, JSON.stringify(PRESET_ATTRACTIONS));
    return PRESET_ATTRACTIONS;
  }
  return JSON.parse(stored);
};

export const saveDBAttractions = (attractions: Attraction[]) => {
  if (isStorageAvailable()) {
    localStorage.setItem(KEYS.ATTRACTIONS, JSON.stringify(attractions));
  }
};

export const getDBGallery = (): GalleryItem[] => {
  if (!isStorageAvailable()) return PRESET_GALLERY;
  const stored = localStorage.getItem(KEYS.GALLERY);
  if (!stored) {
    localStorage.setItem(KEYS.GALLERY, JSON.stringify(PRESET_GALLERY));
    return PRESET_GALLERY;
  }
  return JSON.parse(stored);
};

export const saveDBGallery = (gallery: GalleryItem[]) => {
  if (isStorageAvailable()) {
    localStorage.setItem(KEYS.GALLERY, JSON.stringify(gallery));
  }
};

export const getDBApplications = (): MembershipApplication[] => {
  if (!isStorageAvailable()) return PRESET_APPLICATIONS;
  const stored = localStorage.getItem(KEYS.APPLICATIONS);
  if (!stored) {
    localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(PRESET_APPLICATIONS));
    return PRESET_APPLICATIONS;
  }
  return JSON.parse(stored);
};

export const saveDBApplications = (apps: MembershipApplication[]) => {
  if (isStorageAvailable()) {
    localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(apps));
  }
};

export const getDBConfig = (): HomepageConfig => {
  if (!isStorageAvailable()) return PRESET_CONFIG;
  const stored = localStorage.getItem(KEYS.CONFIG);
  if (!stored) {
    localStorage.setItem(KEYS.CONFIG, JSON.stringify(PRESET_CONFIG));
    return PRESET_CONFIG;
  }
  try {
    const parsed = JSON.parse(stored) as HomepageConfig;
    // Auto-migrate if holding the old desk icon image
    if (parsed.heroImage && (parsed.heroImage.includes('photo-1523805009345-7448845a9e53') || parsed.heroImage.includes('1523805009345'))) {
      parsed.heroImage = 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=1600';
      localStorage.setItem(KEYS.CONFIG, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return PRESET_CONFIG;
  }
};

export const saveDBConfig = (config: HomepageConfig) => {
  if (isStorageAvailable()) {
    localStorage.setItem(KEYS.CONFIG, JSON.stringify(config));
  }
};
