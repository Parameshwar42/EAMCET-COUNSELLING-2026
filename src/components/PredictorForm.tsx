"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2, ChevronDown, Check } from "lucide-react";

export interface PredictorFormProps {
  onResults: (results: { dream: any[]; target: any[]; safe: any[] }, profile: any) => void;
}

export default function PredictorForm({ onResults }: PredictorFormProps) {
  const [rank, setRank] = useState<string>("");
  const [category, setCategory] = useState<string>("OC");
  const [gender, setGender] = useState<string>("BOYS");
  const [region, setRegion] = useState<string>("OU");
  const [specialQuota, setSpecialQuota] = useState<string>("NONE");
  const [selectedBranches, setSelectedBranches] = useState<string[]>(["CSE", "CSM", "CSD"]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  
  // Dropdown states
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
  
  // Click outside listener refs
  const branchDropdownRef = useRef<HTMLDivElement>(null);
  const districtDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (branchDropdownRef.current && !branchDropdownRef.current.contains(event.target as Node)) {
        setIsBranchDropdownOpen(false);
      }
      if (districtDropdownRef.current && !districtDropdownRef.current.contains(event.target as Node)) {
        setIsDistrictDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const [loading, setLoading] = useState<boolean>(false);

  const defaultBranches = [
    { code: "CSE", name: "Computer Science (CSE)" },
    { code: "CSM", name: "AI & Machine Learning (CSM)" },
    { code: "CSD", name: "Data Science (CSD)" },
    { code: "CSO", name: "CSE (IoT - CSO)" },
    { code: "INF", name: "Information Tech (INF)" },
    { code: "ECE", name: "Electronics & Comm (ECE)" },
    { code: "EEE", name: "Electrical & Elect (EEE)" },
    { code: "MEC", name: "Mechanical (MEC)" },
    { code: "CIV", name: "Civil (CIV)" }
  ];

  const defaultDistricts = [
    { code: "HYD", name: "Hyderabad" },
    { code: "RR", name: "Ranga Reddy" },
    { code: "MDL", name: "Medchal" },
    { code: "KGM", name: "Kothagudem" },
    { code: "WGL", name: "Warangal" },
    { code: "KRM", name: "Karimnagar" }
  ];

  const [branches, setBranches] = useState<any[]>(defaultBranches);
  const [districts, setDistricts] = useState<any[]>(defaultDistricts);

  useEffect(() => {
    async function loadMetadata() {
      try {
        const res = await fetch("/api/predict");
        if (res.ok) {
          const data = await res.json();
          if (data.branches && data.branches.length > 0) {
            setBranches(data.branches);
          }
          if (data.districts && data.districts.length > 0) {
            const districtNames: { [key: string]: string } = {
              HYD: "Hyderabad",
              RR: "Ranga Reddy",
              MDL: "Medchal",
              HNK: "Hanamkonda",
              KRM: "Karimnagar",
              KHM: "Khammam",
              KMR: "Kamareddy",
              MBN: "Mahabubnagar",
              MED: "Medak",
              NZB: "Nizamabad",
              SRD: "Sangareddy",
              SRP: "Suryapet"
            };
            const distObjects = data.districts.map((d: string) => ({
              code: d,
              name: districtNames[d] || d
            }));
            setDistricts(distObjects);
          }
        }
      } catch (e) {
        console.error("Failed to load metadata dynamically:", e);
      }
    }
    loadMetadata();
  }, []);

  const handleBranchToggle = (code: string) => {
    setSelectedBranches(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const handleDistrictToggle = (code: string) => {
    setSelectedDistricts(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rank || parseInt(rank, 10) <= 0) return;
    runPredictor();
  };

  const runPredictor = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rank: parseInt(rank, 10),
          category,
          gender,
          branches: selectedBranches,
          districts: selectedDistricts
        })
      });

      if (res.ok) {
        const data = await res.json();
        onResults(data, {
          rank: parseInt(rank, 10),
          category,
          gender,
          branches: selectedBranches,
          districts: selectedDistricts
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getBranchButtonText = () => {
    if (selectedBranches.length === 0) return "All branches (or select specific ones)...";
    if (selectedBranches.length === branches.length) return "All branches selected";
    return selectedBranches.join(", ");
  };

  const getDistrictButtonText = () => {
    if (selectedDistricts.length === 0) return "All districts (or select specific ones)...";
    if (selectedDistricts.length === districts.length) return "All districts selected";
    return selectedDistricts.join(", ");
  };

  return (
    <div className="w-full">
      <form 
        onSubmit={handleSubmit} 
        className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xl shadow-indigo-100/30"
      >
        {/* Top Accent Gradient Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-teal-500" />

        {/* Form Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3.5 mb-6 gap-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-650" />
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">Predict Your College</h2>
          </div>
          <span className="text-xxs font-semibold text-slate-400">
            Based on 2025 Phase • Historical Cutoffs
          </span>
        </div>

        {/* Row 1: 5-column inputs grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {/* EAPCET Rank */}
          <div className="space-y-1.5">
            <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider">EAPCET Rank</label>
            <input 
              type="number"
              required
              min="1"
              max="200000"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              placeholder="e.g. 5000"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/30 hover:bg-slate-50/70 px-3 py-2.5 text-xs font-semibold text-slate-700 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-350"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/30 hover:bg-slate-50/70 px-3 py-2.5 text-xs font-semibold text-slate-700 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all cursor-pointer"
            >
              <option value="OC">OC</option>
              <option value="BC_A">BC_A</option>
              <option value="BC_B">BC_B</option>
              <option value="BC_C">BC_C</option>
              <option value="BC_D">BC_D</option>
              <option value="BC_E">BC_E</option>
              <option value="SC_I">SC_I</option>
              <option value="SC_II">SC_II</option>
              <option value="SC_III">SC_III</option>
              <option value="ST">ST</option>
              <option value="EWS">EWS</option>
            </select>
          </div>

          {/* Region */}
          <div className="space-y-1.5">
            <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider">Region</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/30 hover:bg-slate-50/70 px-3 py-2.5 text-xs font-semibold text-slate-700 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all cursor-pointer"
            >
              <option value="OU">OU</option>
              <option value="AU">AU</option>
              <option value="SVU">SVU</option>
              <option value="NL">NL / Others</option>
            </select>
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/30 hover:bg-slate-50/70 px-3 py-2.5 text-xs font-semibold text-slate-700 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all cursor-pointer"
            >
              <option value="BOYS">Male</option>
              <option value="GIRLS">Female</option>
            </select>
          </div>

          {/* Special Quota */}
          <div className="space-y-1.5">
            <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider">Special Quota</label>
            <select
              value={specialQuota}
              onChange={(e) => setSpecialQuota(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/30 hover:bg-slate-50/70 px-3 py-2.5 text-xs font-semibold text-slate-700 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all cursor-pointer"
            >
              <option value="NONE">None / General</option>
              <option value="NCC">NCC</option>
              <option value="CAP">CAP</option>
              <option value="PH">PH (Handicapped)</option>
              <option value="SPORTS">Sports</option>
            </select>
          </div>
        </div>

        {/* Preferred Branches Section (Inline Grid) */}
        <div className="space-y-3 mt-6 border-t border-slate-100 pt-5">
          <div className="flex items-center justify-between">
            <label className="text-xxs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>🏫</span>
              <span>Preferred Branches <span className="text-slate-350 font-normal lowercase">(leave blank to select all)</span></span>
            </label>
            <div className="flex gap-3 text-[10px] font-black text-indigo-650 uppercase tracking-wider">
              <button type="button" onClick={() => setSelectedBranches(branches.map(b => b.code))} className="hover:text-indigo-800 cursor-pointer">Select All</button>
              <span className="text-slate-200 select-none">|</span>
              <button type="button" onClick={() => setSelectedBranches([])} className="hover:text-indigo-800 cursor-pointer">Clear All</button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {branches.map((br) => {
              const isChecked = selectedBranches.includes(br.code);
              return (
                <label 
                  key={br.code} 
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all text-xs font-semibold ${
                    isChecked 
                      ? "bg-indigo-50/60 border-indigo-300 text-indigo-900 font-bold shadow-sm" 
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <input 
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleBranchToggle(br.code)}
                    className="mt-0.5 rounded border-slate-300 cursor-pointer accent-indigo-600 shrink-0 h-3.5 w-3.5"
                  />
                  <span className="leading-snug select-none break-words">{br.name}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Preferred Districts Section (Inline Grid) */}
        <div className="space-y-3 mt-6 border-t border-slate-100 pt-5">
          <div className="flex items-center justify-between">
            <label className="text-xxs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>📍</span>
              <span>Preferred Districts <span className="text-slate-350 font-normal lowercase">(leave blank to select all)</span></span>
            </label>
            <div className="flex gap-3 text-[10px] font-black text-indigo-650 uppercase tracking-wider">
              <button type="button" onClick={() => setSelectedDistricts(districts.map(d => d.code))} className="hover:text-indigo-800 cursor-pointer">Select All</button>
              <span className="text-slate-200 select-none">|</span>
              <button type="button" onClick={() => setSelectedDistricts([])} className="hover:text-indigo-800 cursor-pointer">Clear All</button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
            {districts.map((d) => {
              const isChecked = selectedDistricts.includes(d.code);
              return (
                <label 
                  key={d.code} 
                  className={`flex items-start gap-2 p-2.5 rounded-xl border cursor-pointer transition-all text-xs font-semibold ${
                    isChecked 
                      ? "bg-violet-50/70 border-violet-300 text-violet-900 font-bold shadow-sm" 
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <input 
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleDistrictToggle(d.code)}
                    className="mt-0.5 rounded border-slate-300 cursor-pointer accent-violet-600 shrink-0 h-3.5 w-3.5"
                  />
                  <span className="leading-snug select-none break-words">{d.name}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:from-indigo-500 hover:to-indigo-600 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                <span>Predicting Your Colleges...</span>
              </>
            ) : (
              <>
                <Search className="h-4.5 w-4.5" />
                <span>Predict My Colleges Now</span>
              </>
            )}
          </button>
        </div>

        {/* Form Footer */}
        <div className="text-xxs font-semibold text-slate-400 flex items-center justify-center gap-1.5 mt-4 text-center">
          <span>🛡️</span>
          <span>Free • No registration • Based on audited official counselling data</span>
        </div>
      </form>
    </div>
  );
}
