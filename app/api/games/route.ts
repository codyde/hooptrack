import { NextResponse } from 'next/server';
import { createGame, getGamesByTeamId, getGameStatsById, updateGameStats } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get('teamId');
  const gameId = searchParams.get('gameId');

  if (!teamId && !gameId) {
    return NextResponse.json({ error: 'Team ID or Game ID is required' }, { status: 400 });
  }

  try {
    if (gameId) {
      const stats = await getGameStatsById(gameId);
      return NextResponse.json(stats);
    }

    const games = await getGamesByTeamId(teamId!);
    return NextResponse.json(games);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { teamId, opponent, date, scoreTeam, scoreOpponent } = await request.json();
    
    if (!teamId || !opponent || !date || scoreTeam === undefined || scoreOpponent === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const id = await createGame(teamId, opponent, date, scoreTeam, scoreOpponent);
    return NextResponse.json({ id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create game' }, { status: 500 });
  }
}
