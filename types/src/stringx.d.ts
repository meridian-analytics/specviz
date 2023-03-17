type tformat = (x: number) => string;
declare function formatHz(hz: number): string;
declare function formatPercent(percent: number): string;
declare function formatTimestamp(time: number): string;
declare function randomBytes(count: number): string;
export type { tformat };
export { formatHz, formatPercent, formatTimestamp, randomBytes };
