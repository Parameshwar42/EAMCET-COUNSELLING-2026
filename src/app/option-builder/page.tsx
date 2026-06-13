import React from "react";
import Header from "@/components/Header";
import OptionBuilder from "@/components/OptionBuilder";

export default function OptionBuilderPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 text-slate-800">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Header text */}
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              📋 Web Counselling Option Entry list
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed max-w-3xl">
              Arrange your choices in your preferred order (best colleges first). Download the finalized list as an Excel spreadsheet or PDF choice sheet to submit to the official portal.
            </p>
          </div>

          <OptionBuilder />
        </div>
      </main>
    </div>
  );
}
