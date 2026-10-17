import { FC } from 'react';

interface LogoProps {
  variant?: 'primary' | 'light' | 'compact';
  width?: number;
  height?: number;
  className?: string;
}

const PSOpticalLogo: FC<LogoProps> = ({ variant = 'primary', width, height, className }) => {
  const isDark = variant === 'primary';
  const textColor = isDark ? '#30251F' : '#F6F1E8';
  const accentColor = '#B65E43';
  const goldColor = '#D4B483';

  if (variant === 'compact') {
    return (
      <svg
        width={width || 44}
        height={height || 44}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        role="img"
        aria-label="PS Optical logo monogram"
      >
        <rect width="44" height="44" rx="10" fill={isDark ? '#30251F' : '#B65E43'} />
        <text x="7" y="30" fontFamily="Georgia, serif" fontSize="22" fontWeight="700" fill="#F6F1E8">P</text>
        <text x="22" y="30" fontFamily="Georgia, serif" fontSize="22" fontWeight="700" fill={goldColor}>S</text>
      </svg>
    );
  }

  return (
    <svg
      width={width || 160}
      height={height || 46}
      viewBox="0 0 160 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="PS Optical"
    >
      {/* Left lens */}
      <ellipse cx="15" cy="18" rx="11" ry="8" stroke={goldColor} strokeWidth="1.5" fill="none" />
      {/* Right lens */}
      <ellipse cx="37" cy="18" rx="11" ry="8" stroke={goldColor} strokeWidth="1.5" fill="none" />
      {/* Bridge */}
      <line x1="26" y1="17.5" x2="26" y2="18.5" stroke={goldColor} strokeWidth="1.5" strokeLinecap="round" />
      {/* Temple left */}
      <line x1="4" y1="15" x2="1.5" y2="13" stroke={goldColor} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      {/* Temple right */}
      <line x1="48" y1="15" x2="50.5" y2="13" stroke={goldColor} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      {/* P in left lens */}
      <text x="9" y="22" fontFamily="Georgia, 'Times New Roman', serif" fontSize="12" fontWeight="700" fill={isDark ? '#30251F' : '#F6F1E8'}>P</text>
      {/* S in right lens */}
      <text x="31" y="22" fontFamily="Georgia, 'Times New Roman', serif" fontSize="12" fontWeight="700" fill={accentColor}>S</text>
      {/* Brand name */}
      <text x="58" y="20" fontFamily="Georgia, 'Playfair Display', serif" fontSize="16" fontWeight="700" fill={textColor} letterSpacing="0.5">PS</text>
      <text x="78" y="20" fontFamily="Georgia, 'Playfair Display', serif" fontSize="16" fontWeight="400" fill={accentColor} letterSpacing="0.5"> OPTICAL</text>
      {/* Thin gold rule */}
      <line x1="58" y1="26" x2="155" y2="26" stroke={goldColor} strokeWidth="0.5" opacity="0.5" />
      {/* Tagline */}
      <text x="58" y="38" fontFamily="Inter, system-ui, sans-serif" fontSize="7.5" fontWeight="400" fill={isDark ? '#72785A' : '#D4B483'} letterSpacing="2.5">PREMIUM EYEWEAR</text>
    </svg>
  );
};

export default PSOpticalLogo;
