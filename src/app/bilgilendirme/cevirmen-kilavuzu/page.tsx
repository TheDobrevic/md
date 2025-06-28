// app/bilgilendirme/cevirmen-kilavuzu/page.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import clsx from "clsx";
import { Gavel, Languages, Library, ShieldCheck, LucideIcon } from "lucide-react";

type Section = {
  id: string;
  title: string;
  icon: LucideIcon;
  items: React.ReactNode[];
};

const sections: Section[] = [
  {
    id: "temel-ilkeler",
    title: "Temel İlkeler",
    icon: Gavel,
    items: [
      "Kaynakların sağlam olduğundan ve editöre belirtildiğinden emin olunmalı.",
      "Baloncuk atlamadan, doğru okuma sırasıyla çeviri yapılmalı.",
      "Gereken yerlerde, anlama yardımcı olmak için (İngilizce) eklenmeli.",
      "SFX/Özel efekt baloncukları dahil, sayfadaki her metin çevrilmeli.",
      "Noktalama işaretlerinden sonra mutlaka boşluk bırakılmalı.",
      "Çeviri bitince, baştan sona en az bir kez kontrol edilmeli.",
    ],
  },
  {
    id: "yerellestirme",
    title: "Yerelleştirme & Notlar",
    icon: Languages,
    items: [
      "Amacımız birebir değil, “Biz bunu nasıl deriz?” diye düşünerek yerelleştirme yapmak.",
      "Gereksiz tekrar ve kelimelerden (şey, bir, o…) kaçınılmalı.",
      "Anlam tam karşılanmıyorsa “Çevirmen Notu (Ç/N)” eklenmeli.",
      "Seriye özel, tutarlı bir terimler sözlüğü tutmak kritik önemde.",
    ],
  },
  {
    id: "kaynaklar",
    title: "Kaynaklar",
    icon: Library,
    items: [
      <>Öncelikli (EN-EN): <a href="https://www.oxfordlearnersdictionaries.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-orange-400 hover:underline">Oxford</a>, <a href="https://dictionary.cambridge.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-orange-400 hover:underline">Cambridge</a></>,
      <>Japonca (JP-EN): <a href="https://jisho.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-orange-400 hover:underline">Jisho</a>, <a href="https://tangorin.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-orange-400 hover:underline">Tangorin</a></>,
      <>Türkçe karşılık için: <a href="https://tureng.com/tr/turkce-ingilizce" target="_blank" rel="noopener noreferrer" className="font-semibold text-orange-400 hover:underline">Tureng</a>, Sesli Sözlük</>,
      <>Argo/Deyim için: <a href="https://www.urbandictionary.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-orange-400 hover:underline">Urban Dictionary</a>, <a href="https://idioms.thefreedictionary.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-orange-400 hover:underline">TheFreeDictionary</a></>,
    ],
  },
  {
    id: "sorumluluk",
    title: "Sorumluluk & İletişim",
    icon: ShieldCheck,
    items: [
      "Anlaşılmayan noktalarda ekibe danışmaktan asla çekinilmemeli.",
      <>Yazım denetimi için TDK’nın <a href="http://sozluk.gov.tr/" target="_blank" rel="noopener noreferrer" className="font-semibold text-orange-400 hover:underline">resmi sözlüğü</a> kullanılmalı.</>,
      "Temel hatalardan (Fark etmez, Tabii ki, Her şey…) kaçınılmalı.",
      "Haftada en az iki çeviri hedeflenmeli ve zorunlu durumlarda ekip haberdar edilmeli.",
    ],
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }        // ⬅️ ease kaldırıldı
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 }        // ⬅️ ease kaldırıldı
  },
};

export default function CevirmenKilavuzuPage() {
  const [activeId, setActiveId] = useState(sections[0].id);
  const activeSection = sections.find((sec) => sec.id === activeId)!;

  return (
    <div className="w-full selection:bg-orange-500/30">
      <div className="absolute inset-0 -z-10 h-full w-full bg-inherit
                      bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),
                           linear-gradient(to_bottom,#80808012_1px,transparent_1px)]
                      bg-[size:32px_32px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto
                        h-[310px] w-[310px] rounded-full bg-orange-500
                        opacity-20 blur-[100px]" />
      </div>
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
            Çevirmen Kılavuzu
          </h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto opacity-70">
            MangaDenizi çeviri standartları ve en iyi pratikler.
          </p>
        </div>
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <aside className="lg:col-span-4 xl:col-span-3 mb-12 lg:mb-0">
            <nav className="lg:sticky lg:top-24">
              <ul className="space-y-2">
                {sections.map((sec) => (
                  <li key={sec.id}>
                    <button
                      onClick={() => setActiveId(sec.id)}
                      className={clsx(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group",
                        activeId === sec.id
                          ? "scale-105"
                          : "hover:bg-black/5 dark:hover:bg-white/5"
                      )}
                    >
                      <div className="relative flex-shrink-0">
                        <sec.icon
                          className={clsx(
                            "w-6 h-6 transition-colors",
                            activeId === sec.id
                              ? "text-orange-400"
                              : "opacity-50 group-hover:opacity-100"
                          )}
                        />
                        {activeId === sec.id && (
                          <motion.div
                            layoutId="active-indicator"
                            className="absolute -inset-2 bg-gradient-to-br
                                       from-blue-500/30 to-orange-500/40
                                       rounded-full blur-md"
                          />
                        )}
                      </div>
                      <span className="font-medium">{sec.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
          <main className="lg:col-span-8 xl:col-span-9">
            <div className="lg:sticky lg:top-24">
              <AnimatePresence mode="wait">
                <motion.section
                  key={activeSection.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-black/5 dark:bg-white/5 backdrop-blur-sm
                             border border-black/10 dark:border-white/10
                             rounded-xl p-6 lg:p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-black/5 dark:bg-white/5 rounded-lg">
                      <activeSection.icon className="w-6 h-6 text-orange-400" />
                    </div>
                    <h2 className="text-2xl font-bold">{activeSection.title}</h2>
                  </div>
                  <ul className="space-y-4 opacity-80">
                    {activeSection.items.map((it, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-1 flex-shrink-0 w-2 h-2
                                         rounded-full bg-orange-400 opacity-80" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </motion.section>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
