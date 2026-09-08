import type { SVGProps } from 'react';

export type IconProps = SVGProps<SVGSVGElement> & { size?: number };

export function Icon({ children, size = 16, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const SearchIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={2.5}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </Icon>
);

export const MicIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={2} strokeLinecap="round">
    <rect x="9" y="2" width="6" height="12" rx="3" />
    <path d="M5 10a7 7 0 0014 0M12 19v4M8 23h8" />
  </Icon>
);

export const CameraIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={2} strokeLinecap="round">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
    <circle cx="12" cy="13" r="4" />
  </Icon>
);

export const StoreIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={2}>
    <path d="M3 9l1-5h16l1 5M3 9a3 3 0 006 0 3 3 0 006 0 3 3 0 006 0M5 21V9M19 21V9M5 21h14" />
  </Icon>
);

export const MoonIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={2}>
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </Icon>
);

export const BellIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={2}>
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
  </Icon>
);

export const UserIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={2}>
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z" />
  </Icon>
);

export const PinIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={2.5}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </Icon>
);

export const ClockIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </Icon>
);

export const BoxIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={2}>
    <polyline points="21,8 21,21 3,21 3,8" />
    <rect x="1" y="3" width="22" height="5" />
    <line x1="10" y1="12" x2="14" y2="12" />
  </Icon>
);

export const GlobeIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </Icon>
);

export const BoltIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={2}>
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" />
  </Icon>
);

export const ArrowIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={2.5}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12,5 19,12 12,19" />
  </Icon>
);

export const ReserveIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={2} strokeLinecap="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
  </Icon>
);

export const TruckIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={2} strokeLinecap="round">
    <circle cx="5" cy="17" r="3" />
    <circle cx="19" cy="17" r="3" />
    <path d="M5 17H3V9l4-5h10l3 6h2v7h-3M9 17h6" />
  </Icon>
);

export const ListIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={2.5}>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </Icon>
);

export const MapIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={2}>
    <polygon points="1,6 1,22 8,18 16,22 23,18 23,2 16,6 8,2" />
    <line x1="8" y1="2" x2="8" y2="18" />
    <line x1="16" y1="6" x2="16" y2="22" />
  </Icon>
);

export const MenuIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={2.5}>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </Icon>
);

export const VideoIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={2}>
    <polygon points="23,7 16,12 23,17 23,7" />
    <rect x="1" y="5" width="15" height="14" rx="1" />
  </Icon>
);

export const ChessKnightIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={2}>
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </Icon>
);

export const BankIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={2}>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </Icon>
);

export const RupeeIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={2}>
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </Icon>
);

export const TrendUpIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={2}>
    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
  </Icon>
);

export const CardIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={2}>
    <rect x="1" y="4" width="22" height="16" rx="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </Icon>
);

export const GearIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={2}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </Icon>
);

export const FileIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={2}>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </Icon>
);

export const EyeIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={2}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
);

export const GeoUpIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={2}>
    <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
    <polyline points="17,6 23,6 23,12" />
  </Icon>
);

export const GeoDownIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={2}>
    <polyline points="23,18 13.5,8.5 8.5,13.5 1,6" />
    <polyline points="17,18 23,18 23,12" />
  </Icon>
);

export const BarChartIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={2}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </Icon>
);

export const LogoMark = ({ width = 142, height = 34 }: { width?: number; height?: number }) => (
  <svg width={width} height={height} viewBox="0 0 142 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="32" height="32" fill="#8B5CF6" stroke="#0A0A0A" strokeWidth="2" />
    <rect x="6" y="6" width="22" height="14" fill="#FFFFFF" />
    <rect x="14" y="20" width="4" height="9" fill="#FFFFFF" />
    <circle cx="17" cy="13" r="4" fill="#8B5CF6" stroke="#0A0A0A" strokeWidth="1.5" />
    <circle cx="17" cy="13" r="1.5" fill="#FFFFFF" />
    <text x="42" y="22" fontFamily="'Space Grotesk', sans-serif" fontWeight="800" fontSize="18" fill="#0A0A0A" letterSpacing="-0.8">
      near
    </text>
    <text x="90" y="22" fontFamily="'Space Grotesk', sans-serif" fontWeight="800" fontSize="18" fill="#8B5CF6" letterSpacing="-0.8">
      buy
    </text>
  </svg>
);
export const LockIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Icon>
);

export const FingerprintIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4" />
    <path d="M5 19.5C5.5 18 6 15 6 11.5a6 6 0 0 1 12 0c0 3.1-.5 5.8-1 7.5" />
    <path d="M9 19.5L9 11a3 3 0 0 1 6 0l0 8.5" />
  </Icon>
);

export const BadgeIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </Icon>
);

export const BarcodeIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 5v14" />
    <path d="M8 5v14" />
    <path d="M12 5v14" />
    <path d="M17 5v14" />
    <path d="M21 5v14" />
  </Icon>
);
