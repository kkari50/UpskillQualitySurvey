"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText } from "lucide-react";

interface PDFViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title?: string;
}

/**
 * PDF Viewer Modal with mobile-friendly fallback
 * Desktop: Uses browser's native PDF viewer via iframe
 * Mobile: Shows download/open buttons since inline PDF doesn't work well
 */
export function PDFViewerModal({
  isOpen,
  onClose,
  pdfUrl,
  title = "PDF Document",
}: PDFViewerModalProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile devices
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={
          isMobile
            ? "w-[95vw] max-w-md p-0 flex flex-col"
            : "max-w-4xl w-[95vw] h-[90vh] p-0 flex flex-col"
        }
      >
        <DialogHeader className="px-4 py-3 border-b flex-shrink-0">
          <DialogTitle className="text-lg font-semibold truncate pr-8">
            {title}
          </DialogTitle>
        </DialogHeader>

        {isMobile ? (
          // Mobile: Show action buttons instead of iframe
          <div className="p-6 flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center">
              <FileText className="w-10 h-10 text-teal-600" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              PDF viewing is not supported on mobile devices.
              <br />
              Please use a desktop browser to view this document.
            </p>
          </div>
        ) : (
          // Desktop: Show iframe with hidden toolbar
          <div className="flex-1 min-h-0">
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0`}
              className="w-full h-full border-0"
              title={title}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
