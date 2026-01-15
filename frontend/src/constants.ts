
import { NavItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Engine', path: '/' },
  { label: 'Profit', path: '/profit-analytics' },
  { label: 'System Metrics', path: '/trade-analytics' },
  { label: 'Strategies', path: '/strategies' },
  { label: 'Registry', path: '/registry' },
  { label: 'AI Terminal', path: '/ai-terminal' },
  { label: 'Logs', path: '/logs' },
  { label: 'Withdrawal', path: '/withdrawal' },
  { label: 'Project Progress', path: '/project-progress' },
];

export const REFRESH_INTERVALS = [
  { label: '1s', value: 1000 },
  { label: '5s', value: 5000 },
  { label: '10s', value: 10000 },
  { label: '15s', value: 15000 },
  { label: '30s', value: 30000 },
];
