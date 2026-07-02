/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, ShieldAlert, Award, Compass, HeartHandshake } from 'lucide-react';
import NuhaLogo from './NuhaLogo';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isAdminLoggedIn: boolean;
  onLogoutAdmin: () => void;
}

export default function Navbar({ currentPage, setCurrentPage, isAdminLoggedIn, onLogoutAdmin }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'hotels', label: 'Member Hotels' },
    { id: 'attractions', label: 'Tourism' },
    { id: 'events', label: 'Events & Training' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'membership', label: 'Membership' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavigate = (pageId: string) => {
    setCurrentPage(pageId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      id="nuha-navbar"
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-white backdrop-blur-md shadow-[0_8px_30px_rgba(15,35,68,0.08)] border-gray-200 py-3 h-16'
          : 'bg-white backdrop-blur-sm shadow-[0_4px_20px_rgba(15,35,68,0.05)] border-gray-200 py-4 h-20'
      } flex items-center justify-between`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo Crest */}
          <div
            onClick={() => handleNavigate('home')}
            className="cursor-pointer group flex items-center"
          >
            <NuhaLogo className="h-14 w-auto transition-transform duration-300 group-hover:scale-105" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`relative px-4 py-2 text-[10px] font-medium tracking-[0.18em] uppercase transition-all duration-300 ${
                    isActive
                      ? 'text-[#0F2344] font-semibold'
                      : 'text-[#0F2344]/70 hover:text-[#0F2344]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-1 left-4 right-4 h-[1px] bg-[#C9A35B]" />
                  )}
                </button>
              );
            })}

            {/* Admin trigger */}
            {isAdminLoggedIn && (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-white/15">
                <button
                  onClick={() => handleNavigate('admin')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold tracking-wider uppercase bg-brand-accent text-brand-primary transition-all hover:bg-white`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Dashboard
                </button>
                <button
                  onClick={onLogoutAdmin}
                  className="text-xs font-mono text-red-200 hover:text-white hover:underline transition-all px-2 py-1"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggler */}
          <div className="flex items-center lg:hidden gap-3">
            {isAdminLoggedIn && (
              <button
                onClick={() => handleNavigate('admin')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-brand-accent text-brand-primary text-[10px] font-mono font-bold uppercase tracking-wider"
              >
                <ShieldAlert className="w-3 h-3" />
                Dash
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#0F2344] hover:text-[#0F2344]/80 transition-colors border border-gray-200 rounded-lg hover:bg-[#0F2344]/5"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-300 shadow-[0_12px_35px_rgba(15,35,68,0.10)] py-4 px-4 space-y-2 animate-fade-in duration-200">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors ${
                currentPage === item.id
                  ? 'bg-[#0F2344] text-white border-l-4 border-[#C9A35B]'
                  : 'text-[#0F2344] hover:bg-[#0F2344]/5 hover:text-[#0F2344]'
              }`}
            >
              {item.label}
            </button>
          ))}
          {isAdminLoggedIn && (
            <div className="pt-2 border-t border-white/10 flex items-center justify-between px-4">
              <button
                onClick={() => handleNavigate('admin')}
                className="text-xs font-semibold text-brand-accent tracking-wider uppercase flex items-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4" />
                Admin Dashboard
              </button>
              <button
                onClick={() => {
                  onLogoutAdmin();
                  setIsMobileMenuOpen(false);
                }}
                className="text-xs font-mono text-red-300 font-bold hover:text-red-100"
              >
                Logout Account
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
