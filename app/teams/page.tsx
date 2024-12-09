"use client";

import { useState, useRef } from 'react';
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BsPlusCircle, BsPersonPlusFill } from "react-icons/bs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export default function TeamsPage() {
  const { teams, addTeam, addPlayer } = useStore();
  const [newTeamName, setNewTeamName] = useState('');
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    number: '',
    position: '',
  });
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const addTeamCloseRef = useRef<HTMLButtonElement>(null);
  const addPlayerCloseRef = useRef<HTMLButtonElement>(null);

  const handleAddTeam = () => {
    if (newTeamName.trim()) {
      addTeam({ name: newTeamName, players: [] });
      setNewTeamName('');
      addTeamCloseRef.current?.click();
    }
  };

  const handleAddPlayer = () => {
    if (selectedTeamId && newPlayer.name.trim()) {
      addPlayer(selectedTeamId, newPlayer);
      setNewPlayer({ name: '', number: '', position: '' });
      addPlayerCloseRef.current?.click();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Teams</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <BsPlusCircle className="mr-2 h-4 w-4" />
              Add Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Team</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teamName">Team Name</Label>
                <Input
                  id="teamName"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Enter team name"
                />
              </div>
              <Button onClick={handleAddTeam}>Create Team</Button>
            </div>
            <DialogClose ref={addTeamCloseRef} className="hidden" />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {teams.map((team) => (
          <Card key={team.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{team.name}</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedTeamId(team.id)}
                  >
                    <BsPersonPlusFill className="mr-2 h-4 w-4" />
                    Add Player
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Player to {team.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="playerName">Player Name</Label>
                      <Input
                        id="playerName"
                        value={newPlayer.name}
                        onChange={(e) =>
                          setNewPlayer({ ...newPlayer, name: e.target.value })
                        }
                        placeholder="Enter player name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="playerNumber">Jersey Number</Label>
                      <Input
                        id="playerNumber"
                        value={newPlayer.number}
                        onChange={(e) =>
                          setNewPlayer({ ...newPlayer, number: e.target.value })
                        }
                        placeholder="Enter jersey number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="playerPosition">Position</Label>
                      <Input
                        id="playerPosition"
                        value={newPlayer.position}
                        onChange={(e) =>
                          setNewPlayer({ ...newPlayer, position: e.target.value })
                        }
                        placeholder="Enter position"
                      />
                    </div>
                    <Button onClick={handleAddPlayer}>Add Player</Button>
                  </div>
                  <DialogClose ref={addPlayerCloseRef} className="hidden" />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {team.players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-2 bg-secondary rounded-lg"
                  >
                    <span className="font-medium">{player.name}</span>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>#{player.number}</span>
                      <span>{player.position}</span>
                    </div>
                  </div>
                ))}
                {team.players.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    No players added yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}