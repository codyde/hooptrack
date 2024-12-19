import { NextResponse } from 'next/server';
import { updateGameStats } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { gameId, playerId, points2, points3, rebounds, steals } = await request.json();
    
    if (!gameId || !playerId || points2 === undefined || points3 === undefined || 
        rebounds === undefined || steals === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await updateGameStats(gameId, playerId, points2, points3, rebounds, steals);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update game stats' }, { status: 500 });
  }
}
