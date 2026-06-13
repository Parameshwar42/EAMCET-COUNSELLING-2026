"use client";

import React from "react";

interface AdBannerProps {
  adKey?: string;
  format: "300x250" | "728x90" | "468x60" | "160x600" | "320x50" | "160x300" | "native";
}

export default function AdBanner({ adKey = "", format }: AdBannerProps) {
  if (format === "728x90") {
    return (
      <div className="w-full flex justify-center my-6 gap-2 overflow-hidden select-none">
        {/* Desktop View: 728x90 */}
        <div className="hidden md:flex flex-col items-center justify-center gap-2">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 select-none">
            Advertisement
          </span>
          <div className="w-[728px] h-[90px] bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center overflow-hidden shadow-inner">
            <iframe
              src="/ad-728x90.html"
              width={728}
              height={90}
              frameBorder="0"
              scrolling="no"
              className="overflow-hidden border-0"
              style={{ width: "728px", height: "90px" }}
            />
          </div>
        </div>

        {/* Mobile View fallback: 320x50 */}
        <div className="flex md:hidden flex-col items-center justify-center gap-2 w-full max-w-[320px]">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 select-none">
            Advertisement
          </span>
          <div className="w-[320px] h-[50px] bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center overflow-hidden shadow-inner">
            <iframe
              src="/ad-320x50.html"
              width={320}
              height={50}
              frameBorder="0"
              scrolling="no"
              className="overflow-hidden border-0"
              style={{ width: "320px", height: "50px" }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (format === "468x60") {
    return (
      <div className="w-full flex justify-center my-6 gap-2 overflow-hidden select-none">
        {/* Desktop View: 468x60 */}
        <div className="hidden sm:flex flex-col items-center justify-center gap-2">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 select-none">
            Advertisement
          </span>
          <div className="w-[468px] h-[60px] bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center overflow-hidden shadow-inner">
            <iframe
              src="/ad-468x60.html"
              width={468}
              height={60}
              frameBorder="0"
              scrolling="no"
              className="overflow-hidden border-0"
              style={{ width: "468px", height: "60px" }}
            />
          </div>
        </div>

        {/* Mobile View fallback: 320x50 */}
        <div className="flex sm:hidden flex-col items-center justify-center gap-2 w-full max-w-[320px]">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 select-none">
            Advertisement
          </span>
          <div className="w-[320px] h-[50px] bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center overflow-hidden shadow-inner">
            <iframe
              src="/ad-320x50.html"
              width={320}
              height={50}
              frameBorder="0"
              scrolling="no"
              className="overflow-hidden border-0"
              style={{ width: "320px", height: "50px" }}
            />
          </div>
        </div>
      </div>
    );
  }

  const getDimensions = () => {
    switch (format) {
      case "native":
        return { width: "100%", height: 320, isPercent: true };
      case "320x50":
        return { width: 320, height: 50, isPercent: false };
      case "160x300":
        return { width: 160, height: 300, isPercent: false };
      case "160x600":
        return { width: 160, height: 600, isPercent: false };
      case "300x250":
      default:
        return { width: 300, height: 250, isPercent: false };
    }
  };

  const dimensions = getDimensions();
  const widthVal = dimensions.isPercent ? "100%" : `${dimensions.width}px`;

  return (
    <div className={`flex flex-col items-center justify-center my-6 gap-2 ${dimensions.isPercent ? "w-full" : ""}`}>
      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 select-none">
        Advertisement
      </span>
      <div 
        style={{ 
          width: widthVal, 
          minHeight: `${dimensions.height}px` 
        }} 
        className={`bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center overflow-hidden shadow-inner ${dimensions.isPercent ? "w-full" : ""}`}
      >
        <iframe
          src={`/ad-${format}.html`}
          width={dimensions.isPercent ? "100%" : dimensions.width}
          height={dimensions.height}
          frameBorder="0"
          scrolling="no"
          className="overflow-hidden border-0"
          style={{ width: dimensions.isPercent ? "100%" : `${dimensions.width}px` }}
        />
      </div>
    </div>
  );
}


