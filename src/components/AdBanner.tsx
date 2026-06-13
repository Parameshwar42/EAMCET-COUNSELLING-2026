"use client";

import React from "react";

interface AdBannerProps {
  adKey: string;
  format: "300x250" | "728x90" | "468x60" | "160x600" | "320x50" | "160x300";
}

export default function AdBanner({ adKey, format }: AdBannerProps) {
  const getDimensions = () => {
    switch (format) {
      case "728x90":
        return { width: 728, height: 90 };
      case "468x60":
        return { width: 468, height: 60 };
      case "320x50":
        return { width: 320, height: 50 };
      case "160x300":
        return { width: 160, height: 300 };
      case "160x600":
        return { width: 160, height: 600 };
      case "300x250":
      default:
        return { width: 300, height: 250 };
    }
  };

  const dimensions = getDimensions();

  return (
    <div className="flex flex-col items-center justify-center my-6 gap-2">
      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 select-none">
        Advertisement
      </span>
      <div 
        style={{ 
          minWidth: `${dimensions.width}px`, 
          minHeight: `${dimensions.height}px` 
        }} 
        className="bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center overflow-hidden shadow-inner"
      >
        <iframe
          src={`/ad-${format}.html`}
          width={dimensions.width}
          height={dimensions.height}
          frameBorder="0"
          scrolling="no"
          className="overflow-hidden border-0"
        />
      </div>
    </div>
  );
}

