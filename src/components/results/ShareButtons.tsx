"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, Linkedin, Twitter, Facebook } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareButtonsProps {
  resultsUrl: string;
  percentage: number;
}

export function ShareButtons({ resultsUrl, percentage }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // Build the full URL
  const fullUrl = typeof window !== "undefined"
    ? `${window.location.origin}${resultsUrl}`
    : resultsUrl;

  const shareText = `I just completed the ABA Quality Assessment and scored ${percentage}%. See how your agency compares!`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(fullUrl);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = fullUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLinkedInShare = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const handleTwitterShare = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      "_blank",
      "width=600,height=400"
    );
  };

  return (
    <div className="text-center py-6">
      <p className="text-sm text-muted-foreground mb-4">
        Share your results with colleagues
      </p>
      <div className="flex justify-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={handleCopyLink}
          className={cn(
            "h-10 w-10 rounded-full transition-colors",
            copied && "border-emerald-500 text-emerald-600"
          )}
          title={copied ? "Copied!" : "Copy link"}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleLinkedInShare}
          className="h-10 w-10 rounded-full hover:border-[#0A66C2] hover:text-[#0A66C2]"
          title="Share on LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleTwitterShare}
          className="h-10 w-10 rounded-full hover:border-[#1DA1F2] hover:text-[#1DA1F2]"
          title="Share on Twitter"
        >
          <Twitter className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleFacebookShare}
          className="h-10 w-10 rounded-full hover:border-[#1877F2] hover:text-[#1877F2]"
          title="Share on Facebook"
        >
          <Facebook className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
