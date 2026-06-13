import React from "react";
import { db } from "@/lib/db";
import CutoffsClient from "./CutoffsClient";

export const metadata = {
  title: "TGEAPCET Cutoffs Directory - Official Last Rank Statements",
  description: "Browse 2025 cutoff last ranks for all Telangana engineering colleges. Search branch-wise and category-wise cutoffs for 1st, 2nd, and Final counselling phases."
};

export default async function TgeapcetCutoffsPage() {
  // Fetch colleges, branches, and cutoffs
  const colleges = await db.college.findMany();
  const branches = await db.branch.findMany();
  const cutoffs = await db.cutoff.findMany(); // Fetch all cutoffs for directory browser

  return (
    <CutoffsClient 
      colleges={colleges} 
      branches={branches} 
      cutoffs={cutoffs} 
    />
  );
}
