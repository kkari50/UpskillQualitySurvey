"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

const CRITERIA = [
  {
    title: "Safety and well-being of the learner and the family",
    text: '"The clinician should assess whether particular child behaviors or parenting interactions pose a threat to the safety and well-being of the child or others. Common behaviors that may need to be prioritized are self-injurious behaviors, pica (ingesting non-edible material), and aggression toward others. Other priority behaviors are those that expose the learner to dangerous situations, such as elopement, climbing or jumping from high surfaces, or playing with hazardous objects (e.g., electrical devices and outlets, scissors, matches). Clinicians should also look for maladaptive parenting repertoires that are harmful or could potentially be harmful in the future (e.g., heavy reliance on punishment or aversive procedures, excessive use of physical restraint or physical prompting)"',
    citation: "Gould & Redmond, 2014, p. 172",
  },
  {
    title: "Functional targets",
    text: '"Clinicians should target only those skills that are likely to produce natural sources of reinforcement once treatment ends, since these are the skills that are most likely to be maintained and benefit the family in the long term. Clinicians should consider the number of opportunities parents will have to use the skills they acquire and the degree of impact those skills will have on the family\'s daily life and then prioritize those parenting skills that will produce immediate benefits for the family. For example, hoarding and repetitive lining up of toys are concerns because they prevent a child from using toys in a functional manner, but parents may not consider those treatment priorities. However, if this restrictive, repetitive behavior significantly disrupts the learner\'s ability to participate in daily activities and routines and causes a great deal of stress because the learner engages in high-pitched screaming whenever one of his siblings touches his toys, parents might view the behavior as a high priority for treatment"',
    citation: "Gould & Redmond, 2014, p. 172",
  },
  {
    title: "Cost/benefit ratio",
    text: '"Clinicians should consider the amount of time it will take and the likelihood of success in establishing new parent skills, particularly when trying to optimize the use of limited parent training time"',
    citation: "Gould & Redmond, 2014, p. 173",
  },
  {
    title: "Choose targets that set the caregiver up for success",
    text: '"Setting goals and choosing procedures that ensure that parents will quickly contact reinforcement and success is especially important in the beginning in order to demonstrate the value of the treatment program to the parents and gain their trust"',
    citation: "Gould & Redmond, 2014, p. 173",
  },
  {
    title: "Choose targets that foster positive interactions",
    text: '"Skills that foster more positive interactions between the parent and child can also be prioritized, particularly for parents who are totally overwhelmed and experiencing a great deal of negative emotions during their interactions with their child"',
    citation: "Gould & Redmond, 2014, p. 174",
  },
  {
    title: "Consider social validity and if the goal benefits stakeholders",
    text: '"Does the response benefit others?... All other things being equal, selecting potential cusps based on their impact on the people who control reinforcers and punishers in a specific environment (e.g., parents, teachers, police officers) is more important than the impact on those who lack such control... Does the behavior have social validity in that the response meets the demands of the social community of which the learner is a member (Wolf, 1978)? This criterion is especially important in presenting behavior change programs to parents and other consumers. Parents\' indifference towards the target behavior may undermine the other criteria that might have identified the behavior as a potential cusp"',
    citation: "Bosch & Fuqua, 2001",
  },
  {
    title: "Value and preferences are in alignment with the caregivers",
    text: '"Consider the values and preferences of parents, care providers, and the individual with ASD. Stakeholder values and preferences play a particularly important role in decision making when:\n-- An intervention has been correctly implemented in the past and was not effective or had undesirable side effects.\n-- An intervention is contrary to the values of family members.\n-- The individual with ASD indicates that he or she does not want a specific intervention"',
    citation: "National Standards Project, Phase 2, 2015, p. 82",
  },
];

const REFERENCES = [
  "Bosch, S., & Fuqua, R. W. (2001). Behavioral cusps: a model for selecting target behaviors. Journal of Applied Behavior Analysis, 34(1), 123.",
  "Gould, E. R., & Redmond, V. (2014). Parent involvement. In Granpeesheh, D., Tarbox, J., Najdowski, A. C., & Kornack, J. (2014). Evidence-based treatment for children with autism: the CARD model. Elsevier.",
  "National Research Council. (2001). Educating children with autism. Committee on Educational Interventions for Children with Autism. C. Lord & J. P. McGee (Eds.), Division of Behavioral and Social Sciences and Education. Washington, DC: National Academy Press.",
];

export default function PrioritizingTreatmentTargetsPage() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const [{ pdf }, { PrioritizingTreatmentTargetsPDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/pdf/PrioritizingTreatmentTargetsPDF"),
      ]);

      const logoUrl = `${window.location.origin}/images/logo-medium.png`;
      const doc = <PrioritizingTreatmentTargetsPDF logoUrl={logoUrl} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `prioritizing-treatment-targets-${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header with Upskill ABA logo */}
        <div className="mb-6">
          <Image
            src="/images/logo.png"
            alt="Upskill ABA"
            width={150}
            height={45}
            className="mb-3"
          />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Job Aid for Prioritizing Treatment Targets for Caregivers
          </h1>
          <p className="text-slate-500">
            Caregiver engagement is a critical part of the treatment planning
            process. When designing caregiver goals consider whether or not they
            meet the following criteria:
          </p>
        </div>

        {/* Criteria */}
        <div className="space-y-5 mb-8">
          {CRITERIA.map((item, idx) => (
            <div key={idx} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  {item.title}:
                </h3>
                <p className="text-sm text-slate-600 italic leading-relaxed whitespace-pre-line">
                  {item.text}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  ({item.citation})
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* References */}
        <div className="border-t border-slate-200 pt-4 mb-8">
          <h2 className="font-semibold text-slate-900 mb-3">References</h2>
          <ul className="space-y-2">
            {REFERENCES.map((ref, idx) => (
              <li
                key={idx}
                className="text-xs text-slate-500 leading-relaxed pl-4"
              >
                {ref}
              </li>
            ))}
          </ul>
        </div>

        {/* Download Button */}
        <Button
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className="gap-2"
        >
          <FileDown className="w-4 h-4" />
          {isGenerating ? "Generating..." : "Download PDF"}
        </Button>
      </div>
    </div>
  );
}
