import { mockColleges, mockBranches } from "./mockData";

export interface ParsedData {
  colleges: Array<{ code: string; name: string; place: string; district: string; coEducation: string; type: string; affiliation: string }>;
  branches: Array<{ code: string; name: string }>;
  cutoffs: Array<{ collegeCode: string; branchCode: string; phase: string; category: string; gender: string; rank: number }>;
}

export function parseTgeapcetText(text: string, phaseCode: string = "FINAL"): ParsedData {
  const lines = text.split(/\r?\n/);
  const parsedColleges: any[] = [];
  const parsedBranches: any[] = [];
  const parsedCutoffs: any[] = [];

  const collegeMap = new Map<string, any>();
  const branchMap = new Map<string, any>();

  // Initialize maps with existing seed items to prevent duplicates
  mockColleges.forEach(c => collegeMap.set(c.code, c));
  mockBranches.forEach(b => branchMap.set(b.code, b));

  const categories = ["OC", "BC_A", "BC_B", "BC_C", "BC_D", "BC_E", "SC_I", "SC_II", "SC_III", "ST", "EWS"];

  lines.forEach((line) => {
    line = line.trim();
    if (!line) return;

    // Row must start with a 4-letter uppercase code (e.g. AARM, CBIT)
    const matchCode = line.match(/^[A-Z]{4}\s/);
    if (!matchCode) return;

    const tokens = line.split(/\s+/);
    if (tokens.length < 25) return; // Needs inst, place, branch, type, and 22 ranks

    const instCode = tokens[0];
    
    // Find index of co-education indicator
    const coEdIndex = tokens.findIndex((t, idx) => idx > 1 && (t === "COED" || t === "GIRLS"));
    if (coEdIndex === -1) return;

    const collegeType = tokens[coEdIndex + 1];
    const branchCode = tokens[coEdIndex + 2];
    const distCode = tokens[coEdIndex - 1];
    const place = tokens[coEdIndex - 2];
    
    // College name lies between index 1 and place (index coEdIndex - 2)
    const instName = tokens.slice(1, coEdIndex - 2).join(" ");
    const affiliation = tokens[tokens.length - 1];

    // The preceding 22 tokens are the category ranks
    const rankTokens = tokens.slice(tokens.length - 23, tokens.length - 1);
    if (rankTokens.length !== 22) return;

    if (!collegeMap.has(instCode)) {
      const col = {
        code: instCode,
        name: instName,
        place,
        district: distCode,
        coEducation: tokens[coEdIndex],
        type: collegeType,
        affiliation
      };
      collegeMap.set(instCode, col);
      parsedColleges.push(col);
    }

    // Branch name lies between Branch Code and the first rank cutoff token
    const branchNameTokens = tokens.slice(coEdIndex + 3, tokens.length - 23);
    const branchName = branchNameTokens.join(" ");

    if (!branchMap.has(branchCode)) {
      const br = {
        code: branchCode,
        name: branchName || branchCode
      };
      branchMap.set(branchCode, br);
      parsedBranches.push(br);
    }

    let rankIdx = 0;
    categories.forEach((cat) => {
      // BOYS
      const rankBoysVal = rankTokens[rankIdx];
      if (rankBoysVal && rankBoysVal !== "NA") {
        const rVal = parseInt(rankBoysVal, 10);
        if (!isNaN(rVal)) {
          parsedCutoffs.push({
            collegeCode: instCode,
            branchCode,
            phase: phaseCode,
            category: cat,
            gender: "BOYS",
            rank: rVal
          });
        }
      }
      rankIdx++;

      // GIRLS
      const rankGirlsVal = rankTokens[rankIdx];
      if (rankGirlsVal && rankGirlsVal !== "NA") {
        const rVal = parseInt(rankGirlsVal, 10);
        if (!isNaN(rVal)) {
          parsedCutoffs.push({
            collegeCode: instCode,
            branchCode,
            phase: phaseCode,
            category: cat,
            gender: "GIRLS",
            rank: rVal
          });
        }
      }
      rankIdx++;
    });
  });

  return {
    colleges: parsedColleges,
    branches: parsedBranches,
    cutoffs: parsedCutoffs
  };
}
