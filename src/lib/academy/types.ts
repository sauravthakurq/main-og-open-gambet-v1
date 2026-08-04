export interface AcademyLevel {
  id: number;
  goal: string;
  fen: string;
  apples: string[];
  nbMoves: number;
  captures?: number;
  pointsForCapture?: boolean;
  detectCapture?: 'unprotected' | boolean;
}

export interface AcademyStage {
  id: string;
  title: string;
  subtitle: string;
  intro: string;
  complete: string;
  levels: AcademyLevel[];
}

export interface AcademyCategory {
  id: string;
  name: string;
  stages: AcademyStage[];
}
