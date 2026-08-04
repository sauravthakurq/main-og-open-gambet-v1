'use client';
import { useEffect } from 'react';
import { useThemeStore } from '@/store/useThemeStore';

export const ThemeInjector = () => {
  const { boardTheme, pieceTheme } = useThemeStore();

  useEffect(() => {
    // Generate CSS for pieces
    const pieces = ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king'];
    const colors = ['white', 'black'];
    
    // Map chessground class names to our file names
    const pieceMap: Record<string, string> = {
      'pawn.white': 'wp',
      'knight.white': 'wn',
      'bishop.white': 'wb',
      'rook.white': 'wr',
      'queen.white': 'wq',
      'king.white': 'wk',
      'pawn.black': 'bp',
      'knight.black': 'bn',
      'bishop.black': 'bb',
      'rook.black': 'br',
      'queen.black': 'bq',
      'king.black': 'bk',
    };

    let styleStr = '';

    if (boardTheme !== 'default') {
      styleStr += `
        /* Board injection */
        .cg-wrap {
          background-image: url(/assets/boards/${boardTheme}.png) !important;
          background-size: cover !important;
          background-position: center !important;
        }
      `;
    }

    if (pieceTheme !== 'default') {
      colors.forEach(c => {
        pieces.forEach(p => {
          const cgClass = `${p}.${c}`;
          const fileName = pieceMap[cgClass];
          styleStr += `
            .cg-wrap piece.${cgClass} {
              background-image: url(/assets/pieces/${pieceTheme}/${fileName}.png) !important;
            }
          `;
        });
      });
    }

    const styleId = 'chessground-custom-themes';
    let styleEl = document.getElementById(styleId);

    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    
    styleEl.innerHTML = styleStr;

    return () => {
      // Optional: don't remove on unmount so the theme persists smoothly across navigations
    };
  }, [boardTheme, pieceTheme]);

  return null;
};
