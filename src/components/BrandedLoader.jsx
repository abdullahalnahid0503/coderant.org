import React from "react";

export default function BrandedLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-[#131316] text-white">
      <div className="flex flex-col items-center px-6 text-center">
        {/* CodeRant Logo */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#FDE01A] shadow-lg">
          <span className="text-3xl font-black tracking-tight text-[#131316]">
            CR
          </span>
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl font-bold tracking-tight">
          Code<span className="text-[#FDE01A]">Rant</span>
        </h1>

        <p className="mt-3 text-sm text-gray-400">
          Connecting developers with opportunities.
        </p>

        {/* Loading Animation */}
        <div
          className="mt-8 h-1 w-40 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-label="Loading CodeRant"
        >
          <div className="h-full w-2/5 rounded-full bg-[#FDE01A] animate-[loader_1.2s_ease-in-out_infinite]" />
        </div>

        <p className="mt-4 animate-pulse text-xs text-[#FDE01A]">
          Preparing your experience...
        </p>
      </div>

      <style>{`
        @keyframes loader {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(150%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  );
}
