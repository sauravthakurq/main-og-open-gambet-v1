type SoundType = 
  | 'move' | 'capture' | 'check' | 'checkmate' | 'illegal' 
  | 'start' | 'end' | 'draw' | 'defeat' | 'castle' | 'select'
  | 'move-self' | 'move-opponent' | 'promote' | 'game-start' 
  | 'game-end' | 'drawoffer' | 'premove' | 'tenseconds' | 'move-check';

interface SoundConfig {
  path: string;
  isNew: boolean;
  baseName?: string;
}

const soundMap: Record<SoundType, SoundConfig> = {
  // --- OLD WORKING SOUNDS (UNCHANGED) ---
  'move': { path: '/sounds/standard/Move.mp3', isNew: false },
  'capture': { path: '/sounds/standard/Capture.mp3', isNew: false },
  'check': { path: '/sounds/standard/Check.mp3', isNew: false },
  'checkmate': { path: '/sounds/standard/Checkmate.mp3', isNew: false },
  'defeat': { path: '/sounds/standard/Defeat.mp3', isNew: false },
  'select': { path: '/sounds/standard/Select.mp3', isNew: false },
  'draw': { path: '/sounds/standard/Draw.mp3', isNew: false },
  'start': { path: '/sounds/standard/GenericNotify.mp3', isNew: false },
  'end': { path: '/sounds/standard/Victory.mp3', isNew: false },
  
  // --- NEW SOUNDS FROM DEFAULT SOUND FOLDER ---
  'move-self': { path: '/sounds/standard/Move.mp3', isNew: false }, // User requested 'move-self' to be old one
  'move-opponent': { path: '/sounds/standard/Move.mp3', isNew: false }, // User requested 'move-opponent' to be old one
  'castle': { path: '', isNew: true, baseName: 'castle' },
  'move-check': { path: '', isNew: true, baseName: 'move-check' },
  'promote': { path: '', isNew: true, baseName: 'promote' },
  'illegal': { path: '', isNew: true, baseName: 'illegal' },
  'game-start': { path: '', isNew: true, baseName: 'game-start' },
  'game-end': { path: '', isNew: true, baseName: 'game-end' },
  'drawoffer': { path: '', isNew: true, baseName: 'drawoffer' },
  'premove': { path: '', isNew: true, baseName: 'premove' },
  'tenseconds': { path: '', isNew: true, baseName: 'tenseconds' },
};

// Auto-select best format
const FORMATS = ['.ogg', '.mp3', '.webm', '.wav'];

class AudioManager {
  private ctx: AudioContext | null = null;
  private buffers: Record<string, AudioBuffer> = {};
  private initialized = false;
  private lastPlayed: Record<string, number> = {};

  public async init() {
    if (this.initialized || typeof window === 'undefined') return;
    this.initialized = true;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();

    const loadSound = async (key: SoundType, config: SoundConfig) => {
      let buffer: AudioBuffer | null = null;

      if (config.isNew && config.baseName) {
        // Try formats in order
        for (const ext of FORMATS) {
          try {
            const url = `/sounds/default/${config.baseName}${ext}`;
            const response = await fetch(url);
            if (!response.ok) continue;
            const arrayBuffer = await response.arrayBuffer();
            buffer = await this.ctx!.decodeAudioData(arrayBuffer);
            if (buffer) break; // Successfully loaded
          } catch (e) {
            // Ignore error and try next format
          }
        }
      } else {
        // Load old sounds normally
        try {
          const response = await fetch(config.path);
          if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            buffer = await this.ctx!.decodeAudioData(arrayBuffer);
          }
        } catch (e) {
          console.warn('Failed to load old sound', config.path, e);
        }
      }

      if (buffer) {
        this.buffers[key] = buffer;
      } else {
        console.warn('Failed to load sound completely:', key);
      }
    };

    // Preload all sounds concurrently
    await Promise.all(
      (Object.keys(soundMap) as SoundType[]).map(key => loadSound(key, soundMap[key]))
    );

    const resume = () => {
      if (this.ctx?.state === 'suspended') {
        this.ctx.resume();
      }
    };
    
    document.addEventListener('click', resume, { once: true });
    document.addEventListener('touchstart', resume, { once: true });
  }

  public play(type: SoundType) {
    if (!this.ctx || !this.buffers[type]) return;

    // Prevent overlapping duplicate sounds (e.g., multiple captures at once)
    const now = performance.now();
    if (this.lastPlayed[type] && now - this.lastPlayed[type] < 50) {
      return; // Ignore if same sound played within 50ms
    }
    this.lastPlayed[type] = now;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    try {
      const source = this.ctx.createBufferSource();
      source.buffer = this.buffers[type];
      source.connect(this.ctx.destination);
      source.start(0);
    } catch (e) {
      console.warn('Error playing sound', type, e);
    }
  }
}

export const audioManager = new AudioManager();
