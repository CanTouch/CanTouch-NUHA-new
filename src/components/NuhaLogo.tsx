/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface NuhaLogoProps {
  className?: string;
  iconOnly?: boolean;
}

export default function NuhaLogo({ className = "w-10 h-10", iconOnly = false }: NuhaLogoProps) {
  // Define precise HEX colors from the official attached NUHA logo
  const figures = [
    { angle: 0, color: '#3EB25D' },    // Top: Vibrant Green
    { angle: 72, color: '#9CCA62' },   // Top-Right: Lime Green
    { angle: 144, color: '#F1D13C' },  // Bottom-Right: Warm Golden Yellow 
    { angle: 216, color: '#13261F' },  // Bottom-Left: Dark Charcoal Teal
    { angle: 288, color: '#8C8E8D' },  // Top-Left: Slate Grey
  ];

  const logoIcon = (
    <svg
      viewBox="0 0 100 100"
      className={iconOnly ? className : "w-11 h-11 shrink-0"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Background backing for high-contrast blending */}
      <g>
        {figures.map((fig, index) => (
          <g key={index} transform={`rotate(${fig.angle}, 50, 50)`}>
            {/* Outstretched arms holding hands - forming a beautiful interlaced ring */}
            <path
              d="M 24,25 Q 50,42 76,25"
              stroke={fig.color}
              strokeWidth="8.5"
              strokeLinecap="round"
              opacity="0.85"
            />
            {/* Stylized torso legs forming the outer frame & central 5-pointed star */}
            <path
              d="M 37,35 Q 50,22 63,35"
              stroke={fig.color}
              strokeWidth="8.5"
              strokeLinecap="round"
              opacity="0.85"
            />
            {/* Head of stylized human figure */}
            <circle
              cx="50"
              cy="12"
              r="7.5"
              fill={fig.color}
              opacity="0.95"
            />
          </g>
        ))}
      </g>
    </svg>
  );

  if (iconOnly) {
    return logoIcon;
  }

  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {logoIcon}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="text-white font-serif text-xl tracking-[0.16em] font-bold uppercase">NUHA</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A35B]"></span>
        </div>
        <p className="text-[7.5px] uppercase tracking-[0.2em] text-[#C9A35B] font-sans mt-1 font-semibold leading-none">
          Northern Uganda Hotelier's Association
        </p>
      </div>
    </div>
  );
}
