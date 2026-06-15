"use client";

import { Suspense } from "react";
import ListingsPage from "../pages/ListingsPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center text-white/50 font-['Montserrat']">Loading...</div>}>
      <ListingsPage />
    </Suspense>
  );
}
