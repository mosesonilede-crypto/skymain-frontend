import Link from "next/link";

export default function EnterprisePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6 text-sm">
          <div className="text-lg font-semibold">SkyMaintain</div>
          <nav className="flex flex-wrap items-center gap-5 text-slate-300">
            <span>Platform</span>
            <span>Compliance</span>
            <span>Security</span>
            <span>Contact</span>
          </nav>
          <div className="flex flex-wrap gap-3">
            <Link href="/login" className="text-slate-300 hover:text-white">Sign In</Link>
            <Link
              href="/login"
              className="rounded-full border border-slate-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:border-slate-400"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Regulatory-Compliant AI Platform</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              AI-Powered Predictive Aircraft Maintenance
            </h1>
            <p className="mt-4 text-lg text-slate-300">Built for Safety, Compliance, and Scale</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/login"
                className="rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-400"
              >
                Start Your Free Trial
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-slate-600 px-6 py-3 text-sm font-semibold text-white hover:border-slate-400"
              >
                Request Demo
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-300">
              <span>14-day free trial</span>
              <span>No credit card required</span>
              <span>Full platform access</span>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-3xl font-semibold">35%</div>
                <div className="text-sm text-slate-400">Reduction in Downtime</div>
              </div>
              <div>
                <div className="text-3xl font-semibold">99.8%</div>
                <div className="text-sm text-slate-400">Compliance Rate</div>
              </div>
              <div>
                <div className="text-3xl font-semibold">60%</div>
                <div className="text-sm text-slate-400">Faster Task Completion</div>
              </div>
              <div>
                <div className="text-3xl font-semibold">$250K</div>
                <div className="text-sm text-slate-400">Annual Cost Savings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Featured Partner</p>
          <div className="mt-3 text-sm text-slate-400">Sponsored</div>
          <h2 className="mt-3 text-2xl font-semibold">GlobalAero Airlines</h2>
          <p className="mt-3 text-slate-300">
            &quot;Partnering with the world&apos;s leading carriers. Experience excellence in aviation with our premium fleet services and 24/7 maintenance support.&quot;
          </p>
          <div className="mt-5 flex flex-wrap gap-6 text-sm text-slate-300">
            <span>500+ Aircraft Fleet</span>
            <span>Global Coverage</span>
            <span>ISO Certified</span>
          </div>
          <div className="mt-5 text-sm text-blue-300">Learn More</div>
          <p className="mt-4 text-xs text-slate-500">
            DEV INFO: Ad ID: ad-001-globalaero | Contract: 2026-01-01 to 2026-12-31 | Annual contract - Premium airline partner
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Platform Capabilities</p>
          <h2 className="mt-3 text-3xl font-semibold">Comprehensive AI-Driven Maintenance Solution</h2>
          <p className="mt-2 text-slate-300">
            Built specifically for aviation maintenance operations with regulatory compliance at its core
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {[
            {
              title: "AI-Powered Predictive Analytics",
              body: "Advanced machine learning algorithms predict maintenance needs before failures occur, reducing unplanned downtime by up to 35%.",
            },
            {
              title: "Regulatory Compliance Automation",
              body: "Automated tracking of FAA/EASA airworthiness directives with real-time alerts and compliance deadline management.",
            },
            {
              title: "Real-Time IoT Monitoring",
              body: "Continuous aircraft health monitoring through integrated sensor data providing instant visibility into all critical systems.",
            },
            {
              title: "Smart Maintenance Workflows",
              body: "Interactive digital checklists with photo documentation requirements and team collaboration features for efficient task management.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm text-slate-300">{item.body}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-blue-300">Learn More</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Customer Success</p>
          <h2 className="mt-3 text-3xl font-semibold">Trusted by Aviation Professionals</h2>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <p className="text-slate-200">
              “SkyMaintain&apos;s AI predictions helped us avoid two major engine failures, saving over $400,000 in emergency repairs.”
            </p>
            <div className="mt-4 text-sm text-slate-400">
              Michael Rodriguez · Director of Maintenance · Global Airways
            </div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <p className="text-slate-200">
              “The regulatory compliance tracking is exceptional. We&apos;ve achieved 100% AD compliance since implementation.”
            </p>
            <div className="mt-4 text-sm text-slate-400">
              Sarah Chen · Fleet Manager · Pacific Aviation
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Industry Partner</p>
          <div className="mt-3 text-sm text-slate-400">Sponsored</div>
          <h2 className="mt-3 text-2xl font-semibold">AeroTech Parts & Supply</h2>
          <p className="mt-3 text-slate-300">
            &quot;Your trusted source for certified aircraft parts and components. Fast delivery, competitive pricing, and unmatched quality assurance.&quot;
          </p>
          <div className="mt-5 flex flex-wrap gap-6 text-sm text-slate-300">
            <span>FAA/EASA Certified</span>
            <span>24-Hour Shipping</span>
            <span>50,000+ Parts</span>
          </div>
          <div className="mt-5 text-sm text-blue-300">Special Offer</div>
          <div className="mt-2 text-sm text-slate-300">15% Off First Order - Use Code: SKYMAINT15</div>
          <div className="mt-4 text-sm text-slate-400">Shop Parts Catalog</div>
          <p className="mt-4 text-xs text-slate-500">
            DEV INFO: Ad ID: ad-002-aerotech | Contract: 2026-01-15 to 2026-07-15 | 6-month contract with promo code tracking
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Industry Partners</p>
          <h2 className="mt-3 text-3xl font-semibold">Connecting Aviation Excellence</h2>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <div className="text-sm text-slate-400">Sponsored</div>
            <h3 className="mt-3 text-xl font-semibold">AeroTech Solutions</h3>
            <p className="mt-3 text-sm text-slate-300">Partner Slot Available</p>
            <p className="mt-2 text-sm text-slate-300">
              Advanced diagnostic tools and predictive analytics for modern aircraft fleets.
            </p>
            <div className="mt-4 text-sm text-blue-300">Learn More</div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <div className="text-sm text-slate-400">Sponsored content. SkyMaintain does not endorse products.</div>
            <button className="mt-4 rounded-full border border-slate-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:border-slate-400">
              Become a Partner
            </button>
            <p className="mt-4 text-xs text-slate-500">
              SkyMaintain displays sponsored partner content. Sponsorship does not influence AI responses, maintenance recommendations, or compliance assessments. All partnerships are reviewed for aviation industry relevance and quality standards.
            </p>
          </div>
        </div>
        <p className="mt-6 text-xs text-slate-500">Partner Disclosure:</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Compliance & Trust — Frequently Asked Questions</p>
          <h2 className="mt-3 text-3xl font-semibold">How SkyMaintain supports maintenance professionals safely, responsibly, and in line with regulations.</h2>
          <div className="mt-6 space-y-6 text-sm text-slate-300">
            <div>
              <div className="font-semibold text-white">Does SkyMaintain replace approved maintenance manuals?</div>
              <p className="mt-2">
                No. SkyMaintain does not replace AMM, MEL, SRM, IPC, or any approved maintenance documentation. SkyMaintain works with the manuals you are authorized to use and assists by organizing, cross-referencing, and interpreting them. The manuals remain the sole technical authority.
              </p>
            </div>
            <div>
              <div className="font-semibold text-white">Does SkyMaintain need FAA or EASA approval?</div>
              <p className="mt-2">
                No. SkyMaintain is a maintenance decision-support tool, not a maintenance approval or certification system. It does not issue approvals, certify work, modify aircraft configuration, or replace regulatory authority. Therefore, FAA or EASA approval is not required.
              </p>
            </div>
            <div>
              <div className="font-semibold text-white">Can SkyMaintain give answers without manuals?</div>
              <p className="mt-2">
                No. SkyMaintain enforces a strict &quot;No Docs, No Answer&quot; rule. If no applicable, authorized manual is available, the AI Mechanic will refuse to answer and will instead tell the user which documents are required to proceed.
              </p>
            </div>
            <div className="font-semibold text-white">Where do the manuals come from?</div>
            <div className="font-semibold text-white">Does SkyMaintain store or modify original manuals?</div>
            <div className="font-semibold text-white">How does SkyMaintain ensure accuracy?</div>
            <div className="font-semibold text-white">Who is responsible for the maintenance decision?</div>
            <div className="font-semibold text-white">Can SkyMaintain be used in regulated airline or MRO environments?</div>
            <div className="font-semibold text-white">Is SkyMaintain an AI chatbot?</div>
            <div className="font-semibold text-white">What happens if the wrong document or revision is uploaded?</div>
            <div className="font-semibold text-white">Have more questions? Contact our compliance team</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-600/20 to-slate-900/80 p-8 text-center">
+          <h2 className="text-3xl font-semibold">Ready to Transform Your Maintenance Operations?</h2>
+          <p className="mt-4 text-slate-300">
+            Join 50+ airlines and operators using SkyMaintain to improve safety, reduce costs, and ensure 100% regulatory compliance.
+          </p>
+          <div className="mt-6 flex flex-wrap justify-center gap-4">
+            <Link href="/login" className="rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-400">
+              Start Your Free Trial
+            </Link>
+            <Link href="/login" className="rounded-full border border-slate-600 px-6 py-3 text-sm font-semibold text-white hover:border-slate-400">
+              Schedule a Demo
+            </Link>
+          </div>
+          <p className="mt-4 text-xs text-slate-300">✓ 14-day free trial • ✓ No credit card required • ✓ Full platform access</p>
+        </div>
+      </section>
+
+      <footer className="border-t border-slate-800">
+        <div className="mx-auto max-w-6xl px-6 py-12 text-sm text-slate-400">
+          <div className="grid gap-6 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
+            <div>
+              <h3 className="text-lg font-semibold text-white">SkyMaintain</h3>
+              <p className="mt-2 text-slate-400">AI-powered aircraft maintenance platform ensuring safety, compliance, and efficiency.</p>
+            </div>
+            <div>
+              <div className="font-semibold text-white">Product</div>
+              <ul className="mt-3 space-y-2">
+                <li>Features</li>
+                <li>Pricing</li>
+              </ul>
+            </div>
+            <div>
+              <div className="font-semibold text-white">Company</div>
+              <ul className="mt-3 space-y-2">
+                <li>About Us</li>
+                <li>Careers</li>
+              </ul>
+            </div>
+            <div>
+              <div className="font-semibold text-white">Legal</div>
+              <ul className="mt-3 space-y-2">
+                <li>Privacy Policy</li>
+                <li>Terms of Service</li>
+                <li>Security</li>
+                <li>Contact</li>
+                <li>Compliance</li>
+              </ul>
+            </div>
+          </div>
+          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-6 text-xs">
+            <span>© 2026 SkyMaintain. All Rights Reserved.</span>
+            <span>SkyMaintain is a product of EncycloAMTs LLC.</span>
+            <span>A Regulatory-Compliant Architecture for AI-Assisted Aircraft Maintenance Decision Support</span>
+          </div>
+        </div>
       </section>
-    </main>
-  );
-}
+    </main>
+  );
+}
*** End Patch