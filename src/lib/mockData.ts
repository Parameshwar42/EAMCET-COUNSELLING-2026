export interface CollegeMock {
  code: string;
  name: string;
  place: string;
  district: string;
  coEducation: string;
  type: string;
  affiliation: string;
}

export interface BranchMock {
  code: string;
  name: string;
}

export interface CutoffMock {
  collegeCode: string;
  branchCode: string;
  phase: string; // PHASE_1, PHASE_2, FINAL
  category: string; // OC, BC_A, BC_B, BC_C, BC_D, BC_E, SC_I, SC_II, SC_III, ST, EWS
  gender: string; // BOYS, GIRLS
  rank: number;
}

export const mockColleges: CollegeMock[] = [
  { code: "CBIT", name: "CHAITANYA BHARATHI INSTITUTE OF TECHNOLOGY", place: "GANDIPET", district: "RR", coEducation: "COED", type: "PVT", affiliation: "OU" },
  { code: "VJEC", name: "V N R VIGNANA JYOTHI INSTITUTE OF ENGG AND TECH", place: "BACHUPALLY", district: "MDL", coEducation: "COED", type: "PVT", affiliation: "JNTUH" },
  { code: "OUCE", name: "O U COLLEGE OF ENGG HYDERABAD", place: "HYDERABAD", district: "HYD", coEducation: "COED", type: "GOV", affiliation: "OU" },
  { code: "VMEG", name: "VARDHAMAN COLLEGE OF ENGINEERING", place: "SHAMSHABAD", district: "RR", coEducation: "COED", type: "PVT", affiliation: "JNTUH" },
  { code: "VASV", name: "VASAVI COLLEGE OF ENGINEERING", place: "HYDERABAD", district: "HYD", coEducation: "COED", type: "PVT", affiliation: "OU" },
  { code: "CVRH", name: "CVR COLLEGE OF ENGINEERING", place: "IBRAHIMPATAN", district: "RR", coEducation: "COED", type: "PVT", affiliation: "JNTUH" },
  { code: "GNTW", name: "G NARAYNAMMA INSTITUTE OF TECHNOLOGY AND SCI (FOR WOMEN)", place: "SHAIKPET", district: "HYD", coEducation: "GIRLS", type: "PVT", affiliation: "JNTUH" },
  { code: "GRRR", name: "GOKARAJU RANGARAJU INSTITUTE OF ENGG AND TECH", place: "BACHUPALLY", district: "MDL", coEducation: "COED", type: "PVT", affiliation: "JNTUH" },
  { code: "IARE", name: "INSTITUTE OF AERONAUTICAL ENGINEERING", place: "DUNDIGAL", district: "MDL", coEducation: "COED", type: "PVT", affiliation: "JNTUH" },
  { code: "ANUG", name: "ANURAG UNIVERSITY (FORMERLY CVSR)", place: "GHATKESAR", district: "MDL", coEducation: "COED", type: "PVT", affiliation: "ANURAG" },
  { code: "AARM", name: "AAR MAHAVEER ENGINEERING COLLEGE", place: "BANDLAGUDA", district: "HYD", coEducation: "COED", type: "PVT", affiliation: "JNTUH" },
  { code: "ACEG", name: "A C E ENGINEERING COLLEGE", place: "GHATKESAR", district: "MDL", coEducation: "COED", type: "PVT", affiliation: "JNTUH" },
  { code: "AITH", name: "ANNAMACHARYA INST OF TECHNOLOGY AND SCI", place: "HAYATHNAGAR", district: "RR", coEducation: "COED", type: "PVT", affiliation: "JNTUH" },
  { code: "AKIT", name: "ABDULKALAM INST OF TECHNOLOGY AND SCI", place: "KOTHAGUDEM", district: "KGM", coEducation: "COED", type: "PVT", affiliation: "JNTUH" }
];

export const mockBranches: BranchMock[] = [
  { code: "CSE", name: "COMPUTER SCIENCE AND ENGINEERING" },
  { code: "CSM", name: "CSE (ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING)" },
  { code: "CSD", name: "CSE (DATA SCIENCE)" },
  { code: "CSO", name: "CSE (IOT)" },
  { code: "ECE", name: "ELECTRONICS AND COMMUNICATION ENGINEERING" },
  { code: "EEE", name: "ELECTRICAL AND ELECTRONICS ENGINEERING" },
  { code: "MEC", name: "MECHANICAL ENGINEERING" },
  { code: "CIV", name: "CIVIL ENGINEERING" },
  { code: "INF", name: "INFORMATION TECHNOLOGY" }
];

// Helper to generate realistic cutoffs
const categories = ["OC", "BC_A", "BC_B", "BC_C", "BC_D", "BC_E", "SC_I", "SC_II", "SC_III", "ST", "EWS"];
const genders = ["BOYS", "GIRLS"];

// Raw templates from the OCR to make predictions accurate
// Format: [College, Branch, OC_BOYS, OC_GIRLS, BC_B_BOYS, BC_B_GIRLS, SC_I_BOYS, EWS_BOYS]
const rawCutoffTemplates = [
  { col: "CBIT", br: "CSE", ocB: 2053, ocG: 2471, bcA_B: 4164, bcB_B: 2053, bcB_G: 2495, scB: 14488, ewsB: 2122 },
  { col: "CBIT", br: "CSM", ocB: 2158, ocG: 2753, bcA_B: 4327, bcB_B: 2465, bcB_G: 3290, scB: 2158, ewsB: 2219 },
  { col: "CBIT", br: "ECE", ocB: 4205, ocG: 5696, bcA_B: 10457, bcB_B: 6198, bcB_G: 7273, scB: 26741, ewsB: 5849 },
  { col: "VJEC", br: "CSE", ocB: 1652, ocG: 1933, bcA_B: 2901, bcB_B: 2043, bcB_G: 2043, scB: 21970, ewsB: 1652 },
  { col: "VJEC", br: "CSM", ocB: 2269, ocG: 2269, bcA_B: 4292, bcB_B: 2540, bcB_G: 2764, scB: 16892, ewsB: 2269 },
  { col: "VJEC", br: "ECE", ocB: 4619, ocG: 4619, bcA_B: 10913, bcB_B: 6200, bcB_G: 6945, scB: 4619, ewsB: 5338 },
  { col: "OUCE", br: "CSE", ocB: 2547, ocG: 2547, bcA_B: 4917, bcB_B: 2905, bcB_G: 2905, scB: 11310, ewsB: 3758 },
  { col: "OUCE", br: "ECE", ocB: 4549, ocG: 4568, bcA_B: 10605, bcB_B: 6390, bcB_G: 6390, scB: 4549, ewsB: 5996 },
  { col: "VMEG", br: "CSE", ocB: 8939, ocG: 9853, bcA_B: 25638, bcB_B: 13745, bcB_G: 13745, scB: 85142, ewsB: 9481 },
  { col: "VMEG", br: "CSM", ocB: 9452, ocG: 9452, bcA_B: 23453, bcB_B: 13963, bcB_G: 14087, scB: 9452, ewsB: 9864 },
  { col: "VASV", br: "CSE", ocB: 2292, ocG: 2358, bcA_B: 5756, bcB_B: 2906, bcB_G: 3160, scB: 2292, ewsB: 2339 },
  { col: "CVRH", br: "CSE", ocB: 6590, ocG: 7055, bcA_B: 19729, bcB_B: 8870, bcB_G: 10419, scB: 44637, ewsB: 6743 },
  { col: "CVRH", br: "CSM", ocB: 6781, ocG: 7444, bcA_B: 19952, bcB_B: 9084, bcB_G: 10755, scB: 37804, ewsB: 6843 },
  { col: "GNTW", br: "CSE", ocB: 99999, ocG: 5534, bcA_B: 99999, bcB_B: 99999, bcB_G: 7473, scB: 99999, ewsB: 5645 }, // Girls-only college
  { col: "GNTW", br: "CSM", ocB: 99999, ocG: 5873, bcA_B: 99999, bcB_B: 99999, bcB_G: 7730, scB: 99999, ewsB: 5980 },
  { col: "GRRR", br: "CSE", ocB: 4184, ocG: 4546, bcA_B: 10617, bcB_B: 5637, bcB_G: 6475, scB: 26116, ewsB: 4432 },
  { col: "GRRR", br: "CSM", ocB: 4664, ocG: 4860, bcA_B: 11928, bcB_B: 6176, bcB_G: 7252, scB: 26968, ewsB: 5098 },
  { col: "IARE", br: "CSE", ocB: 11562, ocG: 12390, bcA_B: 27975, bcB_B: 17773, bcB_G: 17773, scB: 70844, ewsB: 13630 },
  { col: "ANUG", br: "CSE", ocB: 11593, ocG: 12045, bcA_B: 25594, bcB_B: 17829, bcB_G: 17829, scB: 60726, ewsB: 12643 },
  { col: "ANUG", br: "ECE", ocB: 18658, ocG: 19424, bcA_B: 45062, bcB_B: 28392, bcB_G: 31153, scB: 132797, ewsB: 21282 },
  { col: "AARM", br: "CSE", ocB: 38805, ocG: 38805, bcA_B: 94375, bcB_B: 79836, bcB_G: 79836, scB: 38805, ewsB: 47591 },
  { col: "AARM", br: "ECE", ocB: 34682, ocG: 34682, bcA_B: 134966, bcB_B: 127402, bcB_G: 127402, scB: 34682, ewsB: 90829 },
  { col: "ACEG", br: "CSE", ocB: 23801, ocG: 23801, bcA_B: 55224, bcB_B: 36333, bcB_G: 36730, scB: 137606, ewsB: 28008 },
  { col: "ACEG", br: "CSD", ocB: 28542, ocG: 28542, bcA_B: 57913, bcB_B: 38383, bcB_G: 41910, scB: 108625, ewsB: 29296 },
  { col: "AITH", br: "CSE", ocB: 42132, ocG: 52412, bcA_B: 123494, bcB_B: 134717, bcB_G: 134717, scB: 42132, ewsB: 125696 },
  { col: "AKIT", br: "CSE", ocB: 55273, ocG: 60154, bcA_B: 133343, bcB_B: 141626, bcB_G: 141626, scB: 55273, ewsB: 106991 }
];

export const generateMockCutoffs = (): CutoffMock[] => {
  const cutoffs: CutoffMock[] = [];
  const phases = ["PHASE_1", "PHASE_2", "FINAL"];

  rawCutoffTemplates.forEach((temp) => {
    phases.forEach((phase) => {
      // Apply slight variations for different phases (phase 1 is strictest, final is highest rank)
      let phaseMultiplier = 1.0;
      if (phase === "PHASE_1") phaseMultiplier = 0.9;
      if (phase === "PHASE_2") phaseMultiplier = 0.95;

      categories.forEach((cat) => {
        genders.forEach((gen) => {
          let baseRank = 45000; // default rank fallback

          if (cat === "OC") {
            baseRank = gen === "BOYS" ? temp.ocB : temp.ocG;
          } else if (cat === "BC_B") {
            baseRank = gen === "BOYS" ? temp.bcB_B : temp.bcB_G;
          } else if (cat === "BC_A") {
            baseRank = temp.bcA_B;
          } else if (cat.startsWith("SC")) {
            baseRank = temp.scB;
          } else if (cat === "EWS") {
            baseRank = temp.ewsB;
          } else {
            // General scaling for other categories (BC_D, BC_E, ST, BC_C)
            const baseOc = gen === "BOYS" ? temp.ocB : temp.ocG;
            if (cat === "ST") baseRank = baseOc * 3.5;
            else if (cat === "BC_D") baseRank = baseOc * 1.5;
            else if (cat === "BC_E") baseRank = baseOc * 2.2;
            else if (cat === "BC_C") baseRank = baseOc * 1.1;
          }

          // Bound it
          const finalRank = Math.min(150000, Math.max(500, Math.round(baseRank * phaseMultiplier)));

          // Avoid writing fake entries for girls-only colleges under boys categories
          if (temp.col === "GNTW" && gen === "BOYS") {
            return; // Skip boys in girls' colleges
          }

          cutoffs.push({
            collegeCode: temp.col,
            branchCode: temp.br,
            phase,
            category: cat,
            gender: gen,
            rank: finalRank
          });
        });
      });
    });
  });

  return cutoffs;
};
