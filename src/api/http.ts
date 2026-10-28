import { log } from '@/utils/logger';

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

const TIMEOUT_MS = 15_000;

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT';
  body?: unknown;
  signal?: AbortSignal;
  label: string;
}

export async function requestJson(url: string, { method = 'GET', body, signal, label }: RequestOptions): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  signal?.addEventListener('abort', () => controller.abort());

  const tag = method === 'GET' ? 'GET' : 'MUTACION';
  const started = Date.now();
  log(tag, `${method} ${label} → enviando`);
  try {
    const response = await fetch(url, {
      method,
      signal: controller.signal,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const elapsed = Date.now() - started;
    if (!response.ok) {
      log(tag, `${method} ${label} → error ${response.status} (${elapsed} ms)`);
      throw new HttpError(response.status, `El servidor respondió ${response.status}.`);
    }
    const json: unknown = await response.json();
    log(tag, `${method} ${label} → ${response.status} OK (${elapsed} ms)`);
    return json;
  } catch (error) {
    if (!(error instanceof HttpError)) {
      log(tag, `${method} ${label} → falló: ${error instanceof Error ? error.message : 'error de red'}`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
