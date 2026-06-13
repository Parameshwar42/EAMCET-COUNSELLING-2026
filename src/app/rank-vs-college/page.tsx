import React from "react";
import { db } from "@/lib/db";
import RankVsCollegeClient from "./RankVsCollegeClient";

export const metadata = {
  title: "TGEAPCET Rank vs College Estimator 2026",
  description: "Check which engineering colleges you can get based on your TGEAPCET category rank. View college tier listings grouped by rank ranges."
};

export default async function RankVsCollegePage() {
  // Fetch colleges, branches, and cutoffs
  const colleges = await db.college.findMany();
  const branches = await db.branch.findMany();
  const cutoffs = await db.cutoff.findMany(); // Fetch all cutoffs for range matcher

  return (
    <RankVsCollegeClient 
      colleges={colleges} 
      branches={branches} 
      cutoffs={cutoffs} 
    />
  );
}
