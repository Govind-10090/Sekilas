"use client"

import { useState } from "react"
import { Globe, ChevronDown } from "lucide-react"

interface Country {
  code: string
  name: string
  flag: string
}

const countries: Country[] = [
  { code: "global", name: "Global", flag: "🌎" },
  { code: "us", name: "United States", flag: "🇺🇸" },
  { code: "uk", name: "United Kingdom", flag: "🇬🇧" },
  { code: "india", name: "India", flag: "🇮🇳" },
  { code: "canada", name: "Canada", flag: "🇨🇦" },
  { code: "australia", name: "Australia", flag: "🇦🇺" },
]

interface CountrySelectorProps {
  onCountryChange: (country: string) => void
  selectedCountry?: string
}

export default function CountrySelector({ onCountryChange, selectedCountry = "global" }: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedCountryData = countries.find(c => c.code === selectedCountry) || countries[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="text-xl">{selectedCountryData.flag}</span>
        <span className="text-gray-700 dark:text-gray-300">{selectedCountryData.name}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <ul className="py-2">
            {countries.map((country) => (
              <li key={country.code}>
                <button
                  onClick={() => {
                    onCountryChange(country.code)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    selectedCountry === country.code ? 'bg-gray-100 dark:bg-gray-700' : ''
                  }`}
                >
                  <span className="text-xl">{country.flag}</span>
                  <span className="text-gray-700 dark:text-gray-300">{country.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
} 