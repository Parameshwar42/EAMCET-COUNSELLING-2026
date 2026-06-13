import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { Sparkles, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";

export const metadata = {
  title: "TGEAPCET College Predictor 2026 - Find Best Colleges By Rank",
  description: "Predict your engineering college admission based on TGEAPCET 2026 expected cutoffs and 2025 official last rank statements. Free choice list generator."
};

export default function CollegePredictorSeoPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 text-slate-800">
      <Header />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Article header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl leading-tight">
            🎓 TGEAPCET College Predictor 2026: Official Cutoff Analysis
          </h1>
          <p className="text-base text-slate-500 leading-relaxed">
            Everything you need to know about calculating admission chances in top Telangana engineering colleges based on TGEAPCET last rank statements.
          </p>
        </div>

        {/* CTA Card */}
        <div className="rounded-2xl border border-indigo-150 bg-gradient-to-r from-indigo-50 to-indigo-100/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1 text-left">
            <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span>Predict Colleges Now</span>
            </h3>
            <p className="text-xs text-indigo-900 leading-relaxed">
              Check your admission probability across Dream, Target, and Safe colleges in 2 seconds.
            </p>
          </div>
          <Link
            href="/predictor"
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 text-xs font-bold shadow-md shadow-indigo-100 hover:shadow-indigo-200 transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Launch Predictor</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Content body */}
        <article className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-650 space-y-6">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-150 pb-2">How Does the TGEAPCET Predictor Work?</h2>
          <p>
            The TGEAPCET college predictor parses historical counseling allotment lists. Every year, the Telangana State Council of Higher Education (TGCHE) releases official lists of last ranks (cutoffs) for each college, branch, category, and gender pairing.
          </p>
          <p>
            Our engine indexes these values and compares them with your rank. If your rank is lower than or equal to the historical cutoff, you have a <strong>High</strong> probability of getting allotted that seat. If it lies within a 20% margin above, it represents a <strong>Medium</strong> probability (or "Target" option).
          </p>

          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-150 pb-2 flex items-center gap-2 mt-8">
            <HelpCircle className="h-5 w-5 text-indigo-600" />
            <span>Frequently Asked Questions (FAQ)</span>
          </h2>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-800">Q. Are Girls eligible for Boys seats in TGEAPCET?</h4>
              <p className="text-xs text-slate-500">
                Yes. In Telangana engineering counseling, all "Boys" seats are actually "General" seats. Girls are eligible to occupy general seats based on pure merit, in addition to the 33% seats reserved exclusively for girls.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-800">Q. What is the difference between CSE and CSM/CSD branches?</h4>
              <p className="text-xs text-slate-500">
                CSE is core Computer Science. CSM (Artificial Intelligence & Machine Learning) and CSD (Data Science) are specialized sub-branches. Their cutoffs are usually 10-15% lower than core CSE, making them excellent target backups.
              </p>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
