"use client";

import { Button } from "@/components/ui/button";
import { PlusSquare, Type, Voicemail } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type ToolbarProps = { onAddPage: () => void; onAddImageText: () => void; onAddSfx: () => void };

const ToolbarButton = ({ onClick, tooltipText, children }: { onClick: () => void; tooltipText: string; children: React.ReactNode }) => (
  <TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger asChild><Button type="button" variant="ghost" size="sm" onClick={onClick}>{children}</Button></TooltipTrigger><TooltipContent><p>{tooltipText}</p></TooltipContent></Tooltip></TooltipProvider>
);

export function FormattingToolbar({ onAddPage, onAddImageText, onAddSfx }: ToolbarProps) {
  return (
    <div className="flex items-center gap-2 rounded-t-md border-b-0 border bg-muted p-2">
      <ToolbarButton onClick={onAddPage} tooltipText="Yeni Sayfa Etiketi Ekle"><PlusSquare className="h-4 w-4 mr-2" />Sayfa Ekle</ToolbarButton>
      <ToolbarButton onClick={onAddImageText} tooltipText="Resim Üstü Yazısı (* ile başlar)"><Type className="h-4 w-4 mr-2" />Resim Üstü</ToolbarButton>
      <ToolbarButton onClick={onAddSfx} tooltipText="Ses Efekti ([içine] yazılır)"><Voicemail className="h-4 w-4 mr-2" />SFX</ToolbarButton>
    </div>
  );
}