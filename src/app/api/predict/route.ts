import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const colleges = await db.college.findMany();
    const branches = await db.branch.findMany();
    const districts = Array.from(new Set(colleges.map((c: any) => c.district))).filter(Boolean).sort();
    
    // Sort branches: CSE first, then alphabetical
    const sortedBranches = [...branches].sort((a: any, b: any) => {
      if (a.code === "CSE") return -1;
      if (b.code === "CSE") return 1;
      return a.code.localeCompare(b.code);
    });

    return NextResponse.json({ colleges, branches: sortedBranches, districts });
  } catch (error) {
    console.error("GET predict metadata failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rank, category, gender, branches, districts } = body;

    if (!rank || !category || !gender || !branches || branches.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch colleges, branches, and cutoffs
    const allColleges = await db.college.findMany();
    const allBranches = await db.branch.findMany();
    
    // Filter colleges by district preferences if specified
    let filteredColleges = allColleges;
    if (districts && districts.length > 0) {
      filteredColleges = allColleges.filter((c: any) => districts.includes(c.district));
    }

    const collegeCodes = filteredColleges.map((c: any) => c.code);

    // Query cutoffs
    // In our db schema/client, we query cutoffs with filters.
    // If the student is Female, she is eligible for both BOYS (Co-Ed) and GIRLS seats,
    // so we will query cutoffs for both genders and merge them by picking the maximum cutoff rank.
    // If Male, we only query BOYS.
    const cutoffGenders = gender === "GIRLS" ? ["BOYS", "GIRLS"] : ["BOYS"];
    
    const rawCutoffs = await db.cutoff.findMany({
      where: {
        college: { code: { in: collegeCodes } },
        branch: { code: { in: branches } },
        category: category,
        gender: { in: cutoffGenders }
      }
    });

    // Merge cutoffs to resolve the best rank if multiple genders queried
    // Group by collegeCode + branchCode + phase
    const mergedMap = new Map<string, any>();
    
    rawCutoffs.forEach((c: any) => {
      const key = `${c.college?.code}-${c.branch?.code}-${c.phase?.code}`;
      const existing = mergedMap.get(key);
      if (!existing || c.rank > existing.rank) {
        mergedMap.set(key, c);
      }
    });

    const uniqueCutoffs = Array.from(mergedMap.values());

    const dreamList: any[] = [];
    const targetList: any[] = [];
    const safeList: any[] = [];

    uniqueCutoffs.forEach((c: any) => {
      const cutoffRank = c.rank;
      const col = c.college;
      const br = c.branch;
      const phaseCode = c.phase?.code || "FINAL";

      // Calculate Probability
      let probability: "High" | "Medium" | "Low" = "Low";
      let percentage = 15;

      if (rank <= cutoffRank) {
        probability = "High";
        // Higher rank = lower number, so if rank is very low (e.g. 2000 vs 8000 cutoff) percentage is 95%
        const ratio = rank / cutoffRank;
        percentage = Math.round(98 - ratio * 15); // 83% - 98%
      } else if (rank <= cutoffRank * 1.2) {
        probability = "Medium";
        // Rank slightly higher (e.g. 11000 vs 10000 cutoff)
        const diff = (rank - cutoffRank) / cutoffRank; // 0 to 0.2
        percentage = Math.round(75 - diff * 150); // 45% - 75%
      } else {
        probability = "Low";
        const diff = (rank - cutoffRank) / cutoffRank;
        percentage = Math.max(5, Math.round(35 - diff * 30)); // 5% - 35%
      }

      const collegeItem = {
        id: c.id,
        collegeCode: col.code,
        collegeName: col.name,
        place: col.place,
        district: col.district,
        coEducation: col.coEducation,
        type: col.type,
        affiliation: col.affiliation,
        branchCode: br.code,
        branchName: br.name,
        cutoffRank,
        probability,
        probabilityPercentage: percentage,
        phase: phaseCode === "FINAL" ? "Final Phase" : phaseCode === "PHASE_1" ? "1st Phase" : "2nd Phase"
      };

      // Classification into Dream, Target, Safe based on historical cutoff and student rank
      // Dream: Cutoff is harder than student rank, but within 50% reach (e.g. cutoff rank is between [rank * 0.5, rank - 1])
      if (cutoffRank < rank && cutoffRank >= rank * 0.5) {
        dreamList.push(collegeItem);
      }
      // Target: Cutoff is right around student rank, up to 1.5x easier (e.g. cutoff rank is between [rank, rank * 1.5])
      else if (cutoffRank >= rank && cutoffRank <= rank * 1.5) {
        targetList.push(collegeItem);
      }
      // Safe: Cutoff is comfortably above student rank, but still nearby (e.g. cutoff rank is between [rank * 1.5, rank * 4.0])
      else if (cutoffRank > rank * 1.5 && cutoffRank <= rank * 4.0) {
        safeList.push(collegeItem);
      }
    });

    // Sort lists by probabilityPercentage descending and then by cutoffRank ascending
    const sorter = (a: any, b: any) => b.probabilityPercentage - a.probabilityPercentage || a.cutoffRank - b.cutoffRank;

    return NextResponse.json({
      dream: dreamList.sort(sorter),
      target: targetList.sort(sorter),
      safe: safeList.sort(sorter)
    });
  } catch (error) {
    console.error("Predict API failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
