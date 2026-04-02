'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import FaIcon from './FaIcon';
import Button from './shared/Button';

type ExpandableSection = 'overview' | 'delivery' | 'edge-platform' | 'ai' | 'monitoring' | null;

export default function Sidebar() {
  const pathname = usePathname();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const notificationsRef = useRef<HTMLButtonElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const unreadCount = 3;

  // Close profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine which section should be expanded based on current route
  const getDefaultSection = (): ExpandableSection => {
    if (pathname === '/') return 'overview';
    if (['/cdn', '/storage', '/stream', '/dns', '/purge'].some(p => pathname.startsWith(p))) return 'delivery';
    if (['/containers', '/scripting', '/database'].some(p => pathname.startsWith(p))) return 'edge-platform';
    if (['/ai-gateway', '/ai-gateway-v2'].some(p => pathname.startsWith(p))) return 'ai';
    if (['/statistics', '/logs', '/origin-errors'].some(p => pathname.startsWith(p))) return 'monitoring';
    return 'delivery';
  };

  const [expandedSection, setExpandedSection] = useState<ExpandableSection>(getDefaultSection);

  const toggleSection = (section: ExpandableSection) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // Delivery items - all icons use consistent gray color
  const deliveryItems = [
    { name: 'CDN', icon: 'fas fa-globe', href: '/cdn' },
    { name: 'Storage', icon: 'fas fa-hard-drive', href: '/storage' },
    { name: 'Stream', icon: 'fas fa-play', href: '/stream' },
    { name: 'DNS', icon: 'fas fa-server', href: '/dns' },
    { name: 'Purge', icon: 'fas fa-trash-can', href: '/purge' },
  ];

  // Edge Platform items
  const edgePlatformItems = [
    { name: 'Magic Containers', icon: 'fas fa-cube', href: '/containers' },
    { name: 'App Templates', icon: 'fas fa-grip', href: '/containers/templates' },
    { name: 'Scripting', icon: 'fas fa-code', href: '/scripting' },
    { name: 'Database', icon: 'fas fa-database', href: '/database' },
  ];

  // AI items
  const aiItems = [
    { name: 'AI Gateway', icon: 'fas fa-server', href: '/ai-gateway' },
    { name: 'AI Gateway v2', icon: 'fas fa-bolt', href: '/ai-gateway-v2' },
  ];

  // Monitoring items
  const monitoringItems = [
    { name: 'Statistics', icon: 'fas fa-chart-line', href: '/statistics' },
    { name: 'Logs', icon: 'fas fa-bars', href: '/logs' },
    { name: 'Origin errors', icon: 'fas fa-circle-exclamation', href: '/origin-errors' },
  ];

  return (
    <aside className="w-[190px] bg-[#04223e] flex flex-col h-screen fixed top-0 left-0 z-10">
      {/* Header */}
      <div className="h-[60px] flex items-center px-[11px] gap-[20px]">
        {/* Bunny Logo */}
        <Link href="/" className="w-[31.2px] h-[31.2px] flex items-center justify-center">
          <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5 3C14.2 3 13.1 3.8 12.6 4.9L10.5 9.5C10.2 10.2 10.5 11 11.2 11.3C11.9 11.6 12.7 11.3 13 10.6L15 6.5L17 10.6C17.3 11.3 18.1 11.6 18.8 11.3C19.5 11 19.8 10.2 19.5 9.5L17.4 4.9C16.9 3.8 15.8 3 14.5 3" fill="#FF6A13"/>
            <ellipse cx="15.5" cy="19" rx="10" ry="8" fill="#FF6A13"/>
            <circle cx="12" cy="17" r="1.5" fill="white"/>
            <circle cx="19" cy="17" r="1.5" fill="white"/>
            <ellipse cx="15.5" cy="20" rx="2" ry="1" fill="#FFB088"/>
          </svg>
        </Link>

        {/* Right side icons */}
        <div className="ml-auto flex items-center gap-5">
          <div className="relative">
            <button
              ref={notificationsRef}
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative w-6 h-6 flex items-center justify-center text-[#8899a8] hover:text-white cursor-pointer"
            >
              <FaIcon icon="far fa-bell" className="text-[14px]" ariaLabel="Notifications" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-[#ff7854] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-6 h-6 rounded-full bg-[#FF7854] flex items-center justify-center text-white text-xs font-bold">
                R
              </div>
              <FaIcon icon="fas fa-chevron-down" className="text-[8px] text-[#8899a8]" ariaLabel="User menu" />
            </button>

            {/* Profile dropdown menu */}
            {profileMenuOpen && (
              <div className="absolute left-0 top-[35px] w-[240px] bg-white rounded-[10px] border border-[#e6e9ec] shadow-lg overflow-hidden z-50">
                {/* User info section */}
                <div className="px-[16px] py-[14px] border-b border-[#e6e9ec]">
                  <div className="flex items-center gap-[12px]">
                    <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-br from-[#1870c6] to-[#0d5a9e] flex items-center justify-center text-white font-semibold text-[15px]">
                      RK
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-semibold text-[#243342]">Romina Kav</div>
                      <div className="text-[12px] text-[#687a8b] truncate">rominakavcic@gmail.com</div>
                    </div>
                  </div>
                </div>

                {/* Billing section */}
                <div className="px-[16px] py-[12px] border-b border-[#e6e9ec] bg-[#fafbfc]">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#687a8b]">Billing</span>
                    <div className="px-[8px] py-[4px] bg-[#16a34a] rounded-[6px]">
                      <span className="text-[13px] font-semibold text-white">$4,529.75</span>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-[8px]">
                  <Link
                    href="/account/settings"
                    onClick={() => setProfileMenuOpen(false)}
                    className="w-full px-[16px] py-[10px] flex items-center gap-[12px] text-left hover:bg-[#f3f4f5] transition-colors"
                  >
                    <FaIcon icon="fas fa-user-circle" className="text-[14px] w-[16px] text-[#687a8b]" fixedWidth ariaLabel="Account" />
                    <span className="text-[13px] text-[#243342]">Account settings</span>
                  </Link>
                  <Link
                    href="/account/gdpr"
                    onClick={() => setProfileMenuOpen(false)}
                    className="w-full px-[16px] py-[10px] flex items-center gap-[12px] text-left hover:bg-[#f3f4f5] transition-colors"
                  >
                    <FaIcon icon="fas fa-shield-alt" className="text-[14px] w-[16px] text-[#687a8b]" fixedWidth ariaLabel="GDPR" />
                    <span className="text-[13px] text-[#243342]">GDPR</span>
                  </Link>
                  <Link
                    href="/account/affiliate"
                    onClick={() => setProfileMenuOpen(false)}
                    className="w-full px-[16px] py-[10px] flex items-center gap-[12px] text-left hover:bg-[#f3f4f5] transition-colors"
                  >
                    <FaIcon icon="fas fa-handshake" className="text-[14px] w-[16px] text-[#687a8b]" fixedWidth ariaLabel="Affiliate" />
                    <span className="text-[13px] text-[#243342]">Affiliate program</span>
                  </Link>
                  <Link
                    href="/account/settings#password"
                    onClick={() => setProfileMenuOpen(false)}
                    className="w-full px-[16px] py-[10px] flex items-center gap-[12px] text-left hover:bg-[#f3f4f5] transition-colors"
                  >
                    <FaIcon icon="fas fa-key" className="text-[14px] w-[16px] text-[#687a8b]" fixedWidth ariaLabel="Password" />
                    <span className="text-[13px] text-[#243342]">Change password</span>
                  </Link>
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      alert('Theme switching not implemented');
                    }}
                    className="w-full px-[16px] py-[10px] flex items-center gap-[12px] text-left hover:bg-[#f3f4f5] transition-colors"
                  >
                    <FaIcon icon="fas fa-palette" className="text-[14px] w-[16px] text-[#687a8b]" fixedWidth ariaLabel="Theme" />
                    <span className="text-[13px] text-[#243342]">Switch theme</span>
                  </button>
                </div>

                {/* Partner Portal section */}
                <div className="border-t border-[#e6e9ec] py-[8px]">
                  <Link
                    href="/partner"
                    onClick={() => setProfileMenuOpen(false)}
                    className="w-full px-[16px] py-[10px] flex items-center gap-[12px] text-left hover:bg-[#f3f4f5] transition-colors"
                  >
                    <FaIcon icon="fas fa-handshake" className="text-[14px] w-[16px] text-[#1870c6]" fixedWidth ariaLabel="Partner Portal" />
                    <span className="text-[13px] text-[#1870c6] font-medium">Partner Portal</span>
                  </Link>
                </div>

                {/* Logout section */}
                <div className="border-t border-[#e6e9ec] py-[8px]">
                  <button className="w-full px-[16px] py-[10px] flex items-center gap-[12px] text-left hover:bg-[#fef2f2] transition-colors">
                    <FaIcon icon="fas fa-sign-out-alt" className="text-[14px] w-[16px] text-[#dc2626]" fixedWidth ariaLabel="Logout" />
                    <span className="text-[13px] text-[#dc2626] font-medium">Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-[10px] py-[10px]">
        <div className="bg-[#0a2d4d] rounded-[8px] px-[12px] py-[10px] flex items-center gap-[8px] h-[40px]">
          <FaIcon icon="fas fa-search" className="text-[#5a6f82] text-[14px]" ariaLabel="Search" />
          <label htmlFor="sidebar-search" className="sr-only">Search</label>
          <input
            id="sidebar-search"
            type="text"
            placeholder="Search"
            className="bg-transparent text-white placeholder-[#5a6f82] text-[14px] outline-none w-full"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-[10px] py-0 overflow-y-auto">
        {/* Overview Section */}
        <div className="mb-[2px]">
          <button
            onClick={() => toggleSection('overview')}
            className="flex h-[40px] items-center justify-between px-[10px] py-0 w-full rounded-[6px] hover:bg-[#0a2d4d] transition-colors"
          >
            <span className="text-[14px] font-semibold text-white">Overview</span>
            <FaIcon
              icon={`fas fa-chevron-${expandedSection === 'overview' ? 'up' : 'down'}`}
              className="text-[10px] text-[#5a6f82]"
              ariaLabel="Toggle overview section"
            />
          </button>
        </div>

        {/* Overview Sub-items */}
        {expandedSection === 'overview' && (
          <div className="pb-[8px]">
            <Link
              href="/"
              className={`flex h-[36px] items-center gap-[8px] px-[10px] rounded-[6px] transition-colors ${
                pathname === '/'
                  ? 'text-white'
                  : 'text-[#8899a8] hover:text-white hover:bg-[#0a2d4d]'
              }`}
            >
              <FaIcon
                icon="fas fa-gauge-high"
                className="text-[14px] w-[18px] text-[#64748b]"
                ariaLabel="Dashboard"
              />
              <span className="text-[14px] font-medium">Dashboard</span>
            </Link>
          </div>
        )}

        {/* Delivery Section */}
        <div className="mb-[2px]">
          <button
            onClick={() => toggleSection('delivery')}
            className="flex h-[40px] items-center justify-between px-[10px] py-0 w-full rounded-[6px] hover:bg-[#0a2d4d] transition-colors"
          >
            <span className="text-[14px] font-semibold text-white">Delivery</span>
            <FaIcon
              icon={`fas fa-chevron-${expandedSection === 'delivery' ? 'up' : 'down'}`}
              className="text-[10px] text-[#5a6f82]"
              ariaLabel="Toggle delivery section"
            />
          </button>
        </div>

        {/* Delivery Sub-items */}
        {expandedSection === 'delivery' && (
          <div className="pb-[8px]">
            {deliveryItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex h-[36px] items-center gap-[8px] px-[10px] rounded-[6px] transition-colors ${
                    active
                      ? 'text-white'
                      : 'text-[#8899a8] hover:text-white hover:bg-[#0a2d4d]'
                  }`}
                >
                  <FaIcon
                    icon={item.icon}
                    className="text-[14px] w-[18px] text-[#8899a8]"
                    ariaLabel={item.name}
                  />
                  <span className="text-[14px] font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Edge Platform Section */}
        <div className="mb-[2px]">
          <button
            onClick={() => toggleSection('edge-platform')}
            className="flex h-[40px] items-center justify-between px-[10px] py-0 w-full rounded-[6px] hover:bg-[#0a2d4d] transition-colors"
          >
            <span className="text-[14px] font-semibold text-white">Edge Platform</span>
            <FaIcon
              icon={`fas fa-chevron-${expandedSection === 'edge-platform' ? 'up' : 'down'}`}
              className="text-[10px] text-[#5a6f82]"
              ariaLabel="Toggle edge platform section"
            />
          </button>
        </div>

        {/* Edge Platform Sub-items */}
        {expandedSection === 'edge-platform' && (
          <div className="pb-[8px]">
            {edgePlatformItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex h-[36px] items-center gap-[8px] px-[10px] rounded-[6px] transition-colors ${
                    active
                      ? 'text-white'
                      : 'text-[#8899a8] hover:text-white hover:bg-[#0a2d4d]'
                  }`}
                >
                  <FaIcon
                    icon={item.icon}
                    className="text-[14px] w-[18px] text-[#8899a8]"
                    ariaLabel={item.name}
                  />
                  <span className="text-[14px] font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* AI Section */}
        <div className="mb-[2px]">
          <button
            onClick={() => toggleSection('ai')}
            className="flex h-[40px] items-center justify-between px-[10px] py-0 w-full rounded-[6px] hover:bg-[#0a2d4d] transition-colors"
          >
            <span className="text-[14px] font-semibold text-white">AI</span>
            <FaIcon
              icon={`fas fa-chevron-${expandedSection === 'ai' ? 'up' : 'down'}`}
              className="text-[10px] text-[#5a6f82]"
              ariaLabel="Toggle AI section"
            />
          </button>
        </div>

        {/* AI Sub-items */}
        {expandedSection === 'ai' && (
          <div className="pb-[8px]">
            {aiItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex h-[36px] items-center gap-[8px] px-[10px] rounded-[6px] transition-colors ${
                    active
                      ? 'text-white'
                      : 'text-[#8899a8] hover:text-white hover:bg-[#0a2d4d]'
                  }`}
                >
                  <FaIcon
                    icon={item.icon}
                    className="text-[14px] w-[18px] text-[#8899a8]"
                    ariaLabel={item.name}
                  />
                  <span className="text-[14px] font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Monitoring Section */}
        <div className="mb-[2px]">
          <button
            onClick={() => toggleSection('monitoring')}
            className="flex h-[40px] items-center justify-between px-[10px] py-0 w-full rounded-[6px] hover:bg-[#0a2d4d] transition-colors"
          >
            <span className="text-[14px] font-semibold text-white">Monitoring</span>
            <FaIcon
              icon={`fas fa-chevron-${expandedSection === 'monitoring' ? 'up' : 'down'}`}
              className="text-[10px] text-[#5a6f82]"
              ariaLabel="Toggle monitoring section"
            />
          </button>
        </div>

        {/* Monitoring Sub-items */}
        {expandedSection === 'monitoring' && (
          <div className="pb-[8px]">
            {monitoringItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex h-[36px] items-center gap-[8px] px-[10px] rounded-[6px] transition-colors ${
                    active
                      ? 'text-white'
                      : 'text-[#8899a8] hover:text-white hover:bg-[#0a2d4d]'
                  }`}
                >
                  <FaIcon
                    icon={item.icon}
                    className="text-[14px] w-[18px] text-[#8899a8]"
                    ariaLabel={item.name}
                  />
                  <span className="text-[14px] font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Add Button */}
        <div className="py-[16px]">
          <Button variant="sidebar" size="lg" icon="fas fa-plus" fullWidth className="rounded-[8px]">
            Add
          </Button>
        </div>
      </nav>

      {/* Footer */}
      <div className="mt-auto">
        {/* Balance Section */}
        <div className="px-[10px] py-[12px] border-t border-[#1a3a54]">
          <div className="flex items-center gap-[8px] px-[6px]">
            <FaIcon icon="fas fa-wallet" className="text-[14px] text-[#5a6f82]" ariaLabel="Balance" />
            <span className="text-[14px] font-medium text-[#8899a8]">Balance</span>
            <span className="ml-auto text-[14px] font-semibold text-white">$4,536.12</span>
          </div>
          {/* Balance bar */}
          <div className="mt-[8px] mx-[6px]">
            <div className="w-full h-[4px] bg-[#1a3a54] rounded-full overflow-hidden">
              <div className="bg-[#22c55e] h-full w-[75%]"></div>
            </div>
          </div>
        </div>

        {/* Help & Support Section */}
        <div className="px-[10px] py-[8px] border-t border-[#1a3a54]">
          <Link
            href="#"
            className="flex h-[40px] items-center gap-[8px] px-[6px] rounded-[6px] text-[#8899a8] hover:text-white transition-colors"
          >
            <FaIcon icon="fas fa-circle-question" className="text-[16px] text-[#5a6f82]" ariaLabel="Help" />
            <span className="text-[14px] font-medium">Help & Support</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
