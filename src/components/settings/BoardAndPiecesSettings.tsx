'use client';
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, Clock, Star, LayoutGrid } from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';
import { ThemeCard } from './ThemeCard';
import { Chessground } from 'chessground';
import 'chessground/assets/chessground.base.css';

export default function BoardAndPiecesSettings() {
  const {
    boardTheme,
    pieceTheme,
    favoriteBoards,
    favoritePieces,
    recentBoards,
    recentPieces,
    setBoardTheme,
    setPieceTheme,
    toggleFavoriteBoard,
    toggleFavoritePiece,
  } = useThemeStore();

  const [boards, setBoards] = useState<string[]>([]);
  const [pieces, setPieces] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'boards' | 'pieces'>('boards');
  const [isLoading, setIsLoading] = useState(true);
  
  const previewRef = useRef<HTMLDivElement>(null);
  const cgRef = useRef<any>(null);

  // Fetch available themes
  useEffect(() => {
    fetch('/api/themes')
      .then((res) => res.json())
      .then((data) => {
        if (data.boards) setBoards(['default', ...data.boards]);
        if (data.pieces) setPieces(['default', ...data.pieces]);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  // Initialize live preview
  useEffect(() => {
    if (!previewRef.current) return;
    
    // Initial position for preview showing all major pieces
    const previewFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    
    const timer = setTimeout(() => {
      if (!cgRef.current && previewRef.current) {
        cgRef.current = Chessground(previewRef.current, {
          fen: previewFen,
          viewOnly: true,
          coordinates: false,
          animation: { enabled: true, duration: 300 }
        });
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      if (cgRef.current) {
        cgRef.current.destroy();
        cgRef.current = null;
      }
    };
  }, []);

  // Force redraw on theme change
  useEffect(() => {
    if (cgRef.current) {
      cgRef.current.redrawAll();
    }
  }, [boardTheme, pieceTheme]);

  // Filter items based on search and favorites
  const filterItems = (items: string[], favorites: string[]) => {
    let filtered = items;
    if (searchQuery) {
      filtered = items.filter(item => item.toLowerCase().includes(searchQuery.toLowerCase().replace(/ /g, '_')));
    }
    
    // Sort: Default first, then Favorites, then alphabetical
    return [...filtered].sort((a, b) => {
      if (a === 'default') return -1;
      if (b === 'default') return 1;
      const aFav = favorites.includes(a);
      const bFav = favorites.includes(b);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return a.localeCompare(b);
    });
  };

  const displayedBoards = filterItems(boards, favoriteBoards);
  const displayedPieces = filterItems(pieces, favoritePieces);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row pt-8 pb-0 px-6 md:px-10 gap-10 overflow-hidden">
      
      {/* Left Pane: Sticky Sidebar */}
      <div className="w-full lg:w-[320px] flex-shrink-0 flex flex-col gap-8 pb-8 overflow-y-auto lg:overflow-visible hide-scrollbar">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
            <LayoutGrid className="text-[var(--color-accent)]" size={28} />
            Board & Pieces
          </h1>
          <p className="text-white/50 text-sm font-medium">
            Customize your chess experience with premium textures.
          </p>
        </div>

        {/* Live Preview (Sticky) */}
        <div className="flex flex-col lg:sticky lg:top-0 z-10 bg-[#0c0c0c]/95 pt-2 pb-4">
          <h2 className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Sparkles size={14} /> Live Preview
          </h2>
          <div className="w-full max-w-[320px] aspect-square mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 relative bg-black/20 flex items-center justify-center">
            <div ref={previewRef} className="w-full h-full relative overflow-hidden" />
          </div>
        </div>
        
        {/* Search */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={16} className="text-white/30" />
          </div>
          <input
            type="text"
            placeholder="Search themes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1c1c1e] border border-white/10 text-white rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all placeholder:text-white/30 font-medium text-sm"
          />
        </div>
      </div>

      {/* Right Pane: Scrollable Grid */}
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar pb-20 pr-4">
        
        {/* Recently Used */}
        <div className="flex flex-col mb-10">
          <h2 className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Clock size={14} /> Recently Used
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Show top 2 recent boards and top 2 recent pieces */}
            {recentBoards.slice(0, 2).map((b) => (
              <div key={`recent-b-${b}`} onClick={() => { setActiveTab('boards'); setBoardTheme(b); }} className="cursor-pointer group">
                <div className="w-full aspect-square rounded-xl overflow-hidden border border-white/10 group-hover:border-[var(--color-accent)] transition-colors relative mb-2">
                   {b === 'default' ? (
                      <div className="w-full h-full bg-[#b58863] flex flex-col">
                        <div className="w-full h-1/2 flex">
                          <div className="w-1/2 h-full bg-[#f0d9b5]"></div>
                          <div className="w-1/2 h-full bg-[#b58863]"></div>
                        </div>
                        <div className="w-full h-1/2 flex">
                          <div className="w-1/2 h-full bg-[#b58863]"></div>
                          <div className="w-1/2 h-full bg-[#f0d9b5]"></div>
                        </div>
                      </div>
                   ) : (
                     <img src={`/assets/boards/${b}.png`} alt={b} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-150" />
                   )}
                   <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-md text-[9px] px-1.5 py-0.5 rounded text-white/70 font-bold uppercase tracking-wider">Board</div>
                </div>
                <p className="text-xs text-white/70 font-medium text-center capitalize">{b.replace(/_/g, ' ')}</p>
              </div>
            ))}
            {recentPieces.slice(0, 2).map((p) => (
              <div key={`recent-p-${p}`} onClick={() => { setActiveTab('pieces'); setPieceTheme(p); }} className="cursor-pointer group">
                <div className="w-full aspect-square rounded-xl overflow-hidden border border-white/10 group-hover:border-[var(--color-accent)] transition-colors bg-[#2c2b29] p-3 flex flex-wrap items-center justify-center gap-1 relative mb-2">
                   {p === 'default' ? (
                     <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest text-center">Standard<br/>Pieces</span>
                   ) : (
                     ['wn', 'wp', 'bk', 'bq'].map(piece => (
                       <img key={piece} src={`/assets/pieces/${p}/${piece}.png`} className="w-[40%] h-[40%] object-contain group-hover:scale-110 transition-transform" />
                     ))
                   )}
                   <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-md text-[9px] px-1.5 py-0.5 rounded text-white/70 font-bold uppercase tracking-wider">Pieces</div>
                </div>
                <p className="text-xs text-white/70 font-medium text-center capitalize">{p.replace(/_/g, ' ')}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 mb-6 sticky top-0 bg-[#0c0c0c]/95 backdrop-blur-2xl z-10 pt-2">
          <button
            onClick={() => setActiveTab('boards')}
            className={`px-6 py-3 text-sm font-bold tracking-wide uppercase transition-colors relative ${
              activeTab === 'boards' ? 'text-[var(--color-accent)]' : 'text-white/40 hover:text-white/70'
            }`}
          >
            Boards
            {activeTab === 'boards' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 inset-x-0 h-0.5 bg-[var(--color-accent)] shadow-[0_0_10px_var(--color-accent)]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('pieces')}
            className={`px-6 py-3 text-sm font-bold tracking-wide uppercase transition-colors relative ${
              activeTab === 'pieces' ? 'text-[var(--color-accent)]' : 'text-white/40 hover:text-white/70'
            }`}
          >
            Pieces
            {activeTab === 'pieces' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 inset-x-0 h-0.5 bg-[var(--color-accent)] shadow-[0_0_10px_var(--color-accent)]" />
            )}
          </button>
        </div>

        {/* Theme Grid */}
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
        >
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-full aspect-square rounded-3xl bg-white/5 animate-pulse flex flex-col border border-white/5">
                 <div className="flex-1 bg-white/[0.02]"></div>
                 <div className="h-16 bg-white/[0.04] p-4">
                    <div className="w-2/3 h-4 bg-white/10 rounded-full mb-2"></div>
                    <div className="w-1/3 h-3 bg-white/5 rounded-full"></div>
                 </div>
              </div>
            ))
          ) : (
            <>
              {activeTab === 'boards' && displayedBoards.map((b) => (
                <ThemeCard
                  key={b}
                  id={b}
                  name={b}
                  type="board"
                  isSelected={boardTheme === b}
                  isFavorite={favoriteBoards.includes(b)}
                  onSelect={() => setBoardTheme(b)}
                  onToggleFavorite={() => toggleFavoriteBoard(b)}
                />
              ))}

              {activeTab === 'pieces' && displayedPieces.map((p) => (
                <ThemeCard
                  key={p}
                  id={p}
                  name={p}
                  type="piece"
                  isSelected={pieceTheme === p}
                  isFavorite={favoritePieces.includes(p)}
                  onSelect={() => setPieceTheme(p)}
                  onToggleFavorite={() => toggleFavoritePiece(p)}
                />
              ))}

              {((activeTab === 'boards' && displayedBoards.length === 0) || 
                (activeTab === 'pieces' && displayedPieces.length === 0)) && (
                <div className="col-span-full py-12 flex flex-col items-center justify-center text-white/30">
                  <Search size={48} className="mb-4 opacity-50" />
                  <p className="text-lg font-medium">No {activeTab} found</p>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
