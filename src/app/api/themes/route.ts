import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const publicAssetsPath = path.join(process.cwd(), 'public', 'assets');
    const boardsPath = path.join(publicAssetsPath, 'boards');
    const piecesPath = path.join(publicAssetsPath, 'pieces');

    // Read boards (looking for .png or .jpg files)
    let boards: string[] = [];
    if (fs.existsSync(boardsPath)) {
      const files = fs.readdirSync(boardsPath);
      boards = files
        .filter(f => f.endsWith('.png') || f.endsWith('.jpg'))
        .map(f => f.replace(/\.(png|jpg)$/, ''));
    }

    // Read pieces (looking for directories)
    let pieces: string[] = [];
    if (fs.existsSync(piecesPath)) {
      const dirs = fs.readdirSync(piecesPath, { withFileTypes: true });
      pieces = dirs
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    }

    return NextResponse.json({
      boards,
      pieces,
    });
  } catch (error) {
    console.error('Failed to read themes:', error);
    return NextResponse.json({ error: 'Failed to read themes' }, { status: 500 });
  }
}
