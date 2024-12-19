import { NextResponse } from 'next/server';
import { createPlayer, getPlayersByTeamId } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get('teamId');

  if (!teamId) {
    return NextResponse.json({ error: 'Team ID is required' }, { status: 400 });
  }

  try {
    const players = await getPlayersByTeamId(teamId);
    return NextResponse.json(players);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { teamId, name, number, position } = await request.json();
    
    if (!teamId || !name || !number || !position) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const id = await createPlayer(teamId, name, number, position);
    return NextResponse.json({ id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create player' }, { status: 500 });
  }
}
