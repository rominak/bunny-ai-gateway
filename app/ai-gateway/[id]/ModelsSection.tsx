'use client';

import { useState } from 'react';
import FaIcon from '@/app/components/FaIcon';

type Category = 'Flagship' | 'Balanced' | 'Fast' | 'Reasoning' | 'Embedding';

interface Model {
  id: string;
  label: string;
  category: Category;
  inputPer1M: number;
  cachedInputPer1M: number | null;
  outputPer1M: number | null;
  context: string;
}

const MODELS: Model[] = [
  { id: 'openai/gpt-4o',                       label: 'GPT-4o',                  category: 'Flagship',  inputPer1M: 2.50,  cachedInputPer1M: 1.25,  outputPer1M: 10.00, context: '128K' },
  { id: 'openai/gpt-4o-mini',                  label: 'GPT-4o mini',             category: 'Fast',      inputPer1M: 0.15,  cachedInputPer1M: 0.075, outputPer1M: 0.60,  context: '128K' },
  { id: 'openai/gpt-4.1',                      label: 'GPT-4.1',                 category: 'Flagship',  inputPer1M: 2.00,  cachedInputPer1M: 1.00,  outputPer1M: 8.00,  context: '1M'   },
  { id: 'openai/gpt-4.1-mini',                 label: 'GPT-4.1 mini',            category: 'Fast',      inputPer1M: 0.40,  cachedInputPer1M: 0.10,  outputPer1M: 1.60,  context: '1M'   },
  { id: 'openai/gpt-4.1-nano',                 label: 'GPT-4.1 nano',            category: 'Fast',      inputPer1M: 0.10,  cachedInputPer1M: 0.025, outputPer1M: 0.40,  context: '1M'   },
  { id: 'openai/gpt-5-nano',                   label: 'GPT-5 nano',              category: 'Fast',      inputPer1M: 1.10,  cachedInputPer1M: null,  outputPer1M: 4.40,  context: '128K' },
  { id: 'openai/o1-mini',                      label: 'o1 mini',                 category: 'Reasoning', inputPer1M: 1.10,  cachedInputPer1M: null,  outputPer1M: 4.40,  context: '128K' },
  { id: 'text-embedding-3-small',              label: 'text-embedding-3-small',  category: 'Embedding', inputPer1M: 0.02,  cachedInputPer1M: null,  outputPer1M: null,  context: '8K'   },
  { id: 'text-embedding-3-large',              label: 'text-embedding-3-large',  category: 'Embedding', inputPer1M: 0.13,  cachedInputPer1M: null,  outputPer1M: null,  context: '8K'   },
  { id: 'anthropic/claude-opus-4',             label: 'Claude Opus 4',           category: 'Flagship',  inputPer1M: 15.00, cachedInputPer1M: 1.50,  outputPer1M: 75.00, context: '200K' },
  { id: 'anthropic/claude-sonnet-4-5',         label: 'Claude Sonnet 4.5',       category: 'Balanced',  inputPer1M: 3.00,  cachedInputPer1M: 0.30,  outputPer1M: 15.00, context: '200K' },
  { id: 'anthropic/claude-sonnet-4',           label: 'Claude Sonnet 4',         category: 'Balanced',  inputPer1M: 3.00,  cachedInputPer1M: 0.30,  outputPer1M: 15.00, context: '200K' },
  { id: 'anthropic/claude-haiku-4-5',          label: 'Claude Haiku 4.5',        category: 'Fast',      inputPer1M: 0.80,  cachedInputPer1M: 0.08,  outputPer1M: 4.00,  context: '200K' },
  { id: 'anthropic/claude-3-5-sonnet',         label: 'Claude 3.5 Sonnet',       category: 'Balanced',  inputPer1M: 3.00,  cachedInputPer1M: 0.30,  outputPer1M: 15.00, context: '200K' },
  { id: 'anthropic/claude-3-5-haiku',          label: 'Claude 3.5 Haiku',        category: 'Fast',      inputPer1M: 0.80,  cachedInputPer1M: 0.08,  outputPer1M: 4.00,  context: '200K' },
  { id: 'google/gemini-2.5-pro',               label: 'Gemini 2.5 Pro',          category: 'Flagship',  inputPer1M: 1.25,  cachedInputPer1M: null,  outputPer1M: 10.00, context: '1M'   },
  { id: 'google/gemini-2.5-flash',             label: 'Gemini 2.5 Flash',        category: 'Fast',      inputPer1M: 0.15,  cachedInputPer1M: null,  outputPer1M: 0.60,  context: '1M'   },
  { id: 'google/gemini-2.0-flash',             label: 'Gemini 2.0 Flash',        category: 'Fast',      inputPer1M: 0.10,  cachedInputPer1M: null,  outputPer1M: 0.40,  context: '1M'   },
  { id: 'meta-llama/llama-3.3-70b-instruct',   label: 'Llama 3.3 70B',           category: 'Balanced',  inputPer1M: 0.59,  cachedInputPer1M: null,  outputPer1M: 0.79,  context: '128K' },
  { id: 'meta-llama/llama-3.1-8b-instruct',    label: 'Llama 3.1 8B',            category: 'Fast',      inputPer1M: 0.05,  cachedInputPer1M: null,  outputPer1M: 0.05,  context: '128K' },
  { id: 'mistralai/mistral-large',             label: 'Mistral Large',           category: 'Flagship',  inputPer1M: 2.00,  cachedInputPer1M: null,  outputPer1M: 6.00,  context: '128K' },
  { id: 'mistralai/mistral-small',             label: 'Mistral Small',           category: 'Fast',      inputPer1M: 0.10,  cachedInputPer1M: null,  outputPer1M: 0.30,  context: '32K'  },
  { id: 'deepseek/deepseek-r1',                label: 'DeepSeek R1',             category: 'Reasoning', inputPer1M: 0.55,  cachedInputPer1M: null,  outputPer1M: 2.19,  context: '164K' },
  { id: 'deepseek/deepseek-chat',              label: 'DeepSeek V3',             category: 'Balanced',  inputPer1M: 0.27,  cachedInputPer1M: null,  outputPer1M: 1.10,  context: '64K'  },
  { id: 'qwen/qwen-2.5-72b-instruct',          label: 'Qwen 2.5 72B',            category: 'Balanced',  inputPer1M: 0.40,  cachedInputPer1M: null,  outputPer1M: 0.40,  context: '128K' },
];

const CATEGORY_STYLES: Record<Category, string> = {
  Flagship:  'bg-[#eef4fe] text-[#1870c6]',
  Balanced:  'bg-[#f5f3ff] text-[#7c3aed]',
  Fast:      'bg-[#f0fdf4] text-[#16a34a]',
  Reasoning: 'bg-[#fffbeb] text-[#d97706]',
  Embedding: 'bg-[#f3f4f5] text-[#687a8b]',
};

const FILTERS: Array<Category | 'All'> = ['All', 'Flagship', 'Balanced', 'Fast', 'Reasoning', 'Embedding'];

function fmt(n: number | null): string {
  if (n === null) return '—';
  return `$${n % 1 === 0 ? n.toFixed(2) : n % 0.1 === 0 ? n.toFixed(2) : n % 0.01 === 0 ? n.toFixed(2) : n.toString()}`;
}

export default function ModelsSection() {
  const [filter, setFilter] = useState<Category | 'All'>('All');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [endpointCopied, setEndpointCopied] = useState(false);

  const visible = MODELS.filter((m) => {
    if (filter !== 'All' && m.category !== filter) return false;
    if (search && !m.id.toLowerCase().includes(search.toLowerCase()) && !m.label.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText('GET https://gateway.b-cdn.net/v1/models').catch(() => {});
    setEndpointCopied(true);
    setTimeout(() => setEndpointCopied(false), 1800);
  };

  return (
    <>
      {/* Endpoint bar */}
      <div className="bg-white rounded-[10px] card-shadow border border-[#e6e9ec] px-[16px] py-[12px] mb-[20px] flex items-center justify-between">
        <div className="flex items-center gap-[10px]">
          <span className="inline-flex items-center h-[20px] px-[7px] rounded-[4px] text-[10px] font-bold bg-[#eef4fe] text-[#1870c6] tracking-wider">GET</span>
          <code className="text-[13px] text-[#687a8b] font-mono">
            https://gateway.b-cdn.net/v1/<span className="text-[#243342] font-semibold">models</span>
          </code>
        </div>
        <div className="flex items-center gap-[12px]">
          <span className="text-[12px] text-[#9ba7b2]">{MODELS.length} models</span>
          <button
            onClick={handleCopyEndpoint}
            className={`flex items-center gap-[5px] text-[12px] transition-colors ${
              endpointCopied ? 'text-[#16a34a]' : 'text-[#1870c6] hover:underline'
            }`}
          >
            <FaIcon icon={endpointCopied ? 'fas fa-check' : 'fas fa-copy'} className="text-[11px]" ariaLabel="Copy" />
          </button>
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex items-center gap-[12px] mb-[16px]">
        <div className="relative flex-1 max-w-[320px]">
          <div className="absolute left-[12px] top-1/2 -translate-y-1/2 pointer-events-none">
            <FaIcon icon="fas fa-magnifying-glass" className="text-[12px] text-[#9ba7b2]" ariaLabel="Search" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search models…"
            className="w-full h-[34px] pl-[32px] pr-[12px] text-[13px] text-[#243342] border border-[#e6e9ec] rounded-[8px] outline-none focus:border-[#1870c6] placeholder:text-[#9ba7b2] bg-white"
          />
        </div>
        <div className="flex items-center gap-[4px]">
          {FILTERS.map((f) => {
            const count = f === 'All' ? MODELS.length : MODELS.filter(m => m.category === f).length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`h-[34px] px-[12px] rounded-[8px] text-[12px] font-medium transition-colors ${
                  filter === f
                    ? 'bg-[#243342] text-white'
                    : 'bg-white border border-[#e6e9ec] text-[#687a8b] hover:border-[#c4cdd5] hover:text-[#243342]'
                }`}
              >
                {f} <span className={`ml-[4px] text-[11px] ${filter === f ? 'opacity-60' : 'text-[#9ba7b2]'}`}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[10px] card-shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#f3f4f5]">
              <th className="text-left px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Model</th>
              <th className="text-left px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Category</th>
              <th className="text-right px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Input / 1M</th>
              <th className="text-right px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Cached input / 1M</th>
              <th className="text-right px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Output / 1M</th>
              <th className="text-right px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Context</th>
              <th className="w-[48px]" />
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <td colSpan={7} className="px-[20px] py-[40px] text-center text-[13px] text-[#9ba7b2]">
                  No models match your search
                </td>
              </tr>
            )}
            {visible.map((m) => (
              <tr key={m.id} className="border-t border-[#f3f4f5] hover:bg-[#fafbfc] group">
                <td className="px-[20px] py-[11px]">
                  <p className="text-[13px] font-semibold text-[#243342]">{m.label}</p>
                  <code className="text-[11px] text-[#9ba7b2] font-mono">{m.id}</code>
                </td>
                <td className="px-[20px] py-[11px]">
                  <span className={`inline-flex items-center h-[20px] px-[8px] rounded-[4px] text-[11px] font-medium ${CATEGORY_STYLES[m.category]}`}>
                    {m.category}
                  </span>
                </td>
                <td className="px-[20px] py-[11px] text-[13px] text-[#243342] text-right font-medium">{fmt(m.inputPer1M)}</td>
                <td className="px-[20px] py-[11px] text-[13px] text-right">
                  <span className={m.cachedInputPer1M === null ? 'text-[#9ba7b2]' : 'text-[#243342] font-medium'}>
                    {fmt(m.cachedInputPer1M)}
                  </span>
                </td>
                <td className="px-[20px] py-[11px] text-[13px] text-right">
                  <span className={m.outputPer1M === null ? 'text-[#9ba7b2]' : 'text-[#243342] font-medium'}>
                    {fmt(m.outputPer1M)}
                  </span>
                </td>
                <td className="px-[20px] py-[11px] text-[13px] text-[#687a8b] text-right">{m.context}</td>
                <td className="px-[20px] py-[11px] text-right">
                  <button
                    onClick={() => handleCopyId(m.id)}
                    title="Copy model ID"
                    className={`opacity-0 group-hover:opacity-100 transition-all w-[28px] h-[28px] rounded-[6px] flex items-center justify-center ${
                      copiedId === m.id
                        ? 'bg-[#f0fdf4] text-[#16a34a]'
                        : 'bg-[#f3f4f5] text-[#687a8b] hover:bg-[#e6e9ec] hover:text-[#243342]'
                    }`}
                  >
                    <FaIcon icon={copiedId === m.id ? 'fas fa-check' : 'fas fa-copy'} className="text-[11px]" ariaLabel="Copy ID" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="px-[20px] py-[12px] border-t border-[#f3f4f5] flex items-center justify-between">
          <p className="text-[12px] text-[#9ba7b2]">
            {visible.length === MODELS.length
              ? `${MODELS.length} models`
              : `${visible.length} of ${MODELS.length} models`}
          </p>
          <p className="text-[12px] text-[#9ba7b2]">
            Prices shown are Bunny AI Gateway prices · Updated March 2026
          </p>
        </div>
      </div>
    </>
  );
}
