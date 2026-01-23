"use client";

import { Info } from "lucide-react";

interface ResourceNoticeProps {
  className?: string;
}

export function ResourceNotice({ className = "" }: ResourceNoticeProps) {
  return (
    <div
      className={`flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg ${className}`}
    >
      <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
      <p className="text-sm text-blue-700">
        <span className="font-medium">Privacy Notice:</span> Your data stays in
        your browser and is not saved to any server. Download the PDF to keep a
        copy of your work.
      </p>
    </div>
  );
}
