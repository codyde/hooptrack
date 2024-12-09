"use client";

import * as React from "react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { GiBasketballBall } from "react-icons/gi";

export default function Navbar() {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <GiBasketballBall className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">HoopTrack</span>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link 
              href="/teams" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Teams
            </Link>
            <Link 
              href="/games" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Games
            </Link>
            <Link 
              href="/schedule" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Schedule
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}