import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq, and } from 'drizzle-orm';
import Database from 'better-sqlite3';
import * as schema from './schema';

const sqlite = new Database('sqlite.db');
export const db = drizzle(sqlite, { schema });

// Helper functions for database operations
export async function getTeams() {
  return db.select().from(schema.teams);
}

export async function getTeamById(id: string) {
  return db.select().from(schema.teams).where(eq(schema.teams.id, id));
}

export async function getPlayersByTeamId(teamId: string) {
  return db.select().from(schema.players).where(eq(schema.players.teamId, teamId));
}

export async function getGamesByTeamId(teamId: string) {
  return db.select().from(schema.games).where(eq(schema.games.teamId, teamId));
}

export async function getGameStatsById(gameId: string) {
  return db.select().from(schema.gameStats).where(eq(schema.gameStats.gameId, gameId));
}

export async function createTeam(name: string) {
  const id = crypto.randomUUID();
  await db.insert(schema.teams).values({ id, name });
  return id;
}

export async function createPlayer(teamId: string, name: string, number: string, position: string) {
  const id = crypto.randomUUID();
  await db.insert(schema.players).values({ id, teamId, name, number, position });
  return id;
}

export async function createGame(
  teamId: string,
  opponent: string,
  date: string,
  scoreTeam: number,
  scoreOpponent: number
) {
  const id = crypto.randomUUID();
  await db.insert(schema.games).values({
    id,
    teamId,
    opponent,
    date,
    scoreTeam,
    scoreOpponent,
  });
  return id;
}

export async function updateGameStats(
  gameId: string,
  playerId: string,
  points2: number,
  points3: number,
  rebounds: number,
  steals: number
) {
  const id = crypto.randomUUID();
  // Delete existing stats for this player in this game
  await db
    .delete(schema.gameStats)
    .where(and(
      eq(schema.gameStats.gameId, gameId),
      eq(schema.gameStats.playerId, playerId)
    ));
  
  // Insert new stats
  await db.insert(schema.gameStats).values({
    id,
    gameId,
    playerId,
    points2,
    points3,
    rebounds,
    steals,
  });
}
