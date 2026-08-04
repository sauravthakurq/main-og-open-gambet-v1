import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, BookOpen, Settings, Play, ChevronRight, 
  Cpu, Activity, Zap, CheckCircle2, Circle, ArrowRight, Shield, 
  Target, Swords, Crown, Maximize, RotateCcw, X, GraduationCap
} from 'lucide-react';
import { useAcademyStore } from '@/store/useAcademyStore';
import { useLearningStore } from '@/store/useLearningStore';

// Smooth scroll hook for Table of Contents
const useScrollSpy = (ids: string[], offset = 100) => {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    // We attach scroll listener to the scroll container in the docs view, not window
    const container = document.getElementById('docs-scroll-container');
    if (!container) return;

    const handleScroll = () => {
      let currentId = "";
      for (const id of ids) {
        const element = document.getElementById(id);
        if (element) {
          const { top } = element.getBoundingClientRect();
          const containerTop = container.getBoundingClientRect().top;
          // Calculate relative position to container
          if (top - containerTop < offset) {
            currentId = id;
          }
        }
      }
      setActiveId(currentId);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [ids, offset]);

  return activeId;
};

// Reveal on Scroll Component
const FadeIn = ({ children, delay = 0, className = '' }: any) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const GlassCard = ({ children, className = '', noPadding = false }: any) => (
  <div className={`rounded-2xl border border-white/10 bg-black/40 shadow-2xl overflow-hidden ${noPadding ? '' : 'p-6 sm:p-8'} ${className}`}>
    {children}
  </div>
);

const SectionHeading = ({ number, title, id }: any) => (
  <div id={id} className="flex items-center gap-4 mb-8 pt-8 border-t border-white/10 scroll-mt-24">
    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-black/40 text-white/70 font-mono text-lg font-semibold border border-white/10 shadow-inner">
      {number}
    </div>
    <h2 className="text-3xl font-bold tracking-tight text-white">{title}</h2>
  </div>
);

const MetricBox = ({ label, value, subtext, highlight = false }: any) => (
  <div className="flex flex-col gap-1 p-3 rounded-xl bg-black/40 border border-white/5">
    <span className="text-xs font-semibold tracking-wider text-white/50 uppercase">{label}</span>
    <span className={`text-xl font-mono font-bold ${highlight ? 'text-[var(--color-accent)]' : 'text-white/90'}`}>{value}</span>
    {subtext && <span className="text-xs text-white/40 font-mono">{subtext}</span>}
  </div>
);

const Sidebar = () => {
  const { closeDocs } = useAcademyStore();
  
  return (
    <aside className="absolute inset-y-0 left-0 z-50 flex flex-col items-center w-20 py-6 border-r bg-[#0a0a0c]/90 backdrop-blur-xl border-white/10">
      {/* Gambit Academy Logo */}
      <img 
        src="/logo.png" 
        alt="Open Gambit" 
        className="h-10 w-auto object-contain transition-transform hover:scale-105 mb-8 cursor-pointer" 
        draggable={false} 
      />

      <nav className="flex flex-col gap-6 flex-1 w-full items-center">
        <button onClick={closeDocs} className="p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-all group relative">
          <Home size={22} strokeWidth={2} />
          <span className="absolute left-14 px-3 py-1.5 text-xs font-semibold text-black bg-[var(--color-accent)] rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">Home</span>
        </button>
        <button className="p-3 text-black bg-[var(--color-accent)] rounded-xl transition-all shadow-[0_0_15px_rgba(227,193,149,0.3)] relative group">
          <BookOpen size={22} strokeWidth={2} />
          <span className="absolute left-14 px-3 py-1.5 text-xs font-semibold text-black bg-[var(--color-accent)] rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">Learning Docs</span>
        </button>
      </nav>
    </aside>
  );
};

const RightPanel = ({ activeSection }: { activeSection: string }) => {
  const sections = [
    { id: 'setup', title: 'Setup The Board' },
    { id: 'pieces', title: 'How Pieces Move' },
    { id: 'special', title: 'Special Rules' },
    { id: 'first-move', title: 'The First Move' },
    { id: 'win', title: 'How To Win' },
    { id: 'strategy', title: 'Basic Strategies' },
    { id: 'practice', title: 'Practice & Play' },
  ];

  const progress = Math.round(((sections.findIndex(s => s.id === activeSection) + 1) / sections.length) * 100) || 0;

  return (
    <aside className="absolute inset-y-0 right-0 z-40 hidden w-80 flex-col py-6 px-4 bg-[#0a0a0c]/90 backdrop-blur-xl border-l border-white/10 xl:flex">
      
      {/* Top Model Indicator */}
      <div className="flex items-center gap-3 mb-8 p-3 rounded-xl bg-black/40 border border-white/10 shadow-inner">
        <Cpu className="text-[var(--color-accent)]" size={20} />
        <div>
          <h3 className="text-sm font-bold text-white leading-none">Gambit Docs</h3>
          <p className="text-[10px] font-mono text-white/40 mt-1 uppercase">Reading Mode</p>
        </div>
        <div className="ml-auto flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse" />
      </div>

      {/* Analytics Group */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-white/50 uppercase tracking-widest px-1 border-b border-white/10 pb-2">
          <span>Module Status</span>
          <span className="text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-2 py-0.5 rounded-md border border-[var(--color-accent)]/20">Active</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <MetricBox label="Progress" value={`${progress}%`} highlight />
          <MetricBox label="Est. Time" value="15m" subtext="Reading" />
          <MetricBox label="Difficulty" value="Beginner" />
          <MetricBox label="Segments" value={`${sections.findIndex(s => s.id === activeSection) + 1} / 7`} />
        </div>
      </div>

      {/* Table of Contents / Move List style */}
      <div className="flex-1 flex flex-col bg-black/40 border border-white/10 rounded-xl overflow-hidden shadow-inner">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
          <h4 className="text-xs font-bold text-white/70 uppercase tracking-wider">Module Index</h4>
        </div>
        <div className="flex-1 p-2 space-y-1 overflow-y-auto custom-scrollbar">
          {sections.map((section, idx) => {
            const isActive = activeSection === section.id;
            const isPast = sections.findIndex(s => s.id === activeSection) > idx;
            
            return (
              <a 
                key={section.id} 
                href={`#${section.id}`}
                className={`flex items-center gap-3 p-2.5 rounded-lg text-sm transition-colors cursor-pointer group ${
                  isActive ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20' : 'text-white/50 hover:bg-white/5 hover:text-white/90'
                }`}
              >
                {isPast ? (
                  <CheckCircle2 size={16} className="text-[var(--color-accent)] shrink-0" />
                ) : isActive ? (
                  <Activity size={16} className="text-[var(--color-accent)] shrink-0 animate-pulse" />
                ) : (
                  <Circle size={16} className="text-white/20 shrink-0" />
                )}
                <span className="font-medium truncate">{section.title}</span>
              </a>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

const OSTopBar = () => {
  const { closeDocs } = useAcademyStore();
  
  return (
    <div className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center gap-2">
        <button onClick={closeDocs} className="text-white/50 hover:text-white transition-colors mr-2">
          <X size={18} />
        </button>
        <span className="text-white/40 text-sm font-medium">Gambit Academy</span>
        <ChevronRight size={14} className="text-white/20" />
        <span className="text-[var(--color-accent)] text-sm font-semibold">Rules of Chess</span>
      </div>
      
      <div className="hidden md:flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/10">
        <button className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition"><RotateCcw size={16} /></button>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition"><Maximize size={16} /></button>
      </div>
    </div>
  );
}

const PieceShowcase = ({ piece, icon: Icon, description, color }: any) => (
  <div className="flex flex-col p-6 rounded-xl border border-white/10 bg-black/40 hover:border-white/20 transition-colors group relative overflow-hidden shadow-lg">
    <div className={`absolute -right-4 -bottom-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 ${color}`}>
      <Icon size={120} />
    </div>
    <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center bg-black border border-white/10 group-hover:scale-110 transition-transform ${color}`}>
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold text-white mb-2 relative z-10">{piece}</h3>
    <p className="text-sm text-white/60 leading-relaxed flex-1 relative z-10">{description}</p>
  </div>
);

export const LearningDocsView = () => {
  const activeSection = useScrollSpy(['setup', 'pieces', 'special', 'first-move', 'win', 'strategy', 'practice']);

  return (
    <div className="absolute inset-0 z-[60] bg-[#0a0a0c] text-zinc-100 font-sans font-normal antialiased overflow-hidden flex animate-in fade-in slide-in-from-bottom-8 duration-150">
      <Sidebar />
      <RightPanel activeSection={activeSection} />

      <main id="docs-scroll-container" className="flex-1 ml-20 xl:mr-80 overflow-y-auto custom-scrollbar scroll-smooth">
        <OSTopBar />
        
        <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12 pb-32">
          
          {/* Hero Section */}
          <FadeIn>
            <div className="flex items-center gap-2 mb-6">
              <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--color-accent)] border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/10 rounded-md">Learning Module</span>
              <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-white/60 border border-white/10 bg-white/5 rounded-md">Beginner</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-[1.1]">
              How to Play Chess
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-[#b58863] mt-2 drop-shadow-sm">
                7 Rules To Get You Started
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-white/60 leading-relaxed max-w-2xl mb-12">
              It's never too late to learn how to play chess—the most popular game in the world! Learning the rules is easy with our step-by-step Open Gambit guide.
            </p>

            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black relative group mb-20 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1586165368502-1bad197a6461?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
                alt="Chess Board" 
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-150"
              />
            </div>
          </FadeIn>

          {/* Rule 1 */}
          <FadeIn>
            <SectionHeading id="setup" number="01" title="How To Setup The Chessboard" />
            <div className="text-white/60 text-lg leading-relaxed">
              <p>
                At the beginning of the game the chessboard is laid out so that each player has the white (or light) color square in the bottom right-hand side.
              </p>
              <GlassCard className="my-8" noPadding>
                <img 
                  src="https://images.unsplash.com/photo-1529699211952-734e80c4d42b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                  alt="Chess Board Setup"
                  className="w-full h-64 sm:h-96 object-cover object-center" 
                />
                <div className="p-6 bg-black/40 border-t border-white/10">
                  <p className="text-sm m-0">The chess pieces are then arranged the same way each time. The second row (or rank) is filled with pawns. The rooks go in the corners, then the knights next to them, followed by the bishops, and finally the queen, who always goes on her own matching color (white queen on white, black queen on black), and the king on the remaining square.</p>
                </div>
              </GlassCard>
            </div>
          </FadeIn>

          {/* Rule 2 */}
          <FadeIn>
            <SectionHeading id="pieces" number="02" title="How The Chess Pieces Move" />
            <p className="text-white/60 text-lg leading-relaxed mb-8">
              Each of the 6 different kinds of pieces moves differently. Pieces cannot move through other pieces (though the knight can jump over other pieces), and can never move onto a square with one of their own pieces.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <PieceShowcase 
                piece="The King" 
                color="text-[var(--color-accent)] drop-shadow-[0_0_15px_rgba(227,193,149,0.3)]"
                icon={Crown}
                description="The most important piece. Moves one square in any direction - up, down, to the sides, and diagonally. May never move into check."
              />
              <PieceShowcase 
                piece="The Queen" 
                color="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                icon={Crown} 
                description="The most powerful piece. Moves in any one straight direction - forward, backward, sideways, or diagonally - as far as possible."
              />
              <PieceShowcase 
                piece="The Rook" 
                color="text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.3)]"
                icon={Shield}
                description="Moves as far as it wants, but only forward, backward, and to the sides. Powerful when protecting each other."
              />
              <PieceShowcase 
                piece="The Bishop" 
                color="text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.3)]"
                icon={Target}
                description="Moves as far as it wants, but only diagonally. Each stays on one color (light or dark) for the entire game."
              />
              <PieceShowcase 
                piece="The Knight" 
                color="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                icon={Swords}
                description="Moves in an 'L' shape: two squares in one direction, and then one more move at a 90-degree angle. Can jump over pieces."
              />
              <PieceShowcase 
                piece="The Pawn" 
                color="text-zinc-300 drop-shadow-[0_0_15px_rgba(212,212,216,0.3)]"
                icon={Circle}
                description="Moves forward but captures diagonally. Can move two squares on its very first move. Cannot move backward."
              />
            </div>
          </FadeIn>

          {/* Rule 3 */}
          <FadeIn>
            <SectionHeading id="special" number="03" title="Discover The Special Rules" />
            <div className="space-y-6">
              <GlassCard>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-black/40 border border-white/10 rounded-lg text-[var(--color-accent)]"><Zap size={20} /></div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Pawn Promotion</h3>
                    <p className="text-white/50 text-sm leading-relaxed">If a pawn reaches the other side of the board it can become any other chess piece (excluding a king). A pawn is usually promoted to a queen. It is a misconception that pawns may only be exchanged for a piece that has been captured.</p>
                  </div>
                </div>
              </GlassCard>
              
              <GlassCard>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-black/40 border border-white/10 rounded-lg text-[var(--color-accent)]"><Zap size={20} /></div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">"En Passant"</h3>
                    <p className="text-white/50 text-sm leading-relaxed">If a pawn moves out two squares on its first move, and lands to the side of an opponent's pawn, that other pawn has the option of capturing the first pawn as it passes by. This special move must be done immediately.</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-black/40 border border-white/10 rounded-lg text-[var(--color-accent)]"><Zap size={20} /></div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Castling</h3>
                    <p className="text-white/50 text-sm leading-relaxed mb-3">Allows you to get your king to safety and get your rook into the game. Move the king two squares over to one side and then move the rook to right next to the king on the opposite side.</p>
                    <div className="p-4 bg-black/20 rounded-lg border border-white/5 shadow-inner">
                      <h4 className="text-xs font-bold text-white/70 uppercase mb-2">Conditions to Castle:</h4>
                      <ul className="text-sm text-white/50 space-y-1 list-disc list-inside">
                        <li>Must be that king's and rook's very first move.</li>
                        <li>No pieces between the king and rook.</li>
                        <li>The king may not be in check or pass through check.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </FadeIn>

          {/* Rule 4 & 5 */}
          <FadeIn>
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mt-16">
              <div>
                <SectionHeading id="first-move" number="04" title="The First Move" />
                <p className="text-white/60 text-lg leading-relaxed">
                  The player with the white pieces always moves first. Players generally decide who will get to be white by chance (flipping a coin or guessing pawn color). White makes a move, followed by black, then white again. Moving first is a tiny advantage that gives the white player an opportunity to attack right away.
                </p>
              </div>
              
              <div>
                <SectionHeading id="win" number="05" title="How To Win" />
                <p className="text-white/60 text-lg leading-relaxed mb-6">
                  The purpose is to checkmate the opponent's king. This happens when the king is put into check and cannot get out of check (move away, block, or capture the threatening piece).
                </p>
                <div className="bg-black/40 border border-white/10 rounded-xl p-5 shadow-inner">
                  <h4 className="text-sm font-bold text-white mb-3">Draw Scenarios:</h4>
                  <ul className="text-sm text-white/50 space-y-2">
                    <li className="flex items-center gap-2"><Circle size={8} className="fill-current text-white/20" /> Stalemate (no legal moves, not in check)</li>
                    <li className="flex items-center gap-2"><Circle size={8} className="fill-current text-white/20" /> Mutual Agreement</li>
                    <li className="flex items-center gap-2"><Circle size={8} className="fill-current text-white/20" /> Insufficient Material</li>
                    <li className="flex items-center gap-2"><Circle size={8} className="fill-current text-white/20" /> 3-Fold Repetition</li>
                    <li className="flex items-center gap-2"><Circle size={8} className="fill-current text-white/20" /> 50-Move Rule</li>
                  </ul>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Rule 6 */}
          <FadeIn>
            <SectionHeading id="strategy" number="06" title="Basic Chess Strategies" />
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-6 bg-gradient-to-br from-black/60 to-black/20 border border-white/10 rounded-xl hover:border-white/20 transition-colors shadow-lg">
                <h4 className="text-lg font-bold text-white mb-2">1. Protect Your King</h4>
                <p className="text-sm text-white/50">Get your king to the corner of the board where he is usually safer. Don't put off castling. You should usually castle as quickly as possible.</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-black/60 to-black/20 border border-white/10 rounded-xl hover:border-white/20 transition-colors shadow-lg">
                <h4 className="text-lg font-bold text-white mb-2">2. Don't Give Pieces Away</h4>
                <p className="text-sm text-white/50">Keep track of points: Pawn=1, Knight/Bishop=3, Rook=5, Queen=9. Don't carelessly lose your pieces without getting value in return.</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-black/60 to-black/20 border border-white/10 rounded-xl hover:border-white/20 transition-colors shadow-lg">
                <h4 className="text-lg font-bold text-white mb-2">3. Control The Center</h4>
                <p className="text-sm text-white/50">Try to control the center of the board with your pieces and pawns. This gives you more room to move and restricts your opponent.</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-black/60 to-black/20 border border-white/10 rounded-xl hover:border-white/20 transition-colors shadow-lg">
                <h4 className="text-lg font-bold text-white mb-2">4. Use All Your Pieces</h4>
                <p className="text-sm text-white/50">Your pieces don't do any good when they are sitting on the first row. Develop all of your pieces so you have more to use when attacking.</p>
              </div>
            </div>
          </FadeIn>

          {/* Rule 7 */}
          <FadeIn>
            <SectionHeading id="practice" number="07" title="Practice By Playing" />
            <GlassCard className="text-center py-16 bg-[url('https://images.unsplash.com/photo-1528819622765-d6bcf132f793?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center relative overflow-hidden">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="h-16 w-16 mb-6 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)] border border-[var(--color-accent)]/30 flex items-center justify-center shadow-[0_0_30px_rgba(227,193,149,0.3)]">
                  <Play size={28} className="ml-1" fill="currentColor" />
                </div>
                <h3 className="text-3xl font-black text-white mb-4 tracking-tight drop-shadow-md">Ready to Master the Board?</h3>
                <p className="text-white/70 text-lg mb-8 max-w-lg drop-shadow-sm">
                  The most important thing you can do to get better is to play. Join the Open Gambit arena against bots or real players.
                </p>
                <button 
                  onClick={() => {
                    // Close docs view and then close the entire learning workspace
                    useAcademyStore.getState().closeDocs();
                    useLearningStore.getState().setWorkspaceOpen(false);
                  }}
                  className="flex items-center gap-3 px-8 py-4 bg-[var(--color-accent)] text-black rounded-xl font-bold hover:brightness-110 hover:scale-105 transition-all shadow-[0_0_20px_rgba(227,193,149,0.3)]"
                >
                  Play <ArrowRight size={18} />
                </button>
              </div>
            </GlassCard>
          </FadeIn>

        </div>
      </main>
    </div>
  );
}
