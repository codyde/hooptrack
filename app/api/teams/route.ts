import { NextResponse } from 'next/server';
import { createTeam, getTeams, getTeamById } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const team = await getTeamById(id);
      return NextResponse.json(team);
    }
    const teams = await getTeams();
    return NextResponse.json(teams);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    const id = await createTeam(name);
    return NextResponse.json({ id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 });
  }
}
