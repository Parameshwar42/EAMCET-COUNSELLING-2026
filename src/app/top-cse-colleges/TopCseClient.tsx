"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Search, MapPin, Award, Filter, RefreshCw, Star, Info } from "lucide-react";
import Header from "@/components/Header";

interface TopCseClientProps {
  colleges: any[];
  branches: any[];
  cutoffs: any[];
}

export default function TopCseClient({ colleges, branches, cutoffs }: TopCseClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("OC");
  const [selectedGender, setSelectedGender] = useState("BOYS");
  const [selectedDistrict, setSelectedDistrict] = useState("ALL");

  const categories = ["OC", "BC_A", "BC_B", "BC_C", "BC_D", "BC_E", "SC_I", "SC_II", "SC_III", "ST", "EWS"];
  const genders = ["BOYS", "GIRLS"];

  // Unique list of districts from colleges
  const districts = useMemo(() => {
    const set = new Set<string>();
    colleges.forEach((c) => {
      if (c.district) set.add(c.district);
    });
    return ["ALL", ...Array.from(set).sort()];
  }, [colleges]);

  // Aggregate cutoffs by college for the selected Category + Gender
  const collegeCseData = useMemo(() => {
    // 1. Group cutoffs by collegeCode and branchCode
    // We want cutoffs in FINAL phase for the selected category & gender.
    const cutoffMap = new Map<string, number>();
    
    cutoffs.forEach((c) => {
      if (
        c.category === selectedCategory &&
        c.gender === selectedGender &&
        c.phase?.code === "FINAL"
      ) {
        const key = `${c.collegeCode || c.college?.code}-${c.branchCode || c.branch?.code}`;
        cutoffMap.set(key, c.rank);
      }
    });

    // 2. Map colleges to their branch cutoffs
    return colleges.map((col) => {
      const cseCutoff = cutoffMap.get(`${col.code}-CSE`) || null;
      const csmCutoff = cutoffMap.get(`${col.code}-CSM`) || null;
      const csdCutoff = cutoffMap.get(`${col.code}-CSD`) || null;

      // Determine an ordering score. Colleges with the lowest CSE rank are ranked higher.
      // If CSE cutoff is not available, place it at the bottom.
      const sortScore = cseCutoff || 999999;

      return {
        ...col,
        cseCutoff,
        csmCutoff,
        csdCutoff,
        sortScore,
      };
    });
  }, [colleges, cutoffs, selectedCategory, selectedGender]);

  // Filter and sort the final list
  const filteredColleges = useMemo(() => {
    return collegeCseData
      .filter((col) => {
        const matchesSearch =
          col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          col.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          col.place.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesDistrict =
          selectedDistrict === "ALL" || col.district === selectedDistrict;

        // Only show colleges that have at least one CSE/CSM/CSD cutoff
        const hasCseBranches = col.cseCutoff || col.csmCutoff || col.csdCutoff;

        return matchesSearch && matchesDistrict && hasCseBranches;
      })
      .sort((a, b) => a.sortScore - b.sortScore);
  }, [collegeCseData, searchQuery, selectedDistrict]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("OC");
    setSelectedGender("BOYS");
    setSelectedDistrict("ALL");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 text-slate-800">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-150 bg-indigo-50/30 px-3.5 py-1 text-xs font-bold text-indigo-600">
            <Star className="h-3.5 w-3.5 fill-indigo-100" />
            <span>TGEAPCET Top Colleges 2026</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Top CSE Engineering Colleges Cutoffs
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Browse and filter Telangana's best engineering institutes for Computer Science & Engineering (CSE), AI/ML (CSM), and Data Science (CSD) based on 2025 final cutoff statements.
          </p>
        </div>

        {/* Filters Panel */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Filter className="h-4.5 w-4.5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800">Filter and Search Directory</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Search College</label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Name, code, or place..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/30 pl-10 pr-4 py-2.5 text-xs font-semibold focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Category */}
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

            {/* Gender */}
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

            {/* District */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">District</label>
              <div className="flex gap-2">
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none transition-all cursor-pointer"
                >
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d === "ALL" ? "All Districts" : d}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleReset}
                  title="Reset Filters"
                  className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-indigo-600 transition-colors shadow-sm cursor-pointer flex items-center justify-center"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 bg-indigo-50/50 border border-indigo-100/50 rounded-xl p-3 text-xxs text-indigo-950 font-medium leading-relaxed">
            <Info className="h-4 w-4 text-indigo-600 shrink-0" />
            <span>
              <strong>Girls Eligibility:</strong> Remember that in the official counselling, girls are eligible for General (Boys) seats if their rank is better than the cutoff. Change "Gender Quota" to "BOYS / GENERAL" to check general cutoffs!
            </span>
          </div>
        </div>

        {/* Directory Listing */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              Found {filteredColleges.length} Top Colleges
            </h3>
            <span className="text-xxs font-semibold text-slate-400 uppercase tracking-wider">
              Sorted by CSE Cutoff Rank
            </span>
          </div>

          {filteredColleges.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              No colleges found matching the filters or search term.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-100 text-xxs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-4 px-6 text-center w-16">Rank</th>
                    <th className="py-4 px-6">College Details</th>
                    <th className="py-4 px-6 text-center w-24">CSE Cutoff</th>
                    <th className="py-4 px-6 text-center w-24">CSM Cutoff</th>
                    <th className="py-4 px-6 text-center w-24">CSD Cutoff</th>
                    <th className="py-4 px-6 text-center w-32">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredColleges.map((col, index) => (
                    <tr key={col.code} className="hover:bg-slate-50/40 transition-colors group">
                      {/* Serial / Rank */}
                      <td className="py-4 px-6 text-center font-extrabold text-slate-400 group-hover:text-indigo-600">
                        {index + 1}
                      </td>

                      {/* College details */}
                      <td className="py-4 px-6 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100/30 px-2 py-0.5 rounded-lg">
                            {col.code}
                          </span>
                          <span className="text-xxs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {col.place}, {col.district}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 leading-snug">
                          {col.name}
                        </h4>
                        <p className="text-xxs text-slate-400">
                          Affiliation: {col.affiliation} | Type: {col.type} | {col.coEducation}
                        </p>
                      </td>

                      {/* CSE Cutoff */}
                      <td className="py-4 px-6 text-center">
                        {col.cseCutoff ? (
                          <div className="space-y-0.5">
                            <span className="text-xs font-extrabold text-indigo-950">
                              {col.cseCutoff.toLocaleString()}
                            </span>
                            <span className="block text-xxs font-bold text-indigo-500 uppercase tracking-widest">
                              CSE
                            </span>
                          </div>
                        ) : (
                          <span className="text-xxs font-semibold text-slate-350">N/A</span>
                        )}
                      </td>

                      {/* CSM Cutoff */}
                      <td className="py-4 px-6 text-center">
                        {col.csmCutoff ? (
                          <div className="space-y-0.5">
                            <span className="text-xs font-semibold text-slate-850">
                              {col.csmCutoff.toLocaleString()}
                            </span>
                            <span className="block text-xxs font-bold text-amber-500 uppercase tracking-widest">
                              AI/ML
                            </span>
                          </div>
                        ) : (
                          <span className="text-xxs font-semibold text-slate-350">N/A</span>
                        )}
                      </td>

                      {/* CSD Cutoff */}
                      <td className="py-4 px-6 text-center">
                        {col.csdCutoff ? (
                          <div className="space-y-0.5">
                            <span className="text-xs font-semibold text-slate-850">
                              {col.csdCutoff.toLocaleString()}
                            </span>
                            <span className="block text-xxs font-bold text-emerald-500 uppercase tracking-widest">
                              Data Sci
                            </span>
                          </div>
                        ) : (
                          <span className="text-xxs font-semibold text-slate-350">N/A</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-center">
                        <Link
                          href={`/predictor?college=${col.code}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xxs font-bold text-slate-700 hover:text-indigo-600 transition-colors shadow-sm cursor-pointer"
                        >
                          <span>Simulate</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* CTA Card */}
        <div className="rounded-3xl border border-indigo-150 bg-gradient-to-r from-indigo-50 to-indigo-100/40 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 text-left">
            <h3 className="text-lg font-bold text-indigo-950 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <span>Predict Your Exact Admission Chances</span>
            </h3>
            <p className="text-xs text-indigo-900/80 leading-relaxed max-w-xl">
              Don't just look at cutoffs. The predictor analyses 20+ branches and uses the official girls-general quota merit system to calculate precise admission percentages for you.
            </p>
          </div>
          <Link
            href="/predictor"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-4 text-xs font-bold shadow-md shadow-indigo-150/50 transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Predict My Colleges</span>
            <ArrowRight className="h-4.5 w-4.5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
