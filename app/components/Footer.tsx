import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-[hsl(var(--card))] shadow-md mt-8 border-t border-[hsl(var(--border))]">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-[hsl(var(--muted-foreground))] mb-4 md:mb-0">
            © 2025  SEKILAS. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <Link
              href="/about"
              className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]"
            >
              About
            </Link>
            <Link
              href="/privacy"
              className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

