const fs = require('fs');
const path = require('path');

// Global polyfills for pdf.js in Node
if (typeof global.DOMMatrix === "undefined") {
  global.DOMMatrix = class DOMMatrix {};
}
if (typeof global.ImageData === "undefined") {
  global.ImageData = class ImageData {};
}
if (typeof global.Path2D === "undefined") {
  global.Path2D = class Path2D {};
}

const { PDFParse } = require("pdf-parse");

// Directory where PDFs are stored
const artifactsDir = 'C:\\Users\\param\\.gemini\\antigravity\\brain\\7268040d-eebb-4e56-a44c-5972496b9e64';

// TGEAPCET line-by-line parser logic
function parseTgeapcetText(text, phaseCode) {
  const lines = text.split(/\r?\n/);
  const parsedColleges = [];
  const parsedBranches = [];
  const parsedCutoffs = [];

  const collegeMap = new Map();
  const branchMap = new Map();

  const categories = ["OC", "BC_A", "BC_B", "BC_C", "BC_D", "BC_E", "SC_I", "SC_II", "SC_III", "ST", "EWS"];

  lines.forEach((line) => {
    line = line.trim();
    if (!line) return;

    const matchCode = line.match(/^[A-Z]{4}\s/);
    if (!matchCode) return;

    const tokens = line.split(/\s+/);
    if (tokens.length < 25) return;

    const instCode = tokens[0];
    const coEdIndex = tokens.findIndex((t, idx) => idx > 1 && (t === "COED" || t === "GIRLS"));
    if (coEdIndex === -1) return;

    const collegeType = tokens[coEdIndex + 1];
    const branchCode = tokens[coEdIndex + 2];
    const distCode = tokens[coEdIndex - 1];
    const place = tokens[coEdIndex - 2];
    const instName = tokens.slice(1, coEdIndex - 2).join(" ");
    const affiliation = tokens[tokens.length - 1];

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

  return { colleges: parsedColleges, branches: parsedBranches, cutoffs: parsedCutoffs };
}

async function parsePdf(filePath) {
  console.log(`Loading PDF file: ${filePath}`);
  const data = fs.readFileSync(filePath);
  const uint8 = new Uint8Array(data);
  const parser = new PDFParse(uint8);
  const parsed = await parser.getText();
  return parsed.text;
}

async function main() {
  const files = fs.readdirSync(artifactsDir).filter(f => f.endsWith('.pdf'));
  
  const allColleges = [];
  const allBranches = [];
  const allCutoffs = [];

  const collegeCodes = new Set();
  const branchCodes = new Set();
  const cutoffSet = new Set();

  for (const file of files) {
    const filePath = path.join(artifactsDir, file);
    try {
      const text = await parsePdf(filePath);
      
      // Determine phase from the PDF text content
      let phase = "FINAL";
      if (text.includes("FIRST PHASE") || text.includes("First Phase") || text.includes("FirstPhase")) {
        phase = "PHASE_1";
      } else if (text.includes("SECOND PHASE") || text.includes("Second Phase") || text.includes("SecondPhase")) {
        phase = "PHASE_2";
      } else if (text.includes("FINAL PHASE") || text.includes("Final Phase") || text.includes("FinalPhase") || text.includes("LAST RANK STATEMENT FINAL PHASE")) {
        phase = "FINAL";
      }

      console.log(`Determined phase for ${file}: ${phase}`);

      const parsed = parseTgeapcetText(text, phase);
      console.log(`Parsed from ${file}: ${parsed.colleges.length} colleges, ${parsed.branches.length} branches, ${parsed.cutoffs.length} cutoffs.`);

      parsed.colleges.forEach(c => {
        if (!collegeCodes.has(c.code)) {
          collegeCodes.add(c.code);
          allColleges.push(c);
        }
      });

      parsed.branches.forEach(b => {
        if (!branchCodes.has(b.code)) {
          branchCodes.add(b.code);
          allBranches.push(b);
        }
      });

      parsed.cutoffs.forEach(c => {
        const key = `${c.collegeCode}-${c.branchCode}-${c.phase}-${c.category}-${c.gender}`;
        if (!cutoffSet.has(key)) {
          cutoffSet.add(key);
          allCutoffs.push(c);
        }
      });

    } catch (e) {
      console.error(`Failed to parse ${file}:`, e);
    }
  }

  console.log("---------------------------------------");
  console.log(`Total parsed colleges: ${allColleges.length}`);
  console.log(`Total parsed branches: ${allBranches.length}`);
  console.log(`Total parsed cutoffs: ${allCutoffs.length}`);

  const output = {
    colleges: allColleges,
    branches: allBranches,
    cutoffs: allCutoffs
  };

  fs.writeFileSync(path.join(__dirname, 'realCutoffData.json'), JSON.stringify(output, null, 2));
  console.log("Successfully wrote output to src/lib/realCutoffData.json!");
}

main().catch(console.error);
