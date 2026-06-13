"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, Trash2, Download, CheckCircle2, GraduationCap } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface OptionItem {
  id: string;
  collegeCode: string;
  collegeName: string;
  branchCode: string;
  branchName: string;
  place: string;
  district: string;
}

export default function OptionBuilder() {
  const [options, setOptions] = useState<OptionItem[]>([]);
  const [showSavedToast, setShowSavedToast] = useState<boolean>(false);

  useEffect(() => {
    // Load from local storage
    const stored = localStorage.getItem("counselling_options");
    if (stored) {
      setOptions(JSON.parse(stored));
    }
  }, []);

  const saveToLocalStorage = (updated: OptionItem[]) => {
    setOptions(updated);
    localStorage.setItem("counselling_options", JSON.stringify(updated));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...options];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    saveToLocalStorage(updated);
  };

  const moveDown = (index: number) => {
    if (index === options.length - 1) return;
    const updated = [...options];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    saveToLocalStorage(updated);
  };

  const deleteItem = (id: string) => {
    const updated = options.filter(item => item.id !== id);
    saveToLocalStorage(updated);
  };

  const saveList = () => {
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  // Excel Export
  const exportToExcel = () => {
    if (options.length === 0) return;
    const data = options.map((item, idx) => ({
      "Priority Order": idx + 1,
      "College Code": item.collegeCode,
      "College Name": item.collegeName,
      "Branch Code": item.branchCode,
      "Branch Name": item.branchName,
      "Place": item.place,
      "District": item.district
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Option Entry List");

    // Adjust column widths
    worksheet["!cols"] = [
      { wch: 15 },
      { wch: 15 },
      { wch: 45 },
      { wch: 15 },
      { wch: 35 },
      { wch: 15 },
      { wch: 15 }
    ];

    XLSX.writeFile(workbook, "TGEAPCET_2026_Option_Entry_Form.xlsx");
  };

  // PDF Export
  const exportToPDF = () => {
    if (options.length === 0) return;
    const doc = new jsPDF();

    // Set Header details
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(79, 70, 229); // Indigo-600
    doc.text("🎓 TGEAPCET Counselling 2026", 14, 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Generated Option Entry Priority List for Official Web Counselling", 14, 26);
    doc.text(`Total Choices: ${options.length} | Date: ${new Date().toLocaleDateString()}`, 14, 31);
    
    // Line separator
    doc.setDrawColor(220);
    doc.line(14, 36, 196, 36);

    const bodyData = options.map((item, idx) => [
      idx + 1,
      item.collegeCode,
      item.collegeName,
      item.branchCode,
      item.branchName,
      `${item.place}, ${item.district}`
    ]);

    autoTable(doc, {
      startY: 42,
      head: [["Priority", "Inst Code", "Institute Name", "Branch", "Branch Name", "Location"]],
      body: bodyData,
      theme: "striped",
      headStyles: { fillColor: [79, 70, 229], fontStyle: "bold" },
      styles: { fontSize: 8.5, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 15, halign: "center" },
        1: { cellWidth: 20, fontStyle: "bold" },
        2: { cellWidth: 60 },
        3: { cellWidth: 15, fontStyle: "bold" },
        4: { cellWidth: 45 },
        5: { cellWidth: 27 }
      }
    });

    // Save PDF
    doc.save("TGEAPCET_2026_Option_Entry_Form.pdf");
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {showSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
          <span>Option entry list saved successfully!</span>
        </div>
      )}

      {options.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-md">
          <GraduationCap className="h-12 w-12 text-slate-300 mb-4 animate-pulse" />
          <h3 className="text-base font-bold text-slate-800">Your Option Entry List is Empty</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm">
            Go to the College Predictor tab, run predictions, and click the "+" button next to colleges to start building your priority list.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-md p-6 shadow-xl shadow-slate-100/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-800">My Priority Choices ({options.length})</h2>
              <p className="text-xs text-slate-500">Arrange colleges in the exact order you want to get allotted.</p>
            </div>
            
            <div className="flex flex-wrap gap-2.5">
              <button 
                onClick={saveList}
                className="rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 px-4 py-2 text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                Save Draft
              </button>
              <button 
                onClick={exportToExcel}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-600 px-4 py-2 text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Excel</span>
              </button>
              <button 
                onClick={exportToPDF}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-xs font-bold shadow-md shadow-indigo-100 hover:shadow-indigo-200 transition-all cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {options.map((item, index) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  {/* Priority Order Badge */}
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-700">
                    {index + 1}
                  </span>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50/30 border border-indigo-100/50 px-1.5 py-0.5 rounded">
                        {item.collegeCode}
                      </span>
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                        {item.branchCode}
                      </span>
                      <span className="text-xxs font-medium text-slate-400">
                        {item.place}, {item.district}
                      </span>
                    </div>
                    <h4 className="mt-1.5 text-sm font-semibold text-slate-800 leading-tight">
                      {item.collegeName}
                    </h4>
                    <p className="text-xxs text-slate-400 mt-0.5">{item.branchName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Up button */}
                  <button 
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border border-slate-100 bg-slate-50/50 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-all ${
                      index === 0 ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  
                  {/* Down button */}
                  <button 
                    onClick={() => moveDown(index)}
                    disabled={index === options.length - 1}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border border-slate-100 bg-slate-50/50 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-all ${
                      index === options.length - 1 ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  
                  {/* Delete button */}
                  <button 
                    onClick={() => deleteItem(item.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-100 bg-slate-50/50 text-slate-400 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
