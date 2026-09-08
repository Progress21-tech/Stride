import React from 'react';

interface StrideLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  className?: string;
}

export function StrideLogo({ size = 'md', showWordmark = true, className = '' }: StrideLogoProps) {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Approved Stride Mark: Ribbon folded path S */}
      <svg
        className={iconSizes[size]}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 68 18 L 32 30 C 26 32 24 38 27 43 L 48 70 C 51 75 58 76 63 73 L 78 63"
          stroke="#18A957"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 22 42 L 56 54 C 62 56 64 62 61 67 L 40 90"
          stroke="#18A957"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />
        <circle cx="78" cy="18" r="6" fill="#18A957" />
      </svg>

      {showWordmark && (
        <span className={`font-bold tracking-wider uppercase font-sans text-current ${textSizes[size]}`}>
          STRID<span className="text-[#18A957]">E</span>
        </span>
      )}
    </div>
  );
}
