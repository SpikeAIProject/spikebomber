'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/#features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
];

export function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold neon-text">
            SPIKE AI
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <Link
                href="/dashboard"
                className="h-9 px-4 rounded-lg bg-gradient-neon text-white text-sm font-medium shadow-neon-blue hover:shadow-neon-blue-lg transition-all"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="h-9 px-4 rounded-lg text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="h-9 px-4 rounded-lg bg-gradient-neon text-white text-sm font-medium shadow-neon-blue hover:shadow-neon-blue-lg transition-all"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-text-secondary hover:text-text-primary"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background-secondary">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-sm text-text-secondary hover:text-text-primary"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border flex flex-col gap-2">
              {session ? (
                <Link href="/dashboard" className="text-sm text-neon-blue">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-sm text-text-secondary">Sign in</Link>
                  <Link href="/register" className="text-sm text-neon-blue">Get started →</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
