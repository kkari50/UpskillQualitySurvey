"use client";

import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResponseButtonsProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
}

export function ResponseButtons({ value, onChange }: ResponseButtonsProps) {
  return (
    <div className="flex flex-col xs:flex-row gap-3 md:gap-4">
      <Button
        type="button"
        variant={value === true ? "default" : "outline"}
        className={`flex-1 h-12 md:h-14 text-lg font-semibold transition-all ${
          value === true
            ? "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500"
            : "border-2 border-neutral-200 hover:border-primary hover:bg-primary/5"
        }`}
        onClick={() => onChange(true)}
      >
        {value === true && <Check className="w-5 h-5 mr-2" />}
        Yes
      </Button>
      <Button
        type="button"
        variant={value === false ? "default" : "outline"}
        className={`flex-1 h-12 md:h-14 text-lg font-semibold transition-all ${
          value === false
            ? "bg-rose-400 hover:bg-rose-500 text-white border-rose-400"
            : "border-2 border-neutral-200 hover:border-primary hover:bg-primary/5"
        }`}
        onClick={() => onChange(false)}
      >
        {value === false && <X className="w-5 h-5 mr-2" />}
        No
      </Button>
    </div>
  );
}
