import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const teams = sqliteTable('teams', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
});

export const players = sqliteTable('players', {
  id: text('id').primaryKey(),
  teamId: text('team_id').notNull().references(() => teams.id),
  name: text('name').notNull(),
  number: text('number').notNull(),
  position: text('position').notNull(),
});

export const games = sqliteTable('games', {
  id: text('id').primaryKey(),
  teamId: text('team_id').notNull().references(() => teams.id),
  opponent: text('opponent').notNull(),
  date: text('date').notNull(),
  scoreTeam: integer('score_team').notNull(),
  scoreOpponent: integer('score_opponent').notNull(),
});

export const gameStats = sqliteTable('game_stats', {
  id: text('id').primaryKey(),
  gameId: text('game_id').notNull().references(() => games.id),
  playerId: text('player_id').notNull().references(() => players.id),
  points2: integer('points_2').notNull(),
  points3: integer('points_3').notNull(),
  rebounds: integer('rebounds').notNull(),
  steals: integer('steals').notNull(),
});
