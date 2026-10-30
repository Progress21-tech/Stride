import Image from 'next/image';

interface SylpaceLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  className?: string;
}

export function SylpaceLogo({ size = 'md', showWordmark = true, className = '' }: SylpaceLogoProps) {
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
      <Image src="/icon-512.png" width={iconSizes[size]} height={iconSizes[size]} alt="Sylpace" priority={size !== 'sm'} />

      {showWordmark && (
        <span className={`font-bold tracking-wider uppercase font-sans text-current ${textSizes[size]}`}>
          SYL<span className="text-[#18A957]">PACE</span>
        </span>
      )}
    </div>
  );
}
