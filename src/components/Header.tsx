"use client";
import React, { useState } from "react";
import Link from "next/link";
import { GraduationCap, Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
                <GraduationCap className="h-5.5 w-5.5" />
              </div>
              <span className="bg-gradient-to-r bg-clip-text text-lg font-bold tracking-tight text-indigo-950 sm:text-xl">
                🎓 TGEAPCET Predictor 2026
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link href="/predictor" className="hover:text-indigo-600 transition-colors">College Predictor</Link>
              <Link href="/top-colleges" className="hover:text-indigo-600 transition-colors">Top Colleges</Link>
              <Link href="/option-builder" className="hover:text-indigo-600 transition-colors">Option Entry</Link>
              <Link href="/trends" className="hover:text-indigo-600 transition-colors">Trend Analysis</Link>
              <Link href="/advisor" className="hover:text-indigo-600 transition-colors">Advisor</Link>
            </nav>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex md:hidden items-center justify-center h-9 w-9 rounded-xl border border-slate-200 bg-slate-50 text-slate-650 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <nav className="md:hidden flex flex-col gap-2 py-3 border-t border-slate-100 text-xs font-bold text-slate-755 animate-in fade-in slide-in-from-top-2 duration-150">
            <Link 
              href="/predictor" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-slate-55 active:bg-slate-100 transition-colors"
            >
              <span>🎯</span>
              <span>College Predictor</span>
            </Link>
            <Link 
              href="/top-colleges" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-slate-55 active:bg-slate-100 transition-colors"
            >
              <span>🏛️</span>
              <span>Top Colleges</span>
            </Link>
            <Link 
              href="/option-builder" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-slate-55 active:bg-slate-100 transition-colors"
            >
              <span>📋</span>
              <span>Option Entry List</span>
            </Link>
            <Link 
              href="/trends" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-slate-55 active:bg-slate-100 transition-colors"
            >
              <span>📈</span>
              <span>Trend Analysis</span>
            </Link>
            <Link 
              href="/advisor" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-slate-55 active:bg-slate-100 transition-colors"
            >
              <span>💡</span>
              <span>Counselling Advisor</span>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}


