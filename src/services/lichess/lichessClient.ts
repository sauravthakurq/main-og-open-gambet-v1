export const LICHESS_API_BASE = 'https://lichess.org/api';

export class LichessApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'LichessApiError';
  }
}

export async function fetchLichess<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${LICHESS_API_BASE}${endpoint}`;
  
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new LichessApiError(response.status, `Lichess API error: ${response.statusText}`);
  }

  // Handle empty responses
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
