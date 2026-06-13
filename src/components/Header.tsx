"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function Header() {
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
        </div>
      </div>
    </header>
  );
}

