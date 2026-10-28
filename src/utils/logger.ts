export type LogTag = 'APP' | 'RED' | 'CACHE' | 'GET' | 'MUTACION';

export interface LogEntry {
  id: number;
  time: string;
  tag: LogTag;
  message: string;
}

const MAX_ENTRIES = 200;

let entries: LogEntry[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

function pad(value: number, size = 2): string {
  return String(value).padStart(size, '0');
}

export function formatClock(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`;
}

export function log(tag: LogTag, message: string, now: Date = new Date()): LogEntry {
  const entry: LogEntry = { id: nextId++, time: formatClock(now), tag, message };
  console.log(`[${entry.time}] [${tag}] ${message}`);
  entries = [entry, ...entries].slice(0, MAX_ENTRIES);
  listeners.forEach((listener) => listener());
  return entry;
}

export function getLogs(): LogEntry[] {
  return entries;
}

export function subscribeLogs(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function clearLogs(): void {
  entries = [];
  listeners.forEach((listener) => listener());
}
