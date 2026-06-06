/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, 
  Calendar, 
  MapPin, 
  Images, 
  Users, 
  Sliders, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Unlock, 
  Eye, 
  Info,
  Building,
  Image as ImageIcon,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import { Hotel, EventItem, Attraction, GalleryItem, MembershipApplication, HomepageConfig } from '../types';

interface AdminPanelProps {
  hotels: Hotel[];
  setHotels: (items: Hotel[]) => void;
  events: EventItem[];
  setEvents: (items: EventItem[]) => void;
  attractions: Attraction[];
  setAttractions: (items: Attraction[]) => void;
  gallery: GalleryItem[];
  setGallery: (items: GalleryItem[]) => void;
  applications: MembershipApplication[];
  setApplications: (items: MembershipApplication[]) => void;
  config: HomepageConfig;
  setConfig: (config: HomepageConfig) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
  triggerToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export default function AdminPanel({
  hotels,
  setHotels,
  events,
  setEvents,
  attractions,
  setAttractions,
  gallery,
  setGallery,
  applications,
  setApplications,
  config,
  setConfig,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
  triggerToast
}: AdminPanelProps) {
  // Login form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active admin tab: 'hotels' | 'attractions' | 'events' | 'gallery' | 'applications' | 'config'
  const [activeTab, setActiveTab] = useState<'hotels' | 'attractions' | 'events' | 'gallery' | 'applications' | 'config'>('hotels');

  // Unified editing & addition modal/states
  const [editHotelId, setEditHotelId] = useState<string | null>(null);
  const [hotelForm, setHotelForm] = useState<Partial<Hotel>>({
    hotel_name: '', district: '', contact_number: '', email: '', description: '', featured_image: '', is_featured: false
  });

  const [editEventId, setEditEventId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState<Partial<EventItem>>({
    title: '', date: '', location: '', description: '', image: '', type: 'Conference'
  });

  const [editAttractionId, setEditAttractionId] = useState<string | null>(null);
  const [attractionForm, setAttractionForm] = useState<Partial<Attraction>>({
    title: '', description: '', image: '', location: ''
  });

  const [galleryForm, setGalleryForm] = useState<Partial<GalleryItem>>({
    image: '', category: 'Member Hotels', caption: ''
  });

  const [configForm, setConfigForm] = useState<HomepageConfig>({ ...config });

  // Open creation forms toggles
  const [isAddingHotel, setIsAddingHotel] = useState(false);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [isAddingAttraction, setIsAddingAttraction] = useState(false);
  const [isAddingGallery, setIsAddingGallery] = useState(false);

  // Authentication logic
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().toLowerCase() === 'admin' && password === 'nuha2026') {
      setIsAdminLoggedIn(true);
      setLoginError('');
      triggerToast('Welcome Administrator. Access authorization established.', 'success');
    } else {
      setLoginError('Invalid Administrator credentials. Please try again.');
      triggerToast('Access Denied: Invalid credentials.', 'error');
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    triggerToast('Administrative session signed off securely.', 'info');
  };

  // --- HOTEL CRUD OPERATIONS ---
  const handleSaveHotel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotelForm.hotel_name || !hotelForm.email || !hotelForm.contact_number) {
      triggerToast('Please complete all required fields.', 'error');
      return;
    }

    // Set fallback image if empty
    const imgUrl = hotelForm.featured_image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800';

    if (editHotelId) {
      // Edit mode
      const updated = hotels.map(h => h.id === editHotelId ? { 
        ...h, 
        hotel_name: hotelForm.hotel_name!,
        contact_number: hotelForm.contact_number!,
        email: hotelForm.email!,
        description: hotelForm.description || '',
        featured_image: imgUrl,
        is_featured: !!hotelForm.is_featured,
        district: hotelForm.district || 'Gulu'
      } : h);
      setHotels(updated);
      triggerToast(`Hotel "${hotelForm.hotel_name}" updated successfully.`, 'success');
      setEditHotelId(null);
    } else {
      // Create mode
      const newHotel: Hotel = {
        id: 'h_' + Date.now(),
        hotel_name: hotelForm.hotel_name!,
        contact_number: hotelForm.contact_number!,
        email: hotelForm.email!,
        description: hotelForm.description || '',
        featured_image: imgUrl,
        is_featured: !!hotelForm.is_featured,
        district: hotelForm.district || 'Gulu'
      };
      setHotels([newHotel, ...hotels]);
      triggerToast(`Hotel "${hotelForm.hotel_name}" added to NUHA directory.`, 'success');
      setIsAddingHotel(false);
    }

    // Clear form state
    setHotelForm({ hotel_name: '', district: '', contact_number: '', email: '', description: '', featured_image: '', is_featured: false });
  };

  const startEditHotel = (h: Hotel) => {
    setEditHotelId(h.id);
    setHotelForm({ ...h });
    setIsAddingHotel(true);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleDeleteHotel = (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently remove "${name}" from the registration list?`)) {
      setHotels(hotels.filter(h => h.id !== id));
      triggerToast(`"${name}" deleted from records.`, 'info');
    }
  };

  // --- ATTRACTION CRUD OPERATIONS ---
  const handleSaveAttraction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attractionForm.title || !attractionForm.description) {
      triggerToast('Required fields are missing.', 'error');
      return;
    }
    const defaultImg = attractionForm.image || 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&q=80&w=800';

    if (editAttractionId) {
      const updated = attractions.map(a => a.id === editAttractionId ? {
        ...a,
        title: attractionForm.title!,
        description: attractionForm.description!,
        image: defaultImg,
        location: attractionForm.location || 'Northern Uganda'
      } : a);
      setAttractions(updated);
      triggerToast(`Attraction "${attractionForm.title}" modified.`, 'success');
      setEditAttractionId(null);
    } else {
      const newAttraction: Attraction = {
        id: 'att_' + Date.now(),
        title: attractionForm.title!,
        description: attractionForm.description!,
        image: defaultImg,
        location: attractionForm.location || 'Northern Uganda'
      };
      setAttractions([newAttraction, ...attractions]);
      triggerToast(`Attraction "${attractionForm.title}" added contextually.`, 'success');
      setIsAddingAttraction(false);
    }
    setAttractionForm({ title: '', description: '', image: '', location: '' });
  };

  const startEditAttraction = (att: Attraction) => {
    setEditAttractionId(att.id);
    setAttractionForm({ ...att });
    setIsAddingAttraction(true);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleDeleteAttraction = (id: string, title: string) => {
    if (confirm(`Remove tourist attraction "${title}"?`)) {
      setAttractions(attractions.filter(a => a.id !== id));
      triggerToast(`Attraction "${title}" deleted.`, 'info');
    }
  };

  // --- EVENTS CRUD OPERATIONS ---
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.date || !eventForm.description) {
      triggerToast('Please complete all required event parameters.', 'error');
      return;
    }
    const defaultImg = eventForm.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800';

    if (editEventId) {
      const updated = events.map(ev => ev.id === editEventId ? {
        ...ev,
        title: eventForm.title!,
        date: eventForm.date!,
        location: eventForm.location || 'Standard Venue',
        description: eventForm.description!,
        image: defaultImg,
        type: eventForm.type || 'Conference'
      } : ev);
      setEvents(updated);
      triggerToast(`Event updated.`, 'success');
      setEditEventId(null);
    } else {
      const newEv: EventItem = {
        id: 'ev_' + Date.now(),
        title: eventForm.title!,
        date: eventForm.date!,
        location: eventForm.location || 'Standard Venue',
        description: eventForm.description!,
        image: defaultImg,
        type: eventForm.type || 'Conference'
      };
      setEvents([newEv, ...events]);
      triggerToast(`Event "${eventForm.title}" launched on schedule.`, 'success');
      setIsAddingEvent(false);
    }
    setEventForm({ title: '', date: '', location: '', description: '', image: '', type: 'Conference' });
  };

  const startEditEvent = (ev: EventItem) => {
    setEditEventId(ev.id);
    setEventForm({ ...ev });
    setIsAddingEvent(true);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleDeleteEvent = (id: string, title: string) => {
    if (confirm(`Delete event agenda "${title}"?`)) {
      setEvents(events.filter(e => e.id !== id));
      triggerToast(`Event deleted from active agendas.`, 'info');
    }
  };

  // --- GALLERY CREATION ---
  const handleSaveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.image) {
      triggerToast('Please enter a valid image URL link.', 'error');
      return;
    }
    const newItem: GalleryItem = {
      id: 'gal_' + Date.now(),
      image: galleryForm.image,
      category: galleryForm.category || 'Member Hotels',
      caption: galleryForm.caption || 'Exquisite asset view'
    };
    setGallery([newItem, ...gallery]);
    triggerToast('Gallery artifact securely catalogued.', 'success');
    setGalleryForm({ image: '', category: 'Member Hotels', caption: '' });
    setIsAddingGallery(false);
  };

  const handleDeleteGallery = (id: string) => {
    if (confirm('Delete this image from the association gallery page?')) {
      setGallery(gallery.filter(g => g.id !== id));
      triggerToast('Media artifact removed.', 'info');
    }
  };

  // --- HOME CONTENT CONFIGURATION ---
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setConfig(configForm);
    triggerToast('Homepage layout content updated successfully!', 'success');
  };

  // --- MEMBERSHIP APPLICATIONS CONTROL ---
  const handleUpdateApplicationStatus = (id: string, status: 'Approved' | 'Declined') => {
    const updated = applications.map(app => app.id === id ? { ...app, status } : app);
    setApplications(updated);
    triggerToast(`Application status toggled to: ${status}`, 'success');
  };

  const handleDeleteApplication = (id: string) => {
    if (confirm('Delete this application record permanently?')) {
      const updated = applications.filter(app => app.id !== id);
      setApplications(updated);
      triggerToast('Application record purged.', 'info');
    }
  };


  // --- LOGIN PANEL (rendered if logged out) ---
  if (!isAdminLoggedIn) {
    return (
      <div id="admin-login-shield" className="min-h-screen pt-32 pb-24 flex items-center justify-center px-4 bg-gradient-to-br from-brand-primary/10 via-brand-light to-brand-primary/5">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full overflow-hidden">
          {/* Header */}
          <div className="bg-brand-primary px-8 py-10 text-center relative">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Building className="w-40 h-40" />
            </div>
            <div className="inline-flex p-3 rounded-full bg-brand-accent/20 border border-brand-accent/30 text-brand-accent mb-4">
              <Unlock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-serif text-white tracking-wide font-medium">Administrator Portal</h2>
            <p className="text-xs text-brand-accent uppercase tracking-widest font-mono mt-1">Staff Security Shield</p>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-6">
            {loginError && (
              <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded text-xs text-red-700 font-medium flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Tip Box */}
            <div className="p-4 bg-brand-light border rounded-xl border-gray-200 text-xs text-brand-primary space-y-1">
              <p className="font-semibold flex items-center gap-1.5 text-brand-secondary font-mono">
                <CheckCircle className="w-3.5 h-3.5" /> TEST AUTHORIZATION
              </p>
              <p className="font-light">To evaluate admin procedures, supply the following credentials:</p>
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-gray-200/60 font-mono">
                <div>
                  <span className="text-gray-400">Username:</span> <strong className="text-black">admin</strong>
                </div>
                <div>
                  <span className="text-gray-400">Password:</span> <strong className="text-black">nuha2026</strong>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin user"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/40 focus:border-brand-accent transition-all"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/40 focus:border-brand-accent transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-primary text-white py-3.5 px-4 rounded-xl font-bold tracking-wider uppercase text-xs hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/10"
            >
              Sign In to Association Server
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- MAIN ADMIN CONSOLE (rendered if logged in) ---
  return (
    <div id="admin-panel" className="min-h-screen pt-28 pb-20 bg-brand-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Header Bar */}
        <div className="bg-brand-primary rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-brand-accent font-semibold font-mono text-xs uppercase tracking-widest leading-none">
              <span className="w-2 h-2 rounded-full bg-brand-secondary inline-block animate-ping"></span>
              <span>NUHA Database Connection Live</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif mt-2 tracking-wide font-medium">Association Administration Panel</h1>
            <p className="text-xs text-gray-300 font-light mt-1 max-w-xl">
              Secure portal for managing active member directory list, news bulletins, regional attractions, photography assets, and incoming registration requests.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-white/20 hover:border-brand-accent hover:bg-white/5 rounded-xl text-xs font-mono tracking-widest text-brand-accent transition-all uppercase"
          >
            Logout Securely
          </button>
        </div>

        {/* Dashboard Grid Options */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Tabs Controls */}
          <div className="space-y-2 bg-white p-5 rounded-2xl shadow-sm border border-gray-200/60 h-fit">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono px-3 mb-3">Database Modules</h3>
            
            <button
              onClick={() => { setActiveTab('hotels'); setIsAddingHotel(false); setEditHotelId(null); }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'hotels' 
                  ? 'bg-brand-primary text-white shadow-md' 
                  : 'text-gray-600 hover:bg-brand-light hover:text-black'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 shrink-0" />
                Member Hotels
              </span>
              <span className="text-[10px] font-mono opacity-80">{hotels.length}</span>
            </button>

            <button
              onClick={() => { setActiveTab('attractions'); setIsAddingAttraction(false); setEditAttractionId(null); }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'attractions' 
                  ? 'bg-brand-primary text-white shadow-md' 
                  : 'text-gray-600 hover:bg-brand-light hover:text-black'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 shrink-0" />
                Tourism Sites
              </span>
              <span className="text-[10px] font-mono opacity-80">{attractions.length}</span>
            </button>

            <button
              onClick={() => { setActiveTab('events'); setIsAddingEvent(false); setEditEventId(null); }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'events' 
                  ? 'bg-brand-primary text-white shadow-md' 
                  : 'text-gray-600 hover:bg-brand-light hover:text-black'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 shrink-0" />
                Agendas & Workshops
              </span>
              <span className="text-[10px] font-mono opacity-80">{events.length}</span>
            </button>

            <button
              onClick={() => { setActiveTab('gallery'); setIsAddingGallery(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'gallery' 
                  ? 'bg-brand-primary text-white shadow-md' 
                  : 'text-gray-600 hover:bg-brand-light hover:text-black'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Images className="w-4 h-4 shrink-0" />
                Gallery Repository
              </span>
              <span className="text-[10px] font-mono opacity-80">{gallery.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('applications')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'applications' 
                  ? 'bg-brand-primary text-white shadow-md' 
                  : 'text-gray-600 hover:bg-brand-light hover:text-black'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Users className="w-4 h-4 shrink-0" />
                Applications Log
              </span>
              <span className="text-[10px] font-mono bg-brand-accent/20 px-2 py-0.5 rounded text-brand-accent font-bold">
                {applications.filter(a => a.status === 'Pending').length} Pending
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('config'); setConfigForm({ ...config }); }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'config' 
                  ? 'bg-brand-primary text-white shadow-md' 
                  : 'text-gray-600 hover:bg-brand-light hover:text-black'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4 shrink-0" />
                Home Layout Texts
              </span>
              <span className="text-[9px] font-mono text-brand-secondary font-bold">Custom</span>
            </button>
          </div>

          {/* Module Panel details */}
          <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-200/60">
            
            {/* --- TAB: HOTELS --- */}
            {activeTab === 'hotels' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <h2 className="text-lg font-serif tracking-wider font-semibold">Hotels Directory Registry</h2>
                    <p className="text-xs text-gray-400">Total listed properties: {hotels.length}</p>
                  </div>
                  {!isAddingHotel && (
                    <button
                      onClick={() => {
                        setEditHotelId(null);
                        setHotelForm({ hotel_name: '', district: '', contact_number: '', email: '', description: '', featured_image: '', is_featured: false });
                        setIsAddingHotel(true);
                      }}
                      className="flex items-center gap-1.5 bg-brand-primary text-white px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-brand-accent transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add Hotel
                    </button>
                  )}
                </div>

                {isAddingHotel && (
                  <form onSubmit={handleSaveHotel} className="bg-brand-light p-6 rounded-xl border border-gray-200 space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-primary">
                      {editHotelId ? 'Edit Register Details' : 'Add New Property Landmark'}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">Hotel Name *</label>
                        <input
                          type="text"
                          value={hotelForm.hotel_name || ''}
                          onChange={(e) => setHotelForm({ ...hotelForm, hotel_name: e.target.value })}
                          required
                          className="w-full bg-white border px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-accent"
                          placeholder="e.g. Churchill Courts Hotel"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">District *</label>
                        <input
                          type="text"
                          value={hotelForm.district || ''}
                          onChange={(e) => setHotelForm({ ...hotelForm, district: e.target.value })}
                          className="w-full bg-white border px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-accent"
                          placeholder="e.g. Gulu City"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">Contact Number *</label>
                        <input
                          type="text"
                          value={hotelForm.contact_number || ''}
                          onChange={(e) => setHotelForm({ ...hotelForm, contact_number: e.target.value })}
                          required
                          className="w-full bg-white border px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-accent"
                          placeholder="e.g. +256 772 000111"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">Email Address *</label>
                        <input
                          type="email"
                          value={hotelForm.email || ''}
                          onChange={(e) => setHotelForm({ ...hotelForm, email: e.target.value })}
                          required
                          className="w-full bg-white border px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-accent"
                          placeholder="e.g. frontdeck@churchill.co.ug"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">Featured Image URL</label>
                      <input
                        type="url"
                        value={hotelForm.featured_image || ''}
                        onChange={(e) => setHotelForm({ ...hotelForm, featured_image: e.target.value })}
                        className="w-full bg-white border px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-accent"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">Description Overview</label>
                      <textarea
                        value={hotelForm.description || ''}
                        onChange={(e) => setHotelForm({ ...hotelForm, description: e.target.value })}
                        rows={3}
                        className="w-full bg-white border px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-accent"
                        placeholder="Enter professional short copy describing rooms, lounges, and special capacities."
                      />
                    </div>

                    <div className="flex items-center gap-3 py-2">
                      <input
                        type="checkbox"
                        id="is_featured"
                        checked={hotelForm.is_featured || false}
                        onChange={(e) => setHotelForm({ ...hotelForm, is_featured: e.target.checked })}
                        className="w-4 h-4 rounded text-brand-secondary focus:ring-brand-accent cursor-pointer"
                      />
                      <label htmlFor="is_featured" className="text-xs text-gray-700 select-none cursor-pointer font-semibold">
                        Spotlight curation (Feature this hotel on the Homepage Carousel?)
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingHotel(false);
                          setEditHotelId(null);
                        }}
                        className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-500 hover:bg-gray-250 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-brand-secondary text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-brand-primary transition-colors"
                      >
                        {editHotelId ? 'Apply Update' : 'Publish Property'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Hotels List Desktop Table */}
                <div className="overflow-x-auto border rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-brand-primary/5 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-mono">
                        <th className="p-3">Cover Image</th>
                        <th className="p-3">Hotel details</th>
                        <th className="p-3">District</th>
                        <th className="p-3">Contacts</th>
                        <th className="p-3 text-center">Home Showcase</th>
                        <th className="p-3 text-right">Administrative Options</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {hotels.map((h) => (
                        <tr key={h.id} className="hover:bg-brand-light/50">
                          <td className="p-3 shrink-0">
                            <img
                              src={h.featured_image}
                              alt={h.hotel_name}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=200';
                              }}
                              className="w-16 h-12 object-cover rounded-md border"
                            />
                          </td>
                          <td className="p-3 max-w-xs">
                            <p className="font-semibold text-black text-sm">{h.hotel_name}</p>
                            <p className="text-gray-400 font-light truncate mt-0.5">{h.description}</p>
                          </td>
                          <td className="p-3 text-gray-600 font-bold">{h.district || 'Unspecified'}</td>
                          <td className="p-3 space-y-0.5 text-gray-500 font-mono">
                            <p className="font-semibold">{h.contact_number}</p>
                            <p className="text-[10px] lowercase">{h.email}</p>
                          </td>
                          <td className="p-3 text-center">
                            {h.is_featured ? (
                              <span className="inline-block px-2.5 py-1 rounded bg-brand-accent/20 text-brand-primary text-[10px] font-bold tracking-widest uppercase">
                                SPOTLIGHT
                              </span>
                            ) : (
                              <span className="text-gray-400 text-[10px] font-mono leading-none">Standard</span>
                            )}
                          </td>
                          <td className="p-3 text-right space-x-1.5 shrink-0 whitespace-nowrap">
                            <button
                              onClick={() => startEditHotel(h)}
                              className="p-2 border rounded-lg hover:border-brand-accent text-gray-500 hover:text-brand-accent hover:bg-neutral-50 transition-all inline-block"
                              title="Edit registration particulars"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteHotel(h.id, h.hotel_name)}
                              className="p-2 border rounded-lg hover:border-red-500 text-gray-500 hover:text-red-500 hover:bg-neutral-50 transition-all inline-block"
                              title="Permanently remove hotel"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}


            {/* --- TAB: TOURISM SITES --- */}
            {activeTab === 'attractions' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <h2 className="text-lg font-serif tracking-wider font-semibold">Scenic Tourist Attractions</h2>
                    <p className="text-xs text-gray-400">Total destination presets: {attractions.length}</p>
                  </div>
                  {!isAddingAttraction && (
                    <button
                      onClick={() => {
                        setEditAttractionId(null);
                        setAttractionForm({ title: '', description: '', image: '', location: '' });
                        setIsAddingAttraction(true);
                      }}
                      className="flex items-center gap-1.5 bg-brand-primary text-white px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-brand-accent transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add Scenic Spot
                    </button>
                  )}
                </div>

                {isAddingAttraction && (
                  <form onSubmit={handleSaveAttraction} className="bg-brand-light p-6 rounded-xl border border-gray-200 space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-primary">
                      {editAttractionId ? 'Edit Attraction Specifics' : 'Propose New Tourism Haven'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">Destination Title *</label>
                        <input
                          type="text"
                          value={attractionForm.title || ''}
                          onChange={(e) => setAttractionForm({ ...attractionForm, title: e.target.value })}
                          required
                          className="w-full bg-white border px-3 py-2 text-sm rounded-lg focus:outline-none"
                          placeholder="e.g. Kidepo Valley Savannah Reserve"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">Regional District location</label>
                        <input
                          type="text"
                          value={attractionForm.location || ''}
                          onChange={(e) => setAttractionForm({ ...attractionForm, location: e.target.value })}
                          className="w-full bg-white border px-3 py-2 text-sm rounded-lg focus:outline-none"
                          placeholder="e.g. Kaabong District"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">High Resolution Photo link</label>
                      <input
                        type="url"
                        value={attractionForm.image || ''}
                        onChange={(e) => setAttractionForm({ ...attractionForm, image: e.target.value })}
                        className="w-full bg-white border px-3 py-2 text-sm rounded-lg focus:outline-none"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">Promotional Description Context *</label>
                      <textarea
                        value={attractionForm.description || ''}
                        onChange={(e) => setAttractionForm({ ...attractionForm, description: e.target.value })}
                        required
                        rows={4}
                        className="w-full bg-white border px-3 py-2 text-sm rounded-lg focus:outline-none"
                        placeholder="Describe key wildlife, climate highlights, access directions, and historic importance."
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingAttraction(false);
                          setEditAttractionId(null);
                        }}
                        className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-brand-secondary text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider"
                      >
                        {editAttractionId ? 'Update Destination' : 'Save & Publish'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Attractions list Table */}
                <div className="overflow-x-auto border rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-brand-primary/5 border-b uppercase font-mono text-gray-500 tracking-wider">
                        <th className="p-3">Cover Image</th>
                        <th className="p-3">Title Landmark</th>
                        <th className="p-3">Location Area</th>
                        <th className="p-3">Promotional Text Preview</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150 font-medium">
                      {attractions.map((a) => (
                        <tr key={a.id} className="hover:bg-brand-light/50">
                          <td className="p-3">
                            <img src={a.image} alt={a.title} className="w-16 h-12 object-cover rounded border" />
                          </td>
                          <td className="p-3 font-semibold text-black text-sm">{a.title}</td>
                          <td className="p-3 text-brand-primary font-bold">{a.location}</td>
                          <td className="p-3 text-gray-500 font-light max-w-sm truncate">{a.description}</td>
                          <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => startEditAttraction(a)}
                              className="p-1.5 border rounded hover:border-brand-accent text-gray-500 hover:text-brand-accent transition-all"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteAttraction(a.id, a.title)}
                              className="p-1.5 border rounded hover:border-red-500 text-gray-500 hover:text-red-500 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}


            {/* --- TAB: EVENTS --- */}
            {activeTab === 'events' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <h2 className="text-lg font-serif tracking-wider font-semibold">Agendas, Conferences & Trainings</h2>
                    <p className="text-xs text-gray-400">Scheduled events: {events.length}</p>
                  </div>
                  {!isAddingEvent && (
                    <button
                      onClick={() => {
                        setEditEventId(null);
                        setEventForm({ title: '', date: '', location: '', description: '', image: '', type: 'Conference' });
                        setIsAddingEvent(true);
                      }}
                      className="flex items-center gap-1.5 bg-brand-primary text-white px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-brand-accent transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add Event Schedule
                    </button>
                  )}
                </div>

                {isAddingEvent && (
                  <form onSubmit={handleSaveEvent} className="bg-brand-light p-6 rounded-xl border border-gray-200 space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-primary">
                      {editEventId ? 'Edit Event Scheduling' : 'Establish New Council/Workshop Session'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">Event Title *</label>
                        <input
                          type="text"
                          value={eventForm.title || ''}
                          onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                          required
                          className="w-full bg-white border px-3 py-2 text-sm rounded-lg"
                          placeholder="e.g. Masterclass on Tourism Booking Setup"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">Category Type *</label>
                        <select
                          value={eventForm.type || 'Conference'}
                          onChange={(e) => setEventForm({ ...eventForm, type: e.target.value as any })}
                          className="w-full bg-white border px-3 py-2 text-sm rounded-lg"
                        >
                          <option value="Conference">Conference</option>
                          <option value="Workshop">Workshop</option>
                          <option value="Training Session">Training Session</option>
                          <option value="Industry Meeting">Industry Meeting</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">Event Execution Date *</label>
                        <input
                          type="date"
                          value={eventForm.date || ''}
                          onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                          required
                          className="w-full bg-white border px-3 py-2 text-sm rounded-lg"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">Hosting Venue / Center *</label>
                        <input
                          type="text"
                          value={eventForm.location || ''}
                          onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                          className="w-full bg-white border px-3 py-2 text-sm rounded-lg"
                          placeholder="e.g. Boma Hotel, Gulu"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">Photo Backdrop URL</label>
                      <input
                        type="url"
                        value={eventForm.image || ''}
                        onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })}
                        className="w-full bg-white border px-3 py-2 text-sm rounded-lg"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">Core Content Context *</label>
                      <textarea
                        value={eventForm.description || ''}
                        onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                        required
                        rows={3}
                        className="w-full bg-white border px-3 py-2 text-sm rounded-lg"
                        placeholder="Detail target audience, fee rules (if free), hosts list, and takeaways list."
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingEvent(false);
                          setEditEventId(null);
                        }}
                        className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-brand-secondary text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider"
                      >
                        {editEventId ? 'Apply Update' : 'Publish Agenda'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Events list Table */}
                <div className="overflow-x-auto border rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-brand-primary/5 uppercase font-mono text-gray-500 tracking-wider">
                        <th className="p-3">Image preview</th>
                        <th className="p-3">Agenda Program</th>
                        <th className="p-3">Execution Date</th>
                        <th className="p-3">Classification</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150 font-medium">
                      {events.map((e) => (
                        <tr key={e.id} className="hover:bg-brand-light/50">
                          <td className="p-3">
                            <img src={e.image} alt={e.title} className="w-16 h-12 object-cover rounded border" />
                          </td>
                          <td className="p-3">
                            <p className="font-semibold text-black text-sm">{e.title}</p>
                            <p className="text-gray-400 font-mono text-[10px] mt-0.5">{e.location}</p>
                          </td>
                          <td className="p-3 font-mono text-gray-700 font-bold">{e.date}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-neutral-100 text-neutral-800 text-[9px] rounded font-mono font-bold border">
                              {e.type}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => startEditEvent(e)}
                              className="p-1.5 border rounded hover:border-brand-accent text-gray-500 hover:text-brand-accent transition-all"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(e.id, e.title)}
                              className="p-1.5 border rounded hover:border-red-500 text-gray-500 hover:text-red-500 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}


            {/* --- TAB: GALLERY --- */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <h2 className="text-lg font-serif tracking-wider font-semibold">Institutional Photographic Repository</h2>
                    <p className="text-xs text-gray-400">Active museum captures: {gallery.length}</p>
                  </div>
                  {!isAddingGallery && (
                    <button
                      onClick={() => setIsAddingGallery(true)}
                      className="flex items-center gap-1.5 bg-brand-primary text-white px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-brand-accent transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Import Artifact Photo
                    </button>
                  )}
                </div>

                {isAddingGallery && (
                  <form onSubmit={handleSaveGallery} className="bg-brand-light p-6 rounded-xl border border-gray-200 space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-primary">
                      Register Media Artifact
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">Image Asset URL *</label>
                        <input
                          type="url"
                          value={galleryForm.image || ''}
                          onChange={(e) => setGalleryForm({ ...galleryForm, image: e.target.value })}
                          required
                          className="w-full bg-white border px-3 py-2 text-sm rounded-lg"
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">Category Tag *</label>
                        <select
                          value={galleryForm.category || 'Member Hotels'}
                          onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value as any })}
                          className="w-full bg-white border px-3 py-2 text-sm rounded-lg border-gray-200"
                        >
                          <option value="Member Hotels">Member Hotels</option>
                          <option value="Tourism Attractions">Tourism Attractions</option>
                          <option value="NUHA Events">NUHA Events</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">Short Asset Caption / Credit Label</label>
                      <input
                        type="text"
                        value={galleryForm.caption || ''}
                        onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                        className="w-full bg-white border px-3 py-2 text-sm rounded-lg"
                        placeholder="e.g. Wildlife game drive vehicle viewing savanna"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingGallery(false)}
                        className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-brand-secondary text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider"
                      >
                        Catalog Image
                      </button>
                    </div>
                  </form>
                )}

                {/* Gallery Items Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {gallery.map((item) => (
                    <div key={item.id} className="relative group border rounded-xl overflow-hidden aspect-video bg-neutral-100 shadow-sm">
                      <img src={item.image} alt={item.caption} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 text-white">
                        <button
                          type="button"
                          onClick={() => handleDeleteGallery(item.id)}
                          className="self-end p-1.5 rounded-lg bg-red-600/90 text-white hover:bg-red-700 transition"
                          title="Purge media"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div>
                          <span className="text-[8px] bg-brand-accent text-brand-primary font-mono px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                            {item.category}
                          </span>
                          <p className="text-[10px] mt-1 font-light line-clamp-1">{item.caption}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}


            {/* --- TAB: MEMBERSHIP APPLICATIONS --- */}
            {activeTab === 'applications' && (
              <div className="space-y-6">
                <div className="pb-4 border-b">
                  <h2 className="text-lg font-serif tracking-wider font-semibold">Incoming Membership Submission Logs</h2>
                  <p className="text-xs text-gray-400">
                    Review and authorize hotels submitting registration requests. Core backup target email: <strong className="text-brand-primary select-all">numa.hoteliers.association@gmail.com</strong>
                  </p>
                </div>

                {applications.length === 0 ? (
                  <div className="p-8 text-center bg-brand-light rounded-xl text-gray-400">
                    <FileSpreadsheet className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p className="text-sm font-medium">No submission logs currently recorded.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {applications.map((app) => (
                      <div key={app.id} className="bg-white border rounded-xl p-5 border-gray-200 shadow-sm space-y-4 hover:shadow-md transition">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-150">
                          <div>
                            <span className="text-[10px] font-mono text-gray-400 tracking-wider">
                              SUBMITTED ON {new Date(app.submission_date).toLocaleDateString()}
                            </span>
                            <h3 className="text-base text-brand-primary font-serif font-bold mt-1">{app.hotel_name}</h3>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {app.status === 'Pending' ? (
                              <span className="px-3 py-1 bg-amber-50 rounded-full text-[10px] font-semibold text-amber-700 border border-amber-200">
                                Pending Appraisal
                              </span>
                            ) : app.status === 'Approved' ? (
                              <span className="px-3 py-1 bg-green-50 rounded-full text-[10px] font-bold text-green-700 border border-green-200">
                                Approved & Enrolled
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-neutral-50 rounded-full text-[10px] font-bold text-neutral-500 border">
                                Archived / Declined
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
                          <div>
                            <span className="text-gray-400 uppercase tracking-widest font-mono text-[9px]">Contact Delegate</span>
                            <p className="font-bold text-gray-800 text-sm mt-0.5">{app.contact_person}</p>
                          </div>
                          <div>
                            <span className="text-gray-400 uppercase tracking-widest font-mono text-[9px]">Phone & District Area</span>
                            <p className="font-semibold text-gray-800 text-sm mt-0.5">{app.phone} ({app.district})</p>
                          </div>
                          <div>
                            <span className="text-gray-400 uppercase tracking-widest font-mono text-[9px]">Email Coordinates</span>
                            <p className="font-mono text-brand-accent text-sm mt-0.5 select-all">{app.email}</p>
                          </div>
                        </div>

                        <div className="p-3.5 bg-neutral-50 rounded-lg text-xs leading-relaxed text-gray-600 font-light border">
                          <p className="font-bold font-mono text-[9px] uppercase tracking-wider text-gray-400 mb-1">Applicant Introduction Message</p>
                          "{app.message}"
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center pt-2 gap-4">
                          <p className="text-[10px] font-mono text-brand-secondary font-semibold">
                            Simulated Webhook: Transmitted successfully to Google Mail.
                          </p>
                          
                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            {app.status === 'Pending' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateApplicationStatus(app.id, 'Approved')}
                                  className="px-3.5 py-2 bg-brand-secondary text-white rounded-lg text-xs font-semibold hover:bg-brand-primary transition uppercase tracking-wider"
                                >
                                  Enroll Member
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateApplicationStatus(app.id, 'Declined')}
                                  className="px-3.5 py-2 border hover:bg-neutral-50 rounded-lg text-xs font-semibold text-gray-500 transition uppercase tracking-wider"
                                >
                                  Reject / Decline
                                </button>
                              </>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteApplication(app.id)}
                              className="p-2 border rounded-lg hover:bg-red-50 hover:border-red-500 text-neutral-400 hover:text-red-500 transition"
                              title="Delete log record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}


            {/* --- TAB: HOMEPAGE INTRO CUSTOMIZER --- */}
            {activeTab === 'config' && (
              <form onSubmit={handleSaveConfig} className="space-y-6">
                <div className="pb-4 border-b">
                  <h2 className="text-lg font-serif tracking-wider font-semibold">Homepage Featured Copy & Assets</h2>
                  <p className="text-xs text-gray-400">Revises actual vision headings, mission benchmarks, and hero images across the homepage instantly.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">Core Hero Headline *</label>
                    <input
                      type="text"
                      value={configForm.heroHeadline}
                      onChange={(e) => setConfigForm({ ...configForm, heroHeadline: e.target.value })}
                      required
                      className="w-full bg-white border px-3 py-2 text-sm rounded-lg border-gray-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">Hero Subheadline Text *</label>
                    <textarea
                      value={configForm.heroSubheadline}
                      onChange={(e) => setConfigForm({ ...configForm, heroSubheadline: e.target.value })}
                      required
                      rows={2}
                      className="w-full bg-white border px-3 py-2 text-sm rounded-lg border-gray-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">Hero Backdrop Image Link *</label>
                    <input
                      type="url"
                      value={configForm.heroImage}
                      onChange={(e) => setConfigForm({ ...configForm, heroImage: e.target.value })}
                      required
                      className="w-full bg-white border px-3 py-2 text-sm rounded-lg border-gray-200"
                    />
                  </div>

                  <div className="p-4 bg-brand-light border rounded-xl border-gray-200 space-y-4">
                    <h4 className="text-xs font-mono font-bold uppercase text-brand-primary tracking-widest border-b pb-2">Institutional Copy</h4>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 block">About NUHA Overview Paragraph</label>
                      <textarea
                        value={configForm.aboutOverview}
                        onChange={(e) => setConfigForm({ ...configForm, aboutOverview: e.target.value })}
                        required
                        rows={4}
                        className="w-full bg-white border px-3 py-2 text-sm rounded-lg border-gray-200"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">Association Vision Landmark Statement</label>
                        <textarea
                          value={configForm.aboutVision}
                          onChange={(e) => setConfigForm({ ...configForm, aboutVision: e.target.value })}
                          required
                          rows={4}
                          className="w-full bg-white border px-3 py-2 text-sm rounded-lg border-gray-200"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">Association Mission Statement</label>
                        <textarea
                          value={configForm.aboutMission}
                          onChange={(e) => setConfigForm({ ...configForm, aboutMission: e.target.value })}
                          required
                          rows={4}
                          className="w-full bg-white border px-3 py-2 text-sm rounded-lg border-gray-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-brand-primary text-white hover:bg-brand-secondary transition px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-primary/10"
                  >
                    Commit Configuration Updates
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
