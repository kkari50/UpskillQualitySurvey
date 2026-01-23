import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Powered by{" "}
                <span className="font-semibold text-primary">Upskill ABA</span>
              </span>
            </div>
            <nav className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
            </nav>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Upskill ABA. All rights reserved.
            </p>
          </div>
          <p className="text-xs text-muted-foreground/70 text-center max-w-2xl">
            These materials are proprietary to Upskill ABA and intended for authorized use only.
            Unauthorized reproduction or distribution is prohibited.
          </p>
        </div>
      </div>
    </footer>
  );
}
