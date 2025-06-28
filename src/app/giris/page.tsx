// components/giris-formu.tsx

"use client"; // BU SATIR EN ÖNEMLİSİ!

import dynamic from "next/dynamic";
import React from "react";

const GirisFormu = dynamic(
  () => import("@/components/giris-formu"),
  { ssr: false }
);

export default function GirisPage() {
  return <GirisFormu />;
}