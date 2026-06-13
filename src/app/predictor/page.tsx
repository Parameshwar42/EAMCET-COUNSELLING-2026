"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import PredictorForm from "@/components/PredictorForm";
import { Sparkles, Flame, Target, ShieldCheck, Check, Plus, AlertCircle, ChevronLeft, ChevronRight, Info, MapPin } from "lucide-react";
import { OptionItem } from "@/components/OptionBuilder";
import AdBanner from "@/components/AdBanner";

export default function PredictorPage() {
  const [results, setResults] = useState<{ dream: any[]; target: any[]; safe: any[] } | null>(null);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [savedOptionIds, setSavedOptionIds] = useState<string[]>([]);

  // Redesigned Table states
  const [entriesPerPage, setEntriesPerPage] = useState<number>(25);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    // Load saved option IDs to match checked state
    const stored = localStorage.getItem("counselling_options");
    if (stored) {
      const items = JSON.parse(stored) as OptionItem[];
      setSavedOptionIds(items.map(item => item.id));
    }
  }, []);

  const handleResults = (data: { dream: any[]; target: any[]; safe: any[] }, profile: any) => {
    setResults(data);
    setStudentProfile(profile);
    setCurrentPage(1); // Reset page on new results
  };

  const addToOptions = (item: any) => {
    const stored = localStorage.getItem("counselling_options");
    const currentList: OptionItem[] = stored ? JSON.parse(stored) : [];
    
    const optionId = `${item.collegeCode}-${item.branchCode}`;
    
    if (currentList.some(o => o.id === optionId)) {
      // Remove if already exists
      const updated = currentList.filter(o => o.id !== optionId);
      localStorage.setItem("counselling_options", JSON.stringify(updated));
      setSavedOptionIds(updated.map(o => o.id));
      return;
    }

    const newItem: OptionItem = {
      id: optionId,
      collegeCode: item.collegeCode,
      collegeName: item.collegeName,
      branchCode: item.branchCode,
      branchName: item.branchName,
      place: item.place,
      district: item.district
    };

    const updatedList = [...currentList, newItem];
    localStorage.setItem("counselling_options", JSON.stringify(updatedList));
    setSavedOptionIds(updatedList.map(o => o.id));
  };

  const getUnifiedList = () => {
    if (!results) return [];
    
    // Merge all lists
    const merged = [...results.dream, ...results.target, ...results.safe];

    // Filter client-side by searchQuery
    const filtered = merged.filter((item: any) => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      return (
        item.collegeName.toLowerCase().includes(query) ||
        item.collegeCode.toLowerCase().includes(query) ||
        item.branchName.toLowerCase().includes(query) ||
        item.branchCode.toLowerCase().includes(query) ||
        item.place.toLowerCase().includes(query) ||
        item.district.toLowerCase().includes(query)
      );
    });

    // Sort by cutoffRank ascending (closest to rank first)
    return filtered.sort((a: any, b: any) => a.cutoffRank - b.cutoffRank);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 text-slate-800">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Side-by-side Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Column: Title & Info */}
            <div className="lg:col-span-3 space-y-5">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 shadow-sm shadow-amber-50/50 select-none">
                <span className="h-1 w-1 rounded-full bg-amber-500 animate-pulse" />
                <span>FREE & NO REGISTRATION</span>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-2xl font-black tracking-tight text-indigo-950 sm:text-3xl leading-snug">
                  TG EAPCET<br />
                  <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    Predictor
                  </span> 2026
                </h1>
                <p className="text-[10px] font-black text-slate-400 tracking-wider uppercase">
                  Formerly TS EAMCET
                </p>
              </div>
              
              <p className="text-xs font-semibold text-slate-500 leading-relaxed max-w-xs">
                Enter your rank and instantly see matching engineering colleges based on audited 2025 cutoff data.
              </p>

              {/* Clean Inline Stats Row */}
              <div className="pt-3 border-t border-slate-200/60 space-y-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <span>👤</span>
                  <span>3 Lakh+ Served</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  <span>2025 Audited Data</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🏫</span>
                  <span>36+ Top Colleges</span>
                </div>
              </div>

              {/* Sidebar Adsterra Banner */}
              <div className="hidden lg:block pt-4 border-t border-slate-200/60">
                <AdBanner adKey="5fd3a5bbd2538ead9d136bd4788fc0eb" format="300x250" />
              </div>
            </div>

            {/* Right Column: Expanded Form Box */}
            <div className="lg:col-span-9">
              <PredictorForm onResults={handleResults} />
            </div>
          </div>

          {/* Reservation Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xl shadow-indigo-100/10">
            {/* Left Column: Heading & Highlight Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-amber-600 tracking-wider uppercase">
                  KNOW YOUR SEAT
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-indigo-950 tracking-tight leading-snug">
                  TG EAPCET 2026 Category-wise Reservations
                </h2>
                <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                  Understanding your category's seat share helps you plan realistically during web options filling.
                </p>
              </div>

              {/* Horizontal Reservations Card */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50/35 p-4 space-y-2">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-xs">
                  <Info className="h-4.5 w-4.5 shrink-0 text-blue-600" />
                  <span>Horizontal Reservations</span>
                </div>
                <p className="text-xxs sm:text-xs font-semibold text-slate-600 leading-relaxed">
                  Over and above vertical reservations: <strong className="text-slate-900 font-extrabold">Women – 33%</strong> within each category, <strong className="text-slate-900 font-extrabold">Physically Handicapped – 3%</strong>, <strong className="text-slate-900 font-extrabold">NCC/Sports – 1%</strong> each.
                </p>
              </div>

              {/* Local Area Seats Card */}
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/25 p-4 space-y-2">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs">
                  <MapPin className="h-4.5 w-4.5 shrink-0 text-indigo-600" />
                  <span>Local Area Seats</span>
                </div>
                <p className="text-xxs sm:text-xs font-semibold text-slate-600 leading-relaxed">
                  <strong className="text-slate-900 font-extrabold">85% of seats</strong> are reserved for local area candidates (OU/AU/SVU region). The remaining <strong className="text-slate-900 font-extrabold">15%</strong> are open to all (UR – Unreserved).
                </p>
              </div>
            </div>

            {/* Right Column: Category Table */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/60 border-b border-slate-200/80 text-[10px] font-bold uppercase tracking-wider text-slate-450">
                        <th className="px-4 py-3.5">Category</th>
                        <th className="px-4 py-3.5">Full Form</th>
                        <th className="px-4 py-3.5">Seat %</th>
                        <th className="px-4 py-3.5">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {[
                        { cat: "OC", name: "Open / General", pct: "40%", notes: "Unrestricted merit", badge: "bg-blue-50 border-blue-200 text-blue-700" },
                        { cat: "BC-A", name: "Backward Class – A", pct: "7%", notes: "Includes Muslim BC-A", badge: "bg-emerald-50 border-emerald-200 text-emerald-700" },
                        { cat: "BC-B", name: "Backward Class – B", pct: "10%", notes: "", badge: "bg-emerald-50 border-emerald-250/80 text-emerald-700" },
                        { cat: "BC-C", name: "Backward Class – C", pct: "1%", notes: "", badge: "bg-teal-50 border-teal-200 text-teal-700" },
                        { cat: "BC-D", name: "Backward Class – D", pct: "7%", notes: "", badge: "bg-emerald-50 border-emerald-200 text-emerald-700" },
                        { cat: "BC-E", name: "Backward Class – E (Muslim)", pct: "4%", notes: "", badge: "bg-teal-50 border-teal-200 text-teal-700" },
                        { cat: "SC", name: "Scheduled Caste", pct: "15%", notes: "Sub-categorisation applicable", badge: "bg-amber-50 border-amber-200 text-amber-700" },
                        { cat: "ST", name: "Scheduled Tribe", pct: "6%", notes: "", badge: "bg-teal-550/10 border-teal-250/70 text-teal-850" },
                        { cat: "EWS", name: "Economically Weaker Section", pct: "10%", notes: "From OC category seats", badge: "bg-rose-50 border-rose-200 text-rose-700" }
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                          <td className="px-4 py-2.5">
                            <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${row.badge}`}>
                              {row.cat}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-slate-650 font-medium">{row.name}</td>
                          <td className="px-4 py-2.5 font-bold text-slate-800">{row.pct}</td>
                          <td className="px-4 py-2.5 text-slate-500 font-medium text-xxs sm:text-xs">{row.notes || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Prediction results */}
          {results && studentProfile && (
            <div className="space-y-6">
              <AdBanner adKey="ab6043d59e55ac1704ad3eb038401295" format="728x90" />
              {/* Title Section */}
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-bold text-slate-800">
                  College Predictions — <span className="text-amber-600">Rank {studentProfile.rank.toLocaleString()}</span>
                </h2>
                
                {/* Filter Tags */}
                <div className="flex flex-wrap items-center gap-2 mt-4 text-xxs font-bold uppercase tracking-wider">
                  <span className="rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 px-3 py-1.5 shadow-sm">
                    SEARCH
                  </span>
                  <span className="rounded-lg border border-slate-200 bg-white text-slate-600 px-3 py-1.5 shadow-sm">
                    ● {studentProfile.rank.toLocaleString()}
                  </span>
                  <span className="rounded-lg border border-slate-200 bg-white text-slate-600 px-3 py-1.5 shadow-sm">
                    ● {studentProfile.category}
                  </span>
                  <span className="rounded-lg border border-slate-200 bg-white text-slate-600 px-3 py-1.5 shadow-sm">
                    ● {studentProfile.gender === "BOYS" ? "MALE" : "FEMALE"}
                  </span>
                  <span className="rounded-lg border border-slate-200 bg-white text-slate-600 px-3 py-1.5 shadow-sm">
                    ● {studentProfile.region || "OU"}
                  </span>
                  <span className="rounded-lg border border-slate-200 bg-white text-slate-600 px-3 py-1.5 shadow-sm truncate max-w-xs">
                    ● {studentProfile.branches.length === 0 ? "ALL BRANCHES" : studentProfile.branches.join(", ")}
                  </span>
                </div>
              </div>

              {/* Note banner */}
              <div className="text-xxs font-semibold text-slate-400 flex items-center gap-1.5 pl-1.5">
                <span>ⓘ</span>
                <span>Click on any row for year-wise cutoff history (2015-2025)</span>
              </div>

              {/* Table controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/70 backdrop-blur rounded-2xl border border-slate-200/85 p-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-650">
                  <span>Show</span>
                  <select
                    value={entriesPerPage}
                    onChange={(e) => {
                      setEntriesPerPage(parseInt(e.target.value, 10));
                      setCurrentPage(1);
                    }}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-bold focus:outline-none cursor-pointer text-slate-800"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span>entries</span>
                </div>

                <div className="w-full sm:w-64 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search colleges, branches..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-350 shadow-sm"
                  />
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200/80 text-xxs font-bold uppercase tracking-wider text-slate-500">
                        <th className="px-6 py-4">College</th>
                        <th className="px-6 py-4">Branch</th>
                        <th className="px-6 py-4">Seat Category</th>
                        <th className="px-6 py-4">2025 Cutoff Rank</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-650 font-semibold">
                      {getUnifiedList().length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                            No matching colleges found. Try adjusting your rank, category, or branch filters.
                          </td>
                        </tr>
                      ) : (
                        (() => {
                          const list = getUnifiedList();
                          const startIndex = (currentPage - 1) * entriesPerPage;
                          const endIndex = startIndex + entriesPerPage;
                          const paginatedList = list.slice(startIndex, endIndex);

                          return paginatedList.map((item: any, paginatedIndex: number) => {
                            const optionId = `${item.collegeCode}-${item.branchCode}`;
                            const isAdded = savedOptionIds.includes(optionId);
                            const actualIndex = startIndex + paginatedIndex;

                            return (
                              <React.Fragment key={`${item.id}-${item.phase}`}>
                                {/* Row content */}
                                <tr className="hover:bg-slate-50/50 transition-colors group">
                                  {/* College Column */}
                                  <td className="px-6 py-4.5">
                                    <div className="font-bold text-slate-800 uppercase tracking-tight leading-tight group-hover:text-indigo-650 transition-colors">
                                      {item.collegeName}
                                    </div>
                                    <div className="mt-1">
                                      <Link
                                        href={`/tgeapcet-cutoffs?college=${item.collegeCode}`}
                                        className="inline-flex items-center gap-1 text-xxs font-bold text-indigo-650 hover:underline"
                                      >
                                        🏫 {item.collegeCode}
                                      </Link>
                                    </div>
                                  </td>

                                  {/* Branch Column */}
                                  <td className="px-6 py-4.5">
                                    <div className="font-bold text-slate-700 uppercase tracking-tight">
                                      {item.branchName}
                                    </div>
                                    <div className="text-xxs font-bold text-slate-400 mt-1 uppercase">
                                      {item.branchCode}
                                    </div>
                                  </td>

                                  {/* Seat Category Column */}
                                  <td className="px-6 py-4.5">
                                    <span className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50/70 px-2.5 py-1 text-xxs font-bold uppercase tracking-wider text-emerald-800 shadow-sm">
                                      {studentProfile.category}_{studentProfile.gender === "BOYS" ? "GEN" : "GIRLS"}_{studentProfile.region || "OU"}
                                    </span>
                                  </td>

                                  {/* Cutoff Rank Column */}
                                  <td className="px-6 py-4.5 font-extrabold text-slate-800 text-sm">
                                    {item.cutoffRank.toLocaleString()}
                                    <span className="block text-xxs font-semibold text-slate-400 mt-0.5 uppercase tracking-wider">
                                      {item.phase}
                                    </span>
                                  </td>

                                  {/* Action Column */}
                                  <td className="px-6 py-4.5 text-right">
                                    <button
                                      onClick={() => addToOptions(item)}
                                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xxs font-bold shadow-sm transition-all border cursor-pointer ${
                                        isAdded
                                          ? "border-emerald-250 bg-emerald-50 text-emerald-700 shadow-emerald-50"
                                          : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-300"
                                      }`}
                                    >
                                      {isAdded ? (
                                        <>
                                          <Check className="h-3 w-3 text-emerald-600" />
                                          <span>Added</span>
                                        </>
                                      ) : (
                                        <>
                                          <Plus className="h-3 w-3 text-slate-505" />
                                          <span>Add</span>
                                        </>
                                      )}
                                    </button>
                                  </td>
                                </tr>

                                {/* In-middle discover banner */}
                                {actualIndex === 9 && list.length > 10 && (
                                  <tr className="bg-slate-50/30 hover:bg-slate-50/30">
                                    <td colSpan={5} className="px-6 py-4 border-y border-slate-100">
                                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border border-dashed border-slate-200 bg-white/80 backdrop-blur rounded-2xl p-4 shadow-sm">
                                        <div className="flex items-center gap-2 shrink-0">
                                          <span className="h-2 w-2 rounded-full bg-indigo-650 animate-pulse" />
                                          <span className="text-xxs font-bold text-slate-500 uppercase tracking-wider">Discover more</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2.5">
                                          <Link href="/predictor" className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-xxs font-bold text-slate-650 shadow-sm transition-colors cursor-pointer">
                                            🌐 College Predictor Tool
                                          </Link>
                                          <Link href="/counselling-guide" className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-xxs font-bold text-slate-650 shadow-sm transition-colors cursor-pointer">
                                            📑 EAPCET Counselling Services
                                          </Link>
                                          <a href="https://tgeapcet.nic.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-xxs font-bold text-slate-650 shadow-sm transition-colors cursor-pointer">
                                            📅 EAMCET Exam Schedule
                                          </a>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          });
                        })()
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card List View */}
              <div className="block md:hidden space-y-4">
                {getUnifiedList().length === 0 ? (
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center text-slate-400 italic shadow-sm">
                    No matching colleges found. Try adjusting your rank, category, or branch filters.
                  </div>
                ) : (
                  (() => {
                    const list = getUnifiedList();
                    const startIndex = (currentPage - 1) * entriesPerPage;
                    const endIndex = startIndex + entriesPerPage;
                    const paginatedList = list.slice(startIndex, endIndex);

                    return paginatedList.map((item: any, paginatedIndex: number) => {
                      const optionId = `${item.collegeCode}-${item.branchCode}`;
                      const isAdded = savedOptionIds.includes(optionId);
                      const actualIndex = startIndex + paginatedIndex;

                      return (
                        <React.Fragment key={`${item.id}-${item.phase}-mobile`}>
                          <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-md space-y-3.5">
                            {/* Card Header: College Code Badge & Seat Category */}
                            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                              <Link
                                href={`/tgeapcet-cutoffs?college=${item.collegeCode}`}
                                className="inline-flex items-center gap-1 text-[10px] font-extrabold text-indigo-650 hover:underline border border-indigo-100 bg-indigo-50/40 px-2 py-0.5 rounded-lg"
                              >
                                🏫 {item.collegeCode}
                              </Link>
                              
                              <span className="inline-flex items-center rounded-md border border-emerald-150 bg-emerald-50/50 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-800">
                                {studentProfile.category}_{studentProfile.gender === "BOYS" ? "GEN" : "GIRLS"}_{studentProfile.region || "OU"}
                              </span>
                            </div>

                            {/* College & Branch Names */}
                            <div className="space-y-1">
                              <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight leading-snug break-words">
                                {item.collegeName}
                              </h4>
                              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                <span className="text-[9px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded uppercase shrink-0">
                                  {item.branchCode}
                                </span>
                                <span className="text-[10px] font-semibold text-slate-500 uppercase leading-none">
                                  {item.branchName}
                                </span>
                              </div>
                            </div>

                            {/* Cutoff & Actions Row */}
                            <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-100">
                              <div>
                                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                  2025 Cutoff Rank
                                </span>
                                <div className="flex items-baseline gap-1 mt-0.5">
                                  <span className="text-sm font-black text-slate-800">
                                    {item.cutoffRank.toLocaleString()}
                                  </span>
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                    ({item.phase})
                                  </span>
                                </div>
                              </div>

                              <button
                                onClick={() => addToOptions(item)}
                                className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xxs font-bold shadow-sm transition-all border cursor-pointer ${
                                  isAdded
                                    ? "border-emerald-250 bg-emerald-50 text-emerald-700 shadow-emerald-50"
                                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-300"
                                }`}
                              >
                                {isAdded ? (
                                  <>
                                    <Check className="h-3 w-3 text-emerald-600" />
                                    <span>Added</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="h-3 w-3 text-slate-500" />
                                    <span>Add Choice</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* In-middle discover banner */}
                          {actualIndex === 9 && list.length > 10 && (
                            <div className="border border-dashed border-slate-200 bg-white/80 backdrop-blur rounded-2xl p-4 shadow-sm space-y-3">
                              <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-indigo-650 animate-pulse" />
                                <span className="text-xxs font-bold text-slate-500 uppercase tracking-wider">Discover more</span>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Link href="/predictor" className="w-full text-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-2 text-xxs font-bold text-slate-650 shadow-sm transition-colors cursor-pointer">
                                  🌐 College Predictor Tool
                                </Link>
                                <Link href="/counselling-guide" className="w-full text-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-2 text-xxs font-bold text-slate-650 shadow-sm transition-colors cursor-pointer">
                                  📑 EAPCET Counselling Services
                                </Link>
                                <a href="https://tgeapcet.nic.in" target="_blank" rel="noopener noreferrer" className="w-full text-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-2 text-xxs font-bold text-slate-650 shadow-sm transition-colors cursor-pointer">
                                  📅 EAMCET Exam Schedule
                                </a>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    });
                  })()
                )}
              </div>


              {/* Pagination controls */}
              {getUnifiedList().length > entriesPerPage && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-2">
                  {(() => {
                    const list = getUnifiedList();
                    const totalItems = list.length;
                    const startIndex = (currentPage - 1) * entriesPerPage;
                    const endIndex = Math.min(startIndex + entriesPerPage, totalItems);
                    const totalPages = Math.ceil(totalItems / entriesPerPage);

                    return (
                      <>
                        <div className="text-xxs font-semibold text-slate-400">
                          Showing {startIndex + 1} to {endIndex} of {totalItems} entries
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-xxs font-bold">
                          <button
                            type="button"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>

                          {Array.from({ length: totalPages }).map((_, i) => {
                            const pageNum = i + 1;
                            // Show first page, last page, current page, and pages around current page
                            if (
                              pageNum === 1 || 
                              pageNum === totalPages || 
                              (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                            ) {
                              return (
                                <button
                                  key={pageNum}
                                  type="button"
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={`flex h-8 w-8 items-center justify-center rounded-xl border shadow-sm cursor-pointer transition-colors ${
                                    currentPage === pageNum
                                      ? "border-indigo-650 bg-indigo-650 text-white"
                                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            }
                            if (pageNum === 2 || pageNum === totalPages - 1) {
                              return <span key={pageNum} className="text-slate-350">...</span>;
                            }
                            return null;
                          })}

                          <button
                            type="button"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* Adsterra Native Banner Ads */}
          <div className="w-full mt-8">
            <AdBanner format="native" />
          </div>
        </div>
      </main>
    </div>
  );
}
