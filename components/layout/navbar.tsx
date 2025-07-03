"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown, Search } from "lucide-react"
import { navigationConfig } from "@/lib/nav"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  return (
    <nav className="bg-blue-700 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-blue-700 font-bold text-sm">TTC</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight">Texas Technical</span>
              <span className="text-xs leading-tight">College</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationConfig.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link href={item.href} className="flex items-center space-x-1 hover:text-blue-200 transition-colors">
                  <span>{item.label}</span>
                  {item.children && <ChevronDown className="w-4 h-4" />}
                </Link>

                {item.children && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white text-gray-900 rounded-md shadow-lg py-2 z-50">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors">
              <Search className="w-4 h-4" />
              <span>Ask Anything</span>
            </button>
            <Link
              href="/programs"
              className="btn-outline bg-transparent border-white text-white hover:bg-white hover:text-blue-700"
            >
              View Programs
            </Link>
            <Link href="/admissions/apply" className="btn-primary">
              Apply Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2" aria-label="Toggle menu">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-blue-600">
            {navigationConfig.map((item) => (
              <div key={item.label} className="py-2">
                <Link
                  href={item.href}
                  className="block py-2 hover:text-blue-200 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-4 mt-2 space-y-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block py-1 text-blue-200 hover:text-white transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 space-y-2">
              <Link href="/programs" className="block btn-outline text-center">
                View Programs
              </Link>
              <Link href="/admissions/apply" className="block btn-primary text-center">
                Apply Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
