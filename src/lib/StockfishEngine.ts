export type EngineVariation = {
  multipv: number;
  score: number; // in centipawns
  pv: string[];
};

export type EngineInfo = {
  depth: number;
  nodes: number;
  nps: number;
  time: number;
  score: number; // in centipawns
  bestMove: string;
  pv: string[]; // multi-pv lines
  variations: EngineVariation[];
};

export class StockfishEngine {
  private worker: Worker | null = null;
  private isReady: boolean = false;
  private currentInfo: Partial<EngineInfo> = { variations: [] };
  
  public onInfo?: (info: EngineInfo) => void;
  public onBestMove?: (move: string) => void;
  private isPlaying: boolean = false; // Distinguishes between evaluation and actual game playing

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window !== 'undefined') {
      this.worker = new Worker('/stockfish/stockfish.js');
      
      this.worker.onmessage = (e) => {
        const line = e.data;
        this.parseLine(line);
      };

      this.sendCommand('uci');
    }
  }

  public sendCommand(cmd: string) {
    if (this.worker) {
      this.worker.postMessage(cmd);
    }
  }

  public stop() {
    this.sendCommand('stop');
  }

  public evaluatePosition(fen: string, depth: number = 15) {
    if (this.isPlaying) return; // Do not interrupt an active game calculation with background evaluation
    this.sendCommand('stop');
    this.sendCommand('isready');
    this.sendCommand('setoption name MultiPV value 4');
    this.sendCommand('setoption name Skill Level value 20');
    this.sendCommand('ucinewgame');
    this.sendCommand(`position fen ${fen}`);
    this.currentInfo = { variations: [] };
    this.sendCommand(`go depth ${depth}`);
  }

  public playMove(fen: string, difficulty: 'easy' | 'intermediate' | 'hard' | 'master' | 'max') {
    this.isPlaying = true;
    this.sendCommand('stop');
    this.sendCommand('isready');
    this.sendCommand('setoption name MultiPV value 1');

    // Configure Stockfish strength based on difficulty
    let skillLevel = 20;
    let depth = 22;
    let movetime = 3000;

    switch (difficulty) {
      case 'easy':
        skillLevel = 0; depth = 5; movetime = 600; break;
      case 'intermediate':
        skillLevel = 5; depth = 10; movetime = 1000; break;
      case 'hard':
        skillLevel = 10; depth = 15; movetime = 1500; break;
      case 'master':
        skillLevel = 15; depth = 18; movetime = 2000; break;
      case 'max':
        skillLevel = 20; depth = 22; movetime = 3000; break;
    }

    this.sendCommand(`setoption name Skill Level value ${skillLevel}`);
    this.sendCommand('ucinewgame');
    this.sendCommand(`position fen ${fen}`);
    this.currentInfo = { variations: [] };
    
    // Add random delay calculation internally in stockfish or rely on movetime
    this.sendCommand(`go depth ${depth} movetime ${movetime}`);
  }

  private parseLine(line: string) {
    // console.log('[Engine]', line); // uncomment to debug engine output

    if (line === 'uciok') {
      this.isReady = true;
    }
    
    if (line.startsWith('bestmove')) {
      const match = line.match(/^bestmove ([a-h][1-8][a-h][1-8][qrbn]?)/);
      if (match) {
        if (this.isPlaying && this.onBestMove) {
          this.onBestMove(match[1]);
        }
        this.isPlaying = false; // Reset playing state after move is found
      } else {
        // Fallback for when there is no match but bestmove is returned (e.g. game over)
        this.isPlaying = false;
      }
    }

    if (line.startsWith('info') && line.includes('depth') && line.includes('score')) {
      // Parse engine info: info depth 12 seldepth 17 multipv 1 score cp 44 nodes 64323 nps 1608075 time 40 pv e2e4 c7c5 ...
      
      const depthMatch = line.match(/depth (\d+)/);
      if (depthMatch) this.currentInfo.depth = parseInt(depthMatch[1], 10);
      
      const nodesMatch = line.match(/nodes (\d+)/);
      if (nodesMatch) this.currentInfo.nodes = parseInt(nodesMatch[1], 10);
      
      const npsMatch = line.match(/nps (\d+)/);
      if (npsMatch) this.currentInfo.nps = parseInt(npsMatch[1], 10);
      
      const timeMatch = line.match(/time (\d+)/);
      if (timeMatch) this.currentInfo.time = parseInt(timeMatch[1], 10);
      
      const multipvMatch = line.match(/multipv (\d+)/);
      const multipv = multipvMatch ? parseInt(multipvMatch[1], 10) : 1;

      let score = 0;
      const scoreMatch = line.match(/score cp (-?\d+)/);
      if (scoreMatch) score = parseInt(scoreMatch[1], 10);

      const mateMatch = line.match(/score mate (-?\d+)/);
      if (mateMatch) score = parseInt(mateMatch[1], 10) * 10000; // arbitrary high value for mate
      
      let pv: string[] = [];
      const pvMatch = line.match(/ pv (.*)/);
      if (pvMatch) pv = pvMatch[1].split(' ');

      if (multipv === 1) {
        this.currentInfo.score = score;
        this.currentInfo.pv = pv;
      }

      // Update variations array
      if (!this.currentInfo.variations) this.currentInfo.variations = [];
      
      const existingVarIndex = this.currentInfo.variations.findIndex(v => v.multipv === multipv);
      if (existingVarIndex >= 0) {
        this.currentInfo.variations[existingVarIndex] = { multipv, score, pv };
      } else {
        this.currentInfo.variations.push({ multipv, score, pv });
      }

      // Trigger callback if we have meaningful data
      if (this.currentInfo.depth && this.onInfo) {
        this.onInfo({ ...this.currentInfo } as EngineInfo);
      }
    }
  }

  public destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}
