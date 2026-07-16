import React from "react";

interface CasagrandLogoProps {
  className?: string;
  showText?: boolean;
  textColor?: string;
  subtextColor?: string;
  logoColor?: string;
}

export default function CasagrandLogo({
  className = "h-11",
  showText = true,
  textColor = "text-slate-700",
  subtextColor = "text-slate-500",
}: CasagrandLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* High-fidelity Casagrand SVG Logo with precise upward arrow roof element */}
      <svg
        viewBox="0 0 320 80"
        className="h-full w-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Casagrand Logo"
      >
        {showText && (
          <g>
            {/* "CASAGRAND" Main Title */}
            <text
              x="5"
              y="45"
              fontFamily='"Inter", "SF Pro Display", -apple-system, sans-serif'
              fontWeight="900"
              fontSize="34"
              fill="currentColor"
              className={`${textColor} tracking-tight`}
            >
              CASAGRAND
            </text>
            {/* "building aspirations" Subtitle */}
            <text
              x="115"
              y="65"
              fontFamily='"Inter", sans-serif'
              fontWeight="500"
              fontSize="11.5"
              fill="currentColor"
              className={`${subtextColor} tracking-[0.22em]`}
            >
              building aspirations
            </text>
          </g>
        )}
        {/* Golden upward arrow roof icon */}
        <g transform={showText ? "translate(254, 12)" : "translate(10, 10)"}>
          {/* Main diagonal arrow block */}
          <path
            d="M 1.5 19 L 20 2.5 L 50 2.5 L 50 34.5 L 39 23.5 L 39 45 L 33 51 L 33 23.5 L 1.5 19 Z"
            fill="#F5A623"
          />
          {/* 3D aspect side panel */}
          <path
            d="M 33 23.5 L 39 23.5 L 39 45 L 33 51 Z"
            fill="#D97706"
            opacity="0.85"
          />
          {/* Top light highlight */}
          <path
            d="M 20 2.5 L 50 2.5 L 50 15 L 20 15 Z"
            fill="#F59E0B"
            opacity="0.9"
          />
        </g>
      </svg>
    </div>
  );
}
