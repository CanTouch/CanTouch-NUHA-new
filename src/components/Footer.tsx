/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Mail, Phone, MapPin, Shield, Award, Calendar, HelpCircle, Facebook, Instagram, Twitter } from 'lucide-react';
import NuhaLogo from './NuhaLogo';

interface FooterProps {
  setCurrentPage: (page: string) => void;
  currentPage: string;
}

export default function Footer({ setCurrentPage, currentPage }: FooterProps) {
  const handleNavigate = (pageId: string) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="nuha-footer" className="bg-[#111111] text-white border-t border-[#C9A35B]/30 pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Info and Crest */}
          <div className="space-y-5">
            <div
              className="inline-flex items-center justify-center rounded-2xl border border-[#C9A35B]/30 bg-white/10 px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-sm transition-all duration-300 hover:border-[#C9A35B]/60 hover:bg-white/15 cursor-pointer group"
              onClick={() => handleNavigate('home')}
            >
              <NuhaLogo className="h-14 sm:h-16 w-auto transition-transform duration-300 group-hover:scale-105" />
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              Fostering collaborative growth, standardizing hospitality operations, and unveiling Northern Uganda as Africa's premier sustainable travel haven.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://x.com/NUHA_Uganda" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-brand-accent hover:bg-brand-accent/10 text-gray-400 hover:text-white transition-all"
                aria-label="Follow NUHA on X (Twitter)"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://www.facebook.com/share/1Dokfio7wi/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-brand-accent hover:bg-brand-accent/10 text-gray-400 hover:text-white transition-all"
                aria-label="Follow NUHA on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://www.instagram.com/nuha.uganda?igsh=b2ozZ2h1dWc0bzJi" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-brand-accent hover:bg-brand-accent/10 text-gray-400 hover:text-white transition-all"
                aria-label="Follow NUHA on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-brand-accent mb-5 font-mono">
              Directories
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <button
                  onClick={() => handleNavigate('home')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Association Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('hotels')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Member Hotels Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('attractions')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Regional Tourist Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('gallery')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Institutional Gallery
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Association Activities */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-brand-accent mb-5 font-mono">
              Advocacy & Support
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <button
                  onClick={() => handleNavigate('events')}
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5 text-brand-secondary inline" />
                  Upcoming Workshops
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('membership')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Join NUHA (Register Today)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('contact')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Public Inquiry Center
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Main Contacts */}
          <div className="space-y-4 text-xs">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-brand-accent mb-1 font-mono">
              Association Office
            </h4>
            <div className="flex items-start gap-2.5 text-gray-400">
              <MapPin className="w-4 h-4 text-brand-secondary shrink-0 mt-0.5" />
              <span>Plot 10, Last Okech Road, Senior Quarters, Gulu city Uganda.</span>
            </div>
            <div className="flex items-center gap-2.5 text-gray-400">
              <Mail className="w-4 h-4 text-brand-secondary shrink-0" />
              <a
                href="mailto:nuha.hoteliers.association@gmail.com"
                className="hover:text-white transition-colors break-all underline"
              >
                nuha.hoteliers.association@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-gray-400">
              <Phone className="w-4 h-4 text-brand-secondary shrink-0" />
              <span>+256 759984301</span>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-gray-500 font-mono">
            &copy; {new Date().getFullYear()} Northern Uganda Hoteliers Association (NUHA). All Rights Reserved.
          </p>
          <div className="flex items-center gap-6 text-[10px] text-gray-500 font-mono">
            <span 
              onDoubleClick={() => handleNavigate('admin')} 
              className="cursor-default select-none hover:text-gray-400 transition-colors"
              title="Version 1.0.4 - NUHA"
            >
              Built By Kuppe Labs
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
