"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Compass, ShieldAlert, Award, ChevronRight, Zap } from "lucide-react";
import Header from "@/components/Header";

interface RankVsCollegeClientProps {
  colleges: any[];
  branches: any[];
  cutoffs: any[];
}

export default function RankVsCollegeClient({ colleges, branches, cutoffs }: RankVsCollegeClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("OC");
  const [selectedGender, setSelectedGender] = useState("BOYS");
  const [userRank, setUserRank] = useState("");
  const [activeRange, setActiveRange] = useState<string>("5000-15000");

  const categories = ["OC", "BC_A", "BC_B", "BC_C", "BC_D", "BC_E", "SC_I", "SC_II", "SC_III", "ST", "EWS"];
  const genders = ["BOYS", "GIRLS"];

  // Define rank bracket ranges
  const brackets = [
    { label: "Top Tier (Under 5,000)", key: "under-5000", min: 0, max: 5000, color: "from-amber-500 to-orange-500", bg: "bg-amber-50 text-amber-800 border-amber-100" },
    { label: "Elite Tier (5,000 - 15,000)", key: "5000-15000", min: 5000, max: 15000, color: "from-indigo-500 to-violet-500", bg: "bg-indigo-50 text-indigo-800 border-indigo-100" },
    { label: "Mid-High Tier (15,000 - 30,000)", key: "15000-30000", min: 15000, max: 30000, color: "from-blue-500 to-cyan-500", bg: "bg-blue-50 text-blue-800 border-blue-100" },
    { label: "Mid Tier (30,000 - 60,000)", key: "30000-60000", min: 30000, max: 60000, color: "from-emerald-500 to-teal-500", bg: "bg-emerald-50 text-emerald-800 border-emerald-100" },
    { label: "Average/Safe Tier (Above 60,000)", key: "above-60000", min: 60000, max: 999999, color: "from-slate-500 to-slate-700", bg: "bg-slate-50 text-slate-800 border-slate-100" }
  ];

  // Calculate cutoffs for each college based on selected Category + Gender
  // We determine a college's tier by its lowest cutoff rank (e.g. CSE branch cutoff)
  const collegeCutoffs = useMemo(() => {
    const finalCutoffs = cutoffs.filter(
      (c) => c.category === selectedCategory && c.gender === selectedGender && c.phase?.code === "FINAL"
    );

    return colleges.map((col) => {
      // Find all branch cutoffs for this college
      const colCutoffs = finalCutoffs.filter((c) => (c.collegeCode || c.college?.code) === col.code);
      
      // Get the minimum cutoff (most competitive, usually CSE)
      const minCutoff = colCutoffs.length > 0 ? Math.min(...colCutoffs.map((c) => c.rank)) : 999999;
      
      // Get branch specific cutoffs for preview
      const cseCutoff = colCutoffs.find((c) => (c.branchCode || c.branch?.code) === "CSE")?.rank || null;
      const csmCutoff = colCutoffs.find((c) => (c.branchCode || c.branch?.code) === "CSM")?.rank || null;
      const eceCutoff = colCutoffs.find((c) => (c.branchCode || c.branch?.code) === "ECE")?.rank || null;

      return {
        ...col,
        minCutoff,
        cseCutoff,
        csmCutoff,
        eceCutoff
      };
    }).filter(col => col.minCutoff !== 999999); // Only colleges that have cutoffs
  }, [colleges, cutoffs, selectedCategory, selectedGender]);

  // When a user inputs their rank, determine which bracket it belongs to
  const detectedBracket = useMemo(() => {
    const r = parseInt(userRank);
    if (isNaN(r)) return null;
    return brackets.find((b) => r >= b.min && r < b.max) || null;
  }, [userRank]);

  // Handle setting active range automatically if a user inputs their rank
  const activeBracket = useMemo(() => {
    if (detectedBracket) return detectedBracket.key;
    return activeRange;
  }, [detectedBracket, activeRange]);

  // Filter colleges belonging to the active bracket
  const bracketColleges = useMemo(() => {
    const selectedBracketInfo = brackets.find((b) => b.key === activeBracket);
    if (!selectedBracketInfo) return [];

    return collegeCutoffs
      .filter((col) => col.minCutoff >= selectedBracketInfo.min && col.minCutoff < selectedBracketInfo.max)
      .sort((a, b) => a.minCutoff - b.minCutoff); // Sort from best/lowest cutoff to highest
  }, [collegeCutoffs, activeBracket]);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 text-slate-800">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Page Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50/30 px-3.5 py-1 text-xs font-bold text-indigo-600">
            <Compass className="h-3.5 w-3.5" />
            <span>Rank vs Institute Analysis</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            TGEAPCET Rank vs College Estimator
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Analyze which tier of engineering colleges you qualify for based on your TGEAPCET category rank. Find out standard cutoff brackets and realistic options.
          </p>
        </div>

        {/* Top interactive inputs panel */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* Rank Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
                <span>Enter Your Expected Rank</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 12450"
                value={userRank}
                onChange={(e) => {
                  setUserRank(e.target.value);
                  const val = parseInt(e.target.value);
                  const bracket = brackets.find((b) => val >= b.min && val < b.max);
                  if (bracket) {
                    setActiveRange(bracket.key);
                  }
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 py-2.5 text-xs font-semibold focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>

            {/* Category Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Counselling Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none transition-all cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            {/* Gender Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gender Quota</label>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none transition-all cursor-pointer"
              >
                {genders.map((gen) => (
                  <option key={gen} value={gen}>
                    {gen === "BOYS" ? "BOYS / GENERAL" : "GIRLS ONLY"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* User Rank Bracket Matcher Alert */}
          {detectedBracket && (
            <div className={`mt-5 flex items-center justify-between gap-4 border p-4 rounded-xl shadow-sm ${detectedBracket.bg}`}>
              <div className="space-y-0.5">
                <span className="text-xxs font-bold uppercase tracking-wider">Detected Bracket</span>
                <h4 className="text-xs font-bold">
                  Your rank ({parseInt(userRank).toLocaleString()}) places you in the <strong className="underline">{detectedBracket.label}</strong>.
                </h4>
              </div>
              <Link
                href={`/predictor?rank=${userRank}&category=${selectedCategory}&gender=${selectedGender}`}
                className="flex items-center gap-1.5 text-xxs font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 rounded-xl shadow transition-colors cursor-pointer"
              >
                <span>Predict Colleges</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Range Tabs */}
        <div className="flex flex-wrap gap-2 justify-center">
          {brackets.map((b) => (
            <button
              key={b.key}
              onClick={() => {
                setActiveRange(b.key);
                setUserRank(""); // Clear to prevent overrides
              }}
              className={`px-4.5 py-2.5 rounded-full text-xs font-bold border transition-all cursor-pointer shadow-sm ${
                activeBracket === b.key
                  ? "bg-slate-900 border-slate-900 text-white"
                  : "bg-white border-slate-200 text-slate-650 hover:bg-slate-50"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Colleges Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-800">
              Colleges in this Bracket ({bracketColleges.length})
            </h3>
            <span className="text-xxs font-semibold text-slate-400 bg-white border border-slate-150 px-2.5 py-1 rounded-lg">
              Category: {selectedCategory} | Gender: {selectedGender}
            </span>
          </div>

          {bracketColleges.length === 0 ? (
            <div className="rounded-2xl border border-slate-250 bg-white p-12 text-center text-slate-450 text-xs">
              No colleges match this cutoff rank range for the selected filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bracketColleges.map((col) => (
                <div
                  key={col.code}
                  className="rounded-2xl border border-slate-150 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-750 bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded-lg">
                        {col.code}
                      </span>
                      <span className="text-xxs font-medium text-slate-400">
                        {col.place}, {col.district}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 leading-snug">
                      {col.name}
                    </h4>

                    {/* Cutoff Ranks Preview */}
                    <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-xxs">
                        <span className="text-slate-450 font-semibold">CSE Cutoff:</span>
                        <span className="font-extrabold text-slate-700">
                          {col.cseCutoff ? col.cseCutoff.toLocaleString() : "N/A"}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xxs">
                        <span className="text-slate-450 font-semibold">CSM (AI/ML) Cutoff:</span>
                        <span className="font-extrabold text-slate-700">
                          {col.csmCutoff ? col.csmCutoff.toLocaleString() : "N/A"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xxs">
                        <span className="text-slate-450 font-semibold">ECE Cutoff:</span>
                        <span className="font-extrabold text-slate-700">
                          {col.eceCutoff ? col.eceCutoff.toLocaleString() : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xxs">
                    <span className="text-slate-400">
                      Affiliation: {col.affiliation}
                    </span>
                    <Link
                      href={`/predictor?college=${col.code}`}
                      className="flex items-center gap-1 font-bold text-indigo-650 hover:underline cursor-pointer"
                    >
                      <span>Simulate Admission</span>
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detailed Explanation */}
        <article className="prose prose-slate max-w-none rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4 text-sm leading-relaxed text-slate-650">
          <h3 className="text-base font-bold text-slate-800 border-b border-slate-150 pb-2">
            Understanding College Tiers & Rank Brackets
          </h3>
          <p>
            Telangana engineering colleges are broadly categorized into tiers based on demand. Computer Science (CSE) cutoffs serve as the primary indicator of an institute's popularity.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-800 text-xs">Top Tier (Under 5,000)</h4>
              <p className="text-xs text-slate-500">
                Highly competitive institutes like CBIT, OUCE, and VJEC. Admission requires a single-digit or double-digit rank in early phases. Best suited for high scorers.
              </p>
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-800 text-xs">Elite Tier (5,000 - 15,000)</h4>
              <p className="text-xs text-slate-500">
                Excellent campuses including Vasavi, CVR, and GRRI. Offers state-of-the-art infrastructure, strong placements, and specialized streams.
              </p>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
