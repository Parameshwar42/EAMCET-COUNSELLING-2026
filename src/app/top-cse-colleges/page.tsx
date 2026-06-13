import React from "react";
import { db } from "@/lib/db";
import TopCseClient from "./TopCseClient";

export const metadata = {
  title: "Top CSE Colleges Cutoffs - TGEAPCET College Predictor 2026",
  description: "Check official 2025 cutoff ranks for Computer Science (CSE), AI & Machine Learning (CSM), and Data Science (CSD) branches in Telangana engineering colleges."
};

export default async function TopCseCollegesPage() {
  // Fetch colleges, branches, and cutoffs
  const colleges = await db.college.findMany();
  const branches = await db.branch.findMany();
  
  // Fetch cutoffs for CSE, CSM, CSD branches in FINAL phase
  const cutoffs = await db.cutoff.findMany({
    where: {
      branch: { code: { in: ["CSE", "CSM", "CSD"] } },
      phase: { code: "FINAL" }
    }
  });

  return (
    <TopCseClient 
      colleges={colleges} 
      branches={branches} 
      cutoffs={cutoffs} 
    />
  );
}
