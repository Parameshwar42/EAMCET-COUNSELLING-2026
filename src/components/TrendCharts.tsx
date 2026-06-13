"use client";

import React from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell,
  PieChart, Pie
} from "recharts";

// Data for Line Chart: Cutoff movements across phases
const phaseTrendData = [
  { name: "Phase 1", "CBIT CSE": 1850, "VJEC CSE": 1490, "OUCE CSE": 2290, "CVRH CSE": 5930 },
  { name: "Phase 2", "CBIT CSE": 1950, "VJEC CSE": 1580, "OUCE CSE": 2400, "CVRH CSE": 6250 },
  { name: "Final Phase", "CBIT CSE": 2053, "VJEC CSE": 1652, "OUCE CSE": 2547, "CVRH CSE": 6590 }
];

// Data for Bar Chart: College demand index (search/allotment ratios)
const collegeDemandData = [
  { name: "CBIT", count: 9400, fill: "#4f46e5" },
  { name: "VJEC", count: 8800, fill: "#6366f1" },
  { name: "OUCE", count: 8200, fill: "#818cf8" },
  { name: "VASV", count: 7500, fill: "#a5b4fc" },
  { name: "CVRH", count: 7100, fill: "#c7d2fe" },
  { name: "GRRR", count: 6800, fill: "#e0e7ff" }
];

// Data for Pie Chart: Branch popularity index
const branchPopularityData = [
  { name: "CSE (Core)", value: 45, color: "#4f46e5" },
  { name: "CSM (AI/ML)", value: 25, color: "#6366f1" },
  { name: "CSD (Data Sci)", value: 15, color: "#818cf8" },
  { name: "ECE", value: 10, color: "#a5b4fc" },
  { name: "Other (INF/EEE)", value: 5, color: "#c7d2fe" }
];

export default function TrendCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Cutoff Movement Chart */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-100/40">
        <h3 className="text-sm font-bold text-slate-800 mb-1">Cutoff Movement Trends</h3>
        <p className="text-xxs text-slate-400 mb-6">Cutoff rank progression over counselling phases (lower rank means harder to enter).</p>
        
        <div className="h-64 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={phaseTrendData} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" reversed={true} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "11px" }} />
              <Legend iconSize={8} iconType="circle" wrapperStyle={{ paddingTop: "10px" }} />
              <Line type="monotone" dataKey="VJEC CSE" stroke="#4f46e5" strokeWidth={2.5} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="CBIT CSE" stroke="#6366f1" strokeWidth={2} />
              <Line type="monotone" dataKey="OUCE CSE" stroke="#818cf8" strokeWidth={2} />
              <Line type="monotone" dataKey="CVRH CSE" stroke="#a5b4fc" strokeWidth={1.5} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* College Demand Chart */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-100/40">
        <h3 className="text-sm font-bold text-slate-800 mb-1">College Demand Index</h3>
        <p className="text-xxs text-slate-400 mb-6">Student interest index based on choice submissions and predictor searches.</p>
        
        <div className="h-64 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={collegeDemandData} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "11px" }} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {collegeDemandData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Branch Popularity Chart */}
      <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-100/40">
        <h3 className="text-sm font-bold text-slate-800 mb-1">Branch Preference Ratios</h3>
        <p className="text-xxs text-slate-400 mb-6">Percentage of choices locked under various engineering branches.</p>
        
        <div className="flex flex-col md:flex-row items-center justify-around gap-6">
          <div className="h-56 w-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={branchPopularityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {branchPopularityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
            {branchPopularityData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}:</span>
                <span className="text-indigo-600 font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
