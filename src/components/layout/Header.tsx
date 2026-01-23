"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BarChart3 } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isResultsPage = pathname === "/results" || pathname.startsWith("/results/");

  return (
    <header className="border-b border-border bg-white">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        {/* Left side - Logo/Brand (links to main Upskill ABA site) */}
        <a
          href="https://upskillaba.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center"
        >
          {/* Full logo on desktop, avatar on mobile */}
          <Image
            src="/images/logo.png"
            alt="Upskill ABA"
            width={150}
            height={40}
            className="hidden sm:block h-8 w-auto"
            priority
          />
          <Image
            src="/images/avatar.png"
            alt="Upskill ABA"
            width={40}
            height={40}
            className="sm:hidden h-9 w-9"
            priority
          />
        </a>

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
