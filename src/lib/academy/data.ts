import { AcademyCategory, AcademyStage } from './types';

export const ACADEMY_CATEGORIES: AcademyCategory[] = [
  {
    id: 'chess-pieces',
    name: 'Chess Pieces',
    stages: [
      {
        "id": "rook",
        "title": "The Rook",
        "subtitle": "It Moves In Straight Lines",
        "intro": "Rook Intro",
        "complete": "Stage completed!",
        "levels": [
          {
            "id": 1,
            "goal": "Rook Goal",
            "fen": "8/8/8/8/8/8/4R3/8 w - -",
            "apples": [
              "e7"
            ],
            "nbMoves": 1
          },
          {
            "id": 2,
            "goal": "Grab All The Stars",
            "fen": "8/2R5/8/8/8/8/8/8 w - -",
            "apples": [
              "c5",
              "g5"
            ],
            "nbMoves": 2
          },
          {
            "id": 3,
            "goal": "The Fewer Moves",
            "fen": "8/8/8/8/3R4/8/8/8 w - -",
            "apples": [
              "a4",
              "g3",
              "g4"
            ],
            "nbMoves": 3
          },
          {
            "id": 4,
            "goal": "The Fewer Moves",
            "fen": "7R/8/8/8/8/8/8/8 w - -",
            "apples": [
              "f8",
              "g1",
              "g7",
              "g8",
              "h7"
            ],
            "nbMoves": 5
          },
          {
            "id": 5,
            "goal": "Use Two Rooks",
            "fen": "8/1R6/8/8/3R4/8/8/8 w - -",
            "apples": [
              "a4",
              "g3",
              "g7",
              "h4"
            ],
            "nbMoves": 4
          },
          {
            "id": 6,
            "goal": "Use Two Rooks",
            "fen": "8/8/8/8/8/5R2/8/R7 w - -",
            "apples": [
              "b7",
              "d1",
              "d5",
              "f2",
              "f7",
              "g4",
              "g7"
            ],
            "nbMoves": 7
          }
        ]
      },
      {
        "id": "bishop",
        "title": "The Bishop",
        "subtitle": "It Moves Diagonally",
        "intro": "Bishop Intro",
        "complete": "Stage completed!",
        "levels": [
          {
            "id": 1,
            "goal": "Grab All The Stars",
            "fen": "8/8/8/8/8/5B2/8/8 w - -",
            "apples": [
              "d5",
              "g8"
            ],
            "nbMoves": 2
          },
          {
            "id": 2,
            "goal": "The Fewer Moves",
            "fen": "8/8/8/8/8/1B6/8/8 w - -",
            "apples": [
              "a2",
              "b1",
              "b5",
              "d1",
              "d3",
              "e2"
            ],
            "nbMoves": 6
          },
          {
            "id": 3,
            "goal": "Grab All The Stars",
            "fen": "8/8/8/8/3B4/8/8/8 w - -",
            "apples": [
              "a1",
              "b6",
              "c1",
              "e3",
              "g7",
              "h6"
            ],
            "nbMoves": 6
          },
          {
            "id": 4,
            "goal": "Grab All The Stars",
            "fen": "8/8/8/8/2B5/8/8/8 w - -",
            "apples": [
              "a4",
              "b1",
              "b3",
              "c2",
              "d3",
              "e2"
            ],
            "nbMoves": 6
          },
          {
            "id": 5,
            "goal": "You Need Both Bishops",
            "fen": "8/8/8/8/8/8/8/2B2B2 w - -",
            "apples": [
              "d3",
              "d4",
              "d5",
              "e3",
              "e4",
              "e5"
            ],
            "nbMoves": 6
          },
          {
            "id": 6,
            "goal": "You Need Both Bishops",
            "fen": "8/3B4/8/8/8/2B5/8/8 w - -",
            "apples": [
              "a3",
              "c2",
              "e7",
              "f5",
              "f6",
              "g8",
              "h4",
              "h7"
            ],
            "nbMoves": 11
          }
        ]
      },
      {
        "id": "queen",
        "title": "The Queen",
        "subtitle": "Queen Combines Rook And Bishop",
        "intro": "Queen Intro",
        "complete": "Stage completed!",
        "levels": [
          {
            "id": 1,
            "goal": "Grab All The Stars",
            "fen": "8/8/8/8/8/8/4Q3/8 w - -",
            "apples": [
              "e5",
              "b8"
            ],
            "nbMoves": 2
          },
          {
            "id": 2,
            "goal": "Grab All The Stars",
            "fen": "8/8/8/8/3Q4/8/8/8 w - -",
            "apples": [
              "a3",
              "f2",
              "f8",
              "h3"
            ],
            "nbMoves": 4
          },
          {
            "id": 3,
            "goal": "Grab All The Stars",
            "fen": "8/8/8/8/2Q5/8/8/8 w - -",
            "apples": [
              "a3",
              "d6",
              "f1",
              "f8",
              "g3",
              "h6"
            ],
            "nbMoves": 6
          },
          {
            "id": 4,
            "goal": "Grab All The Stars",
            "fen": "8/6Q1/8/8/8/8/8/8 w - -",
            "apples": [
              "a2",
              "b5",
              "d3",
              "g1",
              "g8",
              "h2",
              "h5"
            ],
            "nbMoves": 7
          },
          {
            "id": 5,
            "goal": "Grab All The Stars",
            "fen": "8/8/8/8/8/8/8/4Q3 w - -",
            "apples": [
              "a6",
              "d1",
              "f2",
              "f6",
              "g6",
              "g8",
              "h1",
              "h4"
            ],
            "nbMoves": 9
          }
        ]
      },
      {
        "id": "king",
        "title": "The King",
        "subtitle": "The Most Important Piece",
        "intro": "King Intro",
        "complete": "Stage completed!",
        "levels": [
          {
            "id": 1,
            "goal": "The King Is Slow",
            "fen": "8/8/8/8/8/3K4/8/8 w - -",
            "apples": [
              "e6"
            ],
            "nbMoves": 3
          },
          {
            "id": 2,
            "goal": "Grab All The Stars",
            "fen": "8/8/8/8/8/8/8/4K3 w - -",
            "apples": [
              "c2",
              "d3",
              "e2",
              "e3"
            ],
            "nbMoves": 4
          },
          {
            "id": 3,
            "goal": "Last One",
            "fen": "8/8/8/4K3/8/8/8/8 w - -",
            "apples": [
              "b5",
              "c5",
              "d6",
              "e3",
              "f3",
              "g4"
            ],
            "nbMoves": 8
          }
        ]
      },
      {
        "id": "knight",
        "title": "The Knight",
        "subtitle": "It Moves In An L Shape",
        "intro": "Knight Intro",
        "complete": "Stage completed!",
        "levels": [
          {
            "id": 1,
            "goal": "Knights Have A Fancy Way",
            "fen": "8/8/8/8/4N3/8/8/8 w - -",
            "apples": [
              "c5",
              "d7"
            ],
            "nbMoves": 2
          },
          {
            "id": 2,
            "goal": "Grab All The Stars",
            "fen": "8/8/8/8/8/8/8/1N6 w - -",
            "apples": [
              "c3",
              "d4",
              "e2",
              "f3",
              "f7",
              "g5",
              "h8"
            ],
            "nbMoves": 8
          },
          {
            "id": 3,
            "goal": "Grab All The Stars",
            "fen": "8/2N5/8/8/8/8/8/8 w - -",
            "apples": [
              "b6",
              "d5",
              "d7",
              "e6",
              "f4"
            ],
            "nbMoves": 5
          },
          {
            "id": 4,
            "goal": "Knights Can Jump Over Obstacles",
            "fen": "8/8/8/8/5N2/8/8/8 w - -",
            "apples": [
              "e3",
              "e4",
              "e5",
              "f3",
              "f5",
              "g3",
              "g4",
              "g5"
            ],
            "nbMoves": 9
          },
          {
            "id": 5,
            "goal": "Grab All The Stars",
            "fen": "8/8/8/8/8/3N4/8/8 w - -",
            "apples": [
              "c3",
              "e2",
              "e4",
              "f2",
              "f4",
              "g6"
            ],
            "nbMoves": 6
          },
          {
            "id": 6,
            "goal": "Grab All The Stars",
            "fen": "8/2N5/8/8/8/8/8/8 w - -",
            "apples": [
              "b4",
              "b5",
              "c6",
              "c8",
              "d4",
              "d5",
              "e3",
              "e7",
              "f5"
            ],
            "nbMoves": 9
          }
        ]
      },
      {
        "id": "pawn",
        "title": "The Pawn",
        "subtitle": "It Moves Forward Only",
        "intro": "Pawn Intro",
        "complete": "Stage completed!",
        "levels": [
          {
            "id": 1,
            "goal": "Pawns Move One Square Only",
            "fen": "8/8/8/P7/8/8/8/8 w - -",
            "apples": [
              "f3"
            ],
            "nbMoves": 4
          },
          {
            "id": 2,
            "goal": "Most Of The Time Promoting To A Queen Is Best",
            "fen": "8/8/8/5P2/8/8/8/8 w - -",
            "apples": [
              "b6",
              "c4",
              "d7",
              "e5",
              "a8"
            ],
            "nbMoves": 8
          },
          {
            "id": 3,
            "goal": "Pawns Move Forward",
            "fen": "8/8/8/8/8/4P3/8/8 w - -",
            "apples": [
              "c6",
              "d5",
              "d7"
            ],
            "nbMoves": 4
          },
          {
            "id": 4,
            "goal": "Capture Then Promote",
            "fen": "8/8/8/8/8/1P6/8/8 w - -",
            "apples": [
              "b4",
              "b6",
              "c4",
              "c6",
              "c7",
              "d6"
            ],
            "nbMoves": 8
          },
          {
            "id": 5,
            "goal": "Capture Then Promote",
            "fen": "8/8/8/8/8/3P4/8/8 w - -",
            "apples": [
              "c4",
              "b5",
              "b6",
              "d5",
              "d7",
              "e6",
              "c8"
            ],
            "nbMoves": 8
          },
          {
            "id": 6,
            "goal": "Use All The Pawns",
            "fen": "8/8/8/8/8/P1PP3P/8/8 w - -",
            "apples": [
              "b5",
              "c5",
              "d4",
              "e5",
              "g4"
            ],
            "nbMoves": 7
          },
          {
            "id": 7,
            "goal": "A Pawn On The Second Rank",
            "fen": "8/8/8/8/8/8/4P3/8 w - -",
            "apples": [
              "d6"
            ],
            "nbMoves": 3
          },
          {
            "id": 8,
            "goal": "Grab All The Stars No Need To Promote",
            "fen": "8/8/8/8/8/8/2PPPP2/8 w - -",
            "apples": [
              "c5",
              "d5",
              "e5",
              "f5",
              "d3",
              "e4"
            ],
            "nbMoves": 9
          }
        ]
      },
    ]
  },
  {
    id: 'fundamentals',
    name: 'Fundamentals',
    stages: [
      {
        "id": "capture",
        "title": "Capture",
        "subtitle": "Take The Enemy Pieces",
        "intro": "Capture Intro",
        "complete": "Stage completed!",
        "levels": [
          {
            "id": 1,
            "goal": "Take The Black Pieces",
            "fen": "8/2p2p2/8/8/8/2R5/8/8 w - -",
            "apples": [],
            "nbMoves": 2
          },
          {
            "id": 2,
            "goal": "Take The Black Pieces And Dont Lose Yours",
            "fen": "8/2r2p2/8/8/5Q2/8/8/8 w - -",
            "apples": [],
            "nbMoves": 2
          },
          {
            "id": 3,
            "goal": "Take The Black Pieces And Dont Lose Yours",
            "fen": "8/5r2/8/1r3p2/8/3B4/8/8 w - -",
            "apples": [],
            "nbMoves": 5
          },
          {
            "id": 4,
            "goal": "Take The Black Pieces And Dont Lose Yours",
            "fen": "8/5b2/5p2/3n2p1/8/6Q1/8/8 w - -",
            "apples": [],
            "nbMoves": 7
          },
          {
            "id": 5,
            "goal": "Take The Black Pieces And Dont Lose Yours",
            "fen": "8/3b4/2p2q2/8/3p1N2/8/8/8 w - -",
            "apples": [],
            "nbMoves": 6
          }
        ]
      },
      {
        "id": "protection",
        "title": "Protection",
        "subtitle": "Keep Your Pieces Safe",
        "intro": "Protection Intro",
        "complete": "Stage completed!",
        "levels": [
          {
            "id": 1,
            "goal": "Dont Let Them Take Any Undefended Piece",
            "fen": "8/3q4/8/1N3R2/8/2PB4/8/8 w - -",
            "apples": [],
            "nbMoves": 1
          }
        ]
      },
      {
        "id": "combat",
        "title": "Combat",
        "subtitle": "Capture And Defend Pieces",
        "intro": "Combat Intro",
        "complete": "Stage completed!",
        "levels": [
          {
            "id": 1,
            "goal": "Take The Black Pieces And Dont Lose Yours",
            "fen": "8/8/8/8/P2r4/6B1/8/8 w - -",
            "apples": [],
            "nbMoves": 3
          },
          {
            "id": 2,
            "goal": "Take The Black Pieces And Dont Lose Yours",
            "fen": "2r5/8/3b4/2P5/8/1P6/2B5/8 w - -",
            "apples": [],
            "nbMoves": 4
          },
          {
            "id": 3,
            "goal": "Take The Black Pieces And Dont Lose Yours",
            "fen": "1r6/8/5n2/3P4/4P1P1/1Q6/8/8 w - -",
            "apples": [],
            "nbMoves": 4
          },
          {
            "id": 4,
            "goal": "Take The Black Pieces And Dont Lose Yours",
            "fen": "2r5/8/3N4/5b2/8/8/PPP5/8 w - -",
            "apples": [],
            "nbMoves": 4
          },
          {
            "id": 5,
            "goal": "Take The Black Pieces And Dont Lose Yours",
            "fen": "8/6q1/8/4P1P1/8/4B3/r2P2N1/8 w - -",
            "apples": [],
            "nbMoves": 8
          }
        ]
      },
      {
        "id": "check1",
        "title": "Check In One",
        "subtitle": "Attack The Opponents King",
        "intro": "Check In One Intro",
        "complete": "Stage completed!",
        "levels": []
      },
      {
        "id": "outOfCheck",
        "title": "Out Of Check",
        "subtitle": "Defend Your King",
        "intro": "Out Of Check Intro",
        "complete": "Stage completed!",
        "levels": []
      },
      {
        "id": "checkmate1",
        "title": "Mate In One",
        "subtitle": "Defeat The Opponents King",
        "intro": "Mate In One Intro",
        "complete": "Stage completed!",
        "levels": []
      },
    ]
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    stages: [
      {
        "id": "setup",
        "title": "Board Setup",
        "subtitle": "How The Game Starts",
        "intro": "Board Setup Intro",
        "complete": "Stage completed!",
        "levels": [
          {
            "id": 1,
            "goal": "This Is The Initial Position",
            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - -",
            "apples": [],
            "nbMoves": 1
          },
          {
            "id": 2,
            "goal": "First Place The Rooks",
            "fen": "r6r/pppppppp/8/8/8/8/8/2RR4 w - -",
            "apples": [
              "a1",
              "h1"
            ],
            "nbMoves": 2
          },
          {
            "id": 3,
            "goal": "Then Place The Knights",
            "fen": "rn4nr/pppppppp/8/8/8/8/2NN4/R6R w - -",
            "apples": [
              "b1",
              "g1"
            ],
            "nbMoves": 4
          },
          {
            "id": 4,
            "goal": "Place The Bishops",
            "fen": "rnb2bnr/pppppppp/8/8/4BB2/8/8/RN4NR w - -",
            "apples": [
              "c1",
              "f1"
            ],
            "nbMoves": 4
          },
          {
            "id": 5,
            "goal": "Place The Queen",
            "fen": "rnbq1bnr/pppppppp/8/8/5Q2/8/8/RNB2BNR w - -",
            "apples": [
              "d1"
            ],
            "nbMoves": 2
          },
          {
            "id": 6,
            "goal": "Place The King",
            "fen": "rnbqkbnr/pppppppp/8/8/5K2/8/8/RNBQ1BNR w - -",
            "apples": [
              "e1"
            ],
            "nbMoves": 3
          },
          {
            "id": 7,
            "goal": "Pawns Form The Front Line",
            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - -",
            "apples": [],
            "nbMoves": 1
          }
        ]
      },
      {
        "id": "castling",
        "title": "Castling",
        "subtitle": "The Special King Move",
        "intro": "Castling Intro",
        "complete": "Stage completed!",
        "levels": [
          {
            "id": 1,
            "goal": "Castle King Side",
            "fen": "rnbqkbnr/pppppppp/8/8/2B5/4PN2/PPPP1PPP/RNBQK2R w KQkq -",
            "apples": [],
            "nbMoves": 1
          },
          {
            "id": 2,
            "goal": "Castle Queen Side",
            "fen": "rnbqkbnr/pppppppp/8/8/4P3/1PN5/PBPPQPPP/R3KBNR w KQkq -",
            "apples": [],
            "nbMoves": 1
          },
          {
            "id": 3,
            "goal": "The Knight Is In The Way",
            "fen": "rnbqkbnr/pppppppp/8/8/8/4P3/PPPPBPPP/RNBQK1NR w KQkq -",
            "apples": [],
            "nbMoves": 2
          },
          {
            "id": 4,
            "goal": "Castle King Side Move Pieces First",
            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -",
            "apples": [],
            "nbMoves": 4
          },
          {
            "id": 5,
            "goal": "Castle Queen Side Move Pieces First",
            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -",
            "apples": [],
            "nbMoves": 6
          },
          {
            "id": 6,
            "goal": "You Cannot Castle If Moved",
            "fen": "rnbqkbnr/pppppppp/8/8/3P4/1PN1PN2/PBPQBPPP/R3K1R1 w Qkq -",
            "apples": [],
            "nbMoves": 1
          },
          {
            "id": 7,
            "goal": "You Cannot Castle If Attacked",
            "fen": "rn1qkbnr/ppp1pppp/3p4/8/2b5/4PN2/PPPP1PPP/RNBQK2R w KQkq -",
            "apples": [],
            "nbMoves": 2
          },
          {
            "id": 8,
            "goal": "Find A Way To Castle King Side",
            "fen": "rnb2rk1/pppppppp/8/8/8/4Nb1n/PPPP1P1P/RNB1KB1R w KQkq -",
            "apples": [],
            "nbMoves": 2
          },
          {
            "id": 9,
            "goal": "Find A Way To Castle Queen Side",
            "fen": "1r1k2nr/p2ppppp/7b/7b/4P3/2nP4/P1P2P2/RN2K3 w Q -",
            "apples": [],
            "nbMoves": 4
          }
        ]
      },
      {
        "id": "enpassant",
        "title": "The Special Pawn Move",
        "subtitle": "The Special Pawn Move",
        "intro": "En Passant Intro",
        "complete": "Stage completed!",
        "levels": [
          {
            "id": 1,
            "goal": "Black Just Moved The Pawn By Two Squares",
            "fen": "rnbqkbnr/pppppppp/8/2P5/8/8/PP1PPPPP/RNBQKBNR b KQkq -",
            "apples": [],
            "nbMoves": 1
          },
          {
            "id": 2,
            "goal": "En Passant Only Works Immediately",
            "fen": "rnbqkbnr/ppp1pppp/8/2Pp3P/8/8/PP1PPPP1/RNBQKBNR b KQkq -",
            "apples": [],
            "nbMoves": 1
          },
          {
            "id": 3,
            "goal": "En Passant Only Works On Fifth Rank",
            "fen": "rnbqkbnr/pppppppp/P7/2P5/8/8/PP1PPPP1/RNBQKBNR b KQkq -",
            "apples": [],
            "nbMoves": 1
          },
          {
            "id": 4,
            "goal": "Take All The Pawns En Passant",
            "fen": "rnbqkbnr/pppppppp/8/2PPP2P/8/8/PP1P1PP1/RNBQKBNR b KQkq -",
            "apples": [],
            "nbMoves": 4
          }
        ]
      },
      {
        "id": "stalemate",
        "title": "Stalemate",
        "subtitle": "The Game Is A Draw",
        "intro": "Stalemate Intro",
        "complete": "Stage completed!",
        "levels": []
      },
    ]
  },
  {
    id: 'advanced',
    name: 'Advanced',
    stages: [
      {
        "id": "value",
        "title": "Piece Value",
        "subtitle": "Evaluate Piece Strength",
        "intro": "Piece Value Intro",
        "complete": "Stage completed!",
        "levels": []
      },
      {
        "id": "check2",
        "title": "Check2",
        "subtitle": "Learn how to play",
        "intro": "Welcome to this lesson",
        "complete": "Stage completed!",
        "levels": []
      },
    ]
  },
];
