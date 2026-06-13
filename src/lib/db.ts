import { PrismaClient } from "@prisma/client";
import realData from "./realCutoffData.json";

let prisma: PrismaClient | null = null;
let isMockDatabase = false;

try {
  prisma = new PrismaClient();
} catch (e) {
  console.log("Prisma client failed to instantiate, falling back to local memory database.", e);
  isMockDatabase = true;
}

// Memory database tables
let localColleges = [...realData.colleges];
let localBranches = [...realData.branches];
let localCutoffs = [...realData.cutoffs];
const localLeads: any[] = [];

// Fallback Mock database engine
const mockDb = {
  isMock: true,
  college: {
    findMany: async (args?: any) => {
      let list = [...localColleges];
      if (args?.where?.district) {
        list = list.filter(c => c.district === args.where.district);
      }
      return list;
    },
    findUnique: async (args: any) => {
      return localColleges.find(c => c.code === args.where.code) || null;
    },
    create: async (args: any) => {
      const exists = localColleges.find(c => c.code === args.data.code);
      if (exists) return exists;
      localColleges.push(args.data);
      return args.data;
    }
  },
  branch: {
    findMany: async (args?: any) => {
      return localBranches;
    },
    create: async (args: any) => {
      const exists = localBranches.find(b => b.code === args.data.code);
      if (exists) return exists;
      localBranches.push(args.data);
      return args.data;
    }
  },
  phase: {
    findMany: async (args?: any) => {
      return [
        { code: "PHASE_1", name: "First Phase" },
        { code: "PHASE_2", name: "Second Phase" },
        { code: "FINAL", name: "Final Phase" }
      ];
    }
  },
  cutoff: {
    findMany: async (args?: any) => {
      let list = [...localCutoffs];
      
      if (args?.where) {
        const { college, branch, category, gender } = args.where;
        if (college?.code?.in) {
          list = list.filter(c => college.code.in.includes(c.collegeCode));
        }
        if (branch?.code?.in) {
          list = list.filter(c => branch.code.in.includes(c.branchCode));
        }
        if (category) {
          list = list.filter(c => c.category === category);
        }
        if (gender) {
          if (typeof gender === "object" && gender.in) {
            list = list.filter(c => gender.in.includes(c.gender));
          } else {
            list = list.filter(c => c.gender === gender);
          }
        }
      }
      
      return list.map(c => {
        const col = localColleges.find(col => col.code === c.collegeCode);
        const br = localBranches.find(br => br.code === c.branchCode);
        return {
          id: `${c.collegeCode}-${c.branchCode}-${c.category}-${c.gender}-${c.phase}`,
          rank: c.rank,
          category: c.category,
          gender: c.gender,
          phase: { code: c.phase, name: c.phase.replace("_", " ") },
          college: col ? { ...col } : null,
          branch: br ? { ...br } : null
        };
      });
    },
    create: async (args: any) => {
      localCutoffs.push(args.data);
      return args.data;
    },
    createMany: async (args: any) => {
      localCutoffs.push(...args.data);
      return { count: args.data.length };
    },
    deleteMany: async () => {
      localCutoffs = [];
      return { count: 0 };
    }
  },
  lead: {
    create: async (args: any) => {
      const newLead = { id: Math.random().toString(), ...args.data, capturedAt: new Date() };
      localLeads.push(newLead);
      return newLead;
    },
    findMany: async () => {
      return localLeads;
    }
  }
};

export const db = new Proxy({} as any, {
  get(target, prop) {
    if (isMockDatabase || !prisma) {
      return (mockDb as any)[prop];
    }
    
    const prismaProp = (prisma as any)[prop];
    if (!prismaProp) return undefined;
    
    return new Proxy(prismaProp, {
      get(subTarget, subProp) {
        const originalMethod = subTarget[subProp];
        if (typeof originalMethod !== "function") return originalMethod;
        
        return async function (...args: any[]) {
          try {
            return await originalMethod.apply(subTarget, args);
          } catch (error) {
            console.warn(`Postgres connection failed on [db.${String(prop)}.${String(subProp)}]. Gracefully falling back to local memory database.`);
            isMockDatabase = true;
            const fallbackMethod = ((mockDb as any)[prop] as any)[subProp];
            if (typeof fallbackMethod === "function") {
              return await fallbackMethod.apply((mockDb as any)[prop], args);
            }
            throw error;
          }
        };
      }
    });
  }
});

export const getDbStatus = () => {
  return isMockDatabase ? "LOCAL_MOCK_JSON" : "POSTGRESQL_ACTIVE";
};
