import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import Link from "next/link";
import { HiUsers } from "react-icons/hi";
import { GiBasketballBall } from "react-icons/gi";
import { BsCalendar } from "react-icons/bs";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-primary">HoopTrack</h1>
        <p className="text-xl text-muted-foreground">Track your team's progress, manage games, and celebrate victories!</p>
      </section>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <HiUsers className="w-8 h-8 mb-2 text-primary" />
            <CardTitle>Teams & Players</CardTitle>
            <CardDescription>Manage your teams and roster</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/teams">
              <Button className="w-full">View Teams</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <GiBasketballBall className="w-8 h-8 mb-2 text-primary" />
            <CardTitle>Games</CardTitle>
            <CardDescription>Record game stats and scores</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/games">
              <Button className="w-full">Manage Games</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <BsCalendar className="w-8 h-8 mb-2 text-primary" />
            <CardTitle>Schedule</CardTitle>
            <CardDescription>View upcoming games</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/schedule">
              <Button className="w-full">View Schedule</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}