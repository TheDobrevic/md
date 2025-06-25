"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export function Step6Result() {
  return (
    <div className="text-center p-8 space-y-4">
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 20 } }}>
        <CheckCircle className="mx-auto h-24 w-24 text-green-500" />
      </motion.div>
      <h2 className="text-4xl font-bold bg-gradient-to-br from-black to-neutral-600 bg-clip-text text-transparent dark:from-white dark:to-neutral-400">Başvurunuz Alındı!</h2>
      <p className="text-neutral-600 dark:text-neutral-300 max-w-sm mx-auto">Ekibimize gösterdiğiniz ilgi için çok teşekkür ederiz. Başvurunuz en kısa sürede incelenip, belirttiğiniz e-posta adresinden size geri dönüş yapılacaktır.</p>
      <Button asChild className="text-lg py-6 px-6 rounded-full"><Link href="/">Anasayfaya Dön</Link></Button>
    </div>
  );
}