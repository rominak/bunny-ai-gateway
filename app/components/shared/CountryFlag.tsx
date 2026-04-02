'use client';

interface CountryFlagProps {
  code: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-[20px] h-[14px]',
  md: 'w-[32px] h-[22px]',
  lg: 'w-[40px] h-[28px]',
};

// Map city/region names to country codes
const regionToCode: Record<string, string> = {
  'Frankfurt': 'DE',
  'New York': 'US',
  'Singapore': 'SG',
  'Sydney': 'AU',
  'Los Angeles': 'US',
  'London': 'GB',
  'Tokyo': 'JP',
  'São Paulo': 'BR',
  'Amsterdam': 'NL',
  'Paris': 'FR',
  'Hong Kong': 'HK',
  'Seoul': 'KR',
  'Mumbai': 'IN',
  'Toronto': 'CA',
  'Stockholm': 'SE',
  'Madrid': 'ES',
  'Milan': 'IT',
  'Warsaw': 'PL',
  'Johannesburg': 'ZA',
  'Dubai': 'AE',
};

export function getCountryCode(regionOrCode: string): string {
  // If it's already a 2-letter code, return it
  if (regionOrCode.length === 2) {
    return regionOrCode.toUpperCase();
  }

  // Handle patterns like "EU (Frankfurt)" or "US (Los Angeles)"
  const parenthesisMatch = regionOrCode.match(/\(([^)]+)\)/);
  if (parenthesisMatch) {
    const cityName = parenthesisMatch[1];
    if (regionToCode[cityName]) {
      return regionToCode[cityName];
    }
  }

  // Otherwise look it up in the map directly
  return regionToCode[regionOrCode] || 'XX';
}

export default function CountryFlag({ code, size = 'md' }: CountryFlagProps) {
  const flagCode = getCountryCode(code).toLowerCase();

  return (
    <div className={`${sizeClasses[size]} rounded-[3px] overflow-hidden flex-shrink-0 border border-[#e6e9ec]`}>
      <img
        src={`https://flagcdn.com/w80/${flagCode}.png`}
        srcSet={`https://flagcdn.com/w160/${flagCode}.png 2x`}
        alt={`${code} flag`}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
