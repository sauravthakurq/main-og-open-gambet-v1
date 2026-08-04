'use client';

import React, { useRef, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/store/useGameStore';
import { useAppStore } from '@/store/useAppStore';
import { audioManager } from '@/lib/audioManager';
import { useOnlineGameSync } from '@/hooks/useOnlineGameSync';
import { Square } from 'chess.js';

const PIECES = {
  K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
  k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟'
};

const COLS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

function BoardMesh() {
  const group = useRef<THREE.Group>(null);
  const size = 1;
  const offset = (8 * size) / 2 - (size / 2);
  
  const { game, turn, makeMove, orientation } = useGameStore();
  const matchConfig = useAppStore(state => state.matchConfig);
  // Removed useSoundEngine
  
  // AI color calculation
  const userColor = matchConfig?.color || 'w';
  const aiColor = userColor === 'w' ? 'b' : 'w';
  const { submitOnlineMove, isMyTurn } = useOnlineGameSync();
  const isHumanTurn = matchConfig?.opponentType === 'online' 
    ? isMyTurn 
    : (matchConfig?.opponentType === 'aivsai' ? false : (matchConfig?.opponentType === 'local' || turn !== aiColor));
  
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  
  // Create an 8x8 grid for the chessboard
  const squares = useMemo(() => {
    const temp = [];
    const board = game.board(); // 2D array [8][8] from 'a8' to 'h1'
    
    // board[0][0] is a8 (row=0, col=0)
    // We want our 3D grid to map correctly: row 0 (z) should be rank 8, col 0 (x) should be file 'a'
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isDark = (row + col) % 2 === 1;
        const piece = board[row][col]; // { type: 'r', color: 'b' }
        const squareId = `${COLS[col]}${8 - row}` as Square;
        
        let pieceChar = null;
        if (piece) {
          const char = piece.color === 'w' ? piece.type.toUpperCase() : piece.type.toLowerCase();
          pieceChar = char;
        }

        temp.push({
          id: squareId,
          position: [col * size - offset, 0, row * size - offset] as [number, number, number],
          color: isDark ? '#1a1714' : '#e6d8c3',
          highlightColor: isDark ? '#4a5724' : '#b2c75a',
          piece: pieceChar,
          isWhite: piece?.color === 'w'
        });
      }
    }
    return temp;
  }, [game.fen()]);

  const handleSquareClick = (squareId: Square) => {
    if (selectedSquare) {
      if (selectedSquare === squareId) {
        setSelectedSquare(null); // Deselect
        return;
      }
      
      // Try to move
      const moves = game.moves({ verbose: true });
      const moveObj = moves.find(m => m.from === selectedSquare && m.to === squareId);
      
      if (moveObj) {
        const isPromotion = moveObj.flags.includes('p') || moveObj.flags.includes('c');
        const success = makeMove(selectedSquare, squareId, isPromotion ? 'q' : undefined);
        
        if (success) {
          if (matchConfig?.opponentType === 'online') {
            submitOnlineMove(selectedSquare, squareId, isPromotion ? 'q' : undefined);
          }
          // Sounds are now handled globally inside makeMove
        }
      } else {
        audioManager.play('illegal');
      }
      setSelectedSquare(null);
    } else {
      // Select a piece if it belongs to current turn and it is a human turn
      const piece = game.get(squareId);
      if (piece && piece.color === turn && isHumanTurn) {
        setSelectedSquare(squareId);
      }
    }
  };

  return (
    <group ref={group} receiveShadow rotation={[0, orientation === 'b' ? Math.PI : 0, 0]}>
      {/* Luxury Walnut Frame around the board */}
      <RoundedBox args={[8.4, 0.4, 8.4]} position={[0, -0.2, 0]} radius={0.05} receiveShadow castShadow>
        <meshStandardMaterial color="#1a1105" roughness={0.7} />
      </RoundedBox>

      {/* The 64 squares and pieces */}
      {squares.map((sq, i) => {
        const isSelected = selectedSquare === sq.id;
        const isLegalMove = selectedSquare && game.moves({ verbose: true }).some(m => m.from === selectedSquare && m.to === sq.id);
        
        return (
          <group key={i} position={sq.position}>
            <mesh 
              receiveShadow 
              onClick={(e) => { e.stopPropagation(); handleSquareClick(sq.id); }}
              onPointerOver={() => document.body.style.cursor = 'pointer'}
              onPointerOut={() => document.body.style.cursor = 'auto'}
            >
              <boxGeometry args={[1, 0.1, 1]} />
              <meshStandardMaterial 
                color={isSelected ? sq.highlightColor : sq.color} 
                roughness={0.4} 
                metalness={0.1}
              />
            </mesh>
            
            {/* Legal move indicator */}
            {isLegalMove && (
              <mesh position={[0, 0.06, 0]}>
                <circleGeometry args={[0.15, 32]} />
                <meshBasicMaterial color="rgba(0,0,0,0.3)" transparent />
              </mesh>
            )}
            
            {sq.piece && (
              <Text
                position={[0, 0.1, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={0.7}
                color={sq.isWhite ? '#ffffff' : '#000000'}
                anchorX="center"
                anchorY="middle"
                renderOrder={1}
                onClick={(e) => { e.stopPropagation(); handleSquareClick(sq.id); }}
              >
                {PIECES[sq.piece as keyof typeof PIECES]}
              </Text>
            )}
          </group>
        );
      })}
    </group>
  );
}

export default function ChessBoard3D() {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] relative">
      <Canvas shadows camera={{ position: [0, 8, 8], fov: 45 }}>
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 10, 30]} />
        
        <ambientLight intensity={0.4} />
        <directionalLight castShadow position={[5, 10, 5]} intensity={1.5} shadow-mapSize={2048} />
        <spotLight position={[-5, 8, -5]} intensity={2} color="#b8a48e" angle={0.6} penumbra={1} />
        
        <BoardMesh />

        <Environment preset="studio" environmentIntensity={0.2} />
        <OrbitControls 
          enablePan={false} 
          minPolarAngle={0} 
          maxPolarAngle={Math.PI / 2.5}
          minDistance={6}
          maxDistance={15}
        />
      </Canvas>
    </div>
  );
}
