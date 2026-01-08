import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Powered by{" "}
              <span className="font-semibold text-primary">UpskillABA</span>
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
            &copy; {new Date().getFullYear()} UpskillABA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
