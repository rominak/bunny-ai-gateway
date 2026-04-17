'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import FaIcon from '../../components/FaIcon';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';

// ---------------------------------------------------------------------------
// Toggle
// ---------------------------------------------------------------------------

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      style={{ background: enabled ? '#1870c6' : '#c4cdd5' }}
      className="relative w-[44px] h-[24px] rounded-full transition-colors flex-shrink-0 focus:outline-none"
    >
      <span
        style={{ left: enabled ? '23px' : '3px' }}
        className="absolute top-[3px] w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-all duration-200"
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Shared success screen
// ---------------------------------------------------------------------------

type SuccessProps = {
  name: string;
  budgetEnabled: boolean;
  budget: string;
  cacheEnabled: boolean;
  onAddAnother: () => void;
};

function SuccessScreen({ name, budgetEnabled, budget, cacheEnabled, onAddAnother }: SuccessProps) {
  const router = useRouter();
  const gatewayEndpoint = `https://ai-gw-${name.toLowerCase().replace(/[^a-z0-9-]/g, '-')}.b-cdn.net/v1`;
  const curlSnippet = `curl ${gatewayEndpoint}/chat/completions \\
  -H "Authorization: Bearer $BUNNY_AI_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"openai/gpt-4o-mini","messages":[{"role":"user","content":"Hello!"}]}'`;

  return (
    <div className="w-full max-w-[960px] mx-auto">
      <div className="flex items-center gap-[8px] mb-[20px] text-[13px]">
        <Link href="/ai-gateway" className="text-[#1870c6] hover:underline">AI Gateway</Link>
        <FaIcon icon="fas fa-chevron-right" className="text-[10px] text-[#9ba7b2]" ariaLabel="" />
        <span className="text-[#687a8b]">Create gateway</span>
      </div>

      <div className="bg-[#f0fdf4] border border-[#86efac] rounded-[12px] p-[24px] mb-[20px] flex items-start gap-[16px]">
        <div className="w-[40px] h-[40px] rounded-full bg-[#16a34a] flex items-center justify-center flex-shrink-0">
          <FaIcon icon="fas fa-check" className="text-[18px] text-white" ariaLabel="Success" />
        </div>
        <div>
          <h1 className="text-[20px] font-semibold text-[#14532d] mb-[4px]">
            Gateway <span className="font-bold">{name}</span> created!
          </h1>
          <p className="text-[14px] text-[#166534]">
            Your gateway is ready. Create an API key to start routing requests.
          </p>
        </div>
      </div>

      {/* Endpoint */}
      <div className="bg-white rounded-[12px] card-shadow p-[24px] mb-[20px]">
        <h2 className="text-[16px] font-semibold text-[#243342] mb-[4px]">Gateway endpoint</h2>
        <p className="text-[13px] text-[#687a8b] mb-[14px]">
          OpenAI-compatible. Drop this base URL into any SDK — no other changes needed.
        </p>
        <div className="flex items-center justify-between p-[14px] bg-[#f8f9fa] rounded-[8px] mb-[20px]">
          <code className="text-[13px] font-mono text-[#243342]">{gatewayEndpoint}</code>
          <button
            onClick={() => navigator.clipboard.writeText(gatewayEndpoint)}
            className="flex items-center gap-[6px] px-[10px] py-[5px] rounded-[6px] border border-[#e6e9ec] text-[12px] font-medium text-[#1870c6] hover:bg-[#eef4fe] transition-colors flex-shrink-0 ml-[12px]"
          >
            <FaIcon icon="fas fa-copy" className="text-[10px]" ariaLabel="Copy" />
            Copy
          </button>
        </div>

        <h3 className="text-[14px] font-semibold text-[#243342] mb-[8px]">Quick start</h3>
        <div className="relative">
          <pre className="bg-[#1e2836] text-[#e2e8f0] rounded-[8px] p-[16px] text-[12px] font-mono leading-[1.6] overflow-x-auto whitespace-pre">
{curlSnippet}
          </pre>
          <button
            onClick={() => navigator.clipboard.writeText(curlSnippet)}
            className="absolute top-[10px] right-[10px] flex items-center gap-[4px] px-[8px] py-[4px] rounded-[4px] bg-white/10 hover:bg-white/20 text-white text-[11px] transition-colors"
          >
            <FaIcon icon="fas fa-copy" className="text-[9px]" ariaLabel="Copy" />
            Copy
          </button>
        </div>
      </div>

      {/* Config summary */}
      <div className="bg-white rounded-[12px] card-shadow p-[24px] mb-[24px]">
        <h2 className="text-[16px] font-semibold text-[#243342] mb-[16px]">Configuration</h2>
        <div className="grid grid-cols-2 gap-[16px]">
          <div>
            <p className="text-[11px] text-[#9ba7b2] uppercase tracking-wide mb-[4px]">Models available</p>
            <p className="text-[14px] text-[#243342] font-medium">21+ models</p>
          </div>
          <div>
            <p className="text-[11px] text-[#9ba7b2] uppercase tracking-wide mb-[4px]">Caching</p>
            <p className="text-[14px] text-[#243342] font-medium">{cacheEnabled ? 'Enabled' : 'Disabled'}</p>
          </div>
          <div>
            <p className="text-[11px] text-[#9ba7b2] uppercase tracking-wide mb-[4px]">Monthly budget</p>
            <p className="text-[14px] text-[#243342] font-medium">
              {budgetEnabled ? `$${Number(budget).toLocaleString()}` : 'No limit'}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-[#9ba7b2] uppercase tracking-wide mb-[4px]">Next step</p>
            <p className="text-[14px] text-[#1870c6] font-medium">Create an API key →</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.push('/ai-gateway')}>View all gateways</Button>
        <div className="flex items-center gap-[12px]">
          <Button variant="ghost" onClick={onAddAnother}>Add another</Button>
          <Button variant="cta" onClick={() => router.push('/ai-gateway')}>Go to gateway</Button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Flow V1 — detailed form
// ---------------------------------------------------------------------------

function FlowV1() {
  const [name, setName] = useState('');
  const [cacheEnabled, setCacheEnabled] = useState(true);
  const [budgetEnabled, setBudgetEnabled] = useState(false);
  const [budget, setBudget] = useState('500');
  const [rpmEnabled, setRpmEnabled] = useState(false);
  const [rpm, setRpm] = useState('1000');
  const [nameError, setNameError] = useState('');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const endpoint = name.trim()
    ? `https://ai-gw-${name.toLowerCase().replace(/[^a-z0-9-]/g, '-')}.b-cdn.net/v1`
    : null;

  const validate = () => {
    if (!name.trim()) { setNameError('Name is required'); return false; }
    if (!/^[a-z0-9-]+$/i.test(name.trim())) { setNameError('Only lowercase letters, numbers, and hyphens'); return false; }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    if (validate()) setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <SuccessScreen
        name={name} budgetEnabled={budgetEnabled} budget={budget} cacheEnabled={cacheEnabled}
        onAddAnother={() => {
          setShowSuccess(false); setName(''); setCacheEnabled(true);
          setBudgetEnabled(false); setBudget('500'); setRpmEnabled(false); setRpm('1000');
          setNameError(''); setHasAttemptedSubmit(false);
        }}
      />
    );
  }

  return (
    <div className="w-full max-w-[960px] mx-auto">
      <Link href="/ai-gateway" className="flex items-center gap-[8px] text-[13px] text-[#687a8b] hover:text-[#243342] mb-[20px] transition-colors">
        <FaIcon icon="fas fa-arrow-left" className="text-[12px]" ariaLabel="Back" />
        AI Gateway
      </Link>

      <div className="mb-[28px]">
        <h1 className="text-[24px] font-semibold text-[#ff6b35] mb-[8px]">Add AI gateway</h1>
        <p className="text-[14px] text-[#687a8b] leading-[1.6] max-w-[560px]">
          A gateway is your dedicated endpoint for routing AI requests. All available models are accessible through it — no provider setup needed.
        </p>
      </div>

      <form onSubmit={handleSubmit}>

        {/* Name */}
        <div className="bg-white rounded-[12px] card-shadow p-[24px] mb-[20px]">
          <h2 className="text-[16px] font-semibold text-[#243342] mb-[20px]">Gateway details</h2>
          <Input
            label="Name" required value={name}
            onChange={(e) => { setName(e.target.value); if (nameError) setNameError(''); }}
            placeholder="my-gateway"
            error={hasAttemptedSubmit ? nameError : undefined}
            hint={!hasAttemptedSubmit || !nameError ? 'Lowercase letters, numbers, and hyphens only' : undefined}
          />
          {endpoint && (
            <div className="mt-[10px] flex items-center gap-[8px] px-[12px] py-[8px] bg-[#f8f9fa] rounded-[8px]">
              <FaIcon icon="fas fa-link" className="text-[11px] text-[#9ba7b2]" ariaLabel="Endpoint" />
              <code className="text-[12px] font-mono text-[#687a8b]">{endpoint}</code>
            </div>
          )}
        </div>

        {/* Caching */}
        <div className="bg-white rounded-[12px] card-shadow p-[24px] mb-[20px]">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[16px] font-semibold text-[#243342]">Semantic caching</h2>
              <p className="text-[13px] text-[#687a8b] mt-[4px] max-w-[500px]">
                Identical or semantically similar prompts return cached responses — reducing latency and cost.
              </p>
            </div>
            <Toggle enabled={cacheEnabled} onChange={() => setCacheEnabled(!cacheEnabled)} />
          </div>
        </div>

        {/* Budget */}
        <div className="bg-white rounded-[12px] card-shadow p-[24px] mb-[20px]">
          <div className="flex items-start justify-between mb-[4px]">
            <div>
              <h2 className="text-[16px] font-semibold text-[#243342]">Monthly spend limit</h2>
              <p className="text-[13px] text-[#687a8b] mt-[4px]">Pause traffic automatically when the monthly limit is reached.</p>
            </div>
            <Toggle enabled={budgetEnabled} onChange={() => setBudgetEnabled(!budgetEnabled)} />
          </div>
          {budgetEnabled && (
            <div className="mt-[16px] pt-[16px] border-t border-[#f3f4f5]">
              <Input
                label="Budget (USD / month)" type="number" value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="500" leftIcon="fas fa-dollar-sign"
                hint="Gateway traffic will be paused once this amount is reached"
              />
            </div>
          )}
        </div>

        {/* Rate limit */}
        <div className="bg-white rounded-[12px] card-shadow p-[24px] mb-[20px]">
          <div className="flex items-start justify-between mb-[4px]">
            <div>
              <h2 className="text-[16px] font-semibold text-[#243342]">Rate limit</h2>
              <p className="text-[13px] text-[#687a8b] mt-[4px]">Cap the number of requests per minute across all API keys on this gateway.</p>
            </div>
            <Toggle enabled={rpmEnabled} onChange={() => setRpmEnabled(!rpmEnabled)} />
          </div>
          {rpmEnabled && (
            <div className="mt-[16px] pt-[16px] border-t border-[#f3f4f5]">
              <Input
                label="Requests per minute (RPM)" type="number" value={rpm}
                onChange={(e) => setRpm(e.target.value)}
                placeholder="1000"
                hint="Individual API keys can have lower limits set at key creation"
              />
            </div>
          )}
        </div>

        {/* Models info pill */}
        <div className="flex items-center gap-[10px] px-[16px] py-[12px] bg-white rounded-[10px] card-shadow mb-[24px]">
          <FaIcon icon="fas fa-cube" className="text-[14px] text-[#1870c6]" ariaLabel="Models" />
          <p className="text-[13px] text-[#687a8b]">
            All available models and pricing are accessible from the{' '}
            <span className="font-medium text-[#243342]">Models</span> tab after gateway creation.
          </p>
        </div>

        <div className="flex items-center justify-end gap-[12px]">
          <Button variant="outline" href="/ai-gateway">Cancel</Button>
          <Button variant="cta" type="submit" disabled={!name.trim()}>Create gateway</Button>
        </div>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Flow V2 — minimal
// ---------------------------------------------------------------------------

function FlowV2() {
  const [name, setName] = useState('');
  const [budgetEnabled, setBudgetEnabled] = useState(false);
  const [budget, setBudget] = useState('');
  const [nameError, setNameError] = useState('');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const slugName = name.toLowerCase().replace(/[^a-z0-9-]/g, '-');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    if (!name.trim()) { setNameError('Name is required'); return; }
    if (!/^[a-z0-9-]+$/i.test(name.trim())) { setNameError('Only lowercase letters, numbers, and hyphens'); return; }
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <SuccessScreen
        name={name} budgetEnabled={budgetEnabled} budget={budget} cacheEnabled={true}
        onAddAnother={() => {
          setShowSuccess(false); setName(''); setBudgetEnabled(false);
          setBudget(''); setNameError(''); setHasAttemptedSubmit(false);
        }}
      />
    );
  }

  return (
    <div className="w-full max-w-[960px] mx-auto">
      <Link href="/ai-gateway" className="flex items-center gap-[8px] text-[13px] text-[#687a8b] hover:text-[#243342] mb-[32px] transition-colors">
        <FaIcon icon="fas fa-arrow-left" className="text-[12px]" ariaLabel="Back" />
        AI Gateway
      </Link>

      <h1 className="text-[22px] font-semibold text-[#243342] mb-[4px]">Create a gateway</h1>
      <p className="text-[14px] text-[#687a8b] mb-[28px]">
        You'll get an OpenAI-compatible endpoint with access to 21+ models. No provider setup needed.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-[12px] border border-[#e6e9ec] overflow-hidden">

          {/* Name */}
          <div className="px-[24px] py-[20px]">
            <label className="text-[13px] font-medium text-[#243342] block mb-[8px]">
              Gateway name <span className="text-[#dc2626]">*</span>
            </label>
            <input
              type="text" value={name}
              onChange={(e) => { setName(e.target.value); if (nameError) setNameError(''); }}
              placeholder="my-gateway"
              className={`w-full h-[40px] px-[12px] rounded-[8px] border text-[14px] text-[#243342] placeholder-[#c4cdd5] focus:outline-none transition-all ${
                hasAttemptedSubmit && nameError
                  ? 'border-[#dc2626]'
                  : 'border-[#e6e9ec] hover:border-[#c4cdd5] focus:border-[#243342] focus:shadow-[0_0_0_3px_rgba(36,51,66,0.08)]'
              }`}
            />
            {hasAttemptedSubmit && nameError && (
              <p className="mt-[6px] text-[12px] text-[#dc2626]">{nameError}</p>
            )}
            {name.trim() && !nameError && (
              <p className="mt-[6px] text-[12px] text-[#9ba7b2] font-mono truncate">
                ai-gw-{slugName}.b-cdn.net/v1
              </p>
            )}
          </div>

          <div className="h-px bg-[#f3f4f5]" />

          {/* Budget */}
          <div className="px-[24px] py-[18px]">
            <div className="flex items-center justify-between mb-[2px]">
              <div>
                <p className="text-[13px] font-medium text-[#243342]">Monthly spend limit</p>
                <p className="text-[12px] text-[#9ba7b2] mt-[1px]">Pause traffic when reached</p>
              </div>
              <Toggle enabled={budgetEnabled} onChange={() => setBudgetEnabled(!budgetEnabled)} />
            </div>
            {budgetEnabled && (
              <div className="mt-[12px] flex items-center gap-[8px]">
                <span className="text-[14px] text-[#687a8b]">$</span>
                <input
                  type="number" value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="500"
                  className="flex-1 h-[38px] px-[12px] rounded-[8px] border border-[#e6e9ec] text-[14px] text-[#243342] focus:outline-none focus:border-[#243342] focus:shadow-[0_0_0_3px_rgba(36,51,66,0.08)]"
                />
                <span className="text-[13px] text-[#9ba7b2]">/ month</span>
              </div>
            )}
          </div>

          <div className="h-px bg-[#f3f4f5]" />

          {/* Footer */}
          <div className="px-[24px] py-[16px] flex items-center justify-between bg-[#fafbfc]">
            <Link href="/ai-gateway" className="text-[13px] text-[#687a8b] hover:text-[#243342] transition-colors">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={!name.trim()}
              className={`h-[36px] px-[20px] rounded-[8px] text-[13px] font-semibold transition-all ${
                name.trim()
                  ? 'bg-[#243342] text-white hover:bg-[#1a2530]'
                  : 'bg-[#e6e9ec] text-[#9ba7b2] cursor-not-allowed'
              }`}
            >
              Create gateway
            </button>
          </div>
        </div>

        {/* Model count hint */}
        <p className="mt-[12px] text-center text-[12px] text-[#9ba7b2]">
          21+ models available · pricing at{' '}
          <span className="font-mono">GET /v1/models</span>
        </p>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page shell
// ---------------------------------------------------------------------------

function AddGatewayContent() {
  const searchParams = useSearchParams();
  const variant = searchParams.get('v') ?? '1';

  return (
    <div className="flex flex-col items-center">
      {variant === '2' ? <FlowV2 /> : <FlowV1 />}
    </div>
  );
}

export default function AddGatewayPage() {
  return (
    <Suspense>
      <AddGatewayContent />
    </Suspense>
  );
}
