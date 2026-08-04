export interface PlayerInfo {
  id?: string;
  name?: string;
  title?: string;
  rating?: number;
  provisional?: boolean;
}

export interface GameFullState {
  type: 'gameFull';
  id: string;
  variant: { key: string; name: string };
  speed: string;
  perf: { name: string };
  rated: boolean;
  white: PlayerInfo;
  black: PlayerInfo;
  initialFen: string;
  state: {
    moves: string;
    wtime: number;
    btime: number;
    winc: number;
    binc: number;
    status: string;
    winner?: 'white' | 'black';
  };
}

export interface GameStateUpdate {
  type: 'gameState';
  moves: string;
  wtime: number;
  btime: number;
  winc: number;
  binc: number;
  status: string;
  winner?: 'white' | 'black';
}

export type LichessStreamEvent = GameFullState | GameStateUpdate | { type: string; [key: string]: any };

export class LichessStream {
  private url: string;
  private abortController: AbortController | null = null;
  
  constructor(gameId: string) {
    this.url = `https://lichess.org/api/stream/game/${gameId}`;
  }

  public async connect(onMessage: (event: LichessStreamEvent) => void, onError?: (err: Error) => void) {
    this.abortController = new AbortController();
    
    try {
      const response = await fetch(this.url, {
        signal: this.abortController.signal,
        headers: {
          'Accept': 'application/x-ndjson',
        }
      });

      if (!response.ok) {
        throw new Error(`Lichess stream failed: ${response.status} ${response.statusText}`);
      }
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error("Stream not readable");

      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        const lines = buffer.split('\n');
        // keep the last partial line in the buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.length === 0) continue; // ignore keep-alive pings (empty lines)
          
          try {
            const data = JSON.parse(trimmed);
            onMessage(data);
          } catch (e) {
            console.error("Failed to parse stream JSON:", trimmed, e);
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        // Stream aborted manually
        return;
      }
      if (onError) onError(error);
    }
  }

  public disconnect() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}
