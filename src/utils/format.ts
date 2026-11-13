export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());

export const maskEmail = (e: string) => {
  const [u, d] = e.split('@');
  if (!d) return e;
  return `${u.slice(0, Math.min(4, u.length))}***@${d}`;
};

export const isUrl = (s: string) => /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(s.trim());

export const fmtMoney = (n: number) =>
  (n < 0 ? '-$ ' : '$ ') + Math.abs(Math.round(n)).toLocaleString('en-US');

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });

export const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
