"use client";

import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from 'date-fns';
import { BsCalendar } from "react-icons/bs";
import { GiTrophy } from "react-icons/gi";

export default function SchedulePage() {
  const { games, teams } = useStore();

  const gamesByDate = games.reduce((acc, game) => {
    const date = format(new Date(game.date), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(game);
    return acc;
  }, {} as Record<string, typeof games>);

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2">
        <BsCalendar className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Game Schedule</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
            <CardDescription>Select a date to view scheduled games</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={new Date()}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Games</CardTitle>
              <CardDescription>View all scheduled matches</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(gamesByDate)
                .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
                .map(([date, gamesOnDate]) => (
                  <div key={date} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">
                        {format(new Date(date), 'MMMM d, yyyy')}
                      </Badge>
                    </div>
                    {gamesOnDate.map((game) => {
                      const team = teams.find((t) => t.id === game.teamId);
                      return (
                        <TooltipProvider key={game.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Card>
                                <CardContent className="pt-6">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="font-semibold">
                                        {team?.name} vs {game.opponent}
                                      </p>
                                    </div>
                                    <GiTrophy className="h-5 w-5 text-primary" />
                                  </div>
                                </CardContent>
                              </Card>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Click to view game details</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })}
                  </div>
                ))}
              {Object.keys(gamesByDate).length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No games scheduled
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}