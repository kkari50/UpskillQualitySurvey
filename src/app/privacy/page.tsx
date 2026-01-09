import { Header, Footer } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Privacy Policy | Quick Quality Assessment",
  description: "Privacy policy for the Quick Quality Assessment tool by UpskillABA",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-8 md:py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg border-0">
            <CardContent className="p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Privacy Policy
              </h1>
              <p className="text-sm text-muted-foreground mb-8">
                Last updated: January 2025
              </p>

              <div className="prose prose-slate max-w-none space-y-6">
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Overview
                  </h2>
                  <p className="text-muted-foreground">
                    UpskillABA (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the Quick Quality
                    Assessment tool. This privacy policy explains how we collect, use, and
                    protect your information when you use our assessment service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Information We Collect
                  </h2>
                  <p className="text-muted-foreground mb-3">
                    When you complete our assessment, we collect:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
                    <li>
                      <strong>Contact Information:</strong> Email address and name
                    </li>
                    <li>
                      <strong>Professional Information:</strong> Your role, agency size, primary service setting, and state
                    </li>
                    <li>
                      <strong>Assessment Responses:</strong> Your answers to the 28 assessment questions
                    </li>
                    <li>
                      <strong>Marketing Preference:</strong> Whether you opt-in to receive quality improvement resources
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    How We Use Your Information
                  </h2>
                  <p className="text-muted-foreground mb-3">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
                    <li>Generate your personalized assessment results</li>
                    <li>Provide population comparison benchmarks (using anonymized, aggregated data)</li>
                    <li>Allow you to retrieve your results via the unique results link</li>
                    <li>Send quality improvement tips and resources (only if you opt-in)</li>
                    <li>Improve our assessment tool based on aggregated usage patterns</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Data Sharing
                  </h2>
                  <p className="text-muted-foreground mb-3">
                    We do not sell your personal information. We may share data in these limited circumstances:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
                    <li>
                      <strong>Aggregated Statistics:</strong> We may share anonymized, aggregated data
                      for research or benchmarking purposes
                    </li>
                    <li>
                      <strong>Service Providers:</strong> We use third-party services (hosting, database)
                      that process data on our behalf under strict confidentiality
                    </li>
                    <li>
                      <strong>Legal Requirements:</strong> When required by law or to protect our rights
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Data Security
                  </h2>
                  <p className="text-muted-foreground">
                    We implement industry-standard security measures to protect your information,
                    including encrypted data transmission (HTTPS), secure database storage, and
                    access controls. However, no method of electronic transmission or storage
                    is 100% secure.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Data Retention
                  </h2>
                  <p className="text-muted-foreground">
                    We retain your assessment data to allow you to access your results and to
                    maintain accurate population benchmarks. You may request deletion of your
                    data at any time by contacting us.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Your Rights
                  </h2>
                  <p className="text-muted-foreground mb-3">
                    You have the right to:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
                    <li>Access the personal data we hold about you</li>
                    <li>Request correction of inaccurate data</li>
                    <li>Request deletion of your data</li>
                    <li>Opt-out of marketing communications at any time</li>
                    <li>Lodge a complaint with a data protection authority</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Cookies and Tracking
                  </h2>
                  <p className="text-muted-foreground">
                    We use browser local storage to save your assessment progress so you can
                    resume if interrupted. We do not use tracking cookies for advertising purposes.
                    We may use basic analytics to understand how users interact with our tool.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Children&apos;s Privacy
                  </h2>
                  <p className="text-muted-foreground">
                    This assessment is designed for ABA professionals and agency staff. We do not
                    knowingly collect information from children under 13 years of age.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Changes to This Policy
                  </h2>
                  <p className="text-muted-foreground">
                    We may update this privacy policy from time to time. We will notify you of
                    significant changes by posting the new policy on this page with an updated
                    revision date.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Contact Us
                  </h2>
                  <p className="text-muted-foreground">
                    If you have questions about this privacy policy or wish to exercise your
                    data rights, please contact us at{" "}
                    <a
                      href="mailto:privacy@upskillaba.com"
                      className="text-primary hover:underline"
                    >
                      privacy@upskillaba.com
                    </a>
                  </p>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
