const fs = require('fs');
const path = require('path');

// Path to transcript
const transcriptPath = 'C:\\Users\\param\\.gemini\\antigravity\\brain\\7268040d-eebb-4e56-a44c-5972496b9e64\\.system_generated\\logs\\transcript_full.jsonl';

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

async function main() {
  if (!fs.existsSync(transcriptPath)) {
    console.error("Transcript file not found at " + transcriptPath);
    return;
  }

  const fileContent = fs.readFileSync(transcriptPath, 'utf8');
  const lines = fileContent.split('\n').filter(Boolean);
  
  // Find the last user input line
  let userPrompt = "";
  for (let i = lines.length - 1; i >= 0; i--) {
    try {
      const record = JSON.parse(lines[i]);
      if (record.type === "USER_INPUT" || record.content?.includes("==Start of OCR for page 1==")) {
        userPrompt = record.content || "";
        break;
      }
    } catch (e) {}
  }

  if (!userPrompt) {
    console.error("Could not find USER prompt with OCR data in the transcript.");
    return;
  }

  // Segment by start of OCR and parse
  const allColleges = [];
  const allBranches = [];
  const allCutoffs = [];

  const collegeCodes = new Set();
  const branchCodes = new Set();
  const cutoffSet = new Set();

  // Find all segments of OCR
  const matches = userPrompt.matchAll(/==Start of OCR for page \d+==\r?\n([\s\S]*?)==End of OCR for page \d+==/g);
  
  let matchCount = 0;
  for (const match of matches) {
    const pageText = match[1];
    matchCount++;

    // Determine phase from the text context or heading
    let phase = "FINAL";
    if (userPrompt.substring(0, userPrompt.indexOf(pageText)).lastIndexOf("Second Phase") !== -1) {
      phase = "PHASE_2";
    }
    if (userPrompt.substring(0, userPrompt.indexOf(pageText)).lastIndexOf("First Phase") !== -1) {
      phase = "PHASE_1";
    }
    // Double check local page text
    if (pageText.includes("First Phase") || pageText.includes("FIRST PHASE")) {
      phase = "PHASE_1";
    } else if (pageText.includes("Second Phase") || pageText.includes("SECOND PHASE")) {
      phase = "PHASE_2";
    } else if (pageText.includes("Final Phase") || pageText.includes("FINAL PHASE")) {
      phase = "FINAL";
    }

    const parsed = parseTgeapcetText(pageText, phase);
    
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
  }

  console.log(`Parsed ${matchCount} OCR pages.`);
  console.log(`Extracted: ${allColleges.length} colleges, ${allBranches.length} branches, ${allCutoffs.length} cutoff records.`);

  if (allCutoffs.length === 0) {
    console.log("Regex match failed, trying direct text line parse...");
    const textLines = userPrompt.split(/\r?\n/);
    let currentPhase = "FINAL";
    textLines.forEach(line => {
      if (line.includes("First Phase") || line.includes("FIRST PHASE")) currentPhase = "PHASE_1";
      if (line.includes("Second Phase") || line.includes("SECOND PHASE")) currentPhase = "PHASE_2";
      if (line.includes("Final Phase") || line.includes("FINAL PHASE")) currentPhase = "FINAL";

      const parsed = parseTgeapcetText(line, currentPhase);
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
    });
    console.log(`Direct parse: ${allColleges.length} colleges, ${allBranches.length} branches, ${allCutoffs.length} cutoffs.`);
  }

  const result = { colleges: allColleges, branches: allBranches, cutoffs: allCutoffs };
  fs.writeFileSync(path.join(__dirname, 'realCutoffData.json'), JSON.stringify(result, null, 2));
  console.log("Successfully generated realCutoffData.json!");
}

main();
