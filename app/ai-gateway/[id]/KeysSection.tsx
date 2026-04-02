'use client';

import { useState } from 'react';
import FaIcon from '@/app/components/FaIcon';
import Button from '@/app/components/shared/Button';

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

type Step = 'idle' | 'form' | 'reveal';

export default function KeysSection({ step, onStepChange }: { step: Step; onStepChange: (s: Step) => void }) {
  const setStep = onStepChange;
  const [keyName, setKeyName] = useState('');
  const [keyBudget, setKeyBudget] = useState('');
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

  const handleDone = () => {
    setStep('idle');
    setKeyName('');
    setKeyBudget('');
    setRevealedKey('');
    setCopied(false);
    setConfirmed(false);
  };

  // ── Key reveal screen ──────────────────────────────────────────────────────
  if (step === 'reveal') {
    return (
      <div className="max-w-[640px]">
        {/* Header */}
        <div className="flex items-center gap-[12px] mb-[28px]">
          <div className="w-[44px] h-[44px] rounded-full bg-[#eef4fe] flex items-center justify-center flex-shrink-0">
            <FaIcon icon="fas fa-key" className="text-[20px] text-[#1870c6]" ariaLabel="API key" />
          </div>
          <div>
            <h2 className="text-[18px] font-semibold text-[#243342]">Your API key is ready</h2>
            <p className="text-[13px] text-[#687a8b]">
              Key created for <span className="font-medium text-[#243342]">{keyName}</span>
            </p>
          </div>
        </div>

        {/* Warning banner */}
        <div className="flex items-start gap-[10px] bg-[#fffbeb] border border-[#fde68a] rounded-[10px] px-[16px] py-[12px] mb-[16px]">
          <FaIcon icon="fas fa-triangle-exclamation" className="text-[14px] text-[#d97706] mt-[1px] flex-shrink-0" ariaLabel="Warning" />
          <p className="text-[13px] text-[#92400e] leading-[1.5]">
            <span className="font-semibold">This key will not be shown again.</span>{' '}
            Copy it now and store it somewhere safe — a password manager, environment variable, or secrets vault. If you lose it you'll need to create a new one.
          </p>
        </div>

        {/* Key display */}
        <div className="bg-[#04223e] rounded-[10px] overflow-hidden mb-[20px]">
          <div className="flex items-center justify-between px-[16px] py-[12px] border-b border-[#1a3a54]">
            <span className="text-[11px] text-[#8899a8] uppercase tracking-wider">API Key</span>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-[6px] px-[10px] py-[5px] rounded-[6px] text-[12px] font-medium transition-all ${
                copied
                  ? 'bg-[#16a34a]/20 text-[#4ade80]'
                  : 'bg-[#1a3a54] text-[#8899a8] hover:bg-[#243d52] hover:text-white'
              }`}
            >
              <FaIcon icon={copied ? 'fas fa-check' : 'fas fa-copy'} className="text-[11px]" ariaLabel="Copy" />
              {copied ? 'Copied!' : 'Copy key'}
            </button>
          </div>
          <div className="px-[16px] py-[14px]">
            <code className="text-[13px] text-[#4ade80] font-mono break-all leading-[1.6] select-all">
              {revealedKey}
            </code>
          </div>
        </div>

        {/* Quick start snippet */}
        <div className="bg-[#fafbfc] border border-[#e6e9ec] rounded-[10px] p-[16px] mb-[20px]">
          <p className="text-[12px] font-semibold text-[#243342] mb-[8px] uppercase tracking-wide">Quick start</p>
          <pre className="text-[12px] text-[#687a8b] font-mono whitespace-pre overflow-x-auto leading-[1.7]">{`BUNNY_AI_KEY="${revealedKey.slice(0, 28)}..."

curl https://gateway.b-cdn.net/v1/chat/completions \\
  -H "Authorization: Bearer $BUNNY_AI_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"openai/gpt-4o-mini","messages":[{"role":"user","content":"Hello"}]}'`}</pre>
        </div>

        {/* Confirmation checkbox */}
        <label className="flex items-center gap-[10px] cursor-pointer mb-[20px] select-none">
          <div
            onClick={() => setConfirmed(!confirmed)}
            className={`w-[18px] h-[18px] rounded-[4px] flex-shrink-0 flex items-center justify-center border transition-colors cursor-pointer ${
              confirmed ? 'bg-[#1870c6] border-[#1870c6]' : 'bg-white border-[#c4cdd5] hover:border-[#1870c6]'
            }`}
          >
            {confirmed && <FaIcon icon="fas fa-check" className="text-[9px] text-white" ariaLabel="" />}
          </div>
          <span className="text-[13px] text-[#243342]">
            I have copied my API key and stored it securely
          </span>
        </label>

        <div className="flex items-center gap-[10px]">
          <Button
            variant="cta"
            onClick={handleDone}
            disabled={!confirmed}
          >
            Done — go to key list
          </Button>
          {!copied && (
            <button
              onClick={handleCopy}
              className="text-[13px] text-[#1870c6] hover:underline"
            >
              Copy key first
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Create form ─────────────────────────────────────────────────────────────
  return (
    <>

      {step === 'form' && (
        <div className="bg-white rounded-[10px] card-shadow p-[24px] mb-[20px]">
          <h3 className="text-[16px] font-semibold text-[#243342] mb-[4px]">New API key</h3>
          <p className="text-[13px] text-[#687a8b] mb-[20px]">
            The full key is shown <span className="font-medium text-[#243342]">once only</span> after creation.
          </p>

          <div className="max-w-[480px] space-y-[16px]">
            {/* Name */}
            <div>
              <label className="block text-[12px] font-medium text-[#243342] mb-[6px]">
                Key name <span className="text-[#dc2626]">*</span>
              </label>
              <input
                type="text"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="e.g. Production App, Staging, My Agent"
                className="w-full h-[40px] px-[12px] text-[14px] text-[#243342] border border-[#cdd3d8] rounded-[8px] outline-none focus:border-[#1870c6] transition-colors placeholder:text-[#9ba7b2]"
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block text-[12px] font-medium text-[#243342] mb-[6px]">
                Monthly budget <span className="text-[#9ba7b2] font-normal">(optional)</span>
              </label>
              <div className="flex items-center border border-[#cdd3d8] rounded-[8px] overflow-hidden focus-within:border-[#1870c6] transition-colors">
                <span className="px-[12px] py-[8px] bg-[#f3f4f5] text-[14px] text-[#687a8b] border-r border-[#cdd3d8]">$</span>
                <input
                  type="number"
                  value={keyBudget}
                  onChange={(e) => setKeyBudget(e.target.value)}
                  placeholder="No limit"
                  className="flex-1 h-[40px] px-[12px] text-[14px] text-[#243342] outline-none placeholder:text-[#9ba7b2]"
                />
                <span className="px-[12px] text-[13px] text-[#9ba7b2]">/ month</span>
              </div>
              <p className="text-[11px] text-[#9ba7b2] mt-[4px]">Requests will be rejected when this key's budget is reached</p>
            </div>

            <div className="flex items-center gap-[8px] pt-[4px]">
              <Button variant="primary" size="sm" onClick={handleCreate} disabled={!keyName.trim()}>
                Create key
              </Button>
              <Button variant="outline" size="sm" onClick={() => setStep('idle')}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Keys table */}
      <div className="bg-white rounded-[10px] card-shadow">
        <div className="px-[20px] py-[16px] border-b border-[#f3f4f5]">
          <div className="flex items-center gap-[12px]">
            <h3 className="text-[14px] font-bold text-[#243342]">
              {mockKeys.filter(k => k.status === 'active').length} active keys
            </h3>
            <span className="text-[12px] text-[#9ba7b2]">·  {mockKeys.filter(k => k.status === 'revoked').length} revoked</span>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#f3f4f5]">
              <th className="text-left px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Name</th>
              <th className="text-left px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Key</th>
              <th className="text-left px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Created</th>
              <th className="text-left px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Last used</th>
              <th className="text-right px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Budget</th>
              <th className="text-right px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Requests</th>
              <th className="text-right px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Spend</th>
              <th className="text-right px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockKeys.map((k) => (
              <tr key={k.id} className="border-t border-[#f3f4f5] hover:bg-[#fafbfc] group">
                <td className="px-[20px] py-[12px] text-[13px] font-medium text-[#243342]">{k.name}</td>
                <td className="px-[20px] py-[12px] text-[13px] text-[#687a8b] font-mono">{k.key}</td>
                <td className="px-[20px] py-[12px] text-[13px] text-[#687a8b]">{k.created}</td>
                <td className="px-[20px] py-[12px] text-[13px] text-[#687a8b]">{k.lastUsed}</td>
                <td className="px-[20px] py-[12px] text-[13px] text-[#687a8b] text-right">{k.budget ?? 'No limit'}</td>
                <td className="px-[20px] py-[12px] text-[13px] text-[#243342] text-right">{k.requests}</td>
                <td className="px-[20px] py-[12px] text-[13px] font-medium text-[#243342] text-right">{k.spend}</td>
                <td className="px-[20px] py-[12px] text-right">
                  <div className="flex items-center justify-end gap-[8px]">
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
                    <button className="p-[6px] rounded hover:bg-[#f3f4f5] transition-colors" aria-label="More">
                      <FaIcon icon="fas fa-ellipsis" className="text-[12px] text-[#9ba7b2]" ariaLabel="Menu" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
