import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, ListOrdered, TrendingUp, Cpu, Flame, Users, Calendar } from "lucide-react";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-slate-50 via-white to-indigo-50/20 text-slate-800">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* FOMO banner */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
          <div className="flex items-center gap-1.5 rounded-full bg-red-50 border border-red-100 px-4 py-1.5 text-xs font-bold text-red-600 shadow-sm shadow-red-100/50">
            <Flame className="h-4 w-4 fill-red-500 text-red-500 animate-bounce" />
            <span>12,480+ Students Already Predicted</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-100 px-4 py-1.5 text-xs font-bold text-amber-600 shadow-sm shadow-amber-100/50">
            <Calendar className="h-4 w-4 text-amber-500" />
            <span>Counselling Starts Soon</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-4 py-1.5 text-xs font-bold text-indigo-600 shadow-sm shadow-indigo-100/50">
            <Users className="h-4 w-4 text-indigo-500" />
            <span>Avoid Choice-list Mistakes</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50/30 px-3.5 py-1 text-xs font-bold text-indigo-600">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Telangana engineering counselling 2026</span>
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl leading-tight">
            Discover the Best Colleges for Your{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              TGEAPCET Rank
            </span>
          </h1>
          
          <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Input your rank and category to instantly predict Dream, Target, and Safe colleges based on audited 2025 cutoff datasets. Create your option-entry priority sheet in minutes.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/predictor"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-500 hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <span>Predict My Colleges</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>
            <Link 
              href="/counselling-guide"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50 transition-all cursor-pointer"
            >
              <span>View Admission Guide</span>
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          {/* Card 1 */}
          <div className="rounded-2xl border border-slate-200/80 bg-white/50 backdrop-blur p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4">
              <ShieldCheck className="h-5.5 w-5.5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Precision Predictor</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Analyses Phase 1, Phase 2, and Final Phase cutoffs to divide your admission chances into Dream, Target, and Safe brackets.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-slate-200/80 bg-white/50 backdrop-blur p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4">
              <ListOrdered className="h-5.5 w-5.5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Option Entry Builder</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Drag, drop, and prioritize your choices. Export directly to an audited PDF or Excel sheet for the official counselling portal.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-slate-200/80 bg-white/50 backdrop-blur p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4">
              <Cpu className="h-5.5 w-5.5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">AI Counselling Advisor</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Generates strategic counseling insights tailored to your ranks, helping you prioritize high-value branches over generic campuses.
            </p>
          </div>
        </div>

        {/* Premium Banner */}
        <div className="mt-20 rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-600 to-indigo-800 p-8 sm:p-12 text-white shadow-xl shadow-indigo-100/50 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold sm:text-3xl">Ready to secure your future?</h2>
            <p className="text-indigo-100 text-sm max-w-lg leading-relaxed">
              Unlock the smart prediction engine. Enter your ranks, category, and preferred districts to check admission probabilities immediately.
            </p>
          </div>
          <Link
            href="/predictor"
            className="flex items-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-semibold text-indigo-950 shadow-md hover:bg-slate-50 transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Start Prediction</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
