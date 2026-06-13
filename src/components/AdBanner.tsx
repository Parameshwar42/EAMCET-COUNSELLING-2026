"use client";

import React, { useEffect, useRef } from "react";

interface AdBannerProps {
  adKey: string;
  format: "300x250" | "728x90" | "468x60" | "160x600" | "320x50" | "160x300";
}

export default function AdBanner({ adKey, format }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    // Only run on client-side
    if (typeof window === "undefined" || !adRef.current) return;

    const dimensions = getDimensions();
    
    // Clear any previous ad script if already present
    adRef.current.innerHTML = "";

    const containerId = `at-container-${adKey}`;
    const innerContainer = document.createElement("div");
    innerContainer.id = containerId;
    adRef.current.appendChild(innerContainer);

    // 1. Create configuration script
    const configScript = document.createElement("script");
    configScript.type = "text/javascript";
    configScript.innerHTML = `
      atOptions = {
        'key' : '${adKey}',
        'format' : 'iframe',
        'height' : ${dimensions.height},
        'width' : ${dimensions.width},
        'params' : {}
      };
    `;

    // 2. Create invocation script
    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;

    // Append to inner container
    innerContainer.appendChild(configScript);
    innerContainer.appendChild(invokeScript);

  }, [adKey, format]);

  const dimensions = getDimensions();

  return (
    <div className="flex flex-col items-center justify-center my-6 gap-2">
      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 select-none">
        Advertisement
      </span>
      <div 
        ref={adRef} 
        style={{ 
          minWidth: `${dimensions.width}px`, 
          minHeight: `${dimensions.height}px` 
        }} 
        className="bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center overflow-hidden shadow-inner animate-pulse-slow"
      />
    </div>
  );
}
