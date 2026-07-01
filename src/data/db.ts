/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { Hotel, EventItem, Attraction, GalleryItem, MembershipApplication, HomepageConfig } from '../types';
import { supabase } from '../lib/supabase';

// --- HOTELS ---
export const getDBHotels = async (): Promise<Hotel[]> => {
  const { data, error } = await supabase.from('hotels').select('*');
  if (error) {
    console.error('Error fetching hotels:', error);
    return [];
  }
  return data as Hotel[];
};

export const saveDBHotels = async (hotels: Hotel[]) => {
  const { error } = await supabase.from('hotels').upsert(hotels);
  if (error) console.error('Error saving hotels:', error);
};

// --- EVENTS ---
export const getDBEvents = async (): Promise<EventItem[]> => {
  const { data, error } = await supabase.from('events').select('*');
  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }
  return data as EventItem[];
};

export const saveDBEvents = async (events: EventItem[]) => {
  const { error } = await supabase.from('events').upsert(events);
  if (error) console.error('Error saving events:', error);
};

// --- ATTRACTIONS ---
export const getDBAttractions = async (): Promise<Attraction[]> => {
  const { data, error } = await supabase.from('attractions').select('*');
  if (error) {
    console.error('Error fetching attractions:', error);
    return [];
  }
  return data as Attraction[];
};

export const saveDBAttractions = async (attractions: Attraction[]) => {
  const { error } = await supabase.from('attractions').upsert(attractions);
  if (error) console.error('Error saving attractions:', error);
};

// --- GALLERY ---
export const getDBGallery = async (): Promise<GalleryItem[]> => {
  const { data, error } = await supabase.from('gallery').select('*');
  if (error) {
    console.error('Error fetching gallery:', error);
    return [];
  }
  return data as GalleryItem[];
};

export const saveDBGallery = async (gallery: GalleryItem[]) => {
  const { error } = await supabase.from('gallery').upsert(gallery);
  if (error) console.error('Error saving gallery:', error);
};

// --- APPLICATIONS ---
export const getDBApplications = async (): Promise<MembershipApplication[]> => {
  const { data, error } = await supabase.from('applications').select('*');
  if (error) {
    console.error('Error fetching applications:', error);
    return [];
  }
  return data as MembershipApplication[];
};

export const saveDBApplications = async (apps: MembershipApplication[]) => {
  const { error } = await supabase.from('applications').upsert(apps);
  if (error) console.error('Error saving applications:', error);
};

// --- HOMEPAGE CONFIG ---
// Note: homepage_config table uses snake_case columns; we map to/from the
// camelCase HomepageConfig type used throughout the rest of the app.
export const getDBConfig = async (): Promise<HomepageConfig> => {
  const { data, error } = await supabase
    .from('homepage_config')
    .select('*')
    .eq('id', 1)
    .single();

  if (error || !data) {
    console.error('Error fetching homepage config:', error);
    return {
      heroHeadline: '',
      heroSubheadline: '',
      heroImage: '',
      aboutOverview: '',
      aboutVision: '',
      aboutMission: ''
    };
  }

  return {
    heroHeadline: data.hero_headline,
    heroSubheadline: data.hero_subheadline,
    heroImage: data.hero_image,
    aboutOverview: data.about_overview,
    aboutVision: data.about_vision,
    aboutMission: data.about_mission
  };
};

export const saveDBConfig = async (config: HomepageConfig) => {
  const { error } = await supabase
    .from('homepage_config')
    .upsert({
      id: 1,
      hero_headline: config.heroHeadline,
      hero_subheadline: config.heroSubheadline,
      hero_image: config.heroImage,
      about_overview: config.aboutOverview,
      about_vision: config.aboutVision,
      about_mission: config.aboutMission
    });
  if (error) console.error('Error saving homepage config:', error);
};