/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Hotel {
  id: string;
  hotel_name: string;
  contact_number: string;
  email: string;
  description: string;
  featured_image: string;
  is_featured: boolean;
  district?: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  description: string;
  image: string;
  location?: string;
  type?: 'Conference' | 'Workshop' | 'Training Session' | 'Industry Meeting';
}

export interface Attraction {
  id: string;
  title: string;
  description: string;
  image: string;
  location?: string;
}

export interface GalleryItem {
  id: string;
  image: string;
  category: 'Member Hotels' | 'Tourism Attractions' | 'NUHA Events';
  caption?: string;
}

export interface MembershipApplication {
  id: string;
  hotel_name: string;
  contact_person: string;
  phone: string;
  email: string;
  district: string;
  message: string;
  submission_date: string;
  status: 'Pending' | 'Approved' | 'Declined';
}

export interface HomepageConfig {
  heroHeadline: string;
  heroSubheadline: string;
  heroImage: string;
  aboutOverview: string;
  aboutVision: string;
  aboutMission: string;
}
