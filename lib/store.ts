'use client';

import React, { createContext, useContext, useCallback, useEffect, useState, type ReactNode } from 'react';

export interface Player {
  id: string;
  teamId: string;
  name: string;
  number: string;
  position: string;
}

export interface Team {
  id: string;
  name: string;
}

export interface GameStats {
  id: string;
  gameId: string;
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
  scoreTeam: number;
  scoreOpponent: number;
}

interface StoreContextType {
  teams: (Team & { players: Player[] })[];
  games: (Game & { stats: GameStats[] })[];
  addTeam: (team: { name: string }) => Promise<string>;
  addPlayer: (teamId: string, player: Omit<Player, 'id' | 'teamId'>) => Promise<void>;
  addGame: (game: Omit<Game, 'id'>) => Promise<string>;
  updateGameStats: (gameId: string, stats: Omit<GameStats, 'id' | 'gameId'>) => Promise<void>;
  loadTeams: () => Promise<void>;
  loadGames: (teamId: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export function StoreProvider({ children }: Props) {
  const [teams, setTeams] = useState<(Team & { players: Player[] })[]>([]);
  const [games, setGames] = useState<(Game & { stats: GameStats[] })[]>([]);

  const loadTeams = useCallback(async () => {
    try {
      const response = await fetch('/api/teams');
      const teamsData = await response.json();
      
      // Load players for each team
      const teamsWithPlayers = await Promise.all(
        teamsData.map(async (team: Team) => {
          const playersResponse = await fetch(`/api/players?teamId=${team.id}`);
          const players = await playersResponse.json();
          return { ...team, players };
        })
      );
      
      setTeams(teamsWithPlayers);
    } catch (error) {
      console.error('Failed to load teams:', error);
    }
  }, []);

  const loadGames = useCallback(async (teamId: string) => {
    try {
      const response = await fetch(`/api/games?teamId=${teamId}`);
      const gamesData = await response.json();
      
      // Load stats for each game
      const gamesWithStats = await Promise.all(
        gamesData.map(async (game: Game) => {
          const statsResponse = await fetch(`/api/game-stats?gameId=${game.id}`);
          const stats = await statsResponse.json();
          return { ...game, stats };
        })
      );
      
      setGames(gamesWithStats);
    } catch (error) {
      console.error('Failed to load games:', error);
    }
  }, []);

  const addTeam = useCallback(async (team: { name: string }) => {
    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(team),
      });
      const { id } = await response.json();
      await loadTeams();
      return id;
    } catch (error) {
      console.error('Failed to add team:', error);
      throw error;
    }
  }, [loadTeams]);

  const addPlayer = useCallback(async (teamId: string, player: Omit<Player, 'id' | 'teamId'>) => {
    try {
      await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, ...player }),
      });
      await loadTeams();
    } catch (error) {
      console.error('Failed to add player:', error);
      throw error;
    }
  }, [loadTeams]);

  const addGame = useCallback(async (game: Omit<Game, 'id'>) => {
    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(game),
      });
      const { id } = await response.json();
      await loadGames(game.teamId);
      return id;
    } catch (error) {
      console.error('Failed to add game:', error);
      throw error;
    }
  }, [loadGames]);

  const updateGameStats = useCallback(async (gameId: string, stats: Omit<GameStats, 'id' | 'gameId'>) => {
    try {
      await fetch('/api/game-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, ...stats }),
      });
      const game = games.find(g => g.id === gameId);
      if (game) {
        await loadGames(game.teamId);
      }
    } catch (error) {
      console.error('Failed to update game stats:', error);
      throw error;
    }
  }, [games, loadGames]);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  const value = {
    teams,
    games,
    addTeam,
    addPlayer,
    addGame,
    updateGameStats,
    loadTeams,
    loadGames,
  };

  return React.createElement(StoreContext.Provider, { value }, children);
}

export function useStore(): StoreContextType {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
