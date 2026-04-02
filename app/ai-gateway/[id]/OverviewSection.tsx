'use client';

import Link from 'next/link';
import FaIcon from '@/app/components/FaIcon';
import Button from '@/app/components/shared/Button';
import { Gateway } from '../gatewayData';

const requestData = [
  { day: 'Mon', requests: 145000 },
  { day: 'Tue', requests: 189000 },
  { day: 'Wed', requests: 210000 },
  { day: 'Thu', requests: 178000 },
  { day: 'Fri', requests: 195000 },
  { day: 'Sat', requests: 142000 },
  { day: 'Sun', requests: 181000 },
];

const recentFailovers = [
  { time: '14:23', provider: 'OpenAI', fallback: 'Anthropic', model: 'gpt-4o', latency: '320ms' },
  { time: '09:11', provider: 'Google', fallback: 'OpenAI', model: 'gemini-2.0-flash', latency: '180ms' },
  { time: 'Yesterday', provider: 'OpenAI', fallback: 'Anthropic', model: 'gpt-4o-mini', latency: '450ms' },
];

const topModels = [
  { model: 'claude-sonnet-4.5', requests: '482K', pct: 38.9, cost: '$1,108' },
  { model: 'gpt-4o-mini',       requests: '312K', pct: 25.2, cost: '$624'   },
  { model: 'gemini-2.0-flash',  requests: '198K', pct: 16.0, cost: '$396'   },
  { model: 'claude-haiku-4.5',  requests: '156K', pct: 12.6, cost: '$312'   },
  { model: 'gpt-4o',            requests: '92K',  pct: 7.3,  cost: '$407'   },
];

// ── Stat cards ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon, accent = 'blue' }: {
  label: string; value: string; sub?: string; icon: string; accent?: 'blue' | 'green';
}) {
  const isGreen = accent === 'green';
  return (
    <div className={`rounded-[10px] card-shadow p-[16px] ${isGreen ? 'bg-[#f0fdf4] border border-[#bbf7d0]' : 'bg-white'}`}>
      <div className="flex items-center justify-between mb-[8px]">
        <div className={`w-[32px] h-[32px] rounded-[8px] flex items-center justify-center ${isGreen ? 'bg-[#16a34a]/10' : 'bg-[#eef4fe]'}`}>
          <FaIcon icon={icon} className={`text-[14px] ${isGreen ? 'text-[#16a34a]' : 'text-[#1870c6]'}`} ariaLabel={label} />
        </div>
        {sub && (
          <span className={`text-[12px] font-medium ${isGreen ? 'text-[#16a34a]' : sub.startsWith('+') ? 'text-[#16a34a]' : 'text-[#687a8b]'}`}>{sub}</span>
        )}
      </div>
      <p className="text-[11px] text-[#9ba7b2] uppercase tracking-wider mb-[2px]">{label}</p>
      <p className={`text-[20px] font-bold ${isGreen ? 'text-[#16a34a]' : 'text-[#243342]'}`}>{value}</p>
    </div>
  );
}

function BudgetCard({ gateway }: { gateway: Gateway }) {
  const pct = gateway.budget > 0 ? (gateway.spend / gateway.budget) * 100 : 0;
  const isHigh = pct > 80;
  return (
    <div className="bg-white rounded-[10px] card-shadow p-[16px]">
      <div className="flex items-center justify-between mb-[8px]">
        <div className="w-[32px] h-[32px] rounded-[8px] bg-[#eef4fe] flex items-center justify-center">
          <FaIcon icon="fas fa-wallet" className="text-[14px] text-[#1870c6]" ariaLabel="Spend" />
        </div>
        <span className={`text-[12px] font-medium ${isHigh ? 'text-[#dc2626]' : 'text-[#687a8b]'}`}>
          {Math.round(pct)}% used
        </span>
      </div>
      <p className="text-[11px] text-[#9ba7b2] uppercase tracking-wider mb-[2px]">Monthly spend</p>
      <p className="text-[20px] font-bold text-[#243342]">${gateway.spend.toLocaleString()}</p>
      <div className="mt-[8px]">
        <div className="w-full h-[4px] bg-[#f3f4f5] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${isHigh ? 'bg-[#dc2626]' : 'bg-[#1870c6]'}`}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
        <p className="text-[11px] text-[#9ba7b2] mt-[4px]">of ${gateway.budget.toLocaleString()} budget</p>
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ gateway, onGoToKeys }: { gateway: Gateway; onGoToKeys: () => void }) {
  const curlSnippet = `curl ${gateway.endpoint}/chat/completions \\
  -H "Authorization: Bearer $BUNNY_AI_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"openai/gpt-4o-mini","messages":[{"role":"user","content":"Hello"}]}'`;

  return (
    <div className="max-w-[680px] mx-auto py-[20px]">
      {/* Steps */}
      <div className="bg-white rounded-[12px] card-shadow p-[32px]">
        <div className="flex items-center gap-[12px] mb-[28px]">
          <div className="w-[44px] h-[44px] rounded-full bg-[#eef4fe] flex items-center justify-center flex-shrink-0">
            <FaIcon icon="fas fa-rocket" className="text-[20px] text-[#1870c6]" ariaLabel="Get started" />
          </div>
          <div>
            <h2 className="text-[18px] font-semibold text-[#243342]">Your gateway is ready</h2>
            <p className="text-[13px] text-[#687a8b]">Follow these steps to make your first request</p>
          </div>
        </div>

        <div className="space-y-[0px]">
          {/* Step 1 */}
          <div className="flex gap-[16px]">
            <div className="flex flex-col items-center">
              <div className="w-[28px] h-[28px] rounded-full bg-[#1870c6] flex items-center justify-center flex-shrink-0 text-white text-[12px] font-bold">1</div>
              <div className="w-[2px] flex-1 bg-[#e6e9ec] my-[8px]" />
            </div>
            <div className="pb-[24px] flex-1">
              <p className="text-[14px] font-semibold text-[#243342] mt-[4px] mb-[8px]">Create an API key</p>
              <p className="text-[13px] text-[#687a8b] mb-[10px]">API keys authenticate your requests. You can set an optional monthly budget per key.</p>
              <button
                onClick={onGoToKeys}
                className="inline-flex items-center gap-[6px] h-[32px] px-[12px] bg-gradient-to-br from-[#FFAF48] to-[#FF7854] text-white text-[12px] font-medium rounded-[6px] hover:opacity-90"
              >
                <FaIcon icon="fas fa-plus" className="text-[10px]" ariaLabel="" />
                Create API key
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-[16px]">
            <div className="flex flex-col items-center">
              <div className="w-[28px] h-[28px] rounded-full bg-[#e6e9ec] flex items-center justify-center flex-shrink-0 text-[#687a8b] text-[12px] font-bold">2</div>
              <div className="w-[2px] flex-1 bg-[#e6e9ec] my-[8px]" />
            </div>
            <div className="pb-[24px] flex-1">
              <p className="text-[14px] font-semibold text-[#243342] mt-[4px] mb-[8px]">Point your app at the gateway</p>
              <p className="text-[13px] text-[#687a8b] mb-[10px]">Replace your current LLM base URL with your gateway endpoint. No other code changes needed.</p>
              <div className="bg-[#fafbfc] border border-[#e6e9ec] rounded-[8px] px-[12px] py-[10px] font-mono text-[12px] text-[#243342]">
                {gateway.endpoint}
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-[16px]">
            <div className="flex flex-col items-center">
              <div className="w-[28px] h-[28px] rounded-full bg-[#e6e9ec] flex items-center justify-center flex-shrink-0 text-[#687a8b] text-[12px] font-bold">3</div>
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-[#243342] mt-[4px] mb-[8px]">Make your first request</p>
              <p className="text-[13px] text-[#687a8b] mb-[10px]">Use any OpenAI-compatible client. Your metrics will appear here immediately.</p>
              <div className="bg-[#04223e] rounded-[10px] overflow-hidden">
                <div className="flex items-center justify-between px-[14px] py-[10px] border-b border-[#1a3a54]">
                  <span className="text-[11px] text-[#8899a8] uppercase tracking-wider">Quick start</span>
                </div>
                <pre className="px-[14px] py-[12px] text-[11px] text-[#4ade80] font-mono whitespace-pre overflow-x-auto leading-[1.7]">{curlSnippet}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Models hint */}
      <p className="text-center text-[12px] text-[#9ba7b2] mt-[20px]">
        25 models available ·{' '}
        <Link href="#" className="text-[#1870c6] hover:underline">Browse models and pricing →</Link>
      </p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function OverviewSection({ gateway, onTabChange }: { gateway: Gateway; onTabChange?: (tab: string) => void }) {
  const isEmpty = gateway.requests24h === 0;

  const chartW = 700;
  const chartH = 150;
  const pad = { top: 10, right: 10, bottom: 24, left: 45 };
  const plotW = chartW - pad.left - pad.right;
  const plotH = chartH - pad.top - pad.bottom;
  const maxReq = Math.max(...requestData.map(d => d.requests));
  const yMax = Math.ceil(maxReq / 50000) * 50000;

  const bars = requestData.map((d, i) => {
    const barW = plotW / requestData.length * 0.6;
    const gap = plotW / requestData.length;
    const x = pad.left + i * gap + (gap - barW) / 2;
    const h = (d.requests / yMax) * plotH;
    const y = pad.top + plotH - h;
    return { ...d, x, y, w: barW, h };
  });

  return (
    <>
      {/* Endpoint bar */}
      <div className="bg-white rounded-[10px] card-shadow border border-[#e6e9ec] p-[16px] mb-[10px] flex items-center justify-between">
        <div className="flex items-center gap-[12px]">
          <div className="w-[36px] h-[36px] rounded-[8px] bg-[#eef4fe] flex items-center justify-center">
            <FaIcon icon="fas fa-plug" className="text-[14px] text-[#1870c6]" ariaLabel="Endpoint" />
          </div>
          <div>
            <p className="text-[11px] text-[#9ba7b2] uppercase tracking-wider">Endpoint</p>
            <p className="text-[14px] text-[#243342] font-mono">{gateway.endpoint}/chat/completions</p>
          </div>
        </div>
        <span className="inline-flex items-center h-[22px] px-[8px] rounded-[4px] text-[11px] font-medium bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]">
          <span className="w-[6px] h-[6px] rounded-full bg-[#16a34a] mr-[6px] animate-pulse" />
          Healthy
        </span>
      </div>


      {/* Empty state */}
      {isEmpty ? (
        <EmptyState gateway={gateway} onGoToKeys={() => onTabChange?.('keys')} />
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-[12px] mb-[20px]">
            <StatCard label="Requests (7d)" value="1.24M" sub="+18.3%" icon="fas fa-arrow-right-arrow-left" />
            <StatCard label="Cache hit rate" value={`${gateway.cacheHitRate}%`} sub="Saved $482" icon="fas fa-bolt" />
            <BudgetCard gateway={gateway} />
            <StatCard label="Requests protected" value={String(gateway.failoverEvents)} sub="0 dropped" icon="fas fa-shield" accent="green" />
          </div>

          {/* Chart + Info */}
          <div className="grid grid-cols-3 gap-[16px] mb-[20px]">
            <div className="col-span-2 bg-white rounded-[10px] card-shadow p-[20px]">
              <h3 className="text-[14px] font-bold text-[#243342] mb-[2px]">Requests (7 days)</h3>
              <p className="text-[12px] text-[#687a8b] mb-[12px]">Total request volume across all models</p>
              <svg width="100%" viewBox={`0 0 ${chartW} ${chartH}`} className="overflow-visible">
                {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
                  const y = pad.top + plotH - pct * plotH;
                  return (
                    <g key={pct}>
                      <line x1={pad.left} x2={chartW - pad.right} y1={y} y2={y} stroke="#f3f4f5" />
                      <text x={pad.left - 6} y={y + 4} textAnchor="end" className="text-[10px] fill-[#9ba7b2]">{Math.round(yMax * pct / 1000)}K</text>
                    </g>
                  );
                })}
                {bars.map((b) => (
                  <g key={b.day}>
                    <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={4} fill="#1870c6" opacity={0.85} />
                    <text x={b.x + b.w / 2} y={chartH - 6} textAnchor="middle" className="text-[10px] fill-[#9ba7b2]">{b.day}</text>
                  </g>
                ))}
              </svg>
            </div>

            <div className="bg-white rounded-[10px] card-shadow p-[20px]">
              <h3 className="text-[14px] font-bold text-[#243342] mb-[14px]">Quick info</h3>
              <div className="space-y-[14px]">
                <div>
                  <p className="text-[11px] text-[#9ba7b2] uppercase tracking-wider mb-[2px]">Active keys</p>
                  <p className="text-[14px] font-semibold text-[#243342]">{gateway.activeKeys}</p>
                </div>
                <div className="border-t border-[#f3f4f5] pt-[14px]">
                  <p className="text-[11px] text-[#9ba7b2] uppercase tracking-wider mb-[2px]">Top model</p>
                  <p className="text-[14px] font-semibold text-[#243342]">{gateway.topModel}</p>
                </div>
                <div className="border-t border-[#f3f4f5] pt-[14px]">
                  <p className="text-[11px] text-[#9ba7b2] uppercase tracking-wider mb-[2px]">Last request</p>
                  <p className="text-[14px] font-semibold text-[#243342]">{gateway.lastRequest}</p>
                </div>
                <div className="border-t border-[#f3f4f5] pt-[14px]">
                  <p className="text-[11px] text-[#9ba7b2] uppercase tracking-wider mb-[2px]">EU-routed requests</p>
                  <p className="text-[14px] font-semibold text-[#243342]">38.4%</p>
                  <p className="text-[11px] text-[#1870c6] mt-[2px]">GDPR-compliant routing</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top models + Reliability wins */}
          <div className="grid grid-cols-3 gap-[16px]">
            <div className="col-span-2 bg-white rounded-[10px] card-shadow">
              <div className="px-[20px] py-[16px]">
                <h3 className="text-[14px] font-bold text-[#243342]">Top models (7d)</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-t border-[#f3f4f5]">
                    <th className="text-left px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Model</th>
                    <th className="text-right px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Requests</th>
                    <th className="text-right px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Traffic</th>
                    <th className="text-right px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {topModels.map((m) => (
                    <tr key={m.model} className="border-t border-[#f3f4f5] hover:bg-[#fafbfc]">
                      <td className="px-[20px] py-[10px] text-[13px] font-medium text-[#243342] font-mono">{m.model}</td>
                      <td className="px-[20px] py-[10px] text-[13px] text-[#243342] text-right">{m.requests}</td>
                      <td className="px-[20px] py-[10px] text-right">
                        <div className="flex items-center justify-end gap-[8px]">
                          <div className="w-[60px] h-[4px] bg-[#f3f4f5] rounded-full overflow-hidden">
                            <div className="h-full bg-[#1870c6] rounded-full" style={{ width: `${m.pct}%` }} />
                          </div>
                          <span className="text-[12px] text-[#687a8b] w-[36px] text-right">{m.pct}%</span>
                        </div>
                      </td>
                      <td className="px-[20px] py-[10px] text-[13px] font-medium text-[#243342] text-right">{m.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-[10px] card-shadow p-[20px]">
              {/* Header */}
              <div className="flex items-center gap-[8px] mb-[10px]">
                <div className="w-[28px] h-[28px] rounded-[6px] bg-[#16a34a]/10 flex items-center justify-center flex-shrink-0">
                  <FaIcon icon="fas fa-shield" className="text-[13px] text-[#16a34a]" ariaLabel="Reliability" />
                </div>
                <h3 className="text-[14px] font-bold text-[#243342]">Reliability wins</h3>
              </div>

              {/* Hero line */}
              <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-[8px] px-[12px] py-[10px] mb-[14px]">
                <p className="text-[12px] text-[#16a34a] font-semibold leading-[1.4]">
                  Your app stayed up through {recentFailovers.length} provider incidents this week
                </p>
                <p className="text-[11px] text-[#4ade80] mt-[2px]">0 requests dropped · automatic recovery every time</p>
              </div>

              {/* Events */}
              <div className="space-y-[6px]">
                {recentFailovers.map((f, i) => (
                  <div key={i} className="py-[8px] px-[10px] rounded-[8px] border border-[#f3f4f5] bg-[#fafbfc]">
                    <div className="flex items-center justify-between mb-[3px]">
                      <div className="flex items-center gap-[6px]">
                        <FaIcon icon="fas fa-circle-check" className="text-[11px] text-[#16a34a]" ariaLabel="Recovered" />
                        <span className="text-[11px] text-[#9ba7b2]">{f.time}</span>
                      </div>
                      <span className="text-[11px] font-medium text-[#16a34a]">recovered in {f.latency}</span>
                    </div>
                    <p className="text-[12px] text-[#243342] pl-[17px]">
                      <span className="text-[#687a8b]">{f.provider}</span>
                      <span className="text-[#9ba7b2] mx-[6px]">&rarr;</span>
                      <span className="font-medium">{f.fallback}</span>
                    </p>
                    <p className="text-[11px] text-[#9ba7b2] font-mono pl-[17px]">{f.model}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
