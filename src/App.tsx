/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Images, 
  Users, 
  Mail, 
  Phone, 
  Compass, 
  Award, 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  Sparkles, 
  CheckCircle, 
  HeartHandshake, 
  Briefcase, 
  ChevronRight,
  ShieldAlert,
  Loader2
} from 'lucide-react';

import { Hotel, EventItem, Attraction, GalleryItem, MembershipApplication, HomepageConfig } from './types';
import { 
  getDBHotels, saveDBHotels,
  getDBEvents, saveDBEvents,
  getDBAttractions, saveDBAttractions,
  getDBGallery, saveDBGallery,
  getDBApplications, saveDBApplications,
  getDBConfig, saveDBConfig 
} from './data/db';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import Notification from './components/Notification';

const PAGE_SEO: Record<string, { title: string; description: string; ogImage: string; ogType: string; url: string }> = {
  home: {
    title: "NUHA - Northern Uganda Hoteliers Association | Promoting Sustainable Tourism",
    description: "The premier collective voice uniting stellar hoteliers, luxurious safari lodges, and exquisite boutique retreats across Northern Uganda. Connect with peak regional experiences.",
    ogImage: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=1600",
    ogType: "website",
    url: "https://northernugandahoteliers.org/"
  },
  hotels: {
    title: "Directory of Vetted Hotels & Safari Lodges in Northern Uganda | NUHA",
    description: "Explore our fully vetted directory of luxury lodges, guest homes, and boutique retreats across Gulu, Lira, Kitgum, Arua, and Murchison Falls.",
    ogImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200",
    ogType: "website",
    url: "https://northernugandahoteliers.org/hotels"
  },
  attractions: {
    title: "Explore Tourism Attractions & Wildlife Safaris in Northern Uganda | NUHA",
    description: "Plan your journey to iconic destinations: Murchison Falls National Park, Kidepo Valley National Park, and historic cultural sites across Northern Uganda.",
    ogImage: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200",
    ogType: "website",
    url: "https://northernugandahoteliers.org/attractions"
  },
  events: {
    title: "Upcoming Hospitality Training & Bulletins | NUHA Northern Uganda",
    description: "Register for NUHA's upcoming bulletins, capacity building training, and hospitality networking workshops in Gulu, Lira, and beyond.",
    ogImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200",
    ogType: "website",
    url: "https://northernugandahoteliers.org/events"
  },
  gallery: {
    title: "Media Gallery - Hospitality, Wildlife & Landscapes | NUHA",
    description: "A showcase of exquisite member accommodations, pristine natural reserves, local wildlife, and vibrant cultural events throughout Northern Uganda.",
    ogImage: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1200",
    ogType: "website",
    url: "https://northernugandahoteliers.org/gallery"
  },
  membership: {
    title: "Become a Registered Member of NUHA | Northern Uganda Hospitality Support",
    description: "Register your hospitality business to join Gulu and Northern Uganda's premier hoteliers association. Access resources, collective advocacy, and marketing.",
    ogImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1200",
    ogType: "website",
    url: "https://northernugandahoteliers.org/membership"
  },
  contact: {
    title: "Contact NUHA - Secretariat Offices in Gulu & Lira | Northern Uganda",
    description: "Get in touch with the Northern Uganda Hoteliers Association secretariat. Find email, phone lines, and physical office addresses for prompt support.",
    ogImage: "https://images.unsplash.com/photo-1423662055905-ec3d12f8b581?auto=format&fit=crop&q=80&w=1200",
    ogType: "website",
    url: "https://northernugandahoteliers.org/contact"
  },
  admin: {
    title: "Administrative Control Panel | NUHA Secure Portal",
    description: "Secure, authorized-only console to audit applications, manage hotel listings, update regional attractions, and publish upcoming bulletins.",
    ogImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200",
    ogType: "website",
    url: "https://northernugandahoteliers.org/admin"
  }
};

export default function App() {
  // Page Routing: 'home' | 'hotels' | 'attractions' | 'events' | 'gallery' | 'membership' | 'contact' | 'admin'
  const [currentPage, setCurrentPage] = useState<string>('home');

  // Database States
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [config, setConfig] = useState<HomepageConfig | null>(null);

  // Administrative Authentication
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Active toast notifier
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Load Database presets on mount
  useEffect(() => {
    setHotels(getDBHotels());
    setEvents(getDBEvents());
    setAttractions(getDBAttractions());
    setGallery(getDBGallery());
    setApplications(getDBApplications());
    setConfig(getDBConfig());
  }, []);

  // Listen for hidden url hash triggering admin panel access
  useEffect(() => {
    const checkHashRoute = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin' || hash === '#admin-portal') {
        setCurrentPage('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('hashchange', checkHashRoute);
    checkHashRoute();
    return () => window.removeEventListener('hashchange', checkHashRoute);
  }, []);

  // Save changes to db automatically on state mutation
  const handleUpdateHotels = (updated: Hotel[]) => {
    setHotels(updated);
    saveDBHotels(updated);
  };

  const handleUpdateEvents = (updated: EventItem[]) => {
    setEvents(updated);
    saveDBEvents(updated);
  };

  const handleUpdateAttractions = (updated: Attraction[]) => {
    setAttractions(updated);
    saveDBAttractions(updated);
  };

  const handleUpdateGallery = (updated: GalleryItem[]) => {
    setGallery(updated);
    saveDBGallery(updated);
  };

  const handleUpdateApplications = (updated: MembershipApplication[]) => {
    setApplications(updated);
    saveDBApplications(updated);
  };

  const handleUpdateConfig = (newConfig: HomepageConfig) => {
    setConfig(newConfig);
    saveDBConfig(newConfig);
  };

  const triggerToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    triggerToast('Administrative session disconnected securely.', 'info');
    setCurrentPage('home');
  };

  // --- INTERACTIVE LACKING FEATURES MODAL STATE ---
  const [selectedHotelForModal, setSelectedHotelForModal] = useState<Hotel | null>(null);
  const [selectedEventForModal, setSelectedEventForModal] = useState<EventItem | null>(null);
  const [eventBookingForm, setEventBookingForm] = useState({ name: '', email: '', phone: '', attendeeCategory: 'Hotel Member' });
  const [isSubmittingEventBooking, setIsSubmittingEventBooking] = useState(false);
  const [eventBookingSuccess, setEventBookingSuccess] = useState(false);
  const [openedFaqIndex, setOpenedFaqIndex] = useState<number | null>(null);

  // --- SKELETON SCREEN SIMULATION STATES ---
  const [isHotelsLoading, setIsHotelsLoading] = useState(false);
  const [isEventsLoading, setIsEventsLoading] = useState(false);

  const handleEventBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventBookingForm.name || !eventBookingForm.email || !eventBookingForm.phone) {
      triggerToast('All attendee fields are required.', 'error');
      return;
    }
    setIsSubmittingEventBooking(true);
    setTimeout(() => {
      setIsSubmittingEventBooking(false);
      setEventBookingSuccess(true);
      triggerToast(`Successful enlisting of seat for ${eventBookingForm.name}!`, 'success');
    }, 1200);
  };

  // --- HOTEL DIRECTORY FILTER CONFIG ---
  const [hotelSearchQuery, setHotelSearchQuery] = useState('');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState('All Districts');

  useEffect(() => {
    if (currentPage === 'hotels') {
      setIsHotelsLoading(true);
      const timer = setTimeout(() => {
        setIsHotelsLoading(false);
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [currentPage, hotelSearchQuery, selectedDistrictFilter]);

  useEffect(() => {
    if (currentPage === 'events') {
      setIsEventsLoading(true);
      const timer = setTimeout(() => {
        setIsEventsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  // --- MEMBERSHIP FORM STATE ---
  const [memberForm, setMemberForm] = useState({
    hotel_name: '',
    contact_person: '',
    phone: '',
    email: '',
    district: 'Gulu',
    message: ''
  });
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [formSubmittedSuccessfully, setFormSubmittedSuccessfully] = useState(false);

  const handleMembershipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm.hotel_name || !memberForm.contact_person || !memberForm.phone || !memberForm.email) {
      triggerToast('Required fields are missing.', 'error');
      return;
    }

    setIsSubmittingForm(true);

    // Simulate luxury email transaction delay
    setTimeout(() => {
      const newApp: MembershipApplication = {
        id: 'app_' + Date.now(),
        hotel_name: memberForm.hotel_name,
        contact_person: memberForm.contact_person,
        phone: memberForm.phone,
        email: memberForm.email,
        district: memberForm.district,
        message: memberForm.message,
        submission_date: new Date().toISOString(),
        status: 'Pending'
      };

      const revisedApps = [newApp, ...applications];
      setApplications(revisedApps);
      saveDBApplications(revisedApps);

      setIsSubmittingForm(false);
      setFormSubmittedSuccessfully(true);
      triggerToast('Application processed! Sent copy securely to nuha.hoteliers.association@gmail.com', 'success');

      // Clear fields
      setMemberForm({
        hotel_name: '',
        contact_person: '',
        phone: '',
        email: '',
        district: 'Gulu',
        message: ''
      });
    }, 1500);
  };

  // --- CONTACT INQUIRY FORM STATE ---
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [contactSuccess, setContactSuccess] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      triggerToast('Please fill out all mandatory message coordinates.', 'error');
      return;
    }
    triggerToast('Thank you. General inquiry directed to NUHA Secretariat.', 'success');
    setContactSuccess(true);
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  // --- GALLERY FILTER SECTION ---
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<'All' | 'Member Hotels' | 'Tourism Attractions' | 'NUHA Events'>('All');

  // Fallback rendering during config load
  if (!config) {
    return (
      <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
        <p className="mt-4 text-xs font-mono font-bold tracking-widest text-brand-primary/60 uppercase">Launching NUHA Portal...</p>
      </div>
    );
  }

  // Generate 4 Featured Hotels (latest featured properties first, pads with standard if needed)
  const getFeaturedHotels = (): Hotel[] => {
    const explicitlyFeatured = hotels.filter(h => h.is_featured);
    if (explicitlyFeatured.length >= 4) {
      return explicitlyFeatured.slice(0, 4);
    }
    // Pad with other properties to make exactly 4 featured hotels
    const nonFeatured = hotels.filter(h => !h.is_featured);
    return [...explicitlyFeatured, ...nonFeatured].slice(0, 4);
  };

  // Comprehensive list of Northern Uganda Districts to make sure none is left out
  const NORTHERN_UGANDA_DISTRICTS = [
    'Adjumani',
    'Agago',
    'Alebtong',
    'Amolatar',
    'Amuru',
    'Apac',
    'Arua',
    'Dokolo',
    'Gulu',
    'Kaabong',
    'Kitgum',
    'Koboko',
    'Kole',
    'Lamwo',
    'Lira',
    'Maracha',
    'Moyo',
    'Nebbi',
    'Nwoya',
    'Obongi',
    'Omoro',
    'Otuke',
    'Oyam',
    'Pader',
    'Terego',
    'Yumbe',
    'Zombo'
  ];

  // Distilled districts for dropdown filter list on Directory
  const uniqueDistricts = ['All Districts', ...NORTHERN_UGANDA_DISTRICTS];

  // Filtered hotels directory logic
  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = hotel.hotel_name.toLowerCase().includes(hotelSearchQuery.toLowerCase());
    const matchesDistrict = selectedDistrictFilter === 'All Districts' || hotel.district === selectedDistrictFilter;
    return matchesSearch && matchesDistrict;
  });

  const currentSEO = PAGE_SEO[currentPage] || PAGE_SEO.home;

  return (
    <div className="min-h-screen bg-brand-light flex flex-col selection:bg-brand-accent/30 selection:text-brand-primary">
      <Helmet>
        <title>{currentSEO.title}</title>
        <meta name="description" content={currentSEO.description} />
        
        {/* OpenGraph SEO Tags */}
        <meta property="og:title" content={currentSEO.title} />
        <meta property="og:description" content={currentSEO.description} />
        <meta property="og:image" content={currentSEO.ogImage} />
        <meta property="og:type" content={currentSEO.ogType} />
        <meta property="og:url" content={currentSEO.url} />
        <meta property="og:site_name" content="Northern Uganda Hoteliers Association (NUHA)" />
        
        {/* Twitter Card SEO Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={currentSEO.title} />
        <meta name="twitter:description" content={currentSEO.description} />
        <meta name="twitter:image" content={currentSEO.ogImage} />
      </Helmet>

      {/* Toast Notification */}
      {toast && (
        <Notification
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Primary Sticky Header */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogoutAdmin={handleLogout}
      />

      {/* Main Page Containers */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            
            {/* ==================== 1. HOME VIEW ==================== */}
            {currentPage === 'home' && (
              <div id="home-view" className="space-y-24 pb-20 leading-relaxed text-gray-700">
                {/* Luxury Split Hero section */}
                <section className="relative min-h-[580px] lg:min-h-[660px] bg-[#111111] flex flex-col lg:flex-row overflow-hidden mt-16 md:mt-20">
                  {/* Left Side: Editorial Typography & Actions */}
                  <div className="relative z-20 w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-20 py-16 lg:py-24 bg-gradient-to-br from-[#0F2344] via-[#0F2344]/95 to-[#111111] h-full text-left self-stretch">
                    {/* Subtle vector grid overlay on left */}
                    <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#C9A35B_1px,transparent_1px),linear-gradient(to_bottom,#C9A35B_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
                    
                    <div className="w-12 h-[2px] bg-[#C9A35B] mb-8"></div>
                    
                    <h1 className="text-white text-3xl sm:text-5xl lg:text-5xl font-serif font-light leading-[1.15] mb-6">
                      Strengthening Hospitality. <br />
                      <span className="italic text-[#C9A35B]">Promoting Tourism.</span> <br />
                      Advancing Northern Uganda.
                    </h1>
                    
                    <p className="text-white/60 text-sm max-w-md mb-10 leading-relaxed">
                      {config.heroSubheadline}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 z-30">
                      <button
                        onClick={() => {
                          setCurrentPage('hotels');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-8 py-3.5 bg-[#C9A35B] text-[#0F2344] text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-white transition-colors cursor-pointer border border-[#C9A35B]"
                      >
                        Explore Member Hotels
                      </button>
                      <button
                        onClick={() => {
                          setCurrentPage('membership');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-8 py-3.5 border border-white/30 text-white text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        Join the Association
                      </button>
                    </div>
                  </div>

                  {/* Right Side: Hero Image & Overlay */}
                  <div className="relative w-full lg:w-1/2 min-h-[300px] lg:min-h-full bg-[#111111] self-stretch flex-grow">
                    <div className="absolute inset-0 bg-gradient-to-r lg:bg-gradient-to-l from-transparent via-[#111111]/30 to-[#111111] lg:to-transparent z-10"></div>
                    <div 
                      className="w-full h-full opacity-70 bg-cover bg-center transition-all duration-700"
                      style={{
                        backgroundImage: `url(${config.heroImage})`,
                      }}
                    />
                    
                    {/* Floating Luxury Glass Announcement Card */}
                    <div className="absolute bottom-8 right-8 z-20 max-w-sm ml-8 transition-all duration-300 ease-out hover:scale-[1.02] cursor-pointer">
                      <div className="bg-[#0F2344]/55 backdrop-blur-md border border-white/10 p-6 flex flex-col gap-3">
                        <span className="text-[#3FAE49] text-[10px] font-mono font-bold uppercase tracking-widest leading-none">Recent Announcement</span>
                        <p className="text-white text-xs italic font-serif leading-relaxed">
                          "Join our Annual Hospitality Excellence Summit this December in Gulu City."
                        </p>
                        <button 
                          onClick={() => {
                            setCurrentPage('events');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="text-[#C9A35B] text-[10px] font-semibold uppercase text-left hover:underline tracking-wider"
                        >
                          Learn More →
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Counter Strip Section */}
                <section className="bg-[#0F2344] flex flex-wrap items-center justify-around py-8 px-6 sm:px-12 border-t border-b border-[#C9A35B]/30 gap-y-6">
                  <div className="flex items-center gap-3">
                    <span className="text-[#C9A35B] font-serif font-semibold text-2xl sm:text-3xl">34+</span>
                    <span className="text-white/60 text-[9px] uppercase tracking-widest leading-none font-sans font-medium">Registered<br/>Members</span>
                  </div>
                  <div className="hidden sm:block h-8 w-[1px] bg-white/10"></div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#C9A35B] font-serif font-semibold text-2xl sm:text-3xl">43</span>
                    <span className="text-white/60 text-[9px] uppercase tracking-widest leading-none font-sans font-medium">Regional<br/>Attractions</span>
                  </div>
                  <div className="hidden sm:block h-8 w-[1px] bg-white/10"></div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#C9A35B] font-serif font-semibold text-2xl sm:text-3xl">1</span>
                    <span className="text-white/60 text-[9px] uppercase tracking-widest leading-none font-sans font-medium">United<br/>Voice</span>
                  </div>
                </section>

                {/* About NUHA Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="bg-white rounded-3xl p-8 sm:p-16 shadow-2xl border border-gray-100 grid grid-cols-1 lg:grid-cols-12 gap-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 text-brand-accent/5 pointer-events-none">
                      <Compass className="w-80 h-80" />
                    </div>
                    
                    <div className="lg:col-span-7 space-y-6">
                      <div className="flex items-center gap-2 text-brand-secondary font-bold font-mono text-[10px] tracking-widest uppercase">
                        <span>ESTATE VALUES</span>
                        <span className="w-6 h-0.5 bg-brand-secondary"></span>
                      </div>
                      <h2 className="text-3xl sm:text-4xl font-serif text-brand-primary font-medium tracking-tight leading-tight">
                        Fostering Regional Standard Excellence
                      </h2>
                      <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
                        {config.aboutOverview}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                        <div className="border-l-4 border-brand-accent pl-4 space-y-1">
                          <h4 className="font-serif text-brand-primary font-bold text-sm uppercase tracking-wide">Vision Statement</h4>
                          <p className="text-xs text-gray-500 font-light italic leading-relaxed">
                            "{config.aboutVision}"
                          </p>
                        </div>
                        <div className="border-l-4 border-brand-secondary pl-4 space-y-1">
                          <h4 className="font-serif text-brand-primary font-bold text-sm uppercase tracking-wide">Mission Mandate</h4>
                          <p className="text-xs text-gray-500 font-light italic leading-relaxed">
                            "{config.aboutMission}"
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-5 bg-brand-primary/5 rounded-2xl p-8 flex flex-col justify-between border border-brand-primary/10">
                      <div>
                        <h3 className="text-xs font-mono text-brand-primary tracking-widest font-bold uppercase mb-6">Core Values</h3>
                        
                        <div className="space-y-6">
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-brand-primary text-brand-accent flex items-center justify-center font-serif font-bold text-sm shrink-0">I</div>
                            <div>
                              <h4 className="text-brand-primary font-serif font-bold text-sm">Excellence</h4>
                              <p className="text-xs text-gray-500 font-light mt-0.5">Uncompromising focus on service standards, staff training, and cleanliness guides our regional oversight.</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-brand-primary text-brand-accent flex items-center justify-center font-serif font-bold text-sm shrink-0">II</div>
                            <div>
                              <h4 className="text-brand-primary font-serif font-bold text-sm">Integrity</h4>
                              <p className="text-xs text-gray-500 font-light mt-0.5">Honorable dealings, policy transparency, and ethical advocacy with municipal and national tourism organs.</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-brand-primary text-brand-accent flex items-center justify-center font-serif font-bold text-sm shrink-0">III</div>
                            <div>
                              <h4 className="text-brand-primary font-serif font-bold text-sm">Unity</h4>
                              <p className="text-xs text-gray-500 font-light mt-0.5">Fostering cross-property dialogue, sharing industry challenges, and co-marketing Northern Uganda as one.</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-8 border-t border-gray-200 mt-6 flex justify-end items-center text-xs">
                        <ShieldCheck className="w-5 h-5 text-brand-secondary" />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Featured Member Hotels Page Spotlight */}
                <section className="bg-[#0F2344] text-white py-24 relative overflow-hidden border-b border-[#C9A35B]/20">
                  <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none"></div>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                      <div>
                        <span className="text-xs text-[#C9A35B] tracking-[0.2em] font-bold uppercase mb-2 block">Featured Establishments</span>
                        <h2 className="text-white text-3xl font-serif font-light italic tracking-wide">
                          A selection of premium members
                        </h2>
                      </div>
                      <button
                        onClick={() => {
                          setCurrentPage('hotels');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-xs font-serif font-bold uppercase tracking-[0.15em] text-[#C9A35B] border-b border-[#C9A35B]/35 hover:border-[#C9A35B] pb-1 transition-all"
                      >
                        View Entire Directory
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {getFeaturedHotels().map((hotel) => (
                        <div
                          key={hotel.id}
                          className="group cursor-pointer flex flex-col h-full bg-transparent"
                        >
                          <div className="aspect-[4/3] bg-gray-900 mb-4 overflow-hidden border-b-2 border-transparent group-hover:border-[#C9A35B] transition-all duration-300">
                            <img
                              src={hotel.featured_image}
                              alt={hotel.hotel_name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400';
                              }}
                            />
                          </div>
                          
                          <h3 className="text-white font-serif font-semibold text-sm mb-1 uppercase tracking-wider group-hover:text-[#C9A35B] transition-colors">
                            {hotel.hotel_name}
                          </h3>
                          <p className="text-xs text-gray-400 line-clamp-1 mb-2 font-light">
                            {hotel.description || "Luxury hospitality redefined."}
                          </p>
                          <p className="text-[10px] font-medium text-[#C9A35B] tracking-widest uppercase font-mono mt-auto">
                            {hotel.district || "Northern Region"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Tourism Attractions Preview */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="space-y-12">
                    <div className="text-center space-y-2">
                      <span className="text-xs text-brand-secondary font-mono tracking-widest font-bold uppercase">Discover Northern Uganda</span>
                      <h2 className="text-3xl sm:text-4xl font-serif text-brand-primary font-medium tracking-tight leading-none">Scenic Tourism Havens</h2>
                      <p className="text-xs text-gray-500 max-w-md mx-auto font-light leading-normal">
                        Northern Uganda is home to pristine savannah reserves, historical forts, and cascades. Discover what awaits your itinerary.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {attractions.slice(0, 3).map((a) => (
                        <div key={a.id} className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 flex flex-col h-full group hover:shadow-xl transition duration-300">
                          <div className="aspect-video relative overflow-hidden bg-gray-100 shrink-0">
                            <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-102 transition duration-300" />
                            <div className="absolute bottom-3 left-3 bg-brand-primary text-white font-mono text-[9px] py-1 px-3 rounded-lg flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-brand-accent" />
                              <span>{a.location || 'Northern Uganda'}</span>
                            </div>
                          </div>
                          
                          <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                              <h3 className="font-serif text-lg text-brand-primary font-semibold tracking-wide leading-tight group-hover:text-brand-secondary transition-colors">
                                {a.title}
                              </h3>
                              <p className="text-xs text-gray-500 font-light leading-relaxed line-clamp-3">
                                {a.description}
                              </p>
                            </div>

                            <button
                              onClick={() => {
                                setCurrentPage('attractions');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="text-xs font-mono text-brand-secondary hover:text-brand-primary font-bold flex items-center gap-1.5 pt-2"
                            >
                              Explore Landscapes
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-center pt-4">
                      <button
                        onClick={() => {
                          setCurrentPage('attractions');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="inline-flex items-center gap-2 bg-brand-light hover:bg-neutral-200 text-brand-primary border border-gray-250 py-3.5 px-8 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                      >
                        Discover Regional Tourism Full Map
                      </button>
                    </div>
                  </div>
                </section>

                {/* Events Preview */}
                <section className="bg-brand-light border-y py-20">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                      <div className="space-y-4">
                        <span className="text-xs text-brand-secondary tracking-widest font-mono uppercase font-bold">Summits & Trainings</span>
                        <h2 className="text-3xl font-serif text-brand-primary font-semibold tracking-tight leading-none">
                          Capacity & Industry Development
                        </h2>
                        <p className="text-xs text-gray-500 font-light leading-relaxed">
                          NUHA regularly hosts national forums, food hygiene clinics, and digital hospitality tools masterclasses. Track upcoming events to get involved.
                        </p>
                        <button
                          onClick={() => {
                            setCurrentPage('events');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="inline-flex items-center gap-2 text-brand-primary text-xs font-mono font-bold hover:text-brand-secondary"
                        >
                          View Events Schedule Book
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {events.slice(0, 2).map((ev) => (
                          <div key={ev.id} className="bg-white border p-6 rounded-2xl shadow-sm space-y-4 hover:shadow-md transition">
                            <div className="flex items-center justify-between gap-2 border-b pb-3">
                              <span className="font-mono text-[10px] font-bold text-gray-400">{ev.date}</span>
                              <span className="bg-brand-accent/15 text-brand-primary text-[8px] font-mono font-bold tracking-widest p-1 rounded uppercase">
                                {ev.type}
                              </span>
                            </div>
                            <h3 className="font-serif text-base text-brand-primary font-bold line-clamp-1 leading-snug">{ev.title}</h3>
                            <p className="text-xs text-gray-500 font-light line-clamp-2 leading-relaxed">{ev.description}</p>
                            <p className="text-[10px] text-brand-secondary font-mono flex items-center gap-1 font-bold">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{ev.location}</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Membership Call to Action */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="bg-gradient-to-r from-brand-primary to-brand-primary/95 text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Background gold vectors */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-brand-accent opacity-5 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="space-y-4 max-w-2xl relative z-10">
                      <div className="inline-flex items-center gap-1.5 bg-brand-accent/20 text-brand-accent text-[9px] font-mono tracking-widest uppercase py-1 px-3.5 rounded-full font-bold border border-brand-accent/30">
                        <Award className="w-3.5 h-3.5" />
                        <span>RECRUITING NOW FOR 2026</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-serif tracking-wide font-medium leading-none">
                        Elevate Your Hotel's Presence in NUHA
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                        Become a registered NUHA partner to secure standard ratings, list your venue in the searchable directory, access free waitstaff hospitality trainings, and gain regional marketing credentials.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentPage('membership');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-brand-accent text-brand-primary hover:bg-white hover:text-brand-primary transition-colors px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 whitespace-nowrap shrink-0 shadow-lg shadow-black/15 group"
                    >
                      Apply For Membership
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </section>

                {/* Contact Preview Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-4">
                  <div className="bg-white border rounded-2xl p-8 sm:p-12 max-w-3xl mx-auto space-y-4 shadow-sm">
                    <h3 className="font-serif text-xl font-semibold text-brand-primary">Need Direct Institutional Support?</h3>
                    <p className="text-xs text-gray-500 font-light max-w-md mx-auto leading-relaxed">
                      Have questions regarding advocacy, taxation policies, or membership qualifications? Get in touch with the Northern Uganda Hoteliers secretariat team.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4 text-xs font-mono font-bold">
                      <a href="mailto:nuha.hoteliers.association@gmail.com" className="flex items-center justify-center gap-1.5 text-brand-secondary hover:underline">
                        <Mail className="w-4 h-4 inline" /> nuha.hoteliers.association@gmail.com
                      </a>
                      <span className="text-gray-400 font-light hidden sm:inline">|</span>
                      <p className="text-gray-600 flex items-center justify-center gap-1.5">
                        <Phone className="w-4 h-4 inline" /> +256 759984301
                      </p>
                    </div>
                  </div>
                </section>

              </div>
            )}

            {/* ==================== 2. HOTEL DIRECTORY ==================== */}
            {currentPage === 'hotels' && (
              <div id="hotels-view" className="py-24 leading-relaxed bg-brand-light">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                  
                  {/* Category Header */}
                  <div className="text-center space-y-3">
                    <span className="text-xs text-brand-secondary font-mono tracking-widest font-bold uppercase block">Official Directory Registry</span>
                    <h1 className="text-3xl sm:text-5xl font-serif text-brand-primary font-medium tracking-tight leading-none">Find Member Hotels</h1>
                    <p className="text-xs text-gray-500 max-w-lg mx-auto font-light leading-relaxed">
                      Search and confirm real hotels certified by the Northern Uganda Hoteliers Association. Filter properties instantly by Name or localized District Area.
                    </p>
                  </div>

                  {/* Search and District filtering widget */}
                  <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    
                    {/* Search Field */}
                    <div className="relative md:col-span-7">
                      <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={hotelSearchQuery}
                        onChange={(e) => setHotelSearchQuery(e.target.value)}
                        placeholder="Search specifically by hotel name..."
                        className="w-full bg-slate-50 pl-10 pr-4 py-3 text-xs rounded-xl focus:outline-none border border-gray-100 focus:border-brand-accent transition-colors"
                      />
                    </div>

                    {/* District Dropdown Selector */}
                    <div className="md:col-span-5 flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono font-semibold tracking-wider text-gray-400 shrink-0">District:</span>
                      <select
                        value={selectedDistrictFilter}
                        onChange={(e) => setSelectedDistrictFilter(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-100 px-3 py-3 text-xs rounded-xl focus:outline-none focus:border-brand-accent font-semibold text-gray-700"
                      >
                        {uniqueDistricts.map((d) => (
                          <option key={d} value={d}>
                            {d === 'All Districts' ? 'All Districts' : d}
                          </option>
                        ))}
                      </select>
                    </div>

                  </div>

                  {/* Directory listings */}
                  <div className="max-w-5xl mx-auto">
                    {isHotelsLoading ? (
                      <div className="grid grid-cols-1 gap-4">
                        {[1, 2, 3].map((idx) => (
                          <div
                            key={idx}
                            className="bg-white rounded-xl p-6 border border-gray-150 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-pulse"
                          >
                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto text-left">
                              {/* Thumbnail skeleton */}
                              <div className="w-20 h-16 bg-slate-200 rounded-lg shrink-0"></div>
                              <div className="space-y-2 w-full sm:w-80">
                                <div className="flex items-center gap-2">
                                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                                  <div className="h-3 bg-slate-200 rounded w-16"></div>
                                </div>
                                <div className="h-3 bg-slate-100 rounded w-5/6"></div>
                              </div>
                            </div>
                            
                            <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col justify-between sm:items-center md:items-end gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-dashed border-gray-100">
                              <div className="space-y-1.5 md:text-right w-full sm:w-auto">
                                <div className="h-2.5 bg-slate-100 rounded w-20 md:ml-auto"></div>
                                <div className="h-3.5 bg-slate-200 rounded w-32 md:ml-auto"></div>
                              </div>
                              <div className="h-8 bg-slate-200 rounded-lg w-full md:w-28"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : filteredHotels.length === 0 ? (
                      <div className="text-center p-16 bg-white border rounded-2xl text-gray-400 space-y-2">
                        <Compass className="w-12 h-12 mx-auto text-gray-300" />
                        <p className="text-sm font-semibold">No hotels registered matching the parameters.</p>
                        <button
                          onClick={() => { setHotelSearchQuery(''); setSelectedDistrictFilter('All Districts'); }}
                          className="text-xs font-mono font-bold text-brand-secondary hover:underline"
                        >
                          Reset Filters View
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {filteredHotels.map((h) => (
                          <div
                            key={h.id}
                            className="bg-white rounded-xl p-6 border shadow-sm border-gray-200/60 hover:border-brand-accent/40 hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group"
                          >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                              {/* Small thumbnail for directory visual structure */}
                              <img
                                src={h.featured_image}
                                alt={h.hotel_name}
                                className="w-20 h-16 object-cover rounded-lg border border-gray-200/80 shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=200';
                                }}
                              />
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="font-serif text-lg text-brand-primary font-bold tracking-wide group-hover:text-brand-accent transition-colors leading-none">
                                    {h.hotel_name}
                                  </h3>
                                  <span className="bg-brand-primary/5 text-brand-primary border font-mono text-[8px] font-bold py-0.5 px-2 rounded-full uppercase leading-none">
                                    {h.district || 'Unassigned'}
                                  </span>
                                  {h.is_featured && (
                                    <span className="bg-brand-accent/20 text-brand-primary font-mono text-[8px] font-bold py-0.5 px-2 rounded-full uppercase leading-none tracking-widest">
                                      Spotlight
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 font-light max-w-xl line-clamp-1 leading-relaxed">
                                  {h.description}
                                </p>
                              </div>
                            </div>
                            
                            <div className="text-left md:text-right shrink-0 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-dashed border-gray-100 flex flex-col justify-end items-start md:items-end gap-1.5 text-xs font-mono">
                              <button
                                onClick={() => setSelectedHotelForModal(h)}
                                className="w-full md:w-auto bg-brand-primary text-brand-accent hover:bg-brand-secondary hover:text-white border border-[#C9A35B]/20 transition-all font-mono text-[9px] font-bold uppercase tracking-wider py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 shadow-sm leading-none cursor-pointer"
                              >
                                <ShieldCheck className="w-4 h-4 text-brand-secondary" />
                                Verify Certificate
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Membership Prompt */}
                  <div className="max-w-3xl mx-auto bg-brand-primary text-white p-8 rounded-2xl text-center space-y-4">
                    <h3 className="text-lg font-serif">Are you a hotel operator in Gulu, Lira, Kitgum, Kaabong, or Arua?</h3>
                    <p className="text-xs text-gray-300 font-light max-w-md mx-auto">
                      List your business officially. Join the association today and establish credentials with tourism partners.
                    </p>
                    <button
                      onClick={() => { setCurrentPage('membership'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="bg-brand-accent text-brand-primary px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors hover:bg-white"
                    >
                      Submit Member Application
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* ==================== 3. TOURISM ATTRACTIONS ==================== */}
            {currentPage === 'attractions' && (
              <div id="attractions-view" className="py-24 bg-brand-light leading-relaxed">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                  
                  {/* Title Header */}
                  <div className="text-center space-y-3">
                    <span className="text-xs text-brand-secondary font-mono tracking-widest font-bold uppercase block">Uganda Travel Wonders</span>
                    <h1 className="text-3xl sm:text-5xl font-serif text-brand-primary font-medium tracking-tight">Regional Tourist Attractions</h1>
                    <p className="text-xs text-gray-500 max-w-lg mx-auto font-light leading-relaxed">
                      From the world's most powerful waterfall plunge to wild horizons in Kidepo, Northern Uganda boasts stunning environments waiting to be unveiled.
                    </p>
                  </div>

                  {/* Grid Portfolio cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {attractions.map((a) => (
                      <div
                        key={a.id}
                        className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100/80 flex flex-col h-full group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div className="aspect-video relative overflow-hidden bg-gray-50 shrink-0">
                          <img
                            src={a.image}
                            alt={a.title}
                            className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&q=80&w=800';
                            }}
                          />
                          <div className="absolute top-4 left-4 bg-brand-primary/95 text-brand-accent border border-white/5 font-mono text-[9px] font-bold py-1 px-3.5 rounded-lg flex items-center gap-1 shadow-lg">
                            <MapPin className="w-3.5 h-3.5 text-brand-secondary" />
                            <span>{a.location || 'Northern Region'}</span>
                          </div>
                        </div>

                        <div className="p-8 flex-grow flex flex-col justify-between space-y-4">
                          <div className="space-y-3">
                            <h3 className="font-serif text-xl sm:text-2xl text-brand-primary font-bold tracking-wide leading-tight group-hover:text-brand-secondary transition-colors">
                              {a.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
                              {a.description}
                            </p>
                          </div>

                          <div className="pt-4 border-t border-gray-100 flex items-center justify-end text-xs text-gray-400 font-mono">
                            <span className="font-semibold text-brand-secondary">Explore Regional Wonders</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            )}

            {/* ==================== 4. EVENTS & TRAINING ==================== */}
            {currentPage === 'events' && (
              <div id="events-view" className="py-24 bg-brand-light leading-relaxed">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                  
                  {/* Header */}
                  <div className="text-center space-y-3">
                    <span className="text-xs text-brand-secondary font-mono tracking-widest font-bold uppercase block">Capacity Building Calendar</span>
                    <h1 className="text-3xl sm:text-5xl font-serif text-brand-primary font-medium tracking-tight">Events & Training Opportunities</h1>
                    <p className="text-xs text-gray-500 max-w-lg mx-auto font-light leading-relaxed">
                      Empowering and preparing Gulu, Lira, and regional operators with critical regulatory insights, hygiene certifications, and hospitality marketing trends.
                    </p>
                  </div>

                  {/* Bulletins Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {isEventsLoading ? (
                      [1, 2].map((idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded-2xl overflow-hidden border border-gray-150 shadow-md flex flex-col h-full animate-pulse"
                        >
                          <div className="aspect-video bg-slate-200 relative shrink-0"></div>
                          <div className="p-6 flex-grow flex flex-col justify-between space-y-6 text-left">
                            <div className="space-y-3">
                              <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                              <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                              <div className="space-y-2">
                                <div className="h-3 bg-slate-100 rounded w-full"></div>
                                <div className="h-3 bg-slate-100 rounded w-5/6"></div>
                              </div>
                            </div>
                            <div className="pt-4 border-t border-gray-100 flex flex-col gap-4">
                              <div className="flex justify-between items-center">
                                <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                                <div className="h-3 bg-slate-100 rounded w-1/4"></div>
                              </div>
                              <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : events.map((ev) => (
                      <div
                        key={ev.id}
                        className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md flex flex-col h-full group hover:shadow-xl transition-all"
                      >
                        <div className="aspect-video relative overflow-hidden bg-gray-50 shrink-0">
                          <img
                            src={ev.image}
                            alt={ev.title}
                            className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800';
                            }}
                          />
                          <div className="absolute top-4 left-4 bg-brand-primary text-white font-mono text-[9px] font-bold py-1.5 px-3.5 rounded-lg uppercase tracking-wider shadow">
                            {ev.type}
                          </div>
                        </div>

                        <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                          <div className="space-y-3">
                            <span className="font-mono text-[10px] font-bold text-gray-400 tracking-wider block">
                              SCHEDULED DATE: {ev.date}
                            </span>
                            <h3 className="font-serif text-lg text-brand-primary font-bold group-hover:text-brand-secondary transition-colors leading-snug">
                              {ev.title}
                            </h3>
                            <p className="text-xs text-gray-500 font-light leading-relaxed">
                              {ev.description}
                            </p>
                          </div>

                          <div className="pt-4 border-t border-gray-100 flex flex-col gap-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                              <p className="text-brand-secondary font-bold flex items-center gap-1">
                                <MapPin className="w-4 h-4 shrink-0" />
                                <span>{ev.location}</span>
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedEventForModal(ev);
                                setEventBookingSuccess(false);
                                setEventBookingForm({ name: '', email: '', phone: '', attendeeCategory: 'Hotel Member' });
                              }}
                              className="w-full bg-[#0F2344] hover:bg-[#C9A35B] text-white hover:text-[#0F2344] transition-all font-sans font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl cursor-pointer"
                            >
                              Reserve Seat Spot
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            )}

            {/* ==================== 5. GALLERY ==================== */}
            {currentPage === 'gallery' && (
              <div id="gallery-view" className="py-24 bg-brand-light leading-relaxed font-sans">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                  
                  {/* Category description */}
                  <div className="text-center space-y-3">
                    <span className="text-xs text-brand-secondary font-mono tracking-widest font-bold uppercase block">Media Archive</span>
                    <h1 className="text-3xl sm:text-5xl font-serif text-brand-primary font-medium tracking-tight">Institutional Photo Gallery</h1>
                    <p className="text-xs text-gray-500 max-w-lg mx-auto font-light leading-relaxed">
                      Unveil the aesthetic elegance of member hotel architecture, panoramic tourist reserves, and the high energy of summits.
                    </p>
                  </div>

                  {/* Filter Categories Pill Bar */}
                  <div className="flex flex-wrap justify-center items-center gap-2 max-w-2xl mx-auto">
                    {(['All', 'Member Hotels', 'Tourism Attractions', 'NUHA Events'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedGalleryCategory(cat)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 border ${
                          selectedGalleryCategory === cat
                            ? 'bg-brand-primary border-brand-primary text-white font-bold shadow-md'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-neutral-50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Images responsive mosaic container */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {gallery
                      .filter((g) => selectedGalleryCategory === 'All' || g.category === selectedGalleryCategory)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-150 group flex flex-col h-full transform hover:-translate-y-1 duration-300"
                        >
                          <div className="aspect-video relative overflow-hidden shrink-0 bg-neutral-100">
                            <img
                              src={item.image}
                              alt={item.caption}
                              className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400';
                              }}
                            />
                            <div className="absolute top-2.5 left-2.5 bg-brand-primary/95 text-brand-accent py-0.5 px-2 rounded text-[8px] font-mono uppercase font-bold tracking-widest border border-white/5">
                              {item.category}
                            </div>
                          </div>
                          
                          <div className="p-3.5 flex-grow bg-white border-t border-neutral-50 flex items-center justify-between text-xs text-gray-600 font-light italic">
                            <span>{item.caption || 'NUHA Institutional Capture'}</span>
                          </div>
                        </div>
                      ))}
                  </div>

                </div>
              </div>
            )}

            {/* ==================== 6. MEMBERSHIP ==================== */}
            {currentPage === 'membership' && (
              <div id="membership-view" className="py-24 bg-brand-light leading-relaxed">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                  
                  {/* Category Header */}
                  <div className="text-center space-y-3">
                    <span className="text-xs text-brand-secondary font-mono tracking-widest font-bold uppercase block">Partner Enrolment</span>
                    <h1 className="text-3xl sm:text-5xl font-serif text-brand-primary font-medium tracking-tight">NUHA Partnership & Recruitment</h1>
                    <p className="text-xs text-gray-500 max-w-lg mx-auto font-light leading-relaxed">
                      Register your hotel or wilderness camp to claim standard rating reviews, digital visibility campaigns, and professional hospitality waitstaff clinics.
                    </p>
                  </div>

                  {/* Benefits Grid */}
                  <div className="max-w-5xl mx-auto bg-white rounded-3xl p-8 sm:p-14 border border-gray-150 shadow-md">
                    <h2 className="text-2xl font-serif text-brand-primary mb-8 font-medium border-b pb-4">Membership Privileges</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <h3 className="font-serif font-bold text-gray-800 text-base flex items-center gap-2">
                          <Award className="w-5 h-5 text-brand-accent" />
                          <span>Advocacy & Representation</span>
                        </h3>
                        <p className="text-xs text-gray-500 font-light leading-relaxed">
                          NUHA champions policy lobby efforts, fair taxation adjustments, city authority regulations, and environmental frameworks with state bodies.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-serif font-bold text-gray-800 text-base flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-brand-secondary" />
                          <span>Directory Listing Visibility</span>
                        </h3>
                        <p className="text-xs text-gray-500 font-light leading-relaxed">
                          Get catalogued in search indexes accessible to corporate event organizers, international ministries, NGOs, and tourism bureaus.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-serif font-bold text-gray-800 text-base flex items-center gap-2">
                          <Briefcase className="w-5 h-5 text-brand-secondary" />
                          <span>Certified Capacity Training</span>
                        </h3>
                        <p className="text-xs text-gray-500 font-light leading-relaxed">
                          Direct accessibility to certified staff seminars covering customer service, international food sanitation, and digital reservation operations.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-serif font-bold text-gray-800 text-base flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-brand-accent" />
                          <span>Collaborative Marketing Co-ops</span>
                        </h3>
                        <p className="text-xs text-gray-500 font-light leading-relaxed">
                          Promotional spotlights on main homepages, joint representation at global travel summits, and media content development.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* FAQ Accordion Section */}
                  <div className="max-w-3xl mx-auto space-y-6">
                    <div className="text-center space-y-2">
                      <span className="text-xs text-brand-secondary font-mono tracking-widest font-bold uppercase block">Frequent Questions</span>
                      <h2 className="text-2xl sm:text-3xl font-serif text-brand-primary font-medium tracking-tight">Accreditation FAQ</h2>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto font-light">
                        Clear regulatory and organizational details for regional hotel operators.
                      </p>
                    </div>

                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-150 shadow-sm space-y-4">
                      {[
                        {
                          q: "How does my hotel become a registered member of NUHA?",
                          a: "Submit your details using our digital partnership form below. Our executive regional board reviews key hospitality criteria including safety, sanitation, standards, and guest services before certifying."
                        },
                        {
                          q: "What are the direct structural benefits of certification?",
                          a: "Accredited members receive official spotlight placement in our regional tourism index, priority access to waitstaff clinics, representation at national stakeholder policy negotiations, and branding certificates."
                        },
                        {
                          q: "Are training workshops open to non-certified operators?",
                          a: "Capacity training courses are primarily subsidized for registered NUHA hoteliers and staff. Surplus seats are made available to independent hospitality graduates on a case-by-case basis."
                        },
                        {
                          q: "Who controls the review and approval of submissions?",
                          a: "The NUHA Secretariat and Executive Committee—comprised of veteran regional hotel administrators—holds standard monthly evaluation sessions in Gulu to process incoming registries."
                        }
                      ].map((item, index) => {
                        const isOpen = openedFaqIndex === index;
                        return (
                          <div key={index} className="border-b border-gray-100 pb-4 last:border-none last:pb-0">
                            <button
                              onClick={() => setOpenedFaqIndex(isOpen ? null : index)}
                              className="w-full flex justify-between items-center text-left py-2 font-serif text-gray-800 hover:text-[#C9A35B] transition-colors focus:outline-none cursor-pointer"
                            >
                              <span className="text-sm sm:text-base font-bold tracking-wide">{item.q}</span>
                              <span className="text-xs font-bold text-brand-secondary">{isOpen ? '−' : '+'}</span>
                            </button>
                            {isOpen && (
                              <p className="text-xs text-gray-500 font-light mt-1.5 leading-relaxed pl-1">
                                {item.a}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Forms Grid Container */}
                  <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-gray-150 shadow-2xl">
                    <h3 className="font-serif text-xl sm:text-2xl text-brand-primary font-bold tracking-wide text-center">Partnership Application Form</h3>
                    <p className="text-xs text-gray-500 font-light text-center leading-normal mt-2">
                      Please enter the details below. Our executive board registers candidates within Gulu, Lira, Kitgum, Pader, Kaabong, and Arua.
                    </p>

                    {formSubmittedSuccessfully ? (
                      <div className="mt-8 p-6 bg-brand-primary/5 text-center rounded-2xl border border-brand-accent/25 space-y-4">
                        <div className="inline-flex p-3 rounded-full bg-brand-secondary/20 text-brand-secondary mb-1">
                          <CheckCircle className="w-8 h-8" />
                        </div>
                        <h4 className="text-lg font-serif text-brand-primary font-bold">Application Received Successfully!</h4>
                        <p className="text-xs text-gray-500 font-light leading-relaxed">
                          Your hotel details have been synchronized into the association's database. A confirmation report has been automatically dispatched to <strong className="text-brand-primary">nuha.hoteliers.association@gmail.com</strong>.
                        </p>
                        <p className="text-[11px] font-mono text-brand-secondary font-bold">
                          Official Secretariat Reference ID: NUHA-REG-{Date.now().toString().slice(-5)}
                        </p>
                        <button
                          onClick={() => setFormSubmittedSuccessfully(false)}
                          className="pt-2 text-xs font-bold text-brand-primary hover:underline hover:text-brand-secondary block mx-auto font-mono"
                        >
                          Submit Another Registration
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleMembershipSubmit} className="mt-8 space-y-4">
                        
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Hotel Property Name *</label>
                          <input
                            type="text"
                            value={memberForm.hotel_name}
                            onChange={(e) => setMemberForm({ ...memberForm, hotel_name: e.target.value })}
                            required
                            placeholder="e.g. Churchill Courts Lodge"
                            className="w-full bg-slate-50 border px-3 py-3 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Managing Representative Contact Person *</label>
                          <input
                            type="text"
                            value={memberForm.contact_person}
                            onChange={(e) => setMemberForm({ ...memberForm, contact_person: e.target.value })}
                            required
                            placeholder="e.g. Jasper Okello (Managing Director)"
                            className="w-full bg-slate-50 border px-3 py-3 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-brand-accent"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Office Phone *</label>
                            <input
                              type="text"
                              value={memberForm.phone}
                              onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                              required
                              placeholder="e.g. +256 772 123456"
                              className="w-full bg-slate-50 border px-3 py-3 rounded-xl text-xs focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Representative Email *</label>
                            <input
                              type="email"
                              value={memberForm.email}
                              onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                              required
                              placeholder="e.g. director@hotel.co.ug"
                              className="w-full bg-slate-50 border px-3 py-3 rounded-xl text-xs focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Regional District Jurisdiction *</label>
                          <select
                            value={memberForm.district}
                            onChange={(e) => setMemberForm({ ...memberForm, district: e.target.value })}
                            className="w-full bg-slate-50 border px-3 py-3 rounded-xl text-xs focus:outline-none font-semibold text-gray-700"
                          >
                            {NORTHERN_UGANDA_DISTRICTS.map((dist) => (
                              <option key={dist} value={dist}>
                                {dist}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Hotel Spacing Overview / Request Message</label>
                          <textarea
                            value={memberForm.message}
                            onChange={(e) => setMemberForm({ ...memberForm, message: e.target.value })}
                            rows={3}
                            placeholder="Detail capacity and short introductory request for board evaluation..."
                            className="w-full bg-slate-50 border px-3 py-3 rounded-xl text-xs focus:outline-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmittingForm}
                          className="w-full bg-brand-primary text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-brand-secondary transition disabled:bg-neutral-300 shadow-md flex items-center justify-center gap-2"
                        >
                          {isSubmittingForm ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin inline text-white" />
                              <span>Dispatching secure application...</span>
                            </>
                          ) : (
                            <span>Submit Secure Application Record</span>
                          )}
                        </button>

                        <div className="text-center pt-2 text-[9px] text-gray-400 leading-normal font-light">
                          * Securely handles client-state synchronization for the administrator dashboard view.
                        </div>

                      </form>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* ==================== 7. CONTACT VIEW ==================== */}
            {currentPage === 'contact' && (
              <div id="contact-view" className="py-24 bg-brand-light leading-relaxed">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                  
                  {/* Category description */}
                  <div className="text-center space-y-3">
                    <span className="text-xs text-brand-secondary font-mono tracking-widest font-bold uppercase block">Headquarters Contact Office</span>
                    <h1 className="text-3xl sm:text-5xl font-serif text-brand-primary font-medium tracking-tight">Public Inquiry Center</h1>
                    <p className="text-xs text-gray-500 max-w-lg mx-auto font-light leading-relaxed">
                      For membership details, complaints, city authority regulations, or general policy inquiries. Contact our Gulu headquarters or use the form below.
                    </p>
                  </div>

                  <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Contacts info panel Grid */}
                    <div className="lg:col-span-5 bg-brand-primary text-white p-8 sm:p-12 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden">
                      {/* gold vector detail */}
                      <div className="absolute top-0 right-0 w-44 h-44 bg-brand-accent opacity-5 rounded-full blur-2xl pointer-events-none"></div>
                      
                      <div className="space-y-8">
                        <div>
                          <span className="text-xs font-mono text-brand-accent uppercase tracking-widest font-semibold block">NUHA SECRETARIAT</span>
                          <h3 className="text-2xl font-serif mt-2 tracking-wide font-medium">Headquarters Core</h3>
                        </div>

                        <div className="space-y-6 text-sm">
                          <div className="flex items-start gap-4">
                            <MapPin className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                            <div>
                              <p className="font-serif font-bold text-white text-base">Office Location</p>
                              <p className="text-xs text-gray-300 font-light mt-1">
                                Plot 10, Last Okech Road,<br />
                                Senior Quarters, Gulu city Uganda.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-4">
                            <Mail className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                            <div>
                              <p className="font-serif font-bold text-white text-base">Direct Web Addresses</p>
                              <a href="mailto:nuha.hoteliers.association@gmail.com" className="text-brand-accent underline block text-xs font-semibold mt-1 break-all">
                                nuha.hoteliers.association@gmail.com
                              </a>
                            </div>
                          </div>

                          <div className="flex items-start gap-4">
                            <Phone className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                            <div>
                              <p className="font-serif font-bold text-white text-base">General Phone Lines</p>
                              <p className="text-xs text-gray-300 font-light mt-1">
                                +256 759984301
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-10 border-t border-white/5 mt-10 flex items-center justify-end text-xs font-mono text-gray-400">
                        <ShieldCheck className="w-5 h-5 text-brand-secondary" />
                      </div>
                    </div>

                    {/* Feedback Form Card */}
                    <div className="lg:col-span-7 bg-white p-8 sm:p-12 rounded-3xl border border-gray-150 shadow-md">
                      <h3 className="font-serif text-xl sm:text-2xl text-brand-primary font-bold tracking-wide">Write Message To Secretariat</h3>
                      <p className="text-xs text-gray-500 font-light mt-2 leading-normal">
                        Submit any questions and institutional feedback and the representative panel will address your email quickly.
                      </p>

                      {contactSuccess ? (
                        <div className="mt-8 p-6 bg-brand-primary/5 text-center rounded-2xl border border-brand-accent/20">
                          <CheckCircle className="w-10 h-10 mx-auto text-brand-secondary mb-3 animate-bounce" />
                          <h4 className="font-serif text-brand-primary font-bold text-base">Message Logs Synced!</h4>
                          <p className="text-xs text-gray-500 font-light mt-1">
                            Your inquiry has been cataloged. You will receive responsiveness at the coordinates provided.
                          </p>
                          <button
                            onClick={() => setContactSuccess(false)}
                            className="mt-4 text-xs font-mono font-bold text-brand-secondary hover:underline"
                          >
                            Send Another Message Inquiry
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleContactSubmit} className="mt-8 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Your Full Name *</label>
                              <input
                                type="text"
                                value={contactForm.name}
                                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                required
                                placeholder=""
                                className="w-full bg-slate-50 border px-3 py-3 rounded-xl text-xs focus:outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Your Email Address *</label>
                              <input
                                type="email"
                                value={contactForm.email}
                                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                required
                                placeholder=""
                                className="w-full bg-slate-50 border px-3 py-3 rounded-xl text-xs focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Message Subject Title</label>
                            <input
                              type="text"
                              value={contactForm.subject}
                              onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                              placeholder=""
                              className="w-full bg-slate-50 border px-3 py-3 rounded-xl text-xs focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Detailed Message Body *</label>
                            <textarea
                              value={contactForm.message}
                              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                              required
                              rows={4}
                              placeholder=""
                              className="w-full bg-slate-50 border px-3 py-3 rounded-xl text-xs focus:outline-none"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-brand-primary text-white hover:bg-brand-secondary transition py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md"
                          >
                            Send Inquiry
                          </button>
                        </form>
                      )}
                    </div>

                  </div>

                </div>
              </div>
            )}

            {/* ==================== 8. ADMIN PANEL VIEW ==================== */}
            {currentPage === 'admin' && (
              <AdminPanel
                hotels={hotels}
                setHotels={handleUpdateHotels}
                events={events}
                setEvents={handleUpdateEvents}
                attractions={attractions}
                setAttractions={handleUpdateAttractions}
                gallery={gallery}
                setGallery={handleUpdateGallery}
                applications={applications}
                setApplications={handleUpdateApplications}
                config={config}
                setConfig={handleUpdateConfig}
                isAdminLoggedIn={isAdminLoggedIn}
                setIsAdminLoggedIn={setIsAdminLoggedIn}
                triggerToast={triggerToast}
              />
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* Primary Footer Section */}
      <Footer
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* ==================== VERIFICATION & BOOKING POPUP MODALS ==================== */}
      
      {/* 1. Hotel Certificate Verification Modal */}
      {selectedHotelForModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl border border-[#C9A35B]/30 animate-scale-up relative">
            <button 
              onClick={() => setSelectedHotelForModal(null)} 
              className="absolute top-4 right-4 bg-black/60 hover:bg-[#C9A35B] text-white hover:text-[#0F2344] p-2 rounded-full transition-all z-10 font-bold w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>
            
            <div className="aspect-video relative bg-slate-900">
              <img 
                src={selectedHotelForModal.featured_image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'} 
                alt={selectedHotelForModal.hotel_name} 
                className="w-full h-full object-cover opacity-85"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F2344] via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-[#C9A35B] text-[#0F2344] font-mono text-[8.5px] font-bold uppercase py-0.5 px-2 rounded-full leading-none">
                    {selectedHotelForModal.district || 'Gulu'}
                  </span>
                  <span className="bg-white/20 text-white font-mono text-[8px] tracking-widest font-bold uppercase py-0.5 px-2 rounded-full leading-none border border-white/20">
                    Certified Member
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold tracking-wide mt-1">
                  {selectedHotelForModal.hotel_name}
                </h3>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6 text-left">
              <div className="space-y-2">
                <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-[#0F2344]">Certified Services & Profile</h4>
                <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
                  {selectedHotelForModal.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase font-mono font-bold tracking-wider text-gray-400">Security & Quality Badge</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-gray-600 font-medium">
                      <CheckCircle className="w-4 h-4 text-[#C9A35B] shrink-0" />
                      <span>Accreditation Grade A Compliance</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 font-medium">
                      <CheckCircle className="w-4 h-4 text-[#C9A35B] shrink-0" />
                      <span>Regular Hygiene Certifications Sync</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 font-medium">
                      <CheckCircle className="w-4 h-4 text-[#C9A35B] shrink-0" />
                      <span>Tourism-Authorized Staffing Standards</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase font-mono font-bold tracking-wider text-gray-400">Official Association Secretariat</h4>
                  <div className="space-y-2 text-xs text-gray-600">
                    <p className="leading-relaxed">To book, verify registry parameters, or query local hospitality tariffs, contact the association:</p>
                    <a href="mailto:nuha.hoteliers.association@gmail.com" className="text-[#C9A35B] font-mono font-bold block hover:underline leading-none pt-1">nuha.hoteliers.association@gmail.com</a>
                    <a href="tel:+256759984301" className="text-gray-500 font-mono font-bold block hover:underline leading-none pt-2">+256 759984301</a>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-150 flex flex-col sm:flex-row gap-3">
                <a 
                  href="mailto:nuha.hoteliers.association@gmail.com" 
                  className="flex-1 bg-[#0F2344] text-white hover:bg-[#C9A35B] hover:text-[#0F2344] transition-all font-sans font-bold text-xs uppercase tracking-wider py-3 rounded-xl text-center shadow animate-pulse-slow"
                >
                  Inquire via Secretariat
                </a>
                <button 
                  onClick={() => setSelectedHotelForModal(null)} 
                  className="bg-slate-100 hover:bg-slate-200 text-gray-700 transition-all font-sans font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl cursor-pointer"
                >
                  Dismiss Verification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Event Seat Booking Modal */}
      {selectedEventForModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl border border-[#C9A35B]/30 animate-scale-up relative">
            <button 
              onClick={() => setSelectedEventForModal(null)} 
              className="absolute top-4 right-4 bg-black/60 hover:bg-[#C9A35B] text-white hover:text-[#0F2344] p-2 rounded-full transition-all z-10 font-bold w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>

            <div className="bg-[#0F2344] p-6 text-white space-y-1.5 self-stretch text-left">
              <span className="bg-[#C9A35B] text-[#0F2344] font-mono text-[9px] font-bold uppercase py-0.5 px-2 rounded leading-none">
                Training Spot Enrolment
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold tracking-wide leading-tight">
                {selectedEventForModal.title}
              </h3>
              <p className="text-[10px] font-mono text-white/60 uppercase tracking-widest pt-1">
                Scheduled: {selectedEventForModal.date} | Location: {selectedEventForModal.location}
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-6 text-left">
              {eventBookingSuccess ? (
                <div className="text-center p-6 bg-brand-primary/5 rounded-2xl border border-brand-accent/25 space-y-4">
                  <div className="inline-flex p-3 rounded-full bg-brand-secondary/20 text-brand-secondary mb-1">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-serif text-brand-primary font-bold">Registration Enlisted!</h4>
                  <p className="text-xs text-gray-500 font-light leading-relaxed">
                    Success! A ticket allocation key has been reserved for <strong className="text-brand-primary">{eventBookingForm.name}</strong>. Please state your name upon arrival on training day.
                  </p>
                  <p className="text-[11px] font-mono text-[#C9A35B] font-bold">
                    Reservation Ticket Key: NUHA-TKT-{Math.floor(10000 + Math.random() * 90000)}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedEventForModal(null);
                      setEventBookingSuccess(false);
                    }}
                    className="w-full bg-[#0F2344] hover:bg-[#C9A35B] text-white hover:text-[#0F2344] transition-all font-sans font-bold text-xs uppercase tracking-wider py-3 rounded-xl cursor-pointer"
                  >
                    Confirm & Complete
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEventBookingSubmit} className="space-y-4">
                  <p className="text-xs text-gray-500 font-light leading-relaxed">
                    Fill out the request coordinates below. Certified registrations are free but seats are priority-assigned by regional committee review.
                  </p>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Attendee Full Name *</label>
                    <input
                      type="text"
                      value={eventBookingForm.name}
                      onChange={(e) => setEventBookingForm({ ...eventBookingForm, name: e.target.value })}
                      required
                      placeholder="e.g. Christine Alarok"
                      className="w-full bg-slate-50 border px-3 py-2.5 rounded-xl text-xs focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Direct Office Email *</label>
                      <input
                        type="email"
                        value={eventBookingForm.email}
                        onChange={(e) => setEventBookingForm({ ...eventBookingForm, email: e.target.value })}
                        required
                        placeholder="e.g. coordinator@hotel.com"
                        className="w-full bg-slate-50 border px-3 py-2.5 rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Phone Whatsapp Line *</label>
                      <input
                        type="text"
                        value={eventBookingForm.phone}
                        onChange={(e) => setEventBookingForm({ ...eventBookingForm, phone: e.target.value })}
                        required
                        placeholder="e.g. +256 759984301"
                        className="w-full bg-slate-50 border px-3 py-2.5 rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Enlistment Category</label>
                    <select
                      value={eventBookingForm.attendeeCategory}
                      onChange={(e) => setEventBookingForm({ ...eventBookingForm, attendeeCategory: e.target.value })}
                      className="w-full bg-slate-50 border px-3 py-2.5 rounded-xl text-xs focus:outline-none font-semibold text-gray-700 font-sans"
                    >
                      <option value="Hotel Member">Standard Certified Member Employee</option>
                      <option value="Corporate Partner">Corporate Travel Sourcing Representative</option>
                      <option value="Regional Tourist Guide">Independent Regional Tour Operator</option>
                      <option value="Hospitality Graduate">Education/Intern Student Candidate</option>
                    </select>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="submit"
                      disabled={isSubmittingEventBooking}
                      className="flex-1 bg-[#0F2344] text-white hover:bg-[#C9A35B] hover:text-[#0F2344] transition-all font-sans font-bold text-xs uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:bg-neutral-300"
                    >
                      {isSubmittingEventBooking ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white inline animate-infinite" />
                          <span>Assigning...</span>
                        </>
                      ) : (
                        <span>Verify & Enlist Spot</span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedEventForModal(null)}
                      className="bg-slate-100 hover:bg-slate-200 text-gray-700 transition-all font-sans font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
