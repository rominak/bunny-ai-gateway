'use client';

import { useState } from 'react';
import FaIcon from '@/app/components/FaIcon';
import Button from '@/app/components/shared/Button';

// ── Mock keys data ──────────────────────────────────────────────────────────

const mockKeys = [
  { id: '1',  name: 'Production App',      key: 'bny_sk_prod_****7f3a', created: 'Jan 15, 2026', lastUsed: '2 seconds ago',  status: 'active'  as const, budget: '$3,000/mo',  requests: '892K', spend: '$2,108' },
  { id: '2',  name: 'Staging',             key: 'bny_sk_stag_****2b1c', created: 'Jan 20, 2026', lastUsed: '3 hours ago',    status: 'active'  as const, budget: '$500/mo',    requests: '156K', spend: '$312'   },
  { id: '3',  name: 'Dev / Local',         key: 'bny_sk_dev_****9e4d',  created: 'Feb 5, 2026',  lastUsed: '1 day ago',      status: 'active'  as const, budget: null,         requests: '98K',  spend: '$198'   },
  { id: '4',  name: 'Mobile App (iOS)',     key: 'bny_sk_mobi_****c3f1', created: 'Feb 12, 2026', lastUsed: '8 minutes ago',  status: 'active'  as const, budget: '$1,000/mo',  requests: '310K', spend: '$620'   },
  { id: '5',  name: 'Mobile App (Android)',key: 'bny_sk_andr_****d4e2',  created: 'Feb 12, 2026', lastUsed: '12 minutes ago', status: 'active'  as const, budget: '$1,000/mo',  requests: '284K', spend: '$568'   },
  { id: '6',  name: 'Internal Tools',      key: 'bny_sk_intl_****e5f3', created: 'Feb 20, 2026', lastUsed: '2 hours ago',    status: 'active'  as const, budget: '$200/mo',    requests: '42K',  spend: '$84'    },
  { id: '7',  name: 'Data Pipeline',       key: 'bny_sk_pipe_****f6a4', created: 'Mar 1, 2026',  lastUsed: '5 minutes ago',  status: 'active'  as const, budget: null,         requests: '1.2M', spend: '$2,847' },
  { id: '8',  name: 'QA Automation',       key: 'bny_sk_qa___****a7b5', created: 'Mar 8, 2026',  lastUsed: '4 hours ago',    status: 'active'  as const, budget: '$100/mo',    requests: '18K',  spend: '$36'    },
  { id: '9',  name: 'Partner API',         key: 'bny_sk_part_****b8c6', created: 'Mar 15, 2026', lastUsed: '31 minutes ago', status: 'active'  as const, budget: '$750/mo',    requests: '67K',  spend: '$134'   },
  { id: '10', name: 'Legacy Integration',  key: 'bny_sk_legc_****c9d7', created: 'Nov 3, 2025',  lastUsed: 'Feb 28, 2026',   status: 'revoked' as const, budget: null,         requests: '0',    spend: '$0'     },
  { id: '11', name: 'Old Integration',     key: 'bny_sk_old_****1a2b',  created: 'Dec 10, 2025', lastUsed: 'Jan 14, 2026',   status: 'revoked' as const, budget: null,         requests: '0',    spend: '$0'     },
  { id: '12', name: 'Test Key (expired)',  key: 'bny_sk_test_****d0e8', created: 'Dec 28, 2025', lastUsed: 'Jan 2, 2026',    status: 'revoked' as const, budget: '$50/mo',     requests: '0',    spend: '$0'     },
];

// ── Types ────────────────────────────────────────────────────────────────────

type ActiveSection = 'overview' | 'keys' | 'usage' | 'models';
type KeyStep = 'idle' | 'form' | 'reveal';

// ── Lazy imports for section reuse ───────────────────────────────────────────

import UsageSection from '@/app/ai-gateway/[id]/UsageSection';
import ModelsSection from '@/app/ai-gateway/[id]/ModelsSection';

// ── Quick Start snippet ─────────────────────────────────────────────────────

const ENDPOINT = 'https://ai-gw.b-cdn.net/v1';

const codeSnippets = {
  curl: `curl ${ENDPOINT}/chat/completions \\
  -H "Authorization: Bearer $BUNNY_AI_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "openai/gpt-4o-mini",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`,
  python: `from openai import OpenAI

client = OpenAI(
    base_url="${ENDPOINT}",
    api_key="your-bunny-api-key"
)

response = client.chat.completions.create(
    model="openai/gpt-4o-mini",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)`,
  node: `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: '${ENDPOINT}',
  apiKey: 'your-bunny-api-key',
});

const response = await client.chat.completions.create({
  model: 'openai/gpt-4o-mini',
  messages: [{ role: 'user', content: 'Hello!' }],
});
console.log(response.choices[0].message.content);`,
};

// ── Mini chart for overview ─────────────────────────────────────────────────

function MiniChart({ title, subtitle, value, change, up, data, labels, color, format }: {
  title: string; subtitle: string; value: string; change: string; up: boolean;
  data: number[]; labels: string[]; color: string; format: (v: number) => string;
}) {
  const W = 520, H = 140, pad = { top: 10, right: 10, bottom: 24, left: 10 };
  const pW = W - pad.left - pad.right;
  const pH = H - pad.top - pad.bottom;
  const max = Math.max(...data);
  const points = data.map((v, i) => ({
    x: pad.left + (i / (data.length - 1)) * pW,
    y: pad.top + pH - (v / max) * pH,
  }));

  // Smooth curve
  const pathParts = [`M ${points[0].x} ${points[0].y}`];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];
    const t = 0.3;
    pathParts.push(`C ${p1.x + (p2.x - p0.x) * t} ${p1.y + (p2.y - p0.y) * t}, ${p2.x - (p3.x - p1.x) * t} ${p2.y - (p3.y - p1.y) * t}, ${p2.x} ${p2.y}`);
  }
  const line = pathParts.join(' ');
  const area = `${line} L ${points[points.length - 1].x} ${pad.top + pH} L ${points[0].x} ${pad.top + pH} Z`;
  const gradId = `mini-grad-${title.replace(/\s/g, '')}`;

  return (
    <div className="bg-white rounded-[10px] card-shadow">
      <div className="px-[20px] py-[14px] flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-bold text-[#243342]">{title}</h3>
          <p className="text-[12px] text-[#9ba7b2]">{subtitle}</p>
        </div>
        <div className="text-right">
          <p className="text-[18px] font-bold text-[#243342]">{value}</p>
          <p className={`text-[12px] font-medium ${up ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
            {change}
          </p>
        </div>
      </div>
      <div className="px-[10px] pb-[10px]">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.15" />
              <stop offset="100%" stopColor={color} stopOpacity="0.01" />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#${gradId})`} />
          <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {labels.map((l, i) => (
            <text key={i} x={pad.left + (i / (data.length - 1)) * pW} y={H - 4} textAnchor="middle" className="text-[9px] fill-[#9ba7b2]">{l}</text>
          ))}
        </svg>
      </div>
    </div>
  );
}

// ── Overview section ────────────────────────────────────────────────────────

function OverviewV2({ onCreateKey, onGoToKeys, onGoToUsage }: { onCreateKey: () => void; onGoToKeys: () => void; onGoToUsage: () => void }) {
  const [snippetTab, setSnippetTab] = useState<'curl' | 'python' | 'node'>('curl');
  const [snippetCopied, setSnippetCopied] = useState(false);
  const [endpointCopied, setEndpointCopied] = useState(false);

  const activeKeys = mockKeys.filter(k => k.status === 'active');
  const totalRequests = '2.87M';
  const totalSpend = '$6,907';
  const cacheHitRate = '34.2%';

  // Top 3 keys by spend
  const topKeys = [...activeKeys].sort((a, b) => {
    const parseSpend = (s: string) => parseFloat(s.replace(/[$,]/g, ''));
    return parseSpend(b.spend) - parseSpend(a.spend);
  }).slice(0, 3);

  // Top models (mock)
  const topModels = [
    { name: 'openai/gpt-4o-mini', requests: '1.4M', pct: 49 },
    { name: 'anthropic/claude-3.5-sonnet', requests: '680K', pct: 24 },
    { name: 'google/gemini-2.0-flash', requests: '420K', pct: 15 },
    { name: 'meta/llama-3.3-70b', requests: '370K', pct: 12 },
  ];

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(codeSnippets[snippetTab]).catch(() => {});
    setSnippetCopied(true);
    setTimeout(() => setSnippetCopied(false), 2000);
  };

  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText(ENDPOINT).catch(() => {});
    setEndpointCopied(true);
    setTimeout(() => setEndpointCopied(false), 2000);
  };

  return (
    <>
      {/* Hero card: Get started + code snippet */}
      <div className="bg-white rounded-[12px] card-shadow border border-[#e6e9ec] mb-[20px] overflow-hidden">
        <div className="grid grid-cols-2">
          {/* Left: CTA */}
          <div className="p-[28px] flex flex-col justify-center">
            <h2 className="text-[20px] font-semibold text-[#243342] mb-[8px]">Start using AI Gateway</h2>
            <p className="text-[14px] text-[#687a8b] leading-[1.6] mb-[20px]">
              Switch between hundreds of models with a single API key. No provider accounts needed — just change your base URL.
            </p>
            <div className="flex items-center gap-[10px]">
              <Button variant="cta" icon="fas fa-plus" onClick={onCreateKey}>
                Create an API Key
              </Button>
              <Button variant="outline" onClick={handleCopyEndpoint}>
                {endpointCopied ? 'Copied!' : 'Copy Endpoint'}
              </Button>
            </div>
          </div>

          {/* Right: Code snippet */}
          <div className="bg-[#04223e] rounded-r-[12px]">
            <div className="flex items-center justify-between px-[16px] pt-[12px]">
              <div className="flex items-center gap-[2px]">
                {(['curl', 'python', 'node'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSnippetTab(tab)}
                    className={`px-[12px] py-[6px] rounded-[6px] text-[12px] font-medium transition-colors ${
                      snippetTab === tab
                        ? 'bg-[#1a3a54] text-white'
                        : 'text-[#687a8b] hover:text-[#8899a8]'
                    }`}
                  >
                    {tab === 'curl' ? 'cURL' : tab === 'python' ? 'Python' : 'Node.js'}
                  </button>
                ))}
              </div>
              <button
                onClick={handleCopySnippet}
                className={`flex items-center gap-[5px] text-[12px] transition-colors ${
                  snippetCopied ? 'text-[#4ade80]' : 'text-[#687a8b] hover:text-white'
                }`}
              >
                <FaIcon icon={snippetCopied ? 'fas fa-check' : 'fas fa-copy'} className="text-[11px]" ariaLabel="Copy" />
                {snippetCopied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="px-[16px] py-[14px] text-[12px] text-[#e2e8f0] font-mono whitespace-pre overflow-x-auto leading-[1.7] h-[180px]">
              {codeSnippets[snippetTab]}
            </pre>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-[12px] mb-[20px]">
        {[
          { label: 'Active keys', value: String(activeKeys.length), icon: 'fas fa-key' },
          { label: 'Total requests', value: totalRequests, icon: 'fas fa-arrow-right-arrow-left' },
          { label: 'Total spend', value: totalSpend, icon: 'fas fa-wallet' },
          { label: 'Cache hit rate', value: cacheHitRate, icon: 'fas fa-bolt' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-[10px] card-shadow p-[16px] flex items-center gap-[12px]">
            <div className="w-[32px] h-[32px] rounded-[8px] bg-[#eef4fe] flex items-center justify-center">
              <FaIcon icon={s.icon} className="text-[14px] text-[#1870c6]" ariaLabel={s.label} />
            </div>
            <div>
              <p className="text-[11px] text-[#9ba7b2] uppercase tracking-wider">{s.label}</p>
              <p className="text-[18px] font-bold text-[#243342]">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Usage charts (7d) */}
      <div className="grid grid-cols-2 gap-[20px] mb-[20px]">
        <MiniChart
          title="Request volume"
          subtitle="Last 7 days"
          value="1.24M"
          change="+18.4%"
          up
          data={[145, 189, 210, 178, 195, 142, 181]}
          labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
          color="#1870c6"
          format={(v) => `${Math.round(v)}K`}
        />
        <MiniChart
          title="Daily spend"
          subtitle="Last 7 days"
          value="$2,847"
          change="+6.8%"
          up
          data={[380, 420, 460, 410, 440, 350, 387]}
          labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
          color="#16a34a"
          format={(v) => `$${Math.round(v)}`}
        />
      </div>

      {/* Two-column: Top keys + Top models */}
      <div className="grid grid-cols-2 gap-[20px]">
        {/* Top keys by spend */}
        <div className="bg-white rounded-[10px] card-shadow">
          <div className="px-[20px] py-[14px] flex items-center justify-between border-b border-[#f3f4f5]">
            <h3 className="text-[14px] font-bold text-[#243342]">Top keys by spend</h3>
            <button onClick={onGoToKeys} className="text-[12px] text-[#1870c6] hover:underline">View all</button>
          </div>
          <div>
            {topKeys.map((k) => (
              <div key={k.id} className="px-[20px] py-[12px] flex items-center justify-between border-b border-[#f3f4f5] last:border-b-0">
                <div className="flex items-center gap-[10px]">
                  <span className="w-[7px] h-[7px] rounded-full bg-[#16a34a] flex-shrink-0" />
                  <div>
                    <p className="text-[13px] font-medium text-[#243342]">{k.name}</p>
                    <p className="text-[11px] text-[#9ba7b2] font-mono">{k.key}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-semibold text-[#243342]">{k.spend}</p>
                  <p className="text-[11px] text-[#9ba7b2]">{k.requests} requests</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top models */}
        <div className="bg-white rounded-[10px] card-shadow">
          <div className="px-[20px] py-[14px] flex items-center justify-between border-b border-[#f3f4f5]">
            <h3 className="text-[14px] font-bold text-[#243342]">Top models</h3>
            <span className="text-[12px] text-[#9ba7b2]">Last 7 days</span>
          </div>
          <div>
            {topModels.map((m) => (
              <div key={m.name} className="px-[20px] py-[12px] border-b border-[#f3f4f5] last:border-b-0">
                <div className="flex items-center justify-between mb-[6px]">
                  <p className="text-[13px] font-medium text-[#243342]">{m.name}</p>
                  <p className="text-[12px] text-[#687a8b]">{m.requests}</p>
                </div>
                <div className="w-full h-[4px] bg-[#f3f4f5] rounded-full overflow-hidden">
                  <div className="h-full bg-[#1870c6] rounded-full" style={{ width: `${m.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* A/B Test summary */}
      <div className="bg-white rounded-[10px] card-shadow mt-[20px]">
        <div className="px-[20px] py-[14px] flex items-center justify-between border-b border-[#f3f4f5]">
          <div className="flex items-center gap-[10px]">
            <div className="w-[28px] h-[28px] rounded-[6px] bg-[#eef4fe] flex items-center justify-center">
              <FaIcon icon="fas fa-flask" className="text-[12px] text-[#1870c6]" ariaLabel="A/B test" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-[#243342]">A/B Test: Claude Sonnet 4.5 vs GPT-4o</h3>
              <p className="text-[12px] text-[#687a8b]">Running since Mar 20 · 24,300 requests</p>
            </div>
          </div>
          <div className="flex items-center gap-[10px]">
            <span className="inline-flex items-center h-[22px] px-[8px] rounded-[6px] text-[11px] font-semibold bg-[#1870c6] text-white">
              Running
            </span>
            <button onClick={onGoToUsage} className="text-[12px] text-[#1870c6] hover:underline">Details</button>
          </div>
        </div>
        <div className="p-[20px]">
          <div className="grid grid-cols-2 gap-[16px]">
            {/* Model A */}
            <div className="flex items-center justify-between p-[14px] rounded-[10px] border-2 border-[#1870c6]/20 bg-[#fafbfc]">
              <div>
                <div className="flex items-center gap-[8px] mb-[4px]">
                  <span className="inline-flex items-center h-[20px] px-[8px] rounded-[4px] text-[10px] font-bold bg-[#eef4fe] text-[#1870c6]">70% traffic</span>
                  <span className="inline-flex items-center gap-[4px] text-[11px] text-[#16a34a] font-medium">
                    <FaIcon icon="fas fa-circle-check" className="text-[10px]" ariaLabel="" />
                    Winner
                  </span>
                </div>
                <p className="text-[14px] font-semibold text-[#243342] font-mono">Claude Sonnet 4.5</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-[#9ba7b2]">340ms avg · $2.43/1K</p>
                <p className="text-[14px] font-bold text-[#243342]">$612</p>
              </div>
            </div>
            {/* Model B */}
            <div className="flex items-center justify-between p-[14px] rounded-[10px] border-2 border-[#f59e0b]/20 bg-[#fafbfc]">
              <div>
                <div className="flex items-center gap-[8px] mb-[4px]">
                  <span className="inline-flex items-center h-[20px] px-[8px] rounded-[4px] text-[10px] font-bold bg-[#fffbeb] text-[#f59e0b]">30% traffic</span>
                </div>
                <p className="text-[14px] font-semibold text-[#243342] font-mono">GPT-4o</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-[#9ba7b2]">420ms avg · $4.06/1K</p>
                <p className="text-[14px] font-bold text-[#243342]">$296</p>
              </div>
            </div>
          </div>
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-[8px] px-[14px] py-[10px] mt-[14px] flex items-center gap-[10px]">
            <FaIcon icon="fas fa-circle-info" className="text-[13px] text-[#16a34a] flex-shrink-0" ariaLabel="Insight" />
            <p className="text-[12px] text-[#16a34a]">
              <span className="font-semibold">Claude Sonnet 4.5</span> is 19% faster and 40% cheaper per request.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// ── API Keys section ────────────────────────────────────────────────────────

function KeysSection() {
  const activeKeys = mockKeys.filter(k => k.status === 'active');

  return (
    <div className="bg-white rounded-[10px] card-shadow">
      <div className="px-[20px] py-[16px]">
        <h3 className="text-[14px] font-bold text-[#243342]">API Keys</h3>
        <p className="text-[12px] text-[#687a8b]">
          {activeKeys.length} active keys · {mockKeys.length - activeKeys.length} revoked
        </p>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-t border-[#f3f4f5]">
            <th className="text-left px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Name</th>
            <th className="text-left px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Key</th>
            <th className="text-left px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Created</th>
            <th className="text-left px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Last used</th>
            <th className="text-right px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Budget</th>
            <th className="text-right px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Requests</th>
            <th className="text-right px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Spend</th>
            <th className="text-center px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Status</th>
            <th className="w-[40px]" />
          </tr>
        </thead>
        <tbody>
          {mockKeys.map((k) => (
            <tr key={k.id} className="border-t border-[#f3f4f5] hover:bg-[#fafbfc]">
              <td className="px-[20px] py-[11px] text-[13px] font-medium text-[#243342]">{k.name}</td>
              <td className="px-[20px] py-[11px] text-[12px] text-[#9ba7b2] font-mono">{k.key}</td>
              <td className="px-[20px] py-[11px] text-[13px] text-[#687a8b]">{k.created}</td>
              <td className="px-[20px] py-[11px] text-[13px] text-[#687a8b]">{k.lastUsed}</td>
              <td className="px-[20px] py-[11px] text-[13px] text-right">{k.budget ? <span className="text-[#243342]">{k.budget}</span> : <span className="text-[#9ba7b2]">No limit</span>}</td>
              <td className="px-[20px] py-[11px] text-[13px] text-[#243342] text-right">{k.requests}</td>
              <td className="px-[20px] py-[11px] text-[13px] font-medium text-[#243342] text-right">{k.spend}</td>
              <td className="px-[20px] py-[11px] text-center">
                {k.status === 'active' ? (
                  <span className="inline-flex items-center gap-[6px] text-[13px] text-[#243342]">
                    <span className="w-[7px] h-[7px] rounded-full bg-[#16a34a] flex-shrink-0" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-[6px] text-[13px] text-[#9ba7b2]">
                    <span className="w-[7px] h-[7px] rounded-full bg-[#d1d5db] flex-shrink-0" />
                    Revoked
                  </span>
                )}
              </td>
              <td className="px-[6px] py-[11px]">
                <button className="p-[6px] rounded hover:bg-[#f3f4f5] transition-colors" aria-label="More">
                  <FaIcon icon="fas fa-ellipsis" className="text-[12px] text-[#9ba7b2]" ariaLabel="Menu" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Key creation form (inline) ──────────────────────────────────────────────

function CreateKeyFlow({ onDone }: { onDone: () => void }) {
  const [keyName, setKeyName] = useState('');
  const [keyBudget, setKeyBudget] = useState('');
  const [euOnly, setEuOnly] = useState(false);
  const [step, setStep] = useState<'form' | 'reveal'>('form');
  const [revealedKey, setRevealedKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleCreate = () => {
    const slug = keyName.toLowerCase().replace(/\s+/g, '_').slice(0, 6);
    const secret = Array.from(crypto.getRandomValues(new Uint8Array(24)))
      .map(b => b.toString(16).padStart(2, '0')).join('');
    setRevealedKey(`bny_sk_${slug}_${secret}`);
    setCopied(false);
    setConfirmed(false);
    setStep('reveal');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(revealedKey).catch(() => {});
    setCopied(true);
  };

  type Lang = 'curl' | 'python' | 'node';
  type UseCase = 'basic' | 'streaming' | 'tools';
  const [lang, setLang] = useState<Lang>('curl');
  const [useCase, setUseCase] = useState<UseCase>('basic');
  const [snippetCopied, setSnippetCopied] = useState(false);

  const getSnippets = (apiKey: string): Record<UseCase, Record<Lang, string>> => ({
    basic: {
      curl: `curl ${ENDPOINT}/chat/completions \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "openai/gpt-4o-mini",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`,
      python: `from openai import OpenAI

client = OpenAI(
    base_url="${ENDPOINT}",
    api_key="${apiKey}"
)

response = client.chat.completions.create(
    model="openai/gpt-4o-mini",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)`,
      node: `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: '${ENDPOINT}',
  apiKey: '${apiKey}',
});

const response = await client.chat.completions.create({
  model: 'openai/gpt-4o-mini',
  messages: [{ role: 'user', content: 'Hello!' }],
});
console.log(response.choices[0].message.content);`,
    },
    streaming: {
      curl: `curl ${ENDPOINT}/chat/completions \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "openai/gpt-4o-mini",
    "stream": true,
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`,
      python: `from openai import OpenAI

client = OpenAI(
    base_url="${ENDPOINT}",
    api_key="${apiKey}"
)

stream = client.chat.completions.create(
    model="openai/gpt-4o-mini",
    messages=[{"role": "user", "content": "Hello!"}],
    stream=True
)
for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")`,
      node: `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: '${ENDPOINT}',
  apiKey: '${apiKey}',
});

const stream = await client.chat.completions.create({
  model: 'openai/gpt-4o-mini',
  messages: [{ role: 'user', content: 'Hello!' }],
  stream: true,
});
for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '');
}`,
    },
    tools: {
      curl: `curl ${ENDPOINT}/chat/completions \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "openai/gpt-4o-mini",
    "messages": [{"role": "user", "content": "What is the weather in Berlin?"}],
    "tools": [{
      "type": "function",
      "function": {
        "name": "get_weather",
        "description": "Get current weather for a city",
        "parameters": {
          "type": "object",
          "properties": { "city": { "type": "string" } },
          "required": ["city"]
        }
      }
    }]
  }'`,
      python: `from openai import OpenAI

client = OpenAI(
    base_url="${ENDPOINT}",
    api_key="${apiKey}"
)

tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "Get current weather for a city",
        "parameters": {
            "type": "object",
            "properties": {"city": {"type": "string"}},
            "required": ["city"]
        }
    }
}]

response = client.chat.completions.create(
    model="openai/gpt-4o-mini",
    messages=[{"role": "user", "content": "What is the weather in Berlin?"}],
    tools=tools
)
print(response.choices[0].message.tool_calls)`,
      node: `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: '${ENDPOINT}',
  apiKey: '${apiKey}',
});

const response = await client.chat.completions.create({
  model: 'openai/gpt-4o-mini',
  messages: [{ role: 'user', content: 'What is the weather in Berlin?' }],
  tools: [{
    type: 'function',
    function: {
      name: 'get_weather',
      description: 'Get current weather for a city',
      parameters: {
        type: 'object',
        properties: { city: { type: 'string' } },
        required: ['city'],
      },
    },
  }],
});
console.log(response.choices[0].message.tool_calls);`,
    },
  });

  const handleCopySnippet = () => {
    const snippets = getSnippets(revealedKey);
    navigator.clipboard.writeText(snippets[useCase][lang]).catch(() => {});
    setSnippetCopied(true);
    setTimeout(() => setSnippetCopied(false), 2000);
  };

  if (step === 'reveal') {
    const snippets = getSnippets(revealedKey);

    return (
      <div className="max-w-[900px] mx-auto py-[20px]">
        {/* Success header */}
        <div className="bg-white rounded-[12px] card-shadow p-[24px] mb-[16px]">
          <div className="flex items-center gap-[12px] mb-[16px]">
            <div className="w-[40px] h-[40px] rounded-full bg-[#f0fdf4] flex items-center justify-center">
              <FaIcon icon="fas fa-circle-check" className="text-[20px] text-[#16a34a]" ariaLabel="Success" />
            </div>
            <div className="flex-1">
              <h2 className="text-[18px] font-semibold text-[#243342]">API key created</h2>
              <p className="text-[13px] text-[#687a8b]">{keyName}</p>
            </div>
          </div>

          <div className="bg-[#fffbeb] border border-[#fde68a] rounded-[8px] px-[14px] py-[10px] mb-[16px] flex items-center gap-[10px]">
            <FaIcon icon="fas fa-triangle-exclamation" className="text-[13px] text-[#d97706] flex-shrink-0" ariaLabel="Warning" />
            <p className="text-[12px] text-[#92400e]">This key will not be shown again. Copy it now and store it securely.</p>
          </div>

          <div className="relative">
            <input
              type="text"
              readOnly
              value={revealedKey}
              className="w-full h-[44px] px-[14px] pr-[44px] text-[13px] text-[#243342] font-mono bg-[#f3f4f5] border border-[#e6e9ec] rounded-[8px] outline-none cursor-text"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button
              onClick={handleCopy}
              className="absolute right-[1px] top-[1px] h-[42px] w-[42px] flex items-center justify-center rounded-r-[7px] hover:bg-[#e6e9ec] transition-colors"
            >
              <FaIcon icon={copied ? 'fas fa-check' : 'fas fa-copy'} className={`text-[13px] ${copied ? 'text-[#16a34a]' : 'text-[#687a8b]'}`} ariaLabel="Copy" />
            </button>
          </div>

          {/* .env hint */}
          <div className="mt-[12px] flex items-center gap-[8px]">
            <span className="text-[12px] text-[#687a8b]">Add to your <code className="text-[12px] font-mono text-[#243342] bg-[#f3f4f5] px-[6px] py-[2px] rounded-[4px]">.env</code> file:</span>
          </div>
          <div className="relative mt-[6px]">
            <input
              type="text"
              readOnly
              value={`BUNNY_AI_KEY=${revealedKey}`}
              className="w-full h-[40px] px-[14px] pr-[44px] text-[12px] text-[#243342] font-mono bg-[#f3f4f5] border border-[#e6e9ec] rounded-[8px] outline-none cursor-text"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button
              onClick={() => { navigator.clipboard.writeText(`BUNNY_AI_KEY=${revealedKey}`).catch(() => {}); }}
              className="absolute right-[1px] top-[1px] h-[38px] w-[42px] flex items-center justify-center rounded-r-[7px] hover:bg-[#e6e9ec] transition-colors"
            >
              <FaIcon icon="fas fa-copy" className="text-[12px] text-[#687a8b]" ariaLabel="Copy" />
            </button>
          </div>
        </div>

        {/* Ready-to-use code snippets */}
        <div className="bg-white rounded-[12px] card-shadow overflow-hidden mb-[16px]">
          <div className="px-[24px] py-[16px] border-b border-[#f3f4f5] flex items-center gap-[10px]">
            <div className="w-[28px] h-[28px] rounded-[6px] bg-[#eef4fe] flex items-center justify-center">
              <FaIcon icon="fas fa-rocket" className="text-[12px] text-[#1870c6]" ariaLabel="Quick start" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-[#243342]">Quick start</h3>
              <p className="text-[12px] text-[#687a8b]">Your API key is already filled in. Just copy, paste, and run.</p>
            </div>
          </div>
          {/* Use case tabs */}
          <div className="px-[24px] py-[10px] border-b border-[#f3f4f5] flex items-center gap-[6px]">
            {([
              { id: 'basic' as UseCase, label: 'Basic', icon: 'fas fa-play' },
              { id: 'streaming' as UseCase, label: 'Streaming', icon: 'fas fa-bars-staggered' },
              { id: 'tools' as UseCase, label: 'Function calling', icon: 'fas fa-wrench' },
            ]).map((uc) => (
              <button
                key={uc.id}
                onClick={() => { setUseCase(uc.id); setSnippetCopied(false); }}
                className={`flex items-center gap-[6px] px-[12px] py-[6px] rounded-[6px] text-[12px] font-medium transition-colors ${
                  useCase === uc.id
                    ? 'bg-[#eef4fe] text-[#1870c6]'
                    : 'text-[#687a8b] hover:bg-[#f3f4f5] hover:text-[#243342]'
                }`}
              >
                <FaIcon icon={uc.icon} className="text-[10px]" ariaLabel="" />
                {uc.label}
              </button>
            ))}
          </div>
          {/* Code block */}
          <div className="bg-[#04223e] rounded-b-[12px]">
            <div className="flex items-center justify-between px-[16px] pt-[12px]">
              <div className="flex items-center gap-[2px]">
                {(['curl', 'python', 'node'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => { setLang(tab); setSnippetCopied(false); }}
                    className={`px-[12px] py-[6px] rounded-[6px] text-[12px] font-medium transition-colors ${
                      lang === tab
                        ? 'bg-[#1a3a54] text-white'
                        : 'text-[#687a8b] hover:text-[#8899a8]'
                    }`}
                  >
                    {tab === 'curl' ? 'cURL' : tab === 'python' ? 'Python' : 'Node.js'}
                  </button>
                ))}
              </div>
              <button
                onClick={handleCopySnippet}
                className={`flex items-center gap-[5px] text-[12px] transition-colors ${
                  snippetCopied ? 'text-[#4ade80]' : 'text-[#687a8b] hover:text-white'
                }`}
              >
                <FaIcon icon={snippetCopied ? 'fas fa-check' : 'fas fa-copy'} className="text-[11px]" ariaLabel="Copy" />
                {snippetCopied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="px-[16px] py-[14px] text-[12px] text-[#e2e8f0] font-mono whitespace-pre overflow-x-auto leading-[1.7] h-[260px]">
              {snippets[useCase][lang]}
            </pre>
          </div>
        </div>

        {/* Confirm + Done */}
        <div className="bg-white rounded-[12px] card-shadow p-[24px]">
          <label className="flex items-start gap-[8px] mb-[16px] cursor-pointer">
            <input type="checkbox" checked={confirmed} onChange={() => setConfirmed(!confirmed)} className="mt-[3px] accent-[#1870c6]" />
            <span className="text-[13px] text-[#687a8b]">I have copied my API key and stored it securely</span>
          </label>
          <Button variant="primary" disabled={!confirmed} onClick={onDone}>
            Done
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto py-[20px]">
      <div className="bg-white rounded-[12px] card-shadow p-[28px]">
        <h2 className="text-[18px] font-semibold text-[#243342] mb-[4px]">Create API key</h2>
        <p className="text-[13px] text-[#687a8b] mb-[24px]">API keys authenticate your requests to the AI Gateway endpoint.</p>

        <div className="mb-[20px]">
          <label className="block text-[13px] font-medium text-[#243342] mb-[6px]">
            Key name <span className="text-[#ff6b35]">*</span>
          </label>
          <input
            type="text"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
            placeholder="e.g. Production App"
            className="w-full h-[40px] px-[12px] text-[14px] text-[#243342] border border-[#e6e9ec] rounded-[8px] outline-none focus:border-[#1870c6] placeholder:text-[#9ba7b2]"
          />
        </div>

        <div className="mb-[24px]">
          <label className="block text-[13px] font-medium text-[#243342] mb-[6px]">
            Monthly budget <span className="text-[12px] font-normal text-[#9ba7b2]">(optional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[14px] text-[#9ba7b2]">$</span>
            <input
              type="text"
              value={keyBudget}
              onChange={(e) => setKeyBudget(e.target.value)}
              placeholder="500"
              className="w-full h-[40px] pl-[28px] pr-[12px] text-[14px] text-[#243342] border border-[#e6e9ec] rounded-[8px] outline-none focus:border-[#1870c6] placeholder:text-[#9ba7b2]"
            />
          </div>
          <p className="text-[12px] text-[#9ba7b2] mt-[6px]">Traffic will pause when this limit is reached</p>
        </div>

        <div className="mb-[24px] flex items-start justify-between p-[16px] bg-[#fafbfc] border border-[#e6e9ec] rounded-[10px]">
          <div className="flex items-start gap-[10px]">
            <span className="text-[16px] mt-[1px]">🇪🇺</span>
            <div>
              <p className="text-[13px] font-medium text-[#243342]">EU-only routing</p>
              <p className="text-[12px] text-[#687a8b] mt-[2px]">Route all requests through European infrastructure only. Ensures GDPR-compliant data processing.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setEuOnly(!euOnly)}
            style={{ background: euOnly ? '#1870c6' : '#c4cdd5' }}
            className="relative w-[44px] h-[24px] rounded-full transition-colors flex-shrink-0 focus:outline-none ml-[12px] mt-[2px]"
          >
            <span
              style={{ left: euOnly ? '23px' : '3px' }}
              className="absolute top-[3px] w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-all duration-200"
            />
          </button>
        </div>

        <div className="flex items-center gap-[10px]">
          <Button variant="cta" disabled={!keyName.trim()} onClick={handleCreate}>
            Create key
          </Button>
          <Button variant="outline" onClick={onDone}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────────────────

export default function AIGatewayV2Page() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('overview');
  const [keyStep, setKeyStep] = useState<KeyStep>('idle');

  const menuItems = [
    { id: 'overview' as ActiveSection, label: 'Overview', icon: 'fas fa-house' },
    { id: 'keys' as ActiveSection, label: 'API Keys', icon: 'fas fa-key' },
    { id: 'usage' as ActiveSection, label: 'Usage', icon: 'fas fa-chart-line' },
    { id: 'models' as ActiveSection, label: 'Models', icon: 'fas fa-cube' },
  ];

  const activeKeys = mockKeys.filter(k => k.status === 'active').length;

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
              <button
                key={item.id}
                onClick={() => { setActiveSection(item.id); setKeyStep('idle'); }}
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

          {/* Quick stats */}
          <div className="bg-white rounded-[12px] card-shadow p-[16px]">
            <h3 className="text-[13px] font-semibold text-[#243342] mb-[12px]">Quick Stats</h3>
            <div className="space-y-[12px]">
              <div className="flex justify-between">
                <div>
                  <p className="text-[11px] text-[#9ba7b2] mb-[2px]">Active Keys</p>
                  <p className="text-[14px] font-semibold text-[#243342]">{activeKeys}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-[#9ba7b2] mb-[2px]">Cache Hit Rate</p>
                  <p className="text-[14px] font-semibold text-[#1870c6]">34.2%</p>
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-[11px] text-[#9ba7b2] mb-[2px]">Requests (24h)</p>
                  <p className="text-[14px] font-semibold text-[#243342]">126.6K</p>
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
                <p className="text-[11px] text-[#687a8b]">57%</p>
              </div>
              <div className="w-full h-[4px] bg-[#f3f4f5] rounded-full overflow-hidden mb-[4px]">
                <div className="h-full bg-[#1870c6] rounded-full" style={{ width: '57%' }} />
              </div>
              <p className="text-[14px] font-bold text-[#243342]">$6,907 <span className="text-[12px] font-normal text-[#687a8b]">/ $12,000</span></p>
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
            <span className="text-[12px] text-[#687a8b] font-mono">{ENDPOINT}</span>
            <button className="text-[12px] text-[#1870c6] hover:underline flex items-center gap-[4px]">
              <FaIcon icon="fas fa-copy" className="text-[10px]" ariaLabel="Copy" />
            </button>
            {keyStep === 'idle' && (
              <Button variant="cta" size="sm" icon="fas fa-plus" onClick={() => setKeyStep('form')}>
                Create API Key
              </Button>
            )}
          </div>
        </div>

        <div className="p-[24px] max-w-[1520px] mx-auto">
          {activeSection === 'overview' && keyStep === 'idle' && (
            <OverviewV2 onCreateKey={() => { setActiveSection('keys'); setKeyStep('form'); }} onGoToKeys={() => setActiveSection('keys')} onGoToUsage={() => setActiveSection('usage')} />
          )}
          {activeSection === 'keys' && keyStep === 'idle' && (
            <KeysSection />
          )}
          {keyStep === 'form' && (
            <CreateKeyFlow onDone={() => setKeyStep('idle')} />
          )}
          {keyStep === 'reveal' && (
            <CreateKeyFlow onDone={() => setKeyStep('idle')} />
          )}
          {activeSection === 'usage' && keyStep === 'idle' && <UsageSection />}
          {activeSection === 'models' && keyStep === 'idle' && <ModelsSection />}
        </div>
      </div>
    </div>
  );
}
