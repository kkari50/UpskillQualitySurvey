import { Header, Footer } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Terms of Service | Quick Quality Assessment",
  description: "Terms of service for the Quick Quality Assessment tool by Upskill ABA",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-8 md:py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg border-0">
            <CardContent className="p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Terms of Service
              </h1>
              <p className="text-sm text-muted-foreground mb-8">
                Last updated: January 2025
              </p>

              <div className="prose prose-slate max-w-none space-y-6">
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Acceptance of Terms
                  </h2>
                  <p className="text-muted-foreground">
                    By accessing and using the Quick Quality Assessment tool provided by
                    Upskill ABA (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you agree to be bound by these
                    Terms of Service. If you do not agree to these terms, please do not
                    use our service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Description of Service
                  </h2>
                  <p className="text-muted-foreground">
                    The Quick Quality Assessment is a free, self-assessment tool designed
                    to help ABA agencies and professionals evaluate their clinical quality
                    practices. The tool consists of 28 research-backed questions covering
                    five key areas of clinical quality.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Free Use License
                  </h2>
                  <p className="text-muted-foreground mb-3">
                    This assessment is provided free of charge for personal and
                    professional use. You may:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
                    <li>Use the assessment for yourself or your organization</li>
                    <li>Share links to the assessment with colleagues</li>
                    <li>Reference your results in professional discussions</li>
                  </ul>
                  <p className="text-muted-foreground mt-3">
                    You may NOT:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
                    <li>Sell or charge for access to this assessment</li>
                    <li>Incorporate this assessment into paid products or services</li>
                    <li>Copy or redistribute the assessment questions without permission</li>
                    <li>Create derivative works based on this assessment for commercial purposes</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Disclaimer of Warranties
                  </h2>
                  <p className="text-muted-foreground mb-3">
                    <strong>IMPORTANT:</strong> This assessment is provided &quot;as is&quot; without
                    warranties of any kind. Specifically:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
                    <li>
                      This is a <strong>preliminary screening tool</strong> and does not
                      guarantee the quality of services being delivered
                    </li>
                    <li>
                      Results should be used alongside other evaluation methods, not as a
                      sole measure of quality
                    </li>
                    <li>
                      The assessment reflects self-reported practices and may not capture
                      all aspects of clinical quality
                    </li>
                    <li>
                      Population comparisons are based on other respondents and may not
                      represent industry standards
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Limitation of Liability
                  </h2>
                  <p className="text-muted-foreground">
                    To the fullest extent permitted by law, Upskill ABA shall not be liable
                    for any indirect, incidental, special, consequential, or punitive
                    damages arising from your use of this assessment. This includes but is
                    not limited to decisions made based on assessment results, business
                    outcomes, or regulatory compliance matters.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Accuracy of Information
                  </h2>
                  <p className="text-muted-foreground">
                    You agree to provide accurate and truthful responses when completing
                    the assessment. The value of population benchmarks depends on honest
                    self-reporting by all participants. Deliberately providing false
                    information degrades the quality of the tool for all users.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Intellectual Property
                  </h2>
                  <p className="text-muted-foreground">
                    The assessment questions, methodology, design, and all related content
                    are the intellectual property of Upskill ABA. The Upskill ABA name and
                    logo are trademarks of Upskill ABA. You may not use our trademarks
                    without prior written permission.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Modifications to Service
                  </h2>
                  <p className="text-muted-foreground">
                    We reserve the right to modify, suspend, or discontinue the assessment
                    at any time without notice. We may also update the questions, scoring
                    methodology, or benchmarks as our understanding of quality practices
                    evolves.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Privacy
                  </h2>
                  <p className="text-muted-foreground">
                    Your use of this service is also governed by our{" "}
                    <a href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                    , which explains how we collect, use, and protect your information.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Governing Law
                  </h2>
                  <p className="text-muted-foreground">
                    These terms shall be governed by and construed in accordance with the
                    laws of the United States, without regard to conflict of law provisions.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Changes to Terms
                  </h2>
                  <p className="text-muted-foreground">
                    We may revise these Terms of Service at any time. Changes will be
                    effective immediately upon posting. Your continued use of the service
                    after changes are posted constitutes acceptance of the revised terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Contact Us
                  </h2>
                  <p className="text-muted-foreground">
                    If you have questions about these Terms of Service, please contact us
                    at{" "}
                    <a
                      href="mailto:support@upskillaba.com"
                      className="text-primary hover:underline"
                    >
                      support@upskillaba.com
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
