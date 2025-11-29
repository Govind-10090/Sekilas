"use client"

import { useState, useEffect } from 'react'
import { Menu, X, Home, TrendingUp, Search, ChevronDown, Sun, Moon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const categories = [
  { name: 'Business', slug: 'business' },
  { name: 'Technology', slug: 'technology' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Entertainment', slug: 'entertainment' },
  { name: 'Health', slug: 'health' },
  { name: 'Science', slug: 'science' }
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    // Load theme from localStorage
    const stored = localStorage.getItem('theme')
    if (stored === 'light') setDarkMode(false)
    else setDarkMode(true)
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode((d) => !d)

  const isActive = (path: string) => pathname === path

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-glass bg-[hsl(var(--card))] border-b border-[hsl(var(--border))] shadow-glass transition-all text-[hsl(var(--card-foreground))]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-3xl font-serif font-bold text-gold tracking-wide drop-shadow-sm select-none" style={{ fontFamily: 'Playfair Display, serif' }}>
              Sekilas
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-lg ${
                isActive('/') ? 'text-gold bg-gold/10 shadow-gold' : 'text-[hsl(var(--card-foreground))] hover:text-gold'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>

            <Link 
              href="/trending" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-lg ${
                isActive('/trending') ? 'text-gold bg-gold/10 shadow-gold' : 'text-[hsl(var(--card-foreground))] hover:text-gold'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span>Trending</span>
            </Link>

            <Link 
              href="/search" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-lg ${
                isActive('/search') ? 'text-gold bg-gold/10 shadow-gold' : 'text-[hsl(var(--card-foreground))] hover:text-gold'
              }`}
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </Link>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center space-x-2 text-[hsl(var(--card-foreground))] hover:text-gold px-4 py-2 rounded-xl font-medium text-lg transition-all duration-200"
              >
                <span>Categories</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {isCategoriesOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-[hsl(var(--card))] border border-gold/60 rounded-xl shadow-glass py-2 backdrop-blur-glass">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/category/${category.slug}`}
                      className="block px-4 py-2 text-[hsl(var(--card-foreground))] hover:text-gold transition-colors rounded-lg"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="ml-4 p-2 rounded-full border border-gold bg-transparent text-gold hover:bg-gold/10 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 rounded-xl bg-gold/10 text-gold hover:bg-gold/20 transition-all"
            >
              {isMenuOpen ? (
                <X className="w-7 h-7" />
              ) : (
                <Menu className="w-7 h-7" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 motion-fade motion-fade-in bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className={`flex items-center space-x-2 p-3 rounded-xl text-lg font-medium transition-all ${
                  isActive('/') ? 'bg-gold/10 text-gold shadow-gold' : 'text-[hsl(var(--card-foreground))] hover:text-gold'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>

              <Link 
                href="/trending" 
                className={`flex items-center space-x-2 p-3 rounded-xl text-lg font-medium transition-all ${
                  isActive('/trending') ? 'bg-gold/10 text-gold shadow-gold' : 'text-[hsl(var(--card-foreground))] hover:text-gold'
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                <span>Trending</span>
              </Link>

              <Link 
                href="/search" 
                className={`flex items-center space-x-2 p-3 rounded-xl text-lg font-medium transition-all ${
                  isActive('/search') ? 'bg-gold/10 text-gold shadow-gold' : 'text-[hsl(var(--card-foreground))] hover:text-gold'
                }`}
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </Link>

              <div className="px-2 py-2">
                <h3 className="text-sm font-semibold text-[hsl(var(--card-foreground))] mb-2">Categories</h3>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/category/${category.slug}`}
                      className="block px-3 py-2 text-lg text-[hsl(var(--card-foreground))] hover:text-gold rounded-lg transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className="mt-4 p-3 rounded-full border border-gold bg-transparent text-gold hover:bg-gold/10 transition-colors self-start"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 