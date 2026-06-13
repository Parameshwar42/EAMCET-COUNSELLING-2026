import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { Sparkles, ArrowRight, BookOpen, CheckCircle, ShieldAlert, Award, Compass, HelpCircle } from "lucide-react";

export const metadata = {
  title: "TGEAPCET Counselling Guide 2026 - Step-by-Step Options Strategy",
  description: "A complete step-by-step manual on Telangana EAPCET counselling. Learn web options entry strategies, seat allotment rules, and documents list."
};

export default function CounsellingGuidePage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 text-slate-800">
      <Header />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Editorial Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50/30 px-3.5 py-1 text-xs font-bold text-indigo-600">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Complete Strategy Manual</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl leading-tight">
            TGEAPCET 2026 counselling Guide & Web Options Entry Strategy
          </h1>
          <p className="text-base text-slate-500 leading-relaxed">
            A comprehensive, data-backed guide on how to register, verify documents, and build a high-probability option list to avoid seat allotment mistakes.
          </p>
        </div>

        {/* Action Callout */}
        <div className="rounded-2xl border border-indigo-150 bg-gradient-to-r from-indigo-50 to-indigo-100/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1 text-left">
            <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span>Create Your Priority Option Entry List</span>
            </h3>
            <p className="text-xs text-indigo-900/80 leading-relaxed">
              Don't guess. Run predictions, sort options, and export an audited Excel/PDF sheet for option entry.
            </p>
          </div>
          <Link
            href="/predictor"
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 text-xs font-bold shadow-md shadow-indigo-150/50 transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Launch predictor</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Editorial Article */}
        <article className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-650 space-y-8 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
          {/* Section 1: Overview */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-150 pb-2 flex items-center gap-2">
              <Compass className="h-5 w-5 text-indigo-600" />
              <span>1. The Counselling Procedure Flow</span>
            </h2>
            <p>
              The Telangana State Engineering, Agriculture and Medical Common Entrance Test (TGEAPCET) counseling is held in three sequential phases: **Phase 1, Phase 2, and the Final Phase**, followed by a **Spot Round** for any vacant seats.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="rounded-xl border border-slate-150 p-4 bg-slate-50/50 space-y-1">
                <span className="text-xxs font-bold text-indigo-600 uppercase">Step 01</span>
                <h4 className="font-bold text-slate-800 text-xs">Slot Booking & Certificate Verification</h4>
                <p className="text-xxs text-slate-500">Pay the processing fee online, book a slot, and attend document verification at a Help Line Centre (HLC).</p>
              </div>
              <div className="rounded-xl border border-slate-150 p-4 bg-slate-50/50 space-y-1">
                <span className="text-xxs font-bold text-indigo-600 uppercase">Step 02</span>
                <h4 className="font-bold text-slate-800 text-xs">Web Options Entry Selection</h4>
                <p className="text-xxs text-slate-500">Log in to the EAPCET portal, search and list your preferred branch-college choices in prioritized sequence.</p>
              </div>
              <div className="rounded-xl border border-slate-150 p-4 bg-slate-50/50 space-y-1">
                <span className="text-xxs font-bold text-indigo-600 uppercase">Step 03</span>
                <h4 className="font-bold text-slate-800 text-xs">Seat Allotment & Self-Reporting</h4>
                <p className="text-xxs text-slate-500">Accept the allotted seat online, pay the tuition fee if applicable, and report to the college.</p>
              </div>
            </div>
          </section>

          {/* Section 2: Strategy */}
          <section className="space-y-3 pt-4">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-150 pb-2 flex items-center gap-2">
              <Award className="h-5 w-5 text-indigo-600" />
              <span>2. Strategic Web Options Entry Rules</span>
            </h2>
            <p>
              To secure the best possible seat corresponding to your rank, follow the **three-tier listing methodology**:
            </p>
            
            <div className="space-y-4 mt-4">
              <div className="flex gap-3 items-start">
                <div className="h-5 w-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xxs border border-rose-150 mt-0.5 shrink-0">1</div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-xs">Dream Colleges (Ranks 10-20% above you)</h4>
                  <p className="text-xxs text-slate-500">Place these options at the top of your list. Although your rank is slightly above the previous year's cutoff, a sudden increase in seat capacity or change in student preferences might yield an unexpected allotment.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="h-5 w-5 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xxs border border-amber-150 mt-0.5 shrink-0">2</div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-xs">Target Colleges (Ranks close to your rank)</h4>
                  <p className="text-xxs text-slate-500">These are your main choices where previous cutoffs align tightly with your category rank. Sort these by campus quality, campus placements, and travel distance.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xxs border border-emerald-150 mt-0.5 shrink-0">3</div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-xs">Safe Colleges (Cutoff ranks comfortably above yours)</h4>
                  <p className="text-xxs text-slate-500">Always place at least 5-10 safe choices at the bottom. This prevents a "No Seat Allotted" status which forces you to wait for subsequent phases with fewer seats available.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Mistakes to Avoid */}
          <section className="space-y-3 pt-4">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-150 pb-2 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-600" />
              <span>3. Critical Pitfalls & Mistakes to Avoid</span>
            </h2>
            <div className="bg-red-50/50 border border-red-100 rounded-2xl p-5 space-y-3">
              <div className="space-y-1">
                <h4 className="font-bold text-red-950 text-xs">Mistake #1: Submitting too few options</h4>
                <p className="text-xxs text-red-900/80 leading-relaxed">
                  Many students submit only 5 or 10 options expecting to get in. If cutoffs drop due to high demand, they get zero allotments. List at least 30-40 choices.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-red-950 text-xs">Mistake #2: Entering options in random order</h4>
                <p className="text-xxs text-red-900/80 leading-relaxed">
                  The counselling software evaluates options from **Option 1 downwards**. If you place a lower-tier college as Option 2 and a premium college as Option 5, and you qualify for both, the system will immediately allot Option 2 and lock you out of Option 5. Always order from highest to lowest preference.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-red-950 text-xs">Mistake #3: Ignoring General Seats (for Girls)</h4>
                <p className="text-xxs text-red-900/80 leading-relaxed">
                  Girls are fully eligible to compete for Co-Ed (Boys) category seats based on pure merit. If you are female, make sure you evaluate both Boys/General and Girls cutoffs for options.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Required Documents */}
          <section className="space-y-3 pt-4">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-150 pb-2 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-indigo-600" />
              <span>4. Checklist of Documents for HLC Verification</span>
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xxs font-semibold text-slate-650 list-disc pl-5">
              <li>TGEAPCET 2026 Rank Card</li>
              <li>TGEAPCET 2026 Hall Ticket</li>
              <li>Aadhaar Card</li>
              <li>S.S.C or equivalent Marks Memo</li>
              <li>Intermediate or equivalent Memo-cum-Pass Certificate</li>
              <li>Class VI to Intermediate Study Certificates</li>
              <li>Transfer Certificate (T.C.)</li>
              <li>Income Certificate issued on or after Jan 1 of counseling year (if seeking fee reimbursement)</li>
              <li>Caste Certificate issued by competent authority (if claiming reservation quota)</li>
              <li>EWS Certificate issued by Tahsildar (if claiming EWS quota)</li>
            </ul>
          </section>

          {/* Section 5: FAQs */}
          <section className="space-y-4 pt-4">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-150 pb-2 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-indigo-600" />
              <span>5. Frequently Asked Questions (FAQ)</span>
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-xs">Q. Can I participate in Phase 2 if I accept a seat in Phase 1?</h4>
                <p className="text-xxs text-slate-500">
                  Yes. You can perform "self-reporting" online to reserve your Phase 1 seat, and then participate in Phase 2 option entry. If you get allotted a better seat in Phase 2, your Phase 1 seat is automatically cancelled and transferred to someone else.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-xs">Q. What is "Fee Reimbursement" and who is eligible?</h4>
                <p className="text-xxs text-slate-500">
                  The Government of Telangana offers full/partial tuition fee reimbursement (RTF) for students belonging to BC, EWS, SC, and ST categories who meet specific household income thresholds (e.g. annual parental income under ₹2 Lakhs for urban, and ₹1.5 Lakhs for rural).
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-xs">Q. What happens if I don't self-report on time?</h4>
                <p className="text-xxs text-slate-500">
                  If you do not pay the required tuition fee or report online within the specified dates, your seat allotment is automatically cancelled, and you will have to re-apply in the next counselling phase.
                </p>
              </div>
            </div>
          </section>
        </article>

        {/* Action Button Footer */}
        <div className="text-center pt-4">
          <Link
            href="/predictor"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-650 hover:bg-indigo-500 text-white px-8 py-4 text-xs font-bold shadow-md shadow-indigo-150/50 hover:shadow-indigo-200 transition-all cursor-pointer"
          >
            <span>Launch Counselling Predictor</span>
            <ArrowRight className="h-4.5 w-4.5 animate-bounce-horizontal" />
          </Link>
        </div>
      </main>
    </div>
  );
}
