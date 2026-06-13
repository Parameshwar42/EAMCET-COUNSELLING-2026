export interface StudentProfile {
  rank: number;
  category: string;
  gender: string;
  branches: string[];
  districts: string[];
}

export interface AdvisorFeedback {
  summary: string;
  tips: string[];
  warnings: string[];
  recommendedStrategy: string;
}

export function generateAdvisorFeedback(profile: StudentProfile, predictedCount: number): AdvisorFeedback {
  const { rank, category, branches } = profile;
  const tips: string[] = [];
  const warnings: string[] = [];
  
  let summary = "";
  let recommendedStrategy = "";

  // Rank analysis
  if (rank <= 5000) {
    summary = `Excellent rank of ${rank}! You are in the top tier of candidates. You have a very high chance of entering premium institutions.`;
    recommendedStrategy = `Prioritize premium Tier-1 colleges (CBIT, VJEC, OUCE) for CSE and allied branches. Put these at the top of your option entry list. Do not settle for lower-tier colleges even if they offer minor scholarships.`;
    tips.push("Fill options for CBIT CSE, VNR VJIET CSE, and OUCE CSE first.");
    tips.push("If you want JNTU/OU campus life, consider ECE/INF in those colleges, as the brand value is extremely high.");
  } else if (rank > 5000 && rank <= 20000) {
    summary = `Very good rank of ${rank}. You have strong prospects, but direct CSE in the absolute top-3 colleges (CBIT, VJEC, OUCE) is highly competitive.`;
    recommendedStrategy = `Adopt a balanced strategy: prioritize CSE/CSM in Tier-1.5/2 colleges (such as CVR, GRRR, Vasavi, and Anurag University) over ECE/EEE in Tier-1 (CBIT/VJEC). If you prefer branch, select CVRH CSE or GRRR CSE as your primary choices.`;
    tips.push("Include CSM (AI/ML) and CSD (Data Science) branches, as their cutoffs are 10-15% higher than core CSE, giving you better entry odds.");
    tips.push("Put at least 5 Dream colleges in your options, followed by 10 Target colleges.");
  } else if (rank > 20000 && rank <= 50000) {
    summary = `Decent rank of ${rank}. You stand a good chance in several well-established private colleges (such as IARE, Annamacharya AITH, ACEG).`;
    recommendedStrategy = `To secure a seat in engineering branches like CSE/IT, expand your target list to include top-tier private colleges in districts like Rangareddy (RR) and Medchal (MDL). Avoid listing only CSE in top 5 colleges, as that may result in no seat allotment.`;
    tips.push("Add branches like Information Technology (INF) or CSE (IoT/Cybersecurity) to keep your options flexible.");
    tips.push("Ensure you list at least 15 target and safe colleges to avoid remaining unallotted in the first phase.");
    warnings.push("Restricting option list to only 3-5 high-demand colleges is risky at this rank range.");
  } else {
    summary = `Your rank is ${rank}. Admission is competitive, but completely achievable by optimizing your option entry list with safe colleges.`;
    recommendedStrategy = `Focus on established private colleges (such as AARM, AKIT, and lower-cutoff branches in ACEG/AITH). List both CSE and ECE/EEE branches in these colleges. Consider government university self-finance seats (like JNTU Sultanpur/Manthani/Palair) which offer lower cutoffs but good brand exposure.`;
    tips.push("Include at least 25 options in your choice list, covering Safe Colleges comfortably.");
    tips.push("Include ECE/EEE/Civil/Mechanical if you want to ensure a seat in a good campus, or look for CSE in districts outside Hyderabad if you are open to boarding.");
    warnings.push("List at least 10 'Safe' colleges. Leaving Safe colleges out might lead to spot-admission fallbacks, which have higher fees.");
  }

  // Branch checks
  if (branches.length === 1 && branches[0] === "CSE") {
    warnings.push("You have selected only core 'CSE'. In TGEAPCET, cutoffs for CSM (AI/ML) and CSD (Data Science) are slightly higher, so adding them will dramatically increase your chances without compromising your curriculum.");
  }

  // Phase trend advice
  tips.push("Counselling trend shows cutoffs usually open up (increase) in the Second and Final phases for mid-tier colleges, but top-tier colleges (CBIT, VJEC) freeze their seats early. Lock your core preferences in Phase 1.");

  // General counselling rules
  tips.push("Option entry choices are processed top-to-bottom. Always place your dream colleges first, even if you think you won't get in, followed by target, and then safe colleges.");

  if (predictedCount === 0) {
    warnings.push("No colleges were predicted for your current filters. Try expanding your branch preferences or checking other districts.");
  }

  return {
    summary,
    tips,
    warnings,
    recommendedStrategy
  };
}
