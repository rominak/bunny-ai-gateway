'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FaIcon from '@/app/components/FaIcon';
import Button from '@/app/components/shared/Button';
import { mockGateways, mockGatewaysArray } from '../gatewayData';
import OverviewSection from './OverviewSection';
import UsageSection from './UsageSection';
import KeysSection from './KeysSection';
import ModelsSection from './ModelsSection';

type ActiveSection = 'overview' | 'usage' | 'keys' | 'models';
type KeyStep = 'idle' | 'form' | 'reveal';

export default function GatewayDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [activeSection, setActiveSection] = useState<ActiveSection>('overview');
  const [keyStep, setKeyStep] = useState<KeyStep>('idle');
  const [selectorOpen, setSelectorOpen] = useState(false);

  const gateway = mockGateways[id];

  if (!gateway) {
    return (
      <div className="flex flex-col items-center justify-center py-[80px]">
        <FaIcon icon="fas fa-circle-exclamation" className="text-[32px] text-[#9ba7b2] mb-[12px]" ariaLabel="Not found" />
        <p className="text-[16px] text-[#687a8b] mb-[16px]">Gateway not found</p>
        <Button variant="primary" onClick={() => router.push('/ai-gateway')}>Back to Gateways</Button>
      </div>
    );
  }

  const menuItems = [
    { id: 'overview' as ActiveSection, label: 'General', icon: 'fas fa-gear' },
    { id: 'usage' as ActiveSection, label: 'Usage', icon: 'fas fa-chart-line' },
    { id: 'keys' as ActiveSection, label: 'API Keys', icon: 'fas fa-key' },
    { id: 'models' as ActiveSection, label: 'Models', icon: 'fas fa-cube' },
  ];

  const budgetPct = gateway.budget > 0 ? Math.round((gateway.spend / gateway.budget) * 100) : 0;

  return (
    <div className="flex -mx-[30px] -mt-[20px]">
      {/* Secondary sidebar */}
      <div className="w-[220px] min-h-screen bg-[#f3f4f5] border-r border-[#e6e9ec] flex-shrink-0">
        <div className="pt-[12px] px-[12px]">
          {/* Gateway selector */}
          <div className="mb-[16px] relative">
            <button
              onClick={() => setSelectorOpen(!selectorOpen)}
              className="w-full bg-white border border-[#e6e9ec] rounded-[8px] h-[44px] flex items-center px-[11px] justify-between hover:border-[#c4cdd5] transition-colors"
            >
              <div className="flex items-center gap-[8px] min-w-0">
                <FaIcon icon="fas fa-server" className="text-[13px] text-[#1870c6] shrink-0" ariaLabel="Gateway" />
                <span className="text-[14px] font-semibold text-[#1870c6] tracking-[-0.14px] truncate">{gateway.name}</span>
              </div>
              <div className="w-[16px] h-[16px] bg-[#eef4fe] rounded-[3px] flex items-center justify-center shrink-0">
                <FaIcon icon={selectorOpen ? 'fas fa-chevron-up' : 'fas fa-chevron-down'} className="text-[8px] text-[#1870c6]" ariaLabel="Switch gateway" />
              </div>
            </button>
            {selectorOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSelectorOpen(false)} />
                <div className="absolute left-0 right-0 top-[48px] z-20 bg-white border border-[#e6e9ec] rounded-[8px] card-shadow py-[4px] overflow-hidden">
                  {mockGatewaysArray.map((gw) => (
                    <button
                      key={gw.id}
                      onClick={() => {
                        setSelectorOpen(false);
                        if (gw.id !== id) router.push(`/ai-gateway/${gw.id}`);
                      }}
                      className={`w-full flex items-center gap-[8px] px-[11px] py-[10px] text-left transition-colors ${
                        gw.id === id
                          ? 'bg-[#eef4fe]'
                          : 'hover:bg-[#f8f9fa]'
                      }`}
                    >
                      <FaIcon icon="fas fa-server" className={`text-[12px] shrink-0 ${gw.id === id ? 'text-[#1870c6]' : 'text-[#9ba7b2]'}`} ariaLabel="" />
                      <div className="min-w-0 flex-1">
                        <p className={`text-[13px] font-medium truncate ${gw.id === id ? 'text-[#1870c6]' : 'text-[#243342]'}`}>{gw.name}</p>
                        <p className="text-[11px] text-[#9ba7b2] truncate">{gw.endpoint}</p>
                      </div>
                      {gw.id === id && (
                        <FaIcon icon="fas fa-check" className="text-[11px] text-[#1870c6] shrink-0" ariaLabel="Current" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Nav */}
          <div className="mb-[20px]">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full px-[12px] py-[10px] rounded-[8px] flex items-center gap-[10px] mb-[4px] transition-all ${
                  activeSection === item.id
                    ? 'bg-white text-[#243342] card-shadow'
                    : 'bg-transparent text-[#687a8b] hover:bg-white hover:text-[#243342]'
                }`}
              >
                <FaIcon
                  icon={item.icon}
                  className={`text-[14px] ${activeSection === item.id ? 'text-[#1870c6]' : 'text-[#687a8b]'}`}
                  ariaLabel={item.label}
                />
                <span className="text-[14px] font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Usage stats card */}
          <div className="bg-white rounded-[12px] card-shadow p-[16px]">
            <div className="flex items-center justify-between mb-[12px]">
              <h3 className="text-[13px] font-semibold text-[#243342]">Usage Stats</h3>
            </div>
            <div className="space-y-[12px]">
              <div className="flex justify-between">
                <div>
                  <p className="text-[11px] text-[#9ba7b2] mb-[2px]">Requests (24h)</p>
                  <p className="text-[14px] font-semibold text-[#243342]">
                    {gateway.requests24h >= 1000 ? `${(gateway.requests24h / 1000).toFixed(1)}K` : gateway.requests24h}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-[#9ba7b2] mb-[2px]">Cache Hit Rate</p>
                  <p className="text-[14px] font-semibold text-[#1870c6]">{gateway.cacheHitRate}%</p>
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-[11px] text-[#9ba7b2] mb-[2px]">Active Keys</p>
                  <p className="text-[14px] font-semibold text-[#243342]">{gateway.activeKeys}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-[#9ba7b2] mb-[2px]">Failovers</p>
                  <p className="text-[14px] font-semibold text-[#243342]">{gateway.failoverEvents}</p>
                </div>
              </div>
            </div>
            <div className="border-t border-[#e6e9ec] mt-[12px] pt-[12px]">
              <div className="flex justify-between items-baseline mb-[4px]">
                <p className="text-[11px] text-[#9ba7b2]">Spend / Budget</p>
                <p className="text-[11px] text-[#687a8b]">{budgetPct}%</p>
              </div>
              <div className="w-full h-[4px] bg-[#f3f4f5] rounded-full overflow-hidden mb-[4px]">
                <div className="h-full bg-[#1870c6] rounded-full" style={{ width: `${Math.min(budgetPct, 100)}%` }} />
              </div>
              <p className="text-[14px] font-bold text-[#243342]">${gateway.spend.toLocaleString()} <span className="text-[12px] font-normal text-[#687a8b]">/ ${gateway.budget.toLocaleString()}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        {/* Top bar */}
        <div className="h-[56px] border-b border-[#e6e9ec] px-[24px] flex items-center justify-between">
          <span className="text-[16px] font-semibold text-[#243342]">{menuItems.find(m => m.id === activeSection)?.label}</span>
          <div className="flex items-center gap-[8px]">
            <span className="text-[12px] text-[#687a8b] font-mono">{gateway.endpoint}</span>
            <button className="text-[12px] text-[#1870c6] hover:underline flex items-center gap-[4px]">
              <FaIcon icon="fas fa-copy" className="text-[10px]" ariaLabel="Copy" />
            </button>
            {activeSection === 'keys' && keyStep === 'idle' && (
              <Button variant="cta" size="sm" icon="fas fa-plus" onClick={() => setKeyStep('form')}>
                Create API Key
              </Button>
            )}
          </div>
        </div>

        <div className="p-[24px]">
          {activeSection === 'overview' && <OverviewSection gateway={gateway} onTabChange={(tab: string) => setActiveSection(tab as ActiveSection)} />}
          {activeSection === 'usage' && <UsageSection />}
          {activeSection === 'keys' && <KeysSection step={keyStep} onStepChange={setKeyStep} />}
          {activeSection === 'models' && <ModelsSection />}
        </div>
      </div>
    </div>
  );
}
