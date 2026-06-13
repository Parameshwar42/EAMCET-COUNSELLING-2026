"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, MapPin, Sparkles, RefreshCw, BarChart3, TrendingUp, Info } from "lucide-react";
import Header from "@/components/Header";

interface CutoffsClientProps {
  colleges: any[];
  branches: any[];
  cutoffs: any[];
}

export default function CutoffsClient({ colleges, branches, cutoffs }: CutoffsClientProps) {
  const [selectedCollege, setSelectedCollege] = useState(colleges[0]?.code || "");
  const [selectedBranch, setSelectedBranch] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("OC");
  const [selectedGender, setSelectedGender] = useState("BOYS");

  const categories = ["OC", "BC_A", "BC_B", "BC_C", "BC_D", "BC_E", "SC_I", "SC_II", "SC_III", "ST", "EWS"];
  const genders = ["BOYS", "GIRLS"];

  // Find currently active college object
  const currentCollege = useMemo(() => {
    return colleges.find((c) => c.code === selectedCollege) || null;
  }, [colleges, selectedCollege]);

  // Filter cutoffs for the current selection
  const matchingCutoffs = useMemo(() => {
    return cutoffs.filter((c) => {
      const colCode = c.collegeCode || c.college?.code;
      const brCode = c.branchCode || c.branch?.code;
      
      const colMatch = colCode === selectedCollege;
      const brMatch = selectedBranch === "ALL" || brCode === selectedBranch;
      const catMatch = c.category === selectedCategory;
      const genMatch = c.gender === selectedGender;

      return colMatch && brMatch && catMatch && genMatch;
    });
  }, [cutoffs, selectedCollege, selectedBranch, selectedCategory, selectedGender]);

  // Group matching cutoffs by branch to show a comparison table
  const branchDetails = useMemo(() => {
    const branchesMap = new Map<string, { phase1: number | null; phase2: number | null; final: number | null }>();

    matchingCutoffs.forEach((c) => {
      const brCode = c.branchCode || c.branch?.code;
      const phase = c.phase?.code || c.phase;
      
      if (!branchesMap.has(brCode)) {
        branchesMap.set(brCode, { phase1: null, phase2: null, final: null });
      }

      const record = branchesMap.get(brCode)!;
      if (phase === "PHASE_1") record.phase1 = c.rank;
      else if (phase === "PHASE_2") record.phase2 = c.rank;
      else if (phase === "FINAL") record.final = c.rank;
    });

    return Array.from(branchesMap.entries()).map(([brCode, data]) => {
      const branchObj = branches.find((b) => b.code === brCode);
      return {
        code: brCode,
        name: branchObj ? branchObj.name : brCode,
        ...data,
      };
    }).sort((a, b) => {
      // Sort: CSE first, then others
      if (a.code === "CSE") return -1;
      if (b.code === "CSE") return 1;
      return a.code.localeCompare(b.code);
    });
  }, [matchingCutoffs, branches]);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 text-slate-800">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50/30 px-3.5 py-1 text-xs font-bold text-indigo-600">
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Official Counselling Records</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            TGEAPCET Cutoffs Directory Browser
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Audit cutoff ranks for every engineering stream in Telangana. Filter by institute, category, and gender to analyze previous seat allotment thresholds.
          </p>
        </div>

        {/* Browser Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Form Filter Column */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <TrendingUp className="h-4.5 w-4.5 text-indigo-600" />
              <span>Select Search Query</span>
            </h3>

            {/* Select College */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Engineering College</label>
              <select
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none transition-all cursor-pointer"
              >
                {colleges.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} - {c.name.substring(0, 48)}{c.name.length > 48 ? "..." : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Branch */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Branch Specialization</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none transition-all cursor-pointer"
              >
                <option value="ALL">All Specializations</option>
                {branches.map((b) => (
                  <option key={b.code} value={b.code}>
                    {b.code} - {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Category */}
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

            {/* Select Gender */}
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

            {/* Reset Button */}
            <button
              onClick={() => {
                setSelectedCollege(colleges[0]?.code || "");
                setSelectedBranch("ALL");
                setSelectedCategory("OC");
                setSelectedGender("BOYS");
              }}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-650 py-3 transition-colors cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reset Filters</span>
            </button>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* College Info Card */}
            {currentCollege && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-150/50 px-3 py-1 rounded-xl">
                    CODE: {currentCollege.code}
                  </span>
                  <span className="text-xxs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-xl flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {currentCollege.place}, {currentCollege.district}
                  </span>
                </div>
                
                <h2 className="text-base font-extrabold text-slate-900 leading-snug">
                  {currentCollege.name}
                </h2>
                
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xxs font-semibold text-slate-500">
                  <span>University Affiliation: <strong className="text-slate-700">{currentCollege.affiliation}</strong></span>
                  <span>Co-Education: <strong className="text-slate-700">{currentCollege.coEducation}</strong></span>
                  <span>Type: <strong className="text-slate-700">{currentCollege.type}</strong></span>
                </div>
              </div>
            )}

            {/* Cutoffs Table Card */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-800">
                  Last Allotted Ranks ({selectedCategory} {selectedGender})
                </h4>
                <div className="flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-lg text-xxs font-bold text-indigo-700 border border-indigo-100/30">
                  2025 Cutoffs
                </div>
              </div>

              {branchDetails.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs">
                  No allotment cutoff records found for the selected category.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/75 border-b border-slate-100 text-xxs font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-4 px-6">Branch Code & Name</th>
                        <th className="py-4 px-6 text-center w-24">1st Phase</th>
                        <th className="py-4 px-6 text-center w-24">2nd Phase</th>
                        <th className="py-4 px-6 text-center w-24">Final Phase</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {branchDetails.map((br) => (
                        <tr key={br.code} className="hover:bg-slate-50/40 transition-colors">
                          <td className="py-4 px-6">
                            <div className="text-xs font-bold text-slate-800">{br.code}</div>
                            <div className="text-xxs text-slate-450 mt-0.5">{br.name}</div>
                          </td>
                          
                          <td className="py-4 px-6 text-center">
                            {br.phase1 ? (
                              <span className="text-xs font-semibold text-slate-700">
                                {br.phase1.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-xxs font-medium text-slate-350">N/A</span>
                            )}
                          </td>

                          <td className="py-4 px-6 text-center">
                            {br.phase2 ? (
                              <span className="text-xs font-semibold text-slate-700">
                                {br.phase2.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-xxs font-medium text-slate-350">N/A</span>
                            )}
                          </td>

                          <td className="py-4 px-6 text-center">
                            {br.final ? (
                              <span className="text-xs font-extrabold text-indigo-950">
                                {br.final.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-xxs font-medium text-slate-350">N/A</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-amber-50/20 p-4 text-xxs text-slate-500 leading-relaxed">
              <Info className="h-4 w-4 text-indigo-500 shrink-0" />
              <span>
                <strong>How to read Phase Trends:</strong> Cutoff ranks typically increase from Phase 1 to Final Phase (e.g. 8,500 to 11,200). An increasing number indicates that seats were filled by higher rank holders (easier admission) in later phases due to cancellations and slides.
              </span>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-600 to-indigo-800 p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold sm:text-3xl">Get Your Custom Allotment Chances</h2>
            <p className="text-indigo-100 text-sm max-w-lg leading-relaxed">
              Input your specific TGEAPCET 2026 score to search and filter matched colleges in real time.
            </p>
          </div>
          <Link
            href="/predictor"
            className="flex items-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-semibold text-indigo-950 shadow-md hover:bg-slate-50 transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Launch predictor</span>
            <Sparkles className="h-4.5 w-4.5 text-indigo-600" />
          </Link>
        </div>
      </main>
    </div>
  );
}
