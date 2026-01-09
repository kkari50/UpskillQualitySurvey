"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3 } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isResultsPage = pathname === "/results" || pathname.startsWith("/results/");

  return (
    <header className="border-b border-border bg-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left side - Logo/Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">UpskillABA</span>
        </Link>

        {/* Right side - Navigation */}
        <nav className="flex items-center gap-4 sm:gap-6">
          {!isHomePage && (
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Survey Home
            </Link>
          )}
          {!isResultsPage && (
            <Link
              href="/results"
              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Survey Results</span>
              <span className="sm:hidden">Results</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
