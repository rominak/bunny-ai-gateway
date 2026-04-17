'use client';

import FaIcon from '@/app/components/FaIcon';
import Button from '@/app/components/shared/Button';
import PageHeader from '@/app/components/shared/PageHeader';

const features = [
  {
    icon: 'fas fa-bolt',
    title: 'One endpoint, 100+ models',
    description:
      "OpenAI-compatible. Point your SDK at the gateway and call any model — GPT, Claude, Gemini, Llama — through the same URL.",
  },
  {
    icon: 'fas fa-shield-halved',
    title: 'Usage & spend guardrails',
    description:
      'Set monthly spend limits per key, cap requests per minute, and rotate or revoke keys without touching provider accounts.',
  },
  {
    icon: 'fas fa-chart-line',
    title: 'Built-in observability',
    description:
      'See requests, latency, cache hit rate, token usage and spend in real time — per key, per model, per gateway.',
  },
];

export default function AIGatewayEmptyPage() {
  return (
    <>
      <PageHeader
        title="AI Gateway"
        tabs={[{ id: 'gateways', label: 'Gateways', count: 0 }]}
        activeTab="gateways"
        onTabChange={() => {}}
        searchPlaceholder="Search gateways..."
        searchValue=""
        onSearchChange={() => {}}
        addButtonLabel="Create gateway"
        addButtonHref="/ai-gateway/add"
      />

      {/* Empty state */}
      <div className="max-w-[820px] mx-auto pt-[40px] pb-[60px]">
        {/* Hero */}
        <div className="bg-white rounded-[16px] card-shadow p-[48px] mb-[32px] text-center">
          <div
            className="inline-flex items-center justify-center w-[72px] h-[72px] rounded-[20px] mb-[24px]"
            style={{ backgroundImage: 'linear-gradient(135deg, #FFAF48 0%, #FF7854 100%)' }}
          >
            <FaIcon icon="fas fa-bolt" className="text-[32px] text-white" ariaLabel="AI Gateway" />
          </div>

          <h1 className="text-[24px] font-semibold text-[#243342] mb-[10px]">
            Create your first AI Gateway
          </h1>
          <p className="text-[14px] text-[#687a8b] leading-[1.6] max-w-[480px] mx-auto mb-[28px]">
            A gateway is your dedicated endpoint for routing AI requests. Get access to 100+ models
            with a single API key — no provider accounts or setup needed.
          </p>

          <div className="flex items-center justify-center gap-[10px]">
            <Button variant="cta" icon="fas fa-plus" href="/ai-gateway/add">
              Create gateway
            </Button>
            <Button variant="outline" icon="fas fa-book" href="#">
              Read the docs
            </Button>
          </div>
        </div>

        {/* Feature row */}
        <div className="grid grid-cols-3 gap-[16px] mb-[32px]">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-[12px] card-shadow p-[20px]">
              <div className="w-[36px] h-[36px] rounded-[8px] bg-[#eef4fe] flex items-center justify-center mb-[12px]">
                <FaIcon icon={f.icon} className="text-[15px] text-[#1870c6]" ariaLabel="" />
              </div>
              <h3 className="text-[14px] font-semibold text-[#243342] mb-[6px]">{f.title}</h3>
              <p className="text-[12px] text-[#687a8b] leading-[1.6]">{f.description}</p>
            </div>
          ))}
        </div>

        {/* Quick start snippet */}
        <div className="bg-white rounded-[12px] card-shadow overflow-hidden">
          <div className="px-[20px] py-[14px] border-b border-[#f3f4f5] flex items-center justify-between">
            <div>
              <h3 className="text-[14px] font-semibold text-[#243342]">What it looks like</h3>
              <p className="text-[12px] text-[#687a8b] mt-[2px]">
                Once you create a gateway, you'll get an endpoint and an API key. Drop them into any OpenAI-compatible SDK.
              </p>
            </div>
          </div>
          <pre className="bg-[#04223e] text-[#e2e8f0] text-[12px] font-mono leading-[1.7] px-[20px] py-[16px] overflow-x-auto">
{`curl https://ai-gw-<your-gateway>.b-cdn.net/v1/chat/completions \\
  -H "Authorization: Bearer $BUNNY_AI_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "openai/gpt-4o-mini",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`}
          </pre>
        </div>
      </div>
    </>
  );
}
