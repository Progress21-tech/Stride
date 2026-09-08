import Image from 'next/image';

interface StrideLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  className?: string;
}

export function StrideLogo({ size = 'md', showWordmark = true, className = '' }: StrideLogoProps) {
  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 48,
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Image src="/icon-512.png" width={iconSizes[size]} height={iconSizes[size]} alt="Stride" priority={size !== 'sm'} />

      {showWordmark && (
        <span className={`font-bold tracking-wider uppercase font-sans text-current ${textSizes[size]}`}>
          STRID<span className="text-[#18A957]">E</span>
        </span>
      )}
    </div>
  );
}
