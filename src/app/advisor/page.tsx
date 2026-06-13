"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import { generateAdvisorFeedback, AdvisorFeedback, StudentProfile } from "@/lib/advisorAI";
import { Cpu, AlertTriangle, Lightbulb, GraduationCap, ArrowRight, UserCheck } from "lucide-react";
import Link from "next/link";

export default function AdvisorPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [advice, setAdvice] = useState<AdvisorFeedback | null>(null);

  useEffect(() => {
    // Attempt to load profile from the last prediction search
    const storedLead = localStorage.getItem("predicted_lead");
    const storedOptions = localStorage.getItem("counselling_options");
    const optionCount = storedOptions ? JSON.parse(storedOptions).length : 0;

    let activeProfile: StudentProfile = {
      rank: 25000,
      category: "BC_B",
      gender: "GIRLS",
      branches: ["CSE", "CSM"],
      districts: []
    };

    if (storedLead) {
      const lead = JSON.parse(storedLead);
      activeProfile = {
        rank: lead.rank || 25000,
        category: lead.category || "BC_B",
        gender: lead.gender || "GIRLS",
        branches: ["CSE", "CSM"], // default
        districts: []
      };
      setProfile(activeProfile);
    }

    const calculatedAdvice = generateAdvisorFeedback(activeProfile, optionCount || 10);
    setAdvice(calculatedAdvice);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 text-slate-800">
      <Header />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Header text */}
          <div className="space-y-2 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1 text-indigo-600 font-bold bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full text-xs">
              <Cpu className="h-4 w-4 animate-spin" />
              <span>Personalized Counselling Engine</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl mt-2">
              🎓 AI Counselling Advisor
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Based on historical seat allotments, we analyze your rank bracket and provide optimal option entry structures to ensure you don't miss premium seats.
            </p>
          </div>

          {!profile && (
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4 flex items-center justify-between gap-4 text-xs font-semibold text-indigo-800">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4.5 w-4.5 text-indigo-600" />
                <span>Showing a sample report for Rank 25,000. Predict colleges to personalize!</span>
              </div>
              <Link href="/predictor" className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold">
                <span>Predict Now</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          {advice && (
            <div className="space-y-6">
              {/* Summary panel */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-100/40 space-y-4">
                <h3 className="text-sm font-bold text-slate-800 border-b border-slate-150 pb-2">Analysis Summary</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{advice.summary}</p>
              </div>

              {/* Recommended strategy */}
              <div className="rounded-2xl border border-indigo-150 bg-indigo-50/30 p-6 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
                  <GraduationCap className="h-5.5 w-5.5 text-indigo-600" />
                  <span>Recommended Option Strategy</span>
                </h3>
                <p className="text-xs text-indigo-900 leading-relaxed font-semibold bg-white border border-indigo-100/50 p-4 rounded-xl shadow-xs">
                  "{advice.recommendedStrategy}"
                </p>
              </div>

              {/* Warnings panel */}
              {advice.warnings.length > 0 && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50/30 p-6 space-y-4">
                  <h3 className="text-sm font-bold text-rose-950 flex items-center gap-2">
                    <AlertTriangle className="h-4.5 w-4.5 text-rose-600" />
                    <span>Risk Alerts & Warnings</span>
                  </h3>
                  <ul className="space-y-2 text-xs font-semibold text-rose-850 pl-2 list-disc list-inside">
                    {advice.warnings.map((warn, idx) => (
                      <li key={idx} className="leading-relaxed">{warn}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations tips list */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-100/40 space-y-4">
                <h3 className="text-sm font-bold text-slate-800 border-b border-slate-150 pb-2 flex items-center gap-2">
                  <Lightbulb className="h-4.5 w-4.5 text-amber-500" />
                  <span>Step-by-Step Priority Tips</span>
                </h3>
                <ul className="space-y-4 text-xs font-medium text-slate-600 pl-2">
                  {advice.tips.map((tip, idx) => (
                    <li key={idx} className="flex gap-3 leading-relaxed">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-amber-55 text-xxs font-bold text-amber-800 shadow-sm shadow-amber-100">
                        {idx + 1}
                      </span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
