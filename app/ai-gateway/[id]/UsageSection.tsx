'use client';

import { useState, useRef, useEffect } from 'react';
import FaIcon from '@/app/components/FaIcon';

// ── API key definitions for filter ──────────────────────────────────────────

type KeyFilter = 'all' | string;

const apiKeys = [
  { id: 'all', name: 'All keys', key: '' },
  { id: 'prod',   name: 'Production App',       key: 'bny_sk_prod_****7f3a' },
  { id: 'stage',  name: 'Staging',              key: 'bny_sk_stag_****2b1c' },
  { id: 'dev',    name: 'Dev / Local',          key: 'bny_sk_dev_****9e4d' },
  { id: 'ios',    name: 'Mobile App (iOS)',      key: 'bny_sk_mobi_****c3f1' },
  { id: 'android',name: 'Mobile App (Android)', key: 'bny_sk_andr_****d4e2' },
  { id: 'intl',   name: 'Internal Tools',       key: 'bny_sk_intl_****e5f3' },
  { id: 'pipe',   name: 'Data Pipeline',        key: 'bny_sk_pipe_****f6a4' },
  { id: 'qa',     name: 'QA Automation',        key: 'bny_sk_qa___****a7b5' },
  { id: 'partner',name: 'Partner API',          key: 'bny_sk_part_****b8c6' },
];

const keyWeights: Record<string, number> = {
  prod:    0.31,
  stage:   0.055,
  dev:     0.034,
  ios:     0.108,
  android: 0.099,
  intl:    0.015,
  pipe:    0.28,
  qa:      0.006,
  partner: 0.023,
};

function scaleData<T extends { value: number }>(data: T[], keyId: KeyFilter): T[] {
  if (keyId === 'all') return data;
  const w = keyWeights[keyId] ?? 0.1;
  const jitter = [0.92, 1.06, 0.98, 1.03, 0.95, 1.08, 0.97, 1.01, 0.94, 1.05, 0.99, 1.02];
  return data.map((d, i) => ({ ...d, value: Math.round(d.value * w * (jitter[i % jitter.length])) }));
}

function scaleLatency(data: { label: string; p50: number; p95: number; p99: number }[], keyId: KeyFilter) {
  if (keyId === 'all') return data;
  const latencyOffsets: Record<string, number> = {
    prod: 1.0, stage: 1.12, dev: 1.25, ios: 1.18, android: 1.2,
    intl: 0.85, pipe: 0.72, qa: 1.3, partner: 1.1,
  };
  const m = latencyOffsets[keyId] ?? 1.0;
  return data.map(d => ({
    label: d.label,
    p50: Math.round(d.p50 * m),
    p95: Math.round(d.p95 * m),
    p99: Math.round(d.p99 * m),
  }));
}

// Mock data
const timeRanges = ['24h', '7d', '30d', '90d'] as const;
type TimeRange = typeof timeRanges[number];

const requestVolumeData: Record<TimeRange, { label: string; value: number }[]> = {
  '24h': [
    { label: '00:00', value: 4200 },
    { label: '02:00', value: 2800 },
    { label: '04:00', value: 1900 },
    { label: '06:00', value: 3400 },
    { label: '08:00', value: 12800 },
    { label: '10:00', value: 18400 },
    { label: '12:00', value: 16200 },
    { label: '14:00', value: 19100 },
    { label: '16:00', value: 17600 },
    { label: '18:00', value: 14300 },
    { label: '20:00', value: 9800 },
    { label: '22:00', value: 6100 },
  ],
  '7d': [
    { label: 'Mon', value: 145000 },
    { label: 'Tue', value: 189000 },
    { label: 'Wed', value: 210000 },
    { label: 'Thu', value: 178000 },
    { label: 'Fri', value: 195000 },
    { label: 'Sat', value: 142000 },
    { label: 'Sun', value: 181000 },
  ],
  '30d': [
    { label: 'Mar 1', value: 162000 },
    { label: 'Mar 4', value: 178000 },
    { label: 'Mar 7', value: 195000 },
    { label: 'Mar 10', value: 188000 },
    { label: 'Mar 13', value: 204000 },
    { label: 'Mar 16', value: 215000 },
    { label: 'Mar 19', value: 198000 },
    { label: 'Mar 22', value: 224000 },
    { label: 'Mar 25', value: 231000 },
    { label: 'Mar 28', value: 219000 },
    { label: 'Mar 31', value: 240000 },
  ],
  '90d': [
    { label: 'Jan', value: 3200000 },
    { label: 'Feb', value: 4100000 },
    { label: 'Mar', value: 5800000 },
  ],
};

const spendData: Record<TimeRange, { label: string; value: number }[]> = {
  '24h': [
    { label: '00:00', value: 12 },
    { label: '02:00', value: 8 },
    { label: '04:00', value: 5 },
    { label: '06:00', value: 11 },
    { label: '08:00', value: 42 },
    { label: '10:00', value: 58 },
    { label: '12:00', value: 52 },
    { label: '14:00', value: 61 },
    { label: '16:00', value: 54 },
    { label: '18:00', value: 44 },
    { label: '20:00', value: 29 },
    { label: '22:00', value: 18 },
  ],
  '7d': [
    { label: 'Mon', value: 380 },
    { label: 'Tue', value: 420 },
    { label: 'Wed', value: 460 },
    { label: 'Thu', value: 410 },
    { label: 'Fri', value: 440 },
    { label: 'Sat', value: 350 },
    { label: 'Sun', value: 387 },
  ],
  '30d': [
    { label: 'Mar 1', value: 340 },
    { label: 'Mar 4', value: 380 },
    { label: 'Mar 7', value: 420 },
    { label: 'Mar 10', value: 395 },
    { label: 'Mar 13', value: 440 },
    { label: 'Mar 16', value: 465 },
    { label: 'Mar 19', value: 430 },
    { label: 'Mar 22', value: 490 },
    { label: 'Mar 25', value: 510 },
    { label: 'Mar 28', value: 475 },
    { label: 'Mar 31', value: 520 },
  ],
  '90d': [
    { label: 'Jan', value: 8400 },
    { label: 'Feb', value: 10200 },
    { label: 'Mar', value: 14100 },
  ],
};

const cacheHitData: Record<TimeRange, { label: string; value: number }[]> = {
  '24h': [
    { label: '00:00', value: 28 },
    { label: '04:00', value: 25 },
    { label: '08:00', value: 32 },
    { label: '12:00', value: 38 },
    { label: '16:00', value: 41 },
    { label: '20:00', value: 35 },
  ],
  '7d': [
    { label: 'Mon', value: 28 },
    { label: 'Tue', value: 31 },
    { label: 'Wed', value: 34 },
    { label: 'Thu', value: 33 },
    { label: 'Fri', value: 36 },
    { label: 'Sat', value: 38 },
    { label: 'Sun', value: 34 },
  ],
  '30d': [
    { label: 'Mar 1', value: 22 },
    { label: 'Mar 5', value: 25 },
    { label: 'Mar 9', value: 28 },
    { label: 'Mar 13', value: 30 },
    { label: 'Mar 17', value: 33 },
    { label: 'Mar 21', value: 35 },
    { label: 'Mar 25', value: 36 },
    { label: 'Mar 29', value: 38 },
  ],
  '90d': [
    { label: 'Jan', value: 18 },
    { label: 'Feb', value: 26 },
    { label: 'Mar', value: 34 },
  ],
};

const summaryCards: Record<TimeRange, { label: string; value: string; change: string; up: boolean; icon: string }[]> = {
  '24h': [
    { label: 'Total requests', value: '126.6K', change: '+12.3%', up: true, icon: 'fas fa-arrow-right-arrow-left' },
    { label: 'Total tokens', value: '4.8M', change: '+8.7%', up: true, icon: 'fas fa-microchip' },
    { label: 'Total spend', value: '$394', change: '-3.1%', up: false, icon: 'fas fa-wallet' },
    { label: 'Avg latency', value: '342ms', change: '-18ms', up: false, icon: 'fas fa-bolt' },
  ],
  '7d': [
    { label: 'Total requests', value: '1.24M', change: '+18.4%', up: true, icon: 'fas fa-arrow-right-arrow-left' },
    { label: 'Total tokens', value: '53.3M', change: '+14.2%', up: true, icon: 'fas fa-microchip' },
    { label: 'Total spend', value: '$2,847', change: '+6.8%', up: true, icon: 'fas fa-wallet' },
    { label: 'Avg latency', value: '358ms', change: '-24ms', up: false, icon: 'fas fa-bolt' },
  ],
  '30d': [
    { label: 'Total requests', value: '5.86M', change: '+42.1%', up: true, icon: 'fas fa-arrow-right-arrow-left' },
    { label: 'Total tokens', value: '248.7M', change: '+38.5%', up: true, icon: 'fas fa-microchip' },
    { label: 'Total spend', value: '$12,420', change: '+22.4%', up: true, icon: 'fas fa-wallet' },
    { label: 'Avg latency', value: '365ms', change: '-42ms', up: false, icon: 'fas fa-bolt' },
  ],
  '90d': [
    { label: 'Total requests', value: '13.1M', change: '+128%', up: true, icon: 'fas fa-arrow-right-arrow-left' },
    { label: 'Total tokens', value: '584.2M', change: '+96.3%', up: true, icon: 'fas fa-microchip' },
    { label: 'Total spend', value: '$32,700', change: '+64.1%', up: true, icon: 'fas fa-wallet' },
    { label: 'Avg latency', value: '382ms', change: '-68ms', up: false, icon: 'fas fa-bolt' },
  ],
};

const tokensByModel = [
  { model: 'claude-sonnet-4.6', provider: 'Anthropic', input: '12.4M', output: '8.2M', total: '20.6M', cost: '$1,108', pct: 38.9, requests: '482K', avgLatency: '340ms', errorRate: '0.02%' },
  { model: 'gpt-4o-mini', provider: 'OpenAI', input: '8.1M', output: '5.4M', total: '13.5M', cost: '$624', pct: 25.2, requests: '312K', avgLatency: '280ms', errorRate: '0.05%' },
  { model: 'gemini-2.0-flash', provider: 'Google', input: '5.2M', output: '3.1M', total: '8.3M', cost: '$396', pct: 16.0, requests: '198K', avgLatency: '220ms', errorRate: '0.08%' },
  { model: 'claude-haiku-4.5', provider: 'Anthropic', input: '4.1M', output: '2.8M', total: '6.9M', cost: '$312', pct: 12.6, requests: '156K', avgLatency: '180ms', errorRate: '0.01%' },
  { model: 'gpt-4o', provider: 'OpenAI', input: '2.4M', output: '1.6M', total: '4.0M', cost: '$407', pct: 7.3, requests: '91K', avgLatency: '420ms', errorRate: '0.04%' },
];

const providerDistribution = [
  { provider: 'Anthropic', pct: 51.5, color: '#1870c6', requests: '638K', spend: '$1,420', models: 2 },
  { provider: 'OpenAI', pct: 32.5, color: '#243342', requests: '403K', spend: '$1,031', models: 2 },
  { provider: 'Google', pct: 16.0, color: '#f59e0b', requests: '198K', spend: '$396', models: 1 },
];

const latencyPercentiles: Record<TimeRange, { label: string; p50: number; p95: number; p99: number }[]> = {
  '24h': [
    { label: '00:00', p50: 310, p95: 680, p99: 1200 },
    { label: '04:00', p50: 290, p95: 620, p99: 1050 },
    { label: '08:00', p50: 340, p95: 780, p99: 1400 },
    { label: '12:00', p50: 360, p95: 820, p99: 1520 },
    { label: '16:00', p50: 350, p95: 790, p99: 1480 },
    { label: '20:00', p50: 320, p95: 710, p99: 1250 },
  ],
  '7d': [
    { label: 'Mon', p50: 320, p95: 720, p99: 1300 },
    { label: 'Tue', p50: 340, p95: 780, p99: 1400 },
    { label: 'Wed', p50: 360, p95: 810, p99: 1450 },
    { label: 'Thu', p50: 350, p95: 790, p99: 1420 },
    { label: 'Fri', p50: 345, p95: 770, p99: 1380 },
    { label: 'Sat', p50: 310, p95: 680, p99: 1200 },
    { label: 'Sun', p50: 330, p95: 740, p99: 1340 },
  ],
  '30d': [
    { label: 'Mar 1', p50: 380, p95: 860, p99: 1600 },
    { label: 'Mar 8', p50: 365, p95: 820, p99: 1520 },
    { label: 'Mar 15', p50: 350, p95: 790, p99: 1450 },
    { label: 'Mar 22', p50: 340, p95: 760, p99: 1380 },
    { label: 'Mar 29', p50: 330, p95: 740, p99: 1340 },
  ],
  '90d': [
    { label: 'Jan', p50: 410, p95: 920, p99: 1800 },
    { label: 'Feb', p50: 380, p95: 850, p99: 1600 },
    { label: 'Mar', p50: 342, p95: 760, p99: 1400 },
  ],
};

const errorsByType = [
  { code: '429', label: 'Rate limited', count: 3842, pct: 48.2, color: '#f59e0b' },
  { code: '503', label: 'Service unavailable', count: 1924, pct: 24.1, color: '#ef4444' },
  { code: '500', label: 'Internal server error', count: 1204, pct: 15.1, color: '#dc2626' },
  { code: '408', label: 'Request timeout', count: 682, pct: 8.6, color: '#9333ea' },
  { code: '401', label: 'Auth failure', count: 320, pct: 4.0, color: '#687a8b' },
];

const topEndpoints = [
  { path: '/v1/chat/completions', method: 'POST', requests: '892K', avgLatency: '348ms', errorRate: '0.06%', pct: 72.0 },
  { path: '/v1/embeddings', method: 'POST', requests: '218K', avgLatency: '120ms', errorRate: '0.02%', pct: 17.6 },
  { path: '/v1/completions', method: 'POST', requests: '86K', avgLatency: '410ms', errorRate: '0.09%', pct: 6.9 },
  { path: '/v1/images/generations', method: 'POST', requests: '28K', avgLatency: '2.4s', errorRate: '0.14%', pct: 2.3 },
  { path: '/v1/audio/transcriptions', method: 'POST', requests: '16K', avgLatency: '1.8s', errorRate: '0.11%', pct: 1.3 },
];

const peakHours = [
  { hour: '09:00', requests: 18200, pct: 100 },
  { hour: '14:00', requests: 19100, pct: 100 },
  { hour: '10:00', requests: 18400, pct: 96 },
  { hour: '15:00', requests: 17800, pct: 93 },
  { hour: '16:00', requests: 17600, pct: 92 },
  { hour: '11:00', requests: 16900, pct: 88 },
  { hour: '13:00', requests: 16500, pct: 86 },
  { hour: '17:00', requests: 15200, pct: 80 },
];

const abTest = {
  active: true,
  name: 'Claude Sonnet 4.5 vs GPT-4o',
  started: 'Mar 20, 2026',
  totalRequests: 24300,
  models: [
    { model: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5', weight: 70, requests: 17010, pct: 70, avgLatency: '340ms', costPer1K: '$2.43', totalCost: '$612', inputTokens: '8.2M', outputTokens: '5.4M' },
    { model: 'gpt-4o',            label: 'GPT-4o',            weight: 30, requests: 7290,  pct: 30, avgLatency: '420ms', costPer1K: '$4.06', totalCost: '$296', inputTokens: '3.4M', outputTokens: '2.1M' },
  ],
};

const failoverTimeline = [
  { time: 'Mar 25, 14:23', from: 'OpenAI', to: 'Anthropic', model: 'gpt-4o', duration: '320ms', reason: 'Provider timeout (>5s)' },
  { time: 'Mar 25, 09:11', from: 'Google', to: 'OpenAI', model: 'gemini-2.0-flash', duration: '180ms', reason: '503 Service Unavailable' },
  { time: 'Mar 24, 22:45', from: 'OpenAI', to: 'Anthropic', model: 'gpt-4o-mini', duration: '450ms', reason: 'Rate limit exceeded (429)' },
  { time: 'Mar 24, 16:02', from: 'Anthropic', to: 'OpenAI', model: 'claude-sonnet-4.6', duration: '290ms', reason: 'Provider timeout (>5s)' },
  { time: 'Mar 23, 11:30', from: 'OpenAI', to: 'Google', model: 'gpt-4o', duration: '210ms', reason: '500 Internal Server Error' },
  { time: 'Mar 22, 19:45', from: 'Google', to: 'Anthropic', model: 'gemini-2.0-flash', duration: '340ms', reason: '503 Service Unavailable' },
  { time: 'Mar 22, 08:12', from: 'OpenAI', to: 'Anthropic', model: 'gpt-4o-mini', duration: '190ms', reason: 'Rate limit exceeded (429)' },
  { time: 'Mar 21, 15:33', from: 'Anthropic', to: 'Google', model: 'claude-haiku-4.5', duration: '260ms', reason: 'Provider timeout (>5s)' },
  { time: 'Mar 20, 23:08', from: 'OpenAI', to: 'Anthropic', model: 'gpt-4o', duration: '380ms', reason: '500 Internal Server Error' },
  { time: 'Mar 20, 14:17', from: 'Google', to: 'OpenAI', model: 'gemini-2.0-flash', duration: '150ms', reason: '429 Too Many Requests' },
  { time: 'Mar 19, 10:42', from: 'OpenAI', to: 'Google', model: 'gpt-4o-mini', duration: '220ms', reason: 'Provider timeout (>5s)' },
  { time: 'Mar 18, 07:55', from: 'Anthropic', to: 'OpenAI', model: 'claude-sonnet-4.6', duration: '310ms', reason: '503 Service Unavailable' },
];

let gradientIdCounter = 0;

function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';
  const d = [`M ${points[0].x} ${points[0].y}`];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];
    const tension = 0.3;
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;
    d.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`);
  }
  return d.join(' ');
}

function AreaChart({ data, color, format }: {
  data: { label: string; value: number }[];
  color: string;
  format: (v: number) => string;
}) {
  const W = 400;
  const H = 160;
  const pad = { top: 10, right: 10, bottom: 24, left: 44 };
  const pW = W - pad.left - pad.right;
  const pH = H - pad.top - pad.bottom;
  const max = Math.max(...data.map(d => d.value)) * 1.1;
  const gId = `areaGrad-${gradientIdCounter++}`;

  const points = data.map((d, i) => ({
    x: pad.left + (i / (data.length - 1)) * pW,
    y: pad.top + pH - (d.value / max) * pH,
    ...d,
  }));

  const line = smoothPath(points);
  const area = `${line} L ${points[points.length - 1].x} ${pad.top + pH} L ${points[0].x} ${pad.top + pH} Z`;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
      <defs>
        <linearGradient id={gId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
        const y = pad.top + pH - pct * pH;
        return (
          <g key={pct}>
            <line x1={pad.left} x2={W - pad.right} y1={y} y2={y} stroke="#eef0f2" strokeDasharray={pct === 0 ? undefined : '3 3'} />
            {(pct === 0 || pct === 0.5 || pct === 1) && (
              <text x={pad.left - 8} y={y + 4} textAnchor="end" className="text-[9px] fill-[#9ba7b2]">{format(Math.round(max * pct))}</text>
            )}
          </g>
        );
      })}
      <path d={area} fill={`url(#${gId})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p) => (
        <text key={p.label + 'l'} x={p.x} y={H - 4} textAnchor="middle" className="text-[9px] fill-[#9ba7b2]">{p.label}</text>
      ))}
    </svg>
  );
}

function MultiLineChart({ data, colors, labels, format }: {
  data: { label: string; [key: string]: number | string }[];
  colors: string[];
  labels: string[];
  format: (v: number) => string;
}) {
  const W = 400;
  const H = 160;
  const pad = { top: 10, right: 10, bottom: 24, left: 44 };
  const pW = W - pad.left - pad.right;
  const pH = H - pad.top - pad.bottom;

  const allValues = data.flatMap(d => labels.map(l => d[l] as number));
  const max = Math.max(...allValues) * 1.1;
  const gId = `mlGrad-${gradientIdCounter++}`;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
      <defs>
        <linearGradient id={gId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors[0]} stopOpacity="0.12" />
          <stop offset="100%" stopColor={colors[0]} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
        const y = pad.top + pH - pct * pH;
        return (
          <g key={pct}>
            <line x1={pad.left} x2={W - pad.right} y1={y} y2={y} stroke="#eef0f2" strokeDasharray={pct === 0 ? undefined : '3 3'} />
            {(pct === 0 || pct === 0.5 || pct === 1) && (
              <text x={pad.left - 8} y={y + 4} textAnchor="end" className="text-[9px] fill-[#9ba7b2]">{format(Math.round(max * pct))}</text>
            )}
          </g>
        );
      })}
      {/* Fill under primary line only */}
      {(() => {
        const pts = data.map((d, i) => ({
          x: pad.left + (i / (data.length - 1)) * pW,
          y: pad.top + pH - ((d[labels[0]] as number) / max) * pH,
        }));
        const line = smoothPath(pts);
        const area = `${line} L ${pts[pts.length - 1].x} ${pad.top + pH} L ${pts[0].x} ${pad.top + pH} Z`;
        return <path d={area} fill={`url(#${gId})`} />;
      })()}
      {labels.map((key, li) => {
        const points = data.map((d, i) => ({
          x: pad.left + (i / (data.length - 1)) * pW,
          y: pad.top + pH - ((d[key] as number) / max) * pH,
        }));
        const line = smoothPath(points);
        return (
          <path key={key} d={line} fill="none" stroke={colors[li]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        );
      })}
      {data.map((d, i) => (
        <text key={i} x={pad.left + (i / (data.length - 1)) * pW} y={H - 4} textAnchor="middle" className="text-[9px] fill-[#9ba7b2]">{d.label}</text>
      ))}
    </svg>
  );
}

function DonutChart({ segments }: { segments: { pct: number; color: string }[] }) {
  const size = 120;
  const cx = size / 2;
  const cy = size / 2;
  const r = 44;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f5" strokeWidth={strokeWidth} />
      {segments.map((seg, i) => {
        const dash = (seg.pct / 100) * circumference;
        const gap = circumference - dash;
        const currentOffset = offset;
        offset += dash;
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-currentOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
      })}
    </svg>
  );
}

function KeyFilterDropdown({ value, onChange }: { value: KeyFilter; onChange: (v: KeyFilter) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = apiKeys.find(k => k.id === value) ?? apiKeys[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-[8px] h-[34px] pl-[10px] pr-[8px] rounded-[8px] text-[12px] font-medium transition-colors border ${
          value !== 'all'
            ? 'bg-[#eef4fe] border-[#1870c6]/30 text-[#1870c6]'
            : 'bg-white border-[#e6e9ec] text-[#243342] hover:border-[#c4cdd5]'
        }`}
      >
        <FaIcon icon="fas fa-key" className="text-[10px] text-[#9ba7b2]" ariaLabel="" />
        <span className="max-w-[140px] truncate">{selected.name}</span>
        <FaIcon icon="fas fa-chevron-down" className={`text-[9px] transition-transform ${open ? 'rotate-180' : ''} ${value !== 'all' ? 'text-[#1870c6]' : 'text-[#9ba7b2]'}`} ariaLabel="" />
      </button>
      {open && (
        <div className="absolute right-0 top-[40px] w-[240px] bg-white rounded-[10px] card-shadow border border-[#e6e9ec] py-[6px] z-50">
          {apiKeys.map((k) => (
            <button
              key={k.id}
              onClick={() => { onChange(k.id); setOpen(false); }}
              className={`w-full px-[14px] py-[8px] flex items-center gap-[10px] text-left transition-colors ${
                value === k.id ? 'bg-[#eef4fe]' : 'hover:bg-[#fafbfc]'
              }`}
            >
              <span className={`w-[6px] h-[6px] rounded-full flex-shrink-0 ${k.id === 'all' ? 'bg-[#9ba7b2]' : 'bg-[#16a34a]'}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] truncate ${value === k.id ? 'font-medium text-[#1870c6]' : 'text-[#243342]'}`}>{k.name}</p>
                {k.key && <p className="text-[10px] text-[#9ba7b2] font-mono truncate">{k.key}</p>}
              </div>
              {value === k.id && <FaIcon icon="fas fa-check" className="text-[11px] text-[#1870c6] flex-shrink-0" ariaLabel="" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function UsageSection() {
  const [range, setRange] = useState<TimeRange>('7d');
  const [keyFilter, setKeyFilter] = useState<KeyFilter>('all');

  const cards = summaryCards[range].map(c => {
    if (keyFilter === 'all') return c;
    const w = keyWeights[keyFilter] ?? 0.1;
    if (c.label === 'Avg latency') {
      const latencyOffsets: Record<string, number> = {
        prod: 1.0, stage: 1.12, dev: 1.25, ios: 1.18, android: 1.2,
        intl: 0.85, pipe: 0.72, qa: 1.3, partner: 1.1,
      };
      const m = latencyOffsets[keyFilter] ?? 1.0;
      const base = parseInt(c.value);
      return { ...c, value: `${Math.round(base * m)}ms` };
    }
    const raw = c.value.replace(/[,$%]/g, '');
    const hasM = c.value.includes('M');
    const hasK = c.value.includes('K');
    const hasDollar = c.value.startsWith('$');
    let num = parseFloat(raw);
    if (hasM) num *= 1000000;
    else if (hasK) num *= 1000;
    const scaled = num * w;
    let formatted: string;
    if (scaled >= 1000000) formatted = `${(scaled / 1000000).toFixed(2)}M`;
    else if (scaled >= 1000) formatted = `${(scaled / 1000).toFixed(1)}K`;
    else formatted = String(Math.round(scaled));
    if (hasDollar) formatted = `$${formatted}`;
    return { ...c, value: formatted };
  });

  return (
    <>
      {/* Filters row */}
      <div className="flex items-center justify-end gap-[10px] mb-[20px]">
        <KeyFilterDropdown value={keyFilter} onChange={setKeyFilter} />
        <div className="flex items-center gap-[4px] bg-white rounded-[8px] card-shadow p-[4px]">
          {timeRanges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-[12px] py-[6px] rounded-[6px] text-[12px] font-medium transition-colors ${
                range === r ? 'bg-[#243342] text-white' : 'text-[#687a8b] hover:bg-[#f3f4f5]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Active filter indicator */}
      {keyFilter !== 'all' && (
        <div className="flex items-center gap-[10px] mb-[16px] px-[14px] py-[10px] bg-[#eef4fe] border border-[#1870c6]/20 rounded-[10px]">
          <FaIcon icon="fas fa-filter" className="text-[11px] text-[#1870c6]" ariaLabel="" />
          <p className="text-[12px] text-[#1870c6]">
            Filtered by <span className="font-semibold">{apiKeys.find(k => k.id === keyFilter)?.name}</span>
          </p>
          <button
            onClick={() => setKeyFilter('all')}
            className="ml-auto text-[11px] text-[#1870c6] hover:underline flex items-center gap-[4px]"
          >
            <FaIcon icon="fas fa-xmark" className="text-[10px]" ariaLabel="" />
            Clear
          </button>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-[12px] mb-[20px]">
        {cards.map((s) => (
          <div key={s.label} className="bg-white rounded-[10px] card-shadow p-[16px]">
            <div className="flex items-center gap-[12px] mb-[8px]">
              <div className="w-[32px] h-[32px] rounded-[8px] bg-[#eef4fe] flex items-center justify-center">
                <FaIcon icon={s.icon} className="text-[14px] text-[#1870c6]" ariaLabel={s.label} />
              </div>
              <p className="text-[11px] text-[#9ba7b2] uppercase tracking-wider">{s.label}</p>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-[22px] font-bold text-[#243342]">{s.value}</p>
              <span className={`text-[12px] font-medium ${s.label === 'Avg latency' ? (s.up ? 'text-[#ef4444]' : 'text-[#16a34a]') : (s.up ? 'text-[#16a34a]' : 'text-[#ef4444]')}`}>
                {s.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row 1: Requests + Spend */}
      <div className="grid grid-cols-2 gap-[16px] mb-[16px]">
        <div className="bg-white rounded-[10px] card-shadow p-[20px]">
          <h3 className="text-[14px] font-bold text-[#243342] mb-[2px]">Request volume</h3>
          <p className="text-[12px] text-[#687a8b] mb-[12px]">Total requests per {range === '24h' ? 'hour' : range === '90d' ? 'month' : 'day'}</p>
          <AreaChart
            data={scaleData(requestVolumeData[range], keyFilter)}
            color="#1870c6"
            format={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : `${Math.round(v / 1000)}K`}
          />
        </div>

        <div className="bg-white rounded-[10px] card-shadow p-[20px]">
          <h3 className="text-[14px] font-bold text-[#243342] mb-[2px]">Daily spend</h3>
          <p className="text-[12px] text-[#687a8b] mb-[12px]">Cost across all providers</p>
          <AreaChart
            data={scaleData(spendData[range], keyFilter)}
            color="#16a34a"
            format={(v) => v >= 1000 ? `$${(v / 1000).toFixed(1)}K` : `$${v}`}
          />
        </div>
      </div>

      {/* Charts row 2: Latency percentiles + Cache hit rate */}
      <div className="grid grid-cols-2 gap-[16px] mb-[16px]">
        <div className="bg-white rounded-[10px] card-shadow p-[20px]">
          <div className="flex items-center justify-between mb-[12px]">
            <div>
              <h3 className="text-[14px] font-bold text-[#243342] mb-[2px]">Response latency</h3>
              <p className="text-[12px] text-[#687a8b]">Percentile distribution over time</p>
            </div>
            <div className="flex items-center gap-[12px]">
              <span className="flex items-center gap-[4px] text-[10px] text-[#687a8b]">
                <span className="w-[12px] h-[2px] bg-[#1870c6] rounded" /> p50
              </span>
              <span className="flex items-center gap-[4px] text-[10px] text-[#687a8b]">
                <span className="w-[12px] h-[2px] bg-[#f59e0b] rounded" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #f59e0b 0 4px, transparent 4px 7px)' }} /> p95
              </span>
              <span className="flex items-center gap-[4px] text-[10px] text-[#687a8b]">
                <span className="w-[12px] h-[2px] bg-[#ef4444] rounded" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #ef4444 0 4px, transparent 4px 7px)' }} /> p99
              </span>
            </div>
          </div>
          <MultiLineChart
            data={scaleLatency(latencyPercentiles[range], keyFilter).map(d => ({ label: d.label, p50: d.p50, p95: d.p95, p99: d.p99 }))}
            colors={['#1870c6', '#f59e0b', '#ef4444']}
            labels={['p50', 'p95', 'p99']}
            format={(v) => `${v}ms`}
          />
        </div>

        <div className="bg-white rounded-[10px] card-shadow p-[20px]">
          <h3 className="text-[14px] font-bold text-[#243342] mb-[2px]">Cache hit rate</h3>
          <p className="text-[12px] text-[#687a8b] mb-[12px]">Percentage of requests served from cache</p>
          <AreaChart
            data={keyFilter === 'all' ? cacheHitData[range] : cacheHitData[range].map((d, i) => {
              const offsets: Record<string, number> = { prod: 2, stage: -3, dev: -8, ios: 5, android: 4, intl: -2, pipe: 12, qa: -10, partner: 1 };
              return { ...d, value: Math.max(0, Math.min(100, d.value + (offsets[keyFilter] ?? 0) + (i % 2 === 0 ? 2 : -1))) };
            })}
            color="#f59e0b"
            format={(v) => `${v}%`}
          />
        </div>
      </div>

      {/* Provider distribution + Budget */}
      <div className="grid grid-cols-2 gap-[16px] mb-[20px]">
        <div className="bg-white rounded-[10px] card-shadow p-[20px]">
          <h3 className="text-[14px] font-bold text-[#243342] mb-[2px]">Provider distribution</h3>
          <p className="text-[12px] text-[#687a8b] mb-[16px]">Traffic split across AI providers</p>
          <div className="flex items-center gap-[24px]">
            <DonutChart segments={providerDistribution.map(p => ({ pct: p.pct, color: p.color }))} />
            <div className="flex-1 space-y-[12px]">
              {providerDistribution.map((p) => (
                <div key={p.provider}>
                  <div className="flex items-center justify-between mb-[4px]">
                    <div className="flex items-center gap-[8px]">
                      <span className="w-[8px] h-[8px] rounded-full" style={{ background: p.color }} />
                      <span className="text-[13px] font-medium text-[#243342]">{p.provider}</span>
                    </div>
                    <span className="text-[13px] font-bold text-[#243342]">{p.pct}%</span>
                  </div>
                  <div className="flex items-center gap-[12px] pl-[16px]">
                    <span className="text-[11px] text-[#9ba7b2]">{p.requests} req</span>
                    <span className="text-[11px] text-[#9ba7b2]">{p.spend}</span>
                    <span className="text-[11px] text-[#9ba7b2]">{p.models} models</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[10px] card-shadow p-[20px]">
          <h3 className="text-[14px] font-bold text-[#243342] mb-[2px]">Budget utilization</h3>
          <p className="text-[12px] text-[#687a8b] mb-[12px]">Current spend relative to your monthly budget</p>
          <div className="flex items-end gap-[24px] mt-[20px]">
            <div className="flex-1">
              <div className="flex items-baseline justify-between mb-[6px]">
                <span className="text-[24px] font-bold text-[#243342]">$2,847</span>
                <span className="text-[14px] text-[#687a8b]">of $5,000</span>
              </div>
              <div className="w-full h-[12px] bg-[#f3f4f5] rounded-full overflow-hidden">
                <div className="h-full bg-[#1870c6] rounded-full transition-all" style={{ width: '56.9%' }} />
              </div>
              <div className="flex justify-between mt-[6px]">
                <span className="text-[11px] text-[#687a8b]">56.9% used</span>
                <span className="text-[11px] text-[#687a8b]">$2,153 remaining</span>
              </div>
            </div>
          </div>
          <div className="mt-[16px] p-[12px] bg-[#fafbfc] rounded-[8px]">
            <p className="text-[12px] text-[#687a8b]">
              At current rate, projected month-end spend is <span className="font-semibold text-[#243342]">$4,280</span>. You are within budget.
            </p>
          </div>
        </div>
      </div>

      {/* Request routing by region */}
      <div className="bg-white rounded-[10px] card-shadow mb-[20px] p-[20px]">
        <div className="flex items-center justify-between mb-[16px]">
          <div>
            <h3 className="text-[14px] font-bold text-[#243342] mb-[2px]">Request routing by region</h3>
            <p className="text-[12px] text-[#687a8b]">Geographic distribution based on API-level routing headers</p>
          </div>
          <span className="inline-flex items-center gap-[6px] h-[24px] px-[10px] rounded-[6px] bg-[#eef4fe] text-[12px] font-medium text-[#1870c6]">
            <FaIcon icon="fas fa-shield" className="text-[10px]" ariaLabel="" />
            GDPR-compliant
          </span>
        </div>
        <div className="grid grid-cols-3 gap-[16px]">
          <div className="p-[16px] bg-[#fafbfc] rounded-[10px] border border-[#e6e9ec]">
            <div className="flex items-center gap-[8px] mb-[8px]">
              <span className="text-[16px]">🇪🇺</span>
              <p className="text-[13px] font-semibold text-[#243342]">EU regions</p>
            </div>
            <p className="text-[24px] font-bold text-[#1870c6]">38.4%</p>
            <p className="text-[11px] text-[#687a8b] mt-[2px]">476K requests · Frankfurt, Amsterdam</p>
            <div className="w-full h-[4px] bg-[#e6e9ec] rounded-full overflow-hidden mt-[8px]">
              <div className="h-full bg-[#1870c6] rounded-full" style={{ width: '38.4%' }} />
            </div>
          </div>
          <div className="p-[16px] bg-[#fafbfc] rounded-[10px] border border-[#e6e9ec]">
            <div className="flex items-center gap-[8px] mb-[8px]">
              <span className="text-[16px]">🇺🇸</span>
              <p className="text-[13px] font-semibold text-[#243342]">US regions</p>
            </div>
            <p className="text-[24px] font-bold text-[#243342]">52.1%</p>
            <p className="text-[11px] text-[#687a8b] mt-[2px]">646K requests · Virginia, Oregon</p>
            <div className="w-full h-[4px] bg-[#e6e9ec] rounded-full overflow-hidden mt-[8px]">
              <div className="h-full bg-[#243342] rounded-full" style={{ width: '52.1%' }} />
            </div>
          </div>
          <div className="p-[16px] bg-[#fafbfc] rounded-[10px] border border-[#e6e9ec]">
            <div className="flex items-center gap-[8px] mb-[8px]">
              <span className="text-[16px]">🌏</span>
              <p className="text-[13px] font-semibold text-[#243342]">Other regions</p>
            </div>
            <p className="text-[24px] font-bold text-[#687a8b]">9.5%</p>
            <p className="text-[11px] text-[#687a8b] mt-[2px]">118K requests · Singapore, Sydney</p>
            <div className="w-full h-[4px] bg-[#e6e9ec] rounded-full overflow-hidden mt-[8px]">
              <div className="h-full bg-[#9ba7b2] rounded-full" style={{ width: '9.5%' }} />
            </div>
          </div>
        </div>
        <p className="text-[11px] text-[#9ba7b2] mt-[12px]">
          EU routing is configured per-request via the <code className="text-[#687a8b] font-mono">x-gateway-region: eu</code> header. Bunny ensures EU-routed requests stay within European infrastructure.
        </p>
      </div>

      {/* Token usage by model */}
      <div className="bg-white rounded-[10px] card-shadow mb-[20px]">
        <div className="px-[20px] py-[16px]">
          <h3 className="text-[14px] font-bold text-[#243342]">Token usage by model</h3>
          <p className="text-[12px] text-[#687a8b]">Input and output token consumption per model</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-t border-[#f3f4f5]">
              <th className="text-left px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Model</th>
              <th className="text-left px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Provider</th>
              <th className="text-right px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Requests</th>
              <th className="text-right px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Input</th>
              <th className="text-right px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Output</th>
              <th className="text-right px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Avg latency</th>
              <th className="text-right px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Traffic</th>
              <th className="text-right px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Cost</th>
            </tr>
          </thead>
          <tbody>
            {tokensByModel.map((m) => (
              <tr key={m.model} className="border-t border-[#f3f4f5] hover:bg-[#fafbfc]">
                <td className="px-[20px] py-[12px] text-[13px] font-medium text-[#243342] font-mono">{m.model}</td>
                <td className="px-[20px] py-[12px] text-[13px] text-[#687a8b]">{m.provider}</td>
                <td className="px-[20px] py-[12px] text-[13px] text-[#687a8b] text-right">{m.requests}</td>
                <td className="px-[20px] py-[12px] text-[13px] text-[#687a8b] text-right">{m.input}</td>
                <td className="px-[20px] py-[12px] text-[13px] text-[#687a8b] text-right">{m.output}</td>
                <td className="px-[20px] py-[12px] text-[13px] text-[#687a8b] text-right">{m.avgLatency}</td>
                <td className="px-[20px] py-[12px] text-right">
                  <div className="flex items-center justify-end gap-[8px]">
                    <div className="w-[60px] h-[4px] bg-[#f3f4f5] rounded-full overflow-hidden">
                      <div className="h-full bg-[#1870c6] rounded-full" style={{ width: `${m.pct}%` }} />
                    </div>
                    <span className="text-[12px] text-[#687a8b] w-[36px] text-right">{m.pct}%</span>
                  </div>
                </td>
                <td className="px-[20px] py-[12px] text-[13px] font-semibold text-[#243342] text-right">{m.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top endpoints + Peak hours */}
      <div className="grid grid-cols-2 gap-[16px] mb-[20px]">
        <div className="bg-white rounded-[10px] card-shadow">
          <div className="px-[20px] py-[16px]">
            <h3 className="text-[14px] font-bold text-[#243342]">Top endpoints</h3>
            <p className="text-[12px] text-[#687a8b]">Most used API paths by request volume</p>
          </div>
          <div className="px-[20px] pb-[16px] space-y-[10px]">
            {topEndpoints.map((ep) => (
              <div key={ep.path}>
                <div className="flex items-center justify-between mb-[4px]">
                  <div className="flex items-center gap-[8px]">
                    <span className="inline-flex items-center h-[18px] px-[6px] rounded-[3px] text-[10px] font-bold bg-[#eef4fe] text-[#1870c6]">{ep.method}</span>
                    <span className="text-[13px] font-medium text-[#243342] font-mono">{ep.path}</span>
                  </div>
                  <span className="text-[12px] font-semibold text-[#243342]">{ep.requests}</span>
                </div>
                <div className="flex items-center gap-[8px]">
                  <div className="flex-1 h-[4px] bg-[#f3f4f5] rounded-full overflow-hidden">
                    <div className="h-full bg-[#1870c6] rounded-full" style={{ width: `${ep.pct}%` }} />
                  </div>
                  <span className="text-[11px] text-[#9ba7b2] w-[36px] text-right">{ep.pct}%</span>
                </div>
                <div className="flex items-center gap-[12px] mt-[2px]">
                  <span className="text-[11px] text-[#9ba7b2]">Avg {ep.avgLatency}</span>
                  <span className="text-[11px] text-[#9ba7b2]">Errors {ep.errorRate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[10px] card-shadow">
          <div className="px-[20px] py-[16px]">
            <h3 className="text-[14px] font-bold text-[#243342]">Peak hours</h3>
            <p className="text-[12px] text-[#687a8b]">Busiest hours in the last 24h</p>
          </div>
          <div className="px-[20px] pb-[16px] space-y-[8px]">
            {peakHours.map((h, i) => (
              <div key={h.hour} className="flex items-center gap-[12px]">
                <span className="text-[12px] text-[#687a8b] w-[40px] font-mono">{h.hour}</span>
                <div className="flex-1 h-[20px] bg-[#f3f4f5] rounded-[4px] overflow-hidden relative">
                  <div
                    className="h-full rounded-[4px] transition-all"
                    style={{
                      width: `${(h.requests / peakHours[0].requests) * 100}%`,
                      background: i < 3 ? '#1870c6' : '#93c5fd',
                    }}
                  />
                  <span className="absolute right-[8px] top-[2px] text-[11px] font-medium text-[#243342]">
                    {(h.requests / 1000).toFixed(1)}K
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Error breakdown */}
      <div className="bg-white rounded-[10px] card-shadow mb-[20px]">
        <div className="px-[20px] py-[16px] flex items-center justify-between">
          <div>
            <h3 className="text-[14px] font-bold text-[#243342]">Error breakdown</h3>
            <p className="text-[12px] text-[#687a8b]">Errors by HTTP status code (last 7 days)</p>
          </div>
          <div className="flex items-center gap-[6px]">
            <span className="text-[18px] font-bold text-[#243342]">7,972</span>
            <span className="text-[12px] text-[#687a8b]">total errors</span>
            <span className="text-[12px] text-[#9ba7b2] ml-[4px]">(0.64% error rate)</span>
          </div>
        </div>
        <div className="px-[20px] pb-[16px]">
          {/* Stacked bar */}
          <div className="flex h-[8px] rounded-full overflow-hidden mb-[16px]">
            {errorsByType.map((e) => (
              <div key={e.code} className="h-full" style={{ width: `${e.pct}%`, background: e.color }} />
            ))}
          </div>
          <div className="grid grid-cols-5 gap-[12px]">
            {errorsByType.map((e) => (
              <div key={e.code} className="text-center">
                <div className="flex items-center justify-center gap-[6px] mb-[4px]">
                  <span className="w-[8px] h-[8px] rounded-full" style={{ background: e.color }} />
                  <span className="text-[13px] font-bold text-[#243342]">{e.code}</span>
                </div>
                <p className="text-[11px] text-[#687a8b] mb-[2px]">{e.label}</p>
                <p className="text-[14px] font-semibold text-[#243342]">{e.count.toLocaleString()}</p>
                <p className="text-[11px] text-[#9ba7b2]">{e.pct}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* A/B test comparative metrics */}
      {abTest.active && (
        <div className="bg-white rounded-[10px] card-shadow mb-[20px]">
          <div className="px-[20px] py-[16px] flex items-center justify-between border-b border-[#f3f4f5]">
            <div className="flex items-center gap-[10px]">
              <div className="w-[32px] h-[32px] rounded-[8px] bg-[#eef4fe] flex items-center justify-center">
                <FaIcon icon="fas fa-flask" className="text-[14px] text-[#1870c6]" ariaLabel="A/B test" />
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-[#243342]">A/B Test: {abTest.name}</h3>
                <p className="text-[12px] text-[#687a8b]">Running since {abTest.started} · {abTest.totalRequests.toLocaleString()} total requests</p>
              </div>
            </div>
            <span className="inline-flex items-center h-[22px] px-[8px] rounded-[6px] text-[11px] font-semibold bg-[#1870c6] text-white">
              Running
            </span>
          </div>

          <div className="p-[20px] grid grid-cols-2 gap-[16px]">
            {abTest.models.map((m, i) => {
              const accent = i === 0 ? '#1870c6' : '#f59e0b';
              const bg = i === 0 ? 'bg-[#eef4fe]' : 'bg-[#fffbeb]';
              const winner = i === 0;
              return (
                <div key={m.model} className={`rounded-[10px] border-2 p-[16px] ${i === 0 ? 'border-[#1870c6]/30' : 'border-[#f59e0b]/30'}`}>
                  <div className="flex items-center justify-between mb-[14px]">
                    <div>
                      <div className="flex items-center gap-[8px]">
                        <span className={`inline-flex items-center h-[20px] px-[8px] rounded-[4px] text-[10px] font-bold ${bg}`} style={{ color: accent }}>
                          {m.weight}% traffic
                        </span>
                        {winner && (
                          <span className="inline-flex items-center gap-[4px] text-[11px] text-[#16a34a] font-medium">
                            <FaIcon icon="fas fa-circle-check" className="text-[10px]" ariaLabel="" />
                            Lower cost
                          </span>
                        )}
                      </div>
                      <p className="text-[15px] font-semibold text-[#243342] mt-[6px] font-mono">{m.label}</p>
                    </div>
                  </div>
                  <div className="mb-[14px]">
                    <div className="w-full h-[6px] bg-[#f3f4f5] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${m.pct}%`, background: accent }} />
                    </div>
                    <p className="text-[11px] text-[#9ba7b2] mt-[4px]">{m.requests.toLocaleString()} requests</p>
                  </div>
                  <div className="grid grid-cols-2 gap-[10px]">
                    <div className="p-[10px] bg-[#fafbfc] rounded-[8px]">
                      <p className="text-[10px] text-[#9ba7b2] uppercase tracking-wider mb-[2px]">Avg latency</p>
                      <p className="text-[16px] font-bold text-[#243342]">{m.avgLatency}</p>
                    </div>
                    <div className="p-[10px] bg-[#fafbfc] rounded-[8px]">
                      <p className="text-[10px] text-[#9ba7b2] uppercase tracking-wider mb-[2px]">Cost / 1K req</p>
                      <p className="text-[16px] font-bold text-[#243342]">{m.costPer1K}</p>
                    </div>
                    <div className="p-[10px] bg-[#fafbfc] rounded-[8px]">
                      <p className="text-[10px] text-[#9ba7b2] uppercase tracking-wider mb-[2px]">Total cost</p>
                      <p className="text-[16px] font-bold text-[#243342]">{m.totalCost}</p>
                    </div>
                    <div className="p-[10px] bg-[#fafbfc] rounded-[8px]">
                      <p className="text-[10px] text-[#9ba7b2] uppercase tracking-wider mb-[2px]">Output tokens</p>
                      <p className="text-[16px] font-bold text-[#243342]">{m.outputTokens}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="px-[20px] pb-[16px]">
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-[8px] px-[14px] py-[10px] flex items-center gap-[10px]">
              <FaIcon icon="fas fa-circle-info" className="text-[13px] text-[#16a34a] flex-shrink-0" ariaLabel="Insight" />
              <p className="text-[12px] text-[#16a34a]">
                <span className="font-semibold">Claude Sonnet 4.5</span> is 19% faster and 40% cheaper per request than GPT-4o in this test.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Failover events */}
      <div className="bg-white rounded-[10px] card-shadow">
        <div className="px-[20px] py-[16px] flex items-center justify-between">
          <div>
            <h3 className="text-[14px] font-bold text-[#243342]">Failover events</h3>
            <p className="text-[12px] text-[#687a8b]">Automatic provider switches triggered by outages or errors</p>
          </div>
          <span className="inline-flex items-center h-[22px] px-[8px] rounded-[4px] text-[11px] font-semibold bg-[#f0fdf4] text-[#16a34a]">
            {failoverTimeline.length} events, all recovered
          </span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-t border-[#f3f4f5]">
              <th className="text-left px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Time</th>
              <th className="text-left px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Route</th>
              <th className="text-left px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Model</th>
              <th className="text-left px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Reason</th>
              <th className="text-right px-[20px] py-[10px] text-[11px] font-medium text-[#9ba7b2] uppercase tracking-wider">Recovery</th>
            </tr>
          </thead>
          <tbody>
            {failoverTimeline.map((f, i) => (
              <tr key={i} className="border-t border-[#f3f4f5] hover:bg-[#fafbfc]">
                <td className="px-[20px] py-[10px] text-[13px] text-[#687a8b]">{f.time}</td>
                <td className="px-[20px] py-[10px] text-[13px] text-[#243342]">
                  {f.from} <span className="text-[#9ba7b2] mx-[4px]">&rarr;</span> {f.to}
                </td>
                <td className="px-[20px] py-[10px] text-[13px] text-[#243342] font-mono">{f.model}</td>
                <td className="px-[20px] py-[10px] text-[13px] text-[#687a8b]">{f.reason}</td>
                <td className="px-[20px] py-[10px] text-[13px] font-medium text-[#16a34a] text-right">{f.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
