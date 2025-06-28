

"use client"; 

import dynamic from "next/dynamic";
import React from "react";

const GirisFormu = dynamic(
  () => import("@/components/giris-formu"),
  { ssr: false }
);

export default function GirisPage() {
  return <GirisFormu />;
}