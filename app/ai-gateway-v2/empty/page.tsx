'use client';

import Link from 'next/link';
import FaIcon from '@/app/components/FaIcon';
import Button from '@/app/components/shared/Button';

const ENDPOINT = 'https://ai-gw.b-cdn.net/v1';

const menuItems = [
  { id: 'overview', label: 'Overview', icon: 'fas fa-house' },
  { id: 'keys',     label: 'API Keys', icon: 'fas fa-key' },
  { id: 'usage',    label: 'Usage',    icon: 'fas fa-chart-line' },
  { id: 'models',   label: 'Models',   icon: 'fas fa-cube' },
];

export default function AIGatewayV2EmptyPage() {
  const activeSection = 'keys';

  return (
    <div className="flex -mx-[30px] -mt-[20px]">
      {/* Secondary sidebar */}
      <div className="w-[220px] min-h-screen bg-[#f3f4f5] border-r border-[#e6e9ec] flex-shrink-0">
        <div className="pt-[12px] px-[12px]">
          {/* Product header */}
          <div className="mb-[16px] px-[11px]">
            <div className="flex items-center gap-[8px]">
              <div className="w-[28px] h-[28px] rounded-[6px] bg-[#eef4fe] flex items-center justify-center">
                <FaIcon icon="fas fa-bolt" className="text-[13px] text-[#1870c6]" ariaLabel="AI Gateway" />
              </div>
              <span className="text-[14px] font-semibold text-[#243342] tracking-[-0.14px]">AI Gateway</span>
            </div>
          </div>

          {/* Nav */}
          <div className="mb-[20px]">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className={`w-full px-[12px] py-[10px] rounded-[8px] flex items-center gap-[10px] mb-[4px] ${
                  activeSection === item.id
                    ? 'bg-white text-[#243342] card-shadow'
                    : 'bg-transparent text-[#687a8b]'
                }`}
              >
                <FaIcon
                  icon={item.icon}
                  className={`text-[14px] ${activeSection === item.id ? 'text-[#1870c6]' : 'text-[#687a8b]'}`}
                  ariaLabel={item.label}
                />
                <span className="text-[14px] font-medium">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Quick stats (empty) */}
          <div className="bg-white rounded-[12px] card-shadow p-[16px]">
            <h3 className="text-[13px] font-semibold text-[#243342] mb-[12px]">Quick Stats</h3>
            <div className="space-y-[12px]">
              <div className="flex justify-between">
                <div>
                  <p className="text-[11px] text-[#9ba7b2] mb-[2px]">Active Keys</p>
                  <p className="text-[14px] font-semibold text-[#243342]">0</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-[#9ba7b2] mb-[2px]">Cache Hit Rate</p>
                  <p className="text-[14px] font-semibold text-[#9ba7b2]">—</p>
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-[11px] text-[#9ba7b2] mb-[2px]">Requests (24h)</p>
                  <p className="text-[14px] font-semibold text-[#9ba7b2]">—</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-[#9ba7b2] mb-[2px]">Models</p>
                  <p className="text-[14px] font-semibold text-[#243342]">25</p>
                </div>
              </div>
            </div>
            <div className="border-t border-[#e6e9ec] mt-[12px] pt-[12px]">
              <div className="flex justify-between items-baseline mb-[4px]">
                <p className="text-[11px] text-[#9ba7b2]">Spend / Budget</p>
                <p className="text-[11px] text-[#687a8b]">0%</p>
              </div>
              <div className="w-full h-[4px] bg-[#f3f4f5] rounded-full overflow-hidden mb-[4px]">
                <div className="h-full bg-[#1870c6] rounded-full" style={{ width: '0%' }} />
              </div>
              <p className="text-[14px] font-bold text-[#243342]">$0 <span className="text-[12px] font-normal text-[#687a8b]">/ $12,000</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        {/* Top bar */}
        <div className="h-[56px] border-b border-[#e6e9ec] px-[24px] flex items-center justify-between">
          <span className="text-[16px] font-semibold text-[#243342]">API Keys</span>
          <div className="flex items-center gap-[8px]">
            <span className="text-[12px] text-[#687a8b] font-mono">{ENDPOINT}</span>
            <button className="text-[12px] text-[#1870c6] hover:underline flex items-center gap-[4px]">
              <FaIcon icon="fas fa-copy" className="text-[10px]" ariaLabel="Copy" />
            </button>
            <Link href="/ai-gateway-v2">
              <Button variant="cta" size="sm" icon="fas fa-plus">
                Create API Key
              </Button>
            </Link>
          </div>
        </div>

        {/* Empty state */}
        <div className="p-[24px] max-w-[1520px] mx-auto">
          <div className="max-w-[720px] mx-auto pt-[40px]">
            {/* Hero card */}
            <div className="bg-white rounded-[16px] card-shadow p-[48px] mb-[24px] text-center">
              <div
                className="inline-flex items-center justify-center w-[64px] h-[64px] rounded-[16px] mb-[20px]"
                style={{ backgroundImage: 'linear-gradient(135deg, #FFAF48 0%, #FF7854 100%)' }}
              >
                <FaIcon icon="fas fa-key" className="text-[26px] text-white" ariaLabel="API key" />
              </div>

              <h1 className="text-[22px] font-semibold text-[#243342] mb-[8px]">
                Create your first API key
              </h1>
              <p className="text-[14px] text-[#687a8b] leading-[1.6] max-w-[460px] mx-auto mb-[24px]">
                API keys authenticate your requests to this AI Gateway. Each key can have its own
                spend limit, rate limit, and routing preferences — rotate or revoke at any time.
              </p>

              <div className="flex items-center justify-center gap-[10px]">
                <Link href="/ai-gateway-v2">
                  <Button variant="cta" icon="fas fa-plus">
                    Create API key
                  </Button>
                </Link>
                <Button variant="outline" icon="fas fa-book" href="#">
                  View docs
                </Button>
              </div>
            </div>

            {/* Feature row */}
            <div className="grid grid-cols-3 gap-[12px] mb-[24px]">
              {[
                { icon: 'fas fa-shield-halved', title: 'Per-key spend limits', desc: 'Pause traffic when a key hits its monthly cap.' },
                { icon: 'fas fa-gauge-high',    title: 'Rate limiting',         desc: 'Cap requests per minute to keep costs predictable.' },
                { icon: 'fas fa-arrows-rotate', title: 'Rotate any time',       desc: 'Revoke or rotate keys without touching providers.' },
              ].map((f) => (
                <div key={f.title} className="bg-white rounded-[10px] card-shadow p-[16px]">
                  <div className="w-[32px] h-[32px] rounded-[7px] bg-[#eef4fe] flex items-center justify-center mb-[10px]">
                    <FaIcon icon={f.icon} className="text-[13px] text-[#1870c6]" ariaLabel="" />
                  </div>
                  <h3 className="text-[13px] font-semibold text-[#243342] mb-[4px]">{f.title}</h3>
                  <p className="text-[12px] text-[#687a8b] leading-[1.5]">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* Quick start snippet */}
            <div className="bg-white rounded-[12px] card-shadow overflow-hidden">
              <div className="px-[20px] py-[14px] border-b border-[#f3f4f5]">
                <h3 className="text-[14px] font-semibold text-[#243342]">What it looks like</h3>
                <p className="text-[12px] text-[#687a8b] mt-[2px]">
                  Once you create a key, paste it into any OpenAI-compatible SDK.
                </p>
              </div>
              <pre className="bg-[#04223e] text-[#e2e8f0] text-[12px] font-mono leading-[1.7] px-[20px] py-[16px] overflow-x-auto">
{`curl ${ENDPOINT}/chat/completions \\
  -H "Authorization: Bearer $BUNNY_AI_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "openai/gpt-4o-mini",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
