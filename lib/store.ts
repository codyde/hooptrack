"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Player {
  id: string;
  name: string;
  number: string;
  position: string;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
}

export interface GameStats {
  playerId: string;
  points2: number;
  points3: number;
  rebounds: number;
  steals: number;
}

export interface Game {
  id: string;
  teamId: string;
  opponent: string;
  date: string;
  stats: GameStats[];
  score: {
    team: number;
    opponent: number;
  };
}

interface StoreState {
  teams: Team[];
  games: Game[];
  addTeam: (team: Omit<Team, 'id'>) => void;
  addPlayer: (teamId: string, player: Omit<Player, 'id'>) => void;
  addGame: (game: Omit<Game, 'id'>) => void;
  updateGameStats: (gameId: string, stats: GameStats) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      teams: [],
      games: [],
      addTeam: (team) =>
        set((state) => ({
          teams: [...state.teams, { ...team, id: crypto.randomUUID() }],
        })),
      addPlayer: (teamId, player) =>
        set((state) => ({
          teams: state.teams.map((team) =>
            team.id === teamId
              ? {
                  ...team,
                  players: [...team.players, { ...player, id: crypto.randomUUID() }],
                }
              : team
          ),
        })),
      addGame: (game) =>
        set((state) => ({
          games: [...state.games, { ...game, id: crypto.randomUUID() }],
        })),
      updateGameStats: (gameId, stats) =>
        set((state) => ({
          games: state.games.map((game) =>
            game.id === gameId
              ? {
                  ...game,
                  stats: [...game.stats.filter((s) => s.playerId !== stats.playerId), stats],
                }
              : game
          ),
        })),
    }),
    {
      name: 'basketball-stats',
    }
  )
);