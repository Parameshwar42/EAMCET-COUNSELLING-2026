"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import rawData from "@/lib/topCollegesData.json";
import { 
  Search, 
  MapPin, 
  Calendar, 
  Building2, 
  Globe, 
  Phone, 
  ShieldCheck, 
  Award, 
  DollarSign, 
  X, 
  Info, 
  SlidersHorizontal,
  ChevronRight,
  BookOpen,
  History,
  AlertCircle
} from "lucide-react";

interface CollegeData {
  college_code: string;
  name: string;
  location: string;
  district_code: string;
  district_name: string;
  type: string;
  co_education: string;
  minority_status: string;
  fee: number;
  affiliated_to: string;
  autonomous_from: string;
  established_year: number;
  phone: string;
  website: string;
  eamcet_available: string;
  ecet_available: string;
  logo_url: string;
  photos: string;
  nirf_rank: string;
  naac_grade: string;
  nba_accreditation: string;
  overall_score: number;
  grade: string;
  nba_accredited: boolean;
  has_nirf_rank: boolean;
}

export default function TopCollegesPage() {
  const collegesList = rawData.data as CollegeData[];

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("ALL");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedAffiliation, setSelectedAffiliation] = useState("ALL");
  const [sortBy, setSortBy] = useState("score_desc");
  
  // Modal states
  const [activeCollege, setActiveCollege] = useState<CollegeData | null>(null);
  const [showMethodology, setShowMethodology] = useState(false);

  // Extract unique districts, types, affiliations for filtering
  const districts = useMemo(() => {
    return ["ALL", ...Array.from(new Set(collegesList.map(c => c.district_name))).filter(Boolean).sort()];
  }, [collegesList]);

  const types = useMemo(() => {
    return ["ALL", ...Array.from(new Set(collegesList.map(c => c.type))).filter(Boolean).sort()];
  }, [collegesList]);

  const affiliations = useMemo(() => {
    return ["ALL", ...Array.from(new Set(collegesList.map(c => c.affiliated_to))).filter(Boolean).sort()];
  }, [collegesList]);

  // Grouping & Ranking logic matching the screenshot
  const getCollegeInstitutionKey = (name: string, code: string) => {
    const uppercaseName = name.toUpperCase();
    if (uppercaseName.includes("JNTUH") || code.startsWith("JNTH")) return "JNTUH";
    if (uppercaseName.includes("OSMANIA") || uppercaseName.includes("O U ") || code.startsWith("OUC")) return "OU";
    if (uppercaseName.includes("KAKATIYA") || uppercaseName.includes("KU ") || code.startsWith("KUW")) return "KU";
    return code.substring(0, 4);
  };

  // Filtered & Sorted list
  const processedColleges = useMemo(() => {
    let result = collegesList.filter(c => {
      const matchesSearch = 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.college_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.district_name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDistrict = selectedDistrict === "ALL" || c.district_name === selectedDistrict;
      const matchesType = selectedType === "ALL" || c.type === selectedType;
      const matchesAffiliation = selectedAffiliation === "ALL" || c.affiliated_to === selectedAffiliation;

      return matchesSearch && matchesDistrict && matchesType && matchesAffiliation;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "score_desc") return b.overall_score - a.overall_score;
      if (sortBy === "fee_asc") return a.fee - b.fee;
      if (sortBy === "fee_desc") return b.fee - a.fee;
      if (sortBy === "est_asc") return a.established_year - b.established_year;
      return b.overall_score - a.overall_score;
    });

    // Compute ranks dynamically for the current list based on parent institution
    const seenInstitutions = new Set<string>();
    let rankCounter = 0;

    return result.map(c => {
      const instKey = getCollegeInstitutionKey(c.name, c.college_code);
      let rank: number | null = null;
      
      // Do not number Self Finance or Integrated branches separately if the parent is already listed
      const isSelfFinanceOrIntegrated = 
        c.name.toUpperCase().includes("SELF FINANCE") || 
        c.name.toUpperCase().includes("INTEGRATED") ||
        c.type.toUpperCase().includes("(SF)") ||
        c.type.toUpperCase().includes("SELF FINANCE");

      if (!seenInstitutions.has(instKey)) {
        if (!isSelfFinanceOrIntegrated) {
          seenInstitutions.add(instKey);
          rankCounter++;
          rank = rankCounter;
        }
      }

      return {
        ...c,
        rank,
        instKey
      };
    });
  }, [collegesList, searchQuery, selectedDistrict, selectedType, selectedAffiliation, sortBy]);

  // Card Background colors matching the screenshot
  const cardStyles = [
    { bg: "bg-rose-50/50 border-rose-100/80 hover:bg-rose-50/80", badgeBg: "bg-rose-100 text-rose-700", rankColor: "text-rose-600" },
    { bg: "bg-emerald-50/50 border-emerald-100/80 hover:bg-emerald-50/80", badgeBg: "bg-emerald-100 text-emerald-700", rankColor: "text-emerald-600" },
    { bg: "bg-violet-50/50 border-violet-100/80 hover:bg-violet-50/80", badgeBg: "bg-violet-100 text-violet-700", rankColor: "text-violet-600" },
    { bg: "bg-blue-50/50 border-blue-100/80 hover:bg-blue-50/80", badgeBg: "bg-blue-100 text-blue-700", rankColor: "text-blue-600" },
    { bg: "bg-cyan-50/50 border-cyan-100/80 hover:bg-cyan-50/80", badgeBg: "bg-cyan-100 text-cyan-700", rankColor: "text-cyan-600" },
    { bg: "bg-amber-50/50 border-amber-100/80 hover:bg-amber-50/80", badgeBg: "bg-amber-100 text-amber-700", rankColor: "text-amber-600" },
    { bg: "bg-slate-50/50 border-slate-100/80 hover:bg-slate-50/80", badgeBg: "bg-slate-100 text-slate-700", rankColor: "text-slate-600" }
  ];

  // Map each unique instKey to a card style so grouped branches have the same color card
  const styleMapping = useMemo(() => {
    const mapping: { [key: string]: typeof cardStyles[0] } = {};
    let counter = 0;
    
    collegesList.forEach(c => {
      const key = getCollegeInstitutionKey(c.name, c.college_code);
      if (!mapping[key]) {
        mapping[key] = cardStyles[counter % cardStyles.length];
        counter++;
      }
    });
    
    return mapping;
  }, [collegesList]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value).replace("₹", "Rs. ");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 text-slate-800">
      <Header />

      {/* Hero Banner Header */}
      <section className="bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 py-12 text-center shadow-sm">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-indigo-950 sm:text-4xl flex items-center justify-center gap-2">
            Top Engineering Colleges in Telangana 🎓
          </h1>
          <p className="mt-3 text-sm font-semibold text-indigo-800 flex items-center justify-center gap-1.5">
            <span className="inline-block transform hover:translate-x-1 transition-transform">✈️</span>
            <span>Browse all engineering colleges in Telangana</span>
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Info Alert Box */}
        <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50/80 p-4.5 text-sm text-blue-800 flex items-center justify-between gap-4 shadow-sm shadow-blue-50">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Info className="h-5 w-5" />
            </div>
            <p className="font-medium">
              Curious how we rank colleges? Discover our performance indicators.
            </p>
          </div>
          <button 
            onClick={() => setShowMethodology(true)}
            className="shrink-0 text-xs font-bold text-blue-700 bg-white border border-blue-200/80 px-3.5 py-1.5 rounded-xl hover:bg-blue-100 hover:text-blue-800 transition-colors shadow-sm cursor-pointer"
          >
            See our ranking methodology
          </button>
        </div>

        {/* Filter Panel Card */}
        <div className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4">
            
            {/* Search and Sort Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by college name, code, location or district..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/30 py-3 pl-11 pr-4 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none transition-colors shadow-inner"
                />
              </div>

              <div className="md:col-span-4 flex gap-2">
                <div className="w-full relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm focus:border-indigo-500 focus:outline-none transition-colors shadow-sm appearance-none cursor-pointer"
                  >
                    <option value="score_desc">Ranked by Score (Highest First)</option>
                    <option value="fee_asc">Tuition Fee (Lowest First)</option>
                    <option value="fee_desc">Tuition Fee (Highest First)</option>
                    <option value="est_asc">Established Year (Oldest First)</option>
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-500" />
                </div>
              </div>
            </div>

            {/* Filter Group Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
              {/* District Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 tracking-wide uppercase">District</label>
                <div className="relative">
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/40 py-2.5 px-3.5 text-xs font-semibold focus:border-indigo-500 focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="ALL">All Districts ({districts.length - 1})</option>
                    {districts.filter(d => d !== "ALL").map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-500" />
                </div>
              </div>

              {/* Type Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 tracking-wide uppercase">College Type</label>
                <div className="relative">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/40 py-2.5 px-3.5 text-xs font-semibold focus:border-indigo-500 focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="ALL">All Types ({types.length - 1})</option>
                    {types.filter(t => t !== "ALL").map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-500" />
                </div>
              </div>

              {/* Affiliation Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 tracking-wide uppercase">Affiliation</label>
                <div className="relative">
                  <select
                    value={selectedAffiliation}
                    onChange={(e) => setSelectedAffiliation(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/40 py-2.5 px-3.5 text-xs font-semibold focus:border-indigo-500 focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="ALL">All Affiliations ({affiliations.length - 1})</option>
                    {affiliations.filter(a => a !== "ALL").map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-500" />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Colleges List Count */}
        <div className="mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
          Showing {processedColleges.length} colleges matching filters
        </div>

        {/* Colleges Cards Grid/List */}
        <div className="space-y-4.5">
          {processedColleges.length > 0 ? (
            processedColleges.map((college, index) => {
              const cardStyle = styleMapping[college.instKey] || cardStyles[0];

              return (
                <div 
                  key={college.college_code}
                  className={`rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col sm:flex-row items-center gap-6 ${cardStyle.bg}`}
                >
                  
                  {/* Rank Block (Left) */}
                  <div className="w-16 sm:w-20 flex flex-col items-center justify-center shrink-0 border-b sm:border-b-0 sm:border-r border-slate-200/50 pb-3 sm:pb-0 sm:pr-4">
                    {college.rank ? (
                      <span className={`text-3xl font-extrabold sm:text-4xl tracking-tight ${cardStyle.rankColor}`}>
                        {college.rank}
                      </span>
                    ) : (
                      <span className="text-3xl font-extrabold sm:text-4xl text-slate-350 select-none">
                        -
                      </span>
                    )}
                    <span className="mt-1 text-xs font-black tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      {college.grade}
                    </span>
                  </div>

                  {/* Main Details (Middle) */}
                  <div className="grow space-y-2 text-center sm:text-left">
                    <h3 className="text-base font-extrabold text-slate-900 sm:text-lg leading-snug tracking-tight">
                      {college.name} 
                      <span className="ml-1.5 text-xs font-semibold text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg select-all">
                        [{college.college_code}]
                      </span>
                    </h3>

                    {/* Meta Info Grid */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2 text-xs font-semibold text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 shrink-0 text-slate-400" />
                        <span>Estd: {college.established_year}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
                        <span>Affiliation: {college.affiliated_to}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4 shrink-0 text-slate-400" />
                        <span>Type: {college.type}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                        <span className="uppercase">{college.location}, {college.district_name}</span>
                      </span>
                    </div>

                    {/* Accreditations & Fees */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                      {college.nba_accredited && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[10px] font-bold text-sky-700 shadow-sm shadow-sky-50/20">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span>NBA Accredited</span>
                        </span>
                      )}
                      {college.naac_grade !== "N" && college.naac_grade && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[10px] font-bold text-indigo-700 shadow-sm shadow-indigo-50/20">
                          <Award className="h-3.5 w-3.5" />
                          <span>NAAC "{college.naac_grade}" Grade</span>
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-[10px] font-bold text-amber-700 shadow-sm shadow-amber-50/20">
                        <DollarSign className="h-3.5 w-3.5" />
                        <span>Fee: {formatCurrency(college.fee)}</span>
                      </span>
                      {college.has_nirf_rank && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-[10px] font-bold text-rose-700 shadow-sm shadow-rose-50/20">
                          <span>NIRF Rank: {college.nirf_rank}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* View Details Button (Right) */}
                  <div className="shrink-0 flex items-center justify-center w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-200/50">
                    <button
                      onClick={() => setActiveCollege(college)}
                      className="w-full sm:w-auto flex items-center justify-center gap-1 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-extrabold text-white shadow-md shadow-indigo-100 hover:bg-indigo-500 hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
                    >
                      <span>View More</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                </div>
              );
            })
          ) : (
            <div className="text-center py-12 rounded-3xl border border-dashed border-slate-200 bg-white p-6">
              <AlertCircle className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">No colleges match your filter</h3>
              <p className="text-xs text-slate-400 mt-1">Try resetting your search query or dropdown criteria.</p>
            </div>
          )}
        </div>

      </main>

      {/* College Info Details Modal */}
      {activeCollege && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header info */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 shrink-0">
              <div>
                <span className="inline-block text-xxs font-black tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md mb-2">
                  CODE: {activeCollege.college_code}
                </span>
                <h2 className="text-lg font-black text-slate-900 leading-snug">
                  {activeCollege.name}
                </h2>
                <p className="text-xs text-slate-400 font-semibold mt-1 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{activeCollege.location}, {activeCollege.district_name} District</span>
                </p>
              </div>
              <button 
                onClick={() => setActiveCollege(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors shadow-sm cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto py-5 space-y-6 grow pr-2">
              
              {/* Key Indicators Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-center">
                  <div className="text-xxs font-bold text-slate-400 uppercase tracking-wider">Overall Score</div>
                  <div className="text-lg font-black text-indigo-600 mt-1">{activeCollege.overall_score.toFixed(2)}/10</div>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-center">
                  <div className="text-xxs font-bold text-slate-400 uppercase tracking-wider">NIRF Rank</div>
                  <div className="text-lg font-black text-rose-600 mt-1">{activeCollege.nirf_rank || "N/A"}</div>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-center">
                  <div className="text-xxs font-bold text-slate-400 uppercase tracking-wider">NAAC Grade</div>
                  <div className="text-lg font-black text-emerald-600 mt-1">{activeCollege.naac_grade || "N/A"}</div>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-center">
                  <div className="text-xxs font-bold text-slate-400 uppercase tracking-wider">Tuition Fee</div>
                  <div className="text-sm font-black text-amber-600 mt-1.5">{formatCurrency(activeCollege.fee)}/yr</div>
                </div>
              </div>

              {/* Institution Bio details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Institutional Profile</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="font-semibold text-slate-500">Affiliated To:</span>
                    <span className="font-bold text-slate-800">{activeCollege.affiliated_to}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="font-semibold text-slate-500">Established Year:</span>
                    <span className="font-bold text-slate-800">{activeCollege.established_year}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="font-semibold text-slate-500">Status:</span>
                    <span className="font-bold text-slate-800">{activeCollege.type}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="font-semibold text-slate-500">Co-Education:</span>
                    <span className="font-bold text-slate-800">{activeCollege.co_education}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="font-semibold text-slate-500">Minority Status:</span>
                    <span className="font-bold text-slate-800">{activeCollege.minority_status}</span>
                  </div>
                  {activeCollege.autonomous_from && (
                    <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                      <span className="font-semibold text-slate-500">Autonomous From:</span>
                      <span className="font-bold text-slate-800">{activeCollege.autonomous_from}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="font-semibold text-slate-500">NBA Accredited:</span>
                    <span className="font-bold text-slate-800">{activeCollege.nba_accredited ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="font-semibold text-slate-500">EAMCET Admissions:</span>
                    <span className="font-bold text-slate-800">{activeCollege.eamcet_available === "Y" ? "Available" : "Not Available"}</span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact & Resources</h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  {activeCollege.website && (
                    <a
                      href={activeCollege.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grow flex items-center justify-center gap-2 rounded-xl border border-slate-200 p-3 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                      <Globe className="h-4 w-4 text-indigo-500" />
                      <span>Visit Official Website</span>
                    </a>
                  )}
                  {activeCollege.phone && (
                    <a
                      href={`tel:${activeCollege.phone}`}
                      className="grow flex items-center justify-center gap-2 rounded-xl border border-slate-200 p-3 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                      <Phone className="h-4 w-4 text-emerald-500" />
                      <span>Call: {activeCollege.phone}</span>
                    </a>
                  )}
                </div>
              </div>

            </div>

            {/* Footer buttons */}
            <div className="border-t border-slate-100 pt-4 flex gap-3 shrink-0">
              <Link
                href={`/tgeapcet-cutoffs?college=${activeCollege.college_code}`}
                onClick={() => setActiveCollege(null)}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-3.5 text-xs font-black text-white hover:bg-indigo-500 transition-all shadow-md shadow-indigo-100 cursor-pointer"
              >
                <span>Browse Cutoff Ranks</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* Methodology Modal */}
      {showMethodology && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-extrabold text-slate-900">
                Ranking Methodology 📈
              </h3>
              <button 
                onClick={() => setShowMethodology(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="py-4 space-y-4 text-xs font-semibold text-slate-500 leading-relaxed">
              <p>
                Our ranking algorithm compiles college performance statistics using audited datasets. The <strong className="text-slate-800">Overall Score (Out of 10)</strong> is derived from five weighted pillars:
              </p>
              <ul className="space-y-2 border-l-2 border-indigo-200 pl-4 py-1">
                <li>
                  <strong className="text-slate-800">1. Academic & Affiliation Status (25%):</strong> Autonomy status, JNTUH/OU constituent standing, and established legacy.
                </li>
                <li>
                  <strong className="text-slate-800">2. NIRF Ranking Bracket (25%):</strong> Official rankings from the Ministry of Education, India.
                </li>
                <li>
                  <strong className="text-slate-800">3. NAAC Accreditation & Score (20%):</strong> Quality grade levels (A++, A+, A, etc.).
                </li>
                <li>
                  <strong className="text-slate-800">4. NBA Branch Accreditation (15%):</strong> Program certification status in primary engineering fields.
                </li>
                <li>
                  <strong className="text-slate-800">5. Counselling Demand / Cutoff Competitiveness (15%):</strong> Selectivity and cutoff ranks in general quotas.
                </li>
              </ul>
              <p>
                Integrated allied courses and Self-Finance branches of the same university are grouped together colorwise to represent the primary institution unit.
              </p>
            </div>
            
            <button
              onClick={() => setShowMethodology(false)}
              className="w-full rounded-xl bg-slate-950 py-3 text-xs font-extrabold text-white hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
            >
              Close Methodology
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
