'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FaIcon from '@/app/components/FaIcon';
import PageHeader from '@/app/components/shared/PageHeader';
import { HealthIndicator } from '@/app/components/shared/HealthIndicator';
import { mockGatewaysArray } from './gatewayData';

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export default function AIGatewayListPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filtered = mockGatewaysArray.filter(
    (gw) => gw.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalRequests = mockGatewaysArray.reduce((s, g) => s + g.requests24h, 0);
  const totalSpend = mockGatewaysArray.reduce((s, g) => s + g.spend, 0);

  return (
    <>
      <PageHeader
        title="AI Gateway"
        tabs={[
          { id: 'gateways', label: 'Gateways', count: mockGatewaysArray.length },
        ]}
        activeTab="gateways"
        onTabChange={() => {}}
        searchPlaceholder="Search gateways..."
        searchValue={search}
        onSearchChange={setSearch}
        addButtonLabel="Create gateway"
        addButtonHref="/ai-gateway/add"
      />

      {/* Stats row */}
      <div className="flex items-center gap-[12px] mb-[20px]">
        {[
          { label: 'Gateways', value: String(mockGatewaysArray.length), icon: 'fas fa-server' },
          { label: 'Requests (24h)', value: formatNumber(totalRequests), icon: 'fas fa-arrow-right-arrow-left' },
          { label: 'Total Spend', value: `$${totalSpend.toLocaleString()}`, icon: 'fas fa-wallet' },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-[10px] px-[16px] py-[12px] bg-white rounded-[10px] card-shadow">
            <div className="w-[36px] h-[36px] rounded-[8px] bg-[#eef4fe] flex items-center justify-center">
              <FaIcon icon={s.icon} className="text-[16px] text-[#1870c6]" ariaLabel={s.label} />
            </div>
            <div>
              <p className="text-[11px] text-[#9ba7b2] uppercase tracking-wide">{s.label}</p>
              <p className="text-[18px] font-semibold text-[#243342]">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Gateways table */}
      <div className="bg-white rounded-[12px] card-shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left px-[20px] py-[12px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Name</th>
              <th className="text-left px-[20px] py-[12px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Endpoint</th>
              <th className="text-right px-[20px] py-[12px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Requests (24h)</th>
              <th className="text-right px-[20px] py-[12px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Cache Hit</th>
              <th className="text-right px-[20px] py-[12px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Spend</th>
              <th className="text-right px-[20px] py-[12px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Keys</th>
              <th className="w-[40px]"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((gw) => (
              <tr
                key={gw.id}
                onClick={() => router.push(`/ai-gateway/${gw.id}`)}
                className="border-t border-[#f3f4f5] hover:bg-[#fafbfc] cursor-pointer transition-colors"
              >
                <td className="px-[20px] py-[14px]">
                  <div className="flex items-center gap-[10px]">
                    <HealthIndicator
                      status={gw.status === 'healthy' ? 'healthy' : gw.status === 'degraded' ? 'warning' : 'error'}
                    />
                    <span className="text-[14px] font-medium text-[#1870c6]">{gw.name}</span>
                  </div>
                </td>
                <td className="px-[20px] py-[14px] text-[13px] text-[#687a8b] font-mono">{gw.endpoint}</td>
                <td className="px-[20px] py-[14px] text-[13px] text-[#243342] text-right">{formatNumber(gw.requests24h)}</td>
                <td className="px-[20px] py-[14px] text-right">
                  {gw.cacheHitRate > 0 ? (
                    <span className="text-[13px] font-medium text-[#16a34a]">{gw.cacheHitRate}%</span>
                  ) : (
                    <span className="text-[13px] text-[#9ba7b2]">&mdash;</span>
                  )}
                </td>
                <td className="px-[20px] py-[14px] text-[13px] font-medium text-[#243342] text-right">${gw.spend.toLocaleString()}</td>
                <td className="px-[20px] py-[14px] text-[13px] text-[#687a8b] text-right">{gw.activeKeys}</td>
                <td className="px-[20px] py-[14px] text-right">
                  <FaIcon icon="fas fa-ellipsis" className="text-[14px] text-[#9ba7b2]" ariaLabel="More" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
