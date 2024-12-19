"use client";

import { useState, useRef } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { format } from 'date-fns';
import { BsPlusCircle, BsClock, BsStar } from 'react-icons/bs';
import { GiTrophy } from 'react-icons/gi';

export default function GamesPage() {
  const { teams, games, addGame, updateGameStats } = useStore();
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [opponent, setOpponent] = useState('');
  const [gameDate, setGameDate] = useState('');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const createGameCloseRef = useRef<HTMLButtonElement>(null);

  const selectedTeam = teams.find((team) => team.id === selectedTeamId);
  const selectedGame = games.find((game) => game.id === selectedGameId);

  const handleCreateGame = () => {
    if (selectedTeamId && opponent && gameDate) {
      addGame({
        teamId: selectedTeamId,
        opponent,
        date: gameDate,
        scoreTeam: 0,
        scoreOpponent: 0,
      });
      setOpponent('');
      setGameDate('');
      setSelectedTeamId('');
      createGameCloseRef.current?.click();
    }
  };

  const handleStatUpdate = (
    gameId: string,
    playerId: string,
    statType: 'points2' | 'points3' | 'rebounds' | 'steals'
  ) => {
    const game = games.find((g) => g.id === gameId);
    const playerStats = game?.stats.find((s) => s.playerId === playerId) || {
      playerId,
      points2: 0,
      points3: 0,
      rebounds: 0,
      steals: 0,
    };

    updateGameStats(gameId, {
      playerId,
      points2: statType === 'points2' ? (playerStats.points2 || 0) + 1 : (playerStats.points2 || 0),
      points3: statType === 'points3' ? (playerStats.points3 || 0) + 1 : (playerStats.points3 || 0),
      rebounds: statType === 'rebounds' ? (playerStats.rebounds || 0) + 1 : (playerStats.rebounds || 0),
      steals: statType === 'steals' ? (playerStats.steals || 0) + 1 : (playerStats.steals || 0),
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Games</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <BsPlusCircle className="mr-2 h-4 w-4" />
              New Game
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Game</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Team</Label>
                <Select
                  value={selectedTeamId}
                  onValueChange={setSelectedTeamId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Opponent</Label>
                <Input
                  value={opponent}
                  onChange={(e) => setOpponent(e.target.value)}
                  placeholder="Enter opponent team name"
                />
              </div>

              <div className="space-y-2">
                <Label>Game Date</Label>
                <Input
                  type="date"
                  value={gameDate}
                  onChange={(e) => setGameDate(e.target.value)}
                />
              </div>
              <Button onClick={handleCreateGame} className="w-full">Create Game</Button>
            </div>
            <DialogClose ref={createGameCloseRef} className="hidden" />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Games</TabsTrigger>
          <TabsTrigger value="completed">Completed Games</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            {games.map((game) => {
              const team = teams.find((t) => t.id === game.teamId);
              return (
                <Card key={game.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{team?.name} vs {game.opponent}</CardTitle>
                      <GiTrophy className="h-5 w-5 text-primary" />
                    </div>
                    <CardDescription>
                      {format(new Date(game.date), 'MMMM d, yyyy')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Select
                        value={selectedPlayerId || ''}
                        onValueChange={setSelectedPlayerId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select player" />
                        </SelectTrigger>
                        <SelectContent>
                          {team?.players.map((player) => (
                            <SelectItem key={player.id} value={player.id}>
                              {player.name} (#{player.number})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {selectedPlayerId && (
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="secondary"
                            onClick={() =>
                              handleStatUpdate(game.id, selectedPlayerId, 'points2')
                            }
                          >
                            <BsStar className="mr-2 h-4 w-4" />
                            +2 Points
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() =>
                              handleStatUpdate(game.id, selectedPlayerId, 'points3')
                            }
                          >
                            <BsStar className="mr-2 h-4 w-4" />
                            +3 Points
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() =>
                              handleStatUpdate(game.id, selectedPlayerId, 'rebounds')
                            }
                          >
                            <BsClock className="mr-2 h-4 w-4" />
                            +Rebound
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() =>
                              handleStatUpdate(game.id, selectedPlayerId, 'steals')
                            }
                          >
                            <BsClock className="mr-2 h-4 w-4" />
                            +Steal
                          </Button>
                        </div>
                      )}

                      <div className="mt-4">
                        <h3 className="font-semibold mb-2">Game Stats</h3>
                        {game.stats.map((stat) => {
                          const player = team?.players.find(
                            (p) => p.id === stat.playerId
                          );
                          return (
                            <div
                              key={stat.playerId}
                              className="text-sm space-y-1 p-3 bg-secondary rounded-lg mb-2"
                            >
                              <div className="font-medium">{player?.name}</div>
                              <div className="text-muted-foreground">
                                Points: {stat.points2 * 2 + stat.points3 * 3} |
                                Rebounds: {stat.rebounds} | Steals: {stat.steals}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        <TabsContent value="completed">
          <div className="text-center text-muted-foreground py-8">
            No completed games yet
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
