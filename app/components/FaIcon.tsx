import { FontAwesomeIcon, type FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowLeft,
  faArrowsLeftRight,
  faArrowsRotate,
  faArrowDown,
  faArrowRightArrowLeft,
  faArrowTrendDown,
  faArrowTrendUp,
  faArrowUp,
  faBan,
  faBars,
  faBell as fasBell,
  faBellSlash,
  faBolt,
  faBook,
  faBroadcastTower,
  faBroom,
  faCalculator,
  faChartLine,
  faChartPie,
  faChartSimple,
  faCheck,
  faCheckCircle,
  faChevronDown,
  faChevronRight,
  faChevronUp,
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
  faCircleQuestion,
  faClockRotateLeft,
  faClone,
  faCloudArrowUp,
  faCode,
  faCodeBranch,
  faCog,
  faCopy,
  faCreditCard,
  faCube,
  faDatabase,
  faDollarSign,
  faDownload,
  faEllipsis,
  faEllipsisVertical,
  faEraser,
  faExclamationCircle,
  faExclamationTriangle,
  faExpand,
  faFileAudio,
  faFileImage,
  faFilePdf,
  faFileVideo,
  faFileZipper,
  faFireFlameCurved,
  faFile,
  faFileCode,
  faFileLines,
  faFilm,
  faFlag,
  faFolder,
  faFolderPlus,
  faForward,
  faGaugeHigh,
  faGear,
  faGhost,
  faGift,
  faGlobe,
  faGrip,
  faGraduationCap,
  faHandshake,
  faHardDrive,
  faHand,
  faHeadset,
  faHouse,
  faImage,
  faInfoCircle,
  faKey,
  faLifeRing,
  faLink,
  faList,
  faLocationDot,
  faLock,
  faMapPin,
  faMemory,
  faMicrochip,
  faMinus,
  faPalette,
  faPlay,
  faPlayCircle,
  faPlug,
  faPlus,
  faQuestion,
  faQuestionCircle,
  faReceipt,
  faRedo,
  faRotate,
  faRotateRight,
  faSearch,
  faServer,
  faShield,
  faShieldAlt,
  faShieldHalved,
  faSignal,
  faSignOutAlt,
  faSliders,
  faSpinner,
  faStar,
  faSync,
  faTable,
  faTableCellsLarge,
  faTag,
  faTerminal,
  faTimes,
  faTrashCan,
  faTriangleExclamation,
  faUpload,
  faUserCircle,
  faUsers,
  faVideo,
  faWallet,
  faWandMagicSparkles,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { faBell as farBell, faCalendar as farCalendar, faCircle as farCircle, faEye as farEye, faEyeSlash as farEyeSlash, faStar as farStar, faTimesCircle as farTimesCircle } from '@fortawesome/free-regular-svg-icons';
import { faDocker, faGithub, faGitlab, faNodeJs, faPython, faWordpress } from '@fortawesome/free-brands-svg-icons';

type FaPrefix = 'fas' | 'far' | 'fab';

export type FaIconProps = {
  /**
   * Accepts:
   * - "fa-video"
   * - "fas fa-video"
   * - "far fa-eye"
   * - "fas fa-spinner fa-spin"
   */
  icon: string | IconDefinition;
  className?: string;
  style?: FontAwesomeIconProps['style'];
  title?: string;
  ariaLabel?: string;
  spin?: boolean;
  pulse?: boolean;
  fixedWidth?: boolean;
};

const SOLID: Record<string, IconDefinition> = {
  // navigation / general
  'arrow-left': faArrowLeft,
  'arrows-left-right': faArrowsLeftRight,
  'arrows-rotate': faArrowsRotate,
  'arrow-down': faArrowDown,
  'arrow-right-arrow-left': faArrowRightArrowLeft,
  'arrow-trend-down': faArrowTrendDown,
  'arrow-trend-up': faArrowTrendUp,
  'arrow-up': faArrowUp,
  ban: faBan,
  bars: faBars,
  bell: fasBell,
  'bell-slash': faBellSlash,
  bolt: faBolt,
  book: faBook,
  'broadcast-tower': faBroadcastTower,
  broom: faBroom,
  calculator: faCalculator,
  'chart-line': faChartLine,
  'chart-pie': faChartPie,
  'chart-simple': faChartSimple,
  check: faCheck,
  'check-circle': faCheckCircle,
  'chevron-down': faChevronDown,
  'chevron-right': faChevronRight,
  'chevron-up': faChevronUp,
  'circle-check': faCircleCheck,
  'circle-exclamation': faCircleExclamation,
  'circle-info': faCircleInfo,
  'circle-question': faCircleQuestion,
  'clock-rotate-left': faClockRotateLeft,
  clone: faClone,
  'cloud-arrow-up': faCloudArrowUp,
  code: faCode,
  'code-branch': faCodeBranch,
  cog: faCog,
  copy: faCopy,
  'credit-card': faCreditCard,
  cube: faCube,
  database: faDatabase,
  'dollar-sign': faDollarSign,
  download: faDownload,
  ellipsis: faEllipsis,
  'ellipsis-vertical': faEllipsisVertical,
  eraser: faEraser,
  'exclamation-circle': faExclamationCircle,
  'exclamation-triangle': faExclamationTriangle,
  expand: faExpand,
  'file-audio': faFileAudio,
  'file-image': faFileImage,
  'file-pdf': faFilePdf,
  'file-video': faFileVideo,
  'file-zipper': faFileZipper,
  'fire-flame-curved': faFireFlameCurved,
  file: faFile,
  'file-code': faFileCode,
  'file-lines': faFileLines,
  film: faFilm,
  flag: faFlag,
  folder: faFolder,
  'folder-plus': faFolderPlus,
  forward: faForward,
  'gauge-high': faGaugeHigh,
  gear: faGear,
  ghost: faGhost,
  gift: faGift,
  globe: faGlobe,
  grip: faGrip,
  'graduation-cap': faGraduationCap,
  handshake: faHandshake,
  'hard-drive': faHardDrive,
  hand: faHand,
  headset: faHeadset,
  house: faHouse,
  home: faHouse,
  image: faImage,
  'info-circle': faInfoCircle,
  key: faKey,
  'life-ring': faLifeRing,
  link: faLink,
  list: faList,
  'location-dot': faLocationDot,
  lock: faLock,
  'map-pin': faMapPin,
  memory: faMemory,
  microchip: faMicrochip,
  minus: faMinus,
  palette: faPalette,
  play: faPlay,
  'play-circle': faPlayCircle,
  plug: faPlug,
  plus: faPlus,
  question: faQuestion,
  'question-circle': faQuestionCircle,
  receipt: faReceipt,
  redo: faRedo,
  rotate: faRotate,
  'rotate-right': faRotateRight,
  search: faSearch,
  server: faServer,
  shield: faShield,
  'shield-check': faShield,
  'shield-alt': faShieldAlt,
  'shield-halved': faShieldHalved,
  signal: faSignal,
  'sign-out-alt': faSignOutAlt,
  sliders: faSliders,
  sparkles: faWandMagicSparkles,
  spinner: faSpinner,
  star: faStar,
  sync: faSync,
  table: faTable,
  'table-cells-large': faTableCellsLarge,
  tag: faTag,
  terminal: faTerminal,
  times: faTimes,
  'trash-can': faTrashCan,
  'triangle-exclamation': faTriangleExclamation,
  upload: faUpload,
  'user-circle': faUserCircle,
  users: faUsers,
  video: faVideo,
  wallet: faWallet,
  xmark: faXmark,
};

const REGULAR: Record<string, IconDefinition> = {
  bell: farBell,
  calendar: farCalendar,
  circle: farCircle,
  eye: farEye,
  'eye-slash': farEyeSlash,
  star: farStar,
  'times-circle': farTimesCircle,
};

const BRANDS: Record<string, IconDefinition> = {
  docker: faDocker,
  github: faGithub,
  gitlab: faGitlab,
  'node-js': faNodeJs,
  python: faPython,
  wordpress: faWordpress,
};

function parseIconString(raw: string): {
  prefix?: FaPrefix;
  name?: string;
  spin?: boolean;
  pulse?: boolean;
} {
  const tokens = raw.trim().split(/\s+/).filter(Boolean);

  let prefix: FaPrefix | undefined;
  let name: string | undefined;
  let spin = false;
  let pulse = false;

  for (const t of tokens) {
    if (t === 'fas' || t === 'far' || t === 'fab') prefix = t;
    if (t === 'fa-spin') spin = true;
    if (t === 'fa-pulse') pulse = true;
    if (t.startsWith('fa-')) name = t.slice(3);
  }

  return { prefix, name, spin, pulse };
}

function resolveIcon(icon: string | IconDefinition): {
  icon?: IconDefinition;
  spin?: boolean;
  pulse?: boolean;
} {
  if (typeof icon !== 'string') return { icon };

  const { prefix, name, spin, pulse } = parseIconString(icon);
  if (!name) return { icon: undefined, spin, pulse };

  if (prefix === 'far') {
    return { icon: REGULAR[name] ?? SOLID[name], spin, pulse };
  }

  if (prefix === 'fab') {
    return { icon: BRANDS[name], spin, pulse };
  }

  return { icon: SOLID[name] ?? REGULAR[name], spin, pulse };
}

export default function FaIcon({
  icon,
  className,
  style,
  title,
  ariaLabel,
  spin,
  pulse,
  fixedWidth,
}: FaIconProps) {
  const resolved = resolveIcon(icon);
  const finalIcon = resolved.icon;

  if (!finalIcon) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('[FaIcon] Unknown icon:', icon);
    }
    return null;
  }

  return (
    <FontAwesomeIcon
      icon={finalIcon}
      className={className}
      style={style}
      title={title}
      aria-label={ariaLabel}
      spin={spin ?? resolved.spin}
      pulse={pulse ?? resolved.pulse}
      fixedWidth={fixedWidth}
    />
  );
}





