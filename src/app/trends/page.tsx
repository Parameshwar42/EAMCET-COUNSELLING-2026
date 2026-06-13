import React from "react";
import Header from "@/components/Header";
import TrendCharts from "@/components/TrendCharts";
import AdBanner from "@/components/AdBanner";

export default function TrendsPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 text-slate-800">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Header text */}
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              📈 Cutoff Trend & Demand Analysis
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed max-w-3xl">
              Understand counseling allotment trends. Monitor how cutoffs shift between the 1st Phase, 2nd Phase, and Final Phase, and track popular branches in Hyderabad colleges.
            </p>
          </div>

          {/* Adsterra 468x60 Banner */}
          <AdBanner format="468x60" />

          <TrendCharts />
        </div>
      </main>
    </div>
  );
}
