/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, X, Check } from 'lucide-react';

interface NotificationProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Notification({ message, type = 'success', onClose, duration = 4000 }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgStyle =
    type === 'success'
      ? 'bg-brand-primary border-brand-secondary text-white'
      : type === 'error'
      ? 'bg-red-950 border-red-500 text-red-100'
      : 'bg-slate-900 border-brand-accent text-slate-100';

  const Icon = type === 'success' ? CheckCircle2 : AlertTriangle;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border ${bgStyle} animate-fade-in-up duration-300 max-w-sm`}
    >
      <div className="p-1 rounded-full bg-black/25">
        <Icon className={`w-5 h-5 ${type === 'success' ? 'text-brand-secondary' : 'text-brand-accent'}`} />
      </div>
      <div className="flex-1 text-sm font-medium">{message}</div>
      <button
        onClick={onClose}
        className="p-1 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/10"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
