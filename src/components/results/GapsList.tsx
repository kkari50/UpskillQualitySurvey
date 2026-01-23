"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getInsightForQuestion, type Resource } from "@/data/resources";
import { FileText, ExternalLink, ChevronDown, BookOpen } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { PDFViewerModal } from "@/components/pdf/PDFViewerModal";

interface Gap {
  questionId: string;
  questionText: string;
  categoryId: string;
  categoryName: string;
}

interface GapsListProps {
  gaps: Gap[];
}

interface ResourceLinkProps {
  resource: Resource;
  onOpenPDF?: (resource: Resource) => void;
}

function ResourceLink({ resource, onOpenPDF }: ResourceLinkProps) {
  const iconMap: Record<string, typeof FileText> = {
    checklist: FileText,
    tool: FileText,
    guide: FileText,
    template: FileText,
    research: BookOpen,
  };
  const Icon = iconMap[resource.type] || FileText;

  // For PDF modal resources, render a button instead of a link
  if (resource.viewerType === "pdf-modal" && onOpenPDF) {
    return (
      <button
        onClick={() => onOpenPDF(resource)}
        className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-teal-50 hover:bg-teal-100 transition-colors border border-teal-200 cursor-pointer"
      >
        <Icon className="w-4 h-4 text-teal-600 flex-shrink-0" />
        <span className="text-sm font-medium text-teal-700">
          {resource.title}
        </span>
        <BookOpen className="w-3 h-3 text-teal-500" />
      </button>
    );
  }

  // For external links, open in new tab
  if (resource.viewerType === "external") {
    return (
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-teal-50 hover:bg-teal-100 transition-colors border border-teal-200"
      >
        <Icon className="w-4 h-4 text-teal-600 flex-shrink-0" />
        <span className="text-sm font-medium text-teal-700">
          {resource.title}
        </span>
        <ExternalLink className="w-3 h-3 text-teal-500" />
      </a>
    );
  }

  // Default: internal navigation - open tools/forms in new tab
  return (
    <Link
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-teal-50 hover:bg-teal-100 transition-colors border border-teal-200"
    >
      <Icon className="w-4 h-4 text-teal-600 flex-shrink-0" />
      <span className="text-sm font-medium text-teal-700">
        {resource.title}
      </span>
      <ExternalLink className="w-3 h-3 text-teal-500" />
    </Link>
  );
}

export function GapsList({ gaps }: GapsListProps) {
  // State for PDF viewer modal
  const [pdfResource, setPdfResource] = useState<Resource | null>(null);

  const handleOpenPDF = (resource: Resource) => {
    setPdfResource(resource);
  };

  const handleClosePDF = () => {
    setPdfResource(null);
  };

  if (gaps.length === 0) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Areas for Improvement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✨</span>
            </div>
            <p className="text-lg font-medium text-foreground">
              Perfect Score!
            </p>
            <p className="text-muted-foreground">
              You&apos;ve aligned with all quality practices.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group gaps by category
  const gapsByCategory = gaps.reduce(
    (acc, gap) => {
      if (!acc[gap.categoryId]) {
        acc[gap.categoryId] = {
          categoryName: gap.categoryName,
          gaps: [],
        };
      }
      acc[gap.categoryId].gaps.push(gap);
      return acc;
    },
    {} as Record<string, { categoryName: string; gaps: Gap[] }>
  );

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle>Areas for Improvement ({gaps.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={Object.keys(gapsByCategory)}>
          {Object.entries(gapsByCategory).map(([categoryId, { categoryName, gaps: categoryGaps }]) => (
            <AccordionItem key={categoryId} value={categoryId}>
              <AccordionTrigger className="hover:no-underline">
                <span className="font-medium">
                  {categoryName} ({categoryGaps.length})
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-3 pt-2">
                  {categoryGaps.map((gap) => {
                    const insight = getInsightForQuestion(gap.questionId);
                    return (
                      <li key={gap.questionId} className="text-sm">
                        {insight ? (
                          <Collapsible>
                            <div className="flex items-start gap-3">
                              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                ✗
                              </span>
                              <div className="flex-1">
                                <CollapsibleTrigger className="flex items-center justify-between w-full text-left group">
                                  <span className="text-muted-foreground">
                                    {gap.questionText}
                                  </span>
                                  <ChevronDown className="w-4 h-4 text-teal-500 flex-shrink-0 ml-2 transition-transform group-data-[state=open]:rotate-180" />
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <div className="mt-3 space-y-3">
                                    {/* Education Text */}
                                    {insight.educationText && (
                                      <div className="text-xs text-slate-600 bg-slate-50 rounded-lg p-3 whitespace-pre-line leading-relaxed">
                                        {insight.educationText}
                                      </div>
                                    )}
                                    {/* Resources */}
                                    {insight.resources.length > 0 && (
                                      <div className="space-y-2">
                                        {insight.resources.map((resource: Resource) => (
                                          <div key={resource.id}>
                                            <p className="text-xs text-slate-500 mb-1">
                                              {resource.description}
                                            </p>
                                            <ResourceLink
                                              resource={resource}
                                              onOpenPDF={handleOpenPDF}
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </CollapsibleContent>
                              </div>
                            </div>
                          </Collapsible>
                        ) : (
                          <div className="flex items-start gap-3">
                            <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                              ✗
                            </span>
                            <span className="text-muted-foreground">
                              {gap.questionText}
                            </span>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>

      {/* PDF Viewer Modal */}
      {pdfResource && (
        <PDFViewerModal
          isOpen={!!pdfResource}
          onClose={handleClosePDF}
          pdfUrl={pdfResource.url}
          title={pdfResource.title}
        />
      )}
    </Card>
  );
}
