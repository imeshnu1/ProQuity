import { create } from 'zustand';
import type { Person } from '@/data/sample';

type F = Record<string, string[]>;
export const useFilters = create<{ provider: F; advisor: F; set: (kind: 'provider' | 'advisor', f: F) => void }>((set) => ({
  provider: {},
  advisor: {},
  set: (kind, f) => set({ [kind]: f } as any),
}));

export const filterCount = (f: F) => Object.values(f).reduce((n, v) => n + v.length, 0);

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

export function applyFilters(list: Person[], f: F, q: string) {
  return list.filter((p) => {
    if (q && !`${p.name} ${p.firm}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (f.firmType?.length && !f.firmType.includes(p.firmType)) return false;
    if (f.stage?.length && !p.stages.some((s) => f.stage.map(norm).includes(norm(s)))) return false;
    if (f.sector?.length && !p.sectors.some((s) => f.sector.map(norm).some((x) => norm(s).includes(x) || x.includes(norm(s))))) return false;
    if (f.check?.length && !f.check.map(norm).includes(norm(p.checkSize))) return false;
    if (f.geo?.length && !p.geos.some((g) => f.geo.includes(g))) return false;
    return true;
  });
}
