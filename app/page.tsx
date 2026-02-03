// app/page.tsx
import Link from "next/link";

export default function Home() {
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
              Request Demo
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">SkyMaintain</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              Enterprise Aircraft Maintenance Intelligence
            </h1>
            <h2 className="mt-4 text-3xl font-semibold text-blue-200 sm:text-4xl">
              Regulatory-Grade AI for Aircraft Maintenance Operations
            </h2>
            <p className="mt-6 text-lg text-slate-300">
              Deterministic, auditable, and policy-aligned decision support for airlines, MROs, and regulated maintenance environments.
            </p>
            <p className="mt-4 text-slate-400">
              Designed to support compliance-driven maintenance workflows without compromising human authority, safety, or regulatory accountability.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/login"
                className="rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-400"
              >
                Request Enterprise Demo
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-slate-600 px-6 py-3 text-sm font-semibold text-white hover:border-slate-400"
              >
                View Platform Capabilities
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
            <h3 className="text-xl font-semibold">Built for Aviation. Designed for Accountability.</h3>
            <p className="mt-4 text-sm text-slate-300">
              SkyMaintain is not a general-purpose AI tool. It is an enterprise maintenance intelligence platform engineered for environments governed by FAA, EASA, and organizational maintenance control requirements.
            </p>
            <p className="mt-4 text-sm text-slate-300">
              Every output is traceable. Every decision is explainable. Every workflow respects regulatory boundaries.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-8">
        <h2 className="text-2xl font-semibold">Operational Intelligence for Aircraft Maintenance</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h3 className="text-lg font-semibold">Deterministic Maintenance Reasoning</h3>
            <p className="mt-3 text-sm text-slate-300">
              SkyMaintain provides AI-assisted reasoning grounded exclusively in approved technical documentation, maintenance data, and policy constraints. Outputs are deterministic, explainable, and suitable for regulated decision-support use.
            </p>
            <p className="mt-3 text-sm text-slate-300">
              All recommendations are generated within clearly defined policy boundaries, ensuring alignment with organizational procedures, regulatory requirements, and approved maintenance practices. No autonomous actions. No opaque logic. Human authority remains absolute.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h3 className="text-lg font-semibold">Source-Anchored Traceability</h3>
            <p className="mt-3 text-sm text-slate-300">
              Every response is linked to its originating technical sources, enabling engineers, inspectors, and auditors to review, validate, and defend decisions with confidence. This supports internal audits, regulatory reviews, and quality assurance processes.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h3 className="text-lg font-semibold">Predictive Maintenance Alerts (Advisory Only)</h3>
            <p className="mt-3 text-sm text-slate-300">
              SkyMaintain surfaces predictive insights based on historical and operational data trends to support maintenance planning and risk awareness. Alerts are advisory, not prescriptive—designed to inform engineers, not replace judgment.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <h2 className="text-2xl font-semibold">Why SkyMaintain Is Different</h2>
        <p className="mt-2 text-slate-400">
          Most AI platforms prioritize speed and automation. SkyMaintain prioritizes safety, traceability, and regulatory confidence.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { title: "Built for Regulated Aviation", body: "Specifically engineered for regulated aviation maintenance environments" },
            { title: "Deterministic Outputs", body: "Outputs suitable for audit and regulatory review" },
            { title: "No Black-Box ML", body: "No black-box machine learning in safety-critical decision paths" },
            { title: "Human-in-the-Loop", body: "Human-in-the-loop design by default" },
            { title: "Clear Separation", body: "Advisory intelligence separated from maintenance authority" },
            { title: "Safety First", body: "Safety and accountability over automation speed" },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">{item.title}</h3>
              <p className="mt-3 text-sm text-slate-300">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <h2 className="text-2xl font-semibold">Designed for Regulated Maintenance Environments</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            { title: "Regulatory Alignment", body: "Designed with FAA and EASA maintenance philosophies in mind, supporting Part 145, airline, and CAMO operational structures." },
            { title: "Audit-Ready Architecture", body: "Every interaction is logged, traceable, and reviewable to support quality systems, audits, and compliance oversight." },
            { title: "Security & Tenant Isolation", body: "Enterprise-grade access control, organization-level isolation, and role-based permissions protect operational integrity." },
            { title: "Operational Transparency", body: "No hidden decision logic. No uncontrolled automation. SkyMaintain operates as a controlled, inspectable system." },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm text-slate-300">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <h2 className="text-2xl font-semibold">Supporting Maintenance Across the Operation</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            { title: "Maintenance Engineering", body: "Assist engineers in interpreting manuals, troubleshooting recurring defects, and validating maintenance pathways using traceable references." },
            { title: "Maintenance Control & Planning", body: "Support informed planning decisions with advisory insights derived from operational patterns and historical data." },
            { title: "Quality Assurance & Compliance", body: "Enable transparent review of AI-assisted decisions with full traceability for internal and external audits." },
            { title: "Technical Leadership", body: "Provide leadership with confidence that digital intelligence supports—not undermines—regulatory accountability." },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm text-slate-300">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <h2 className="text-2xl font-semibold">AI That Respects Aviation Realities</h2>
        <p className="mt-4 text-slate-300">
          SkyMaintain is engineered with the understanding that aircraft maintenance is not a domain for experimentation. It is a controlled, high-consequence environment where technology must enhance discipline, not bypass it.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-600/20 to-slate-900/80 p-8 text-center">
          <h2 className="text-3xl font-semibold">Evaluate SkyMaintain for Your Maintenance Operation</h2>
          <p className="mt-4 text-slate-300">
            See how a deterministic, audit-ready AI platform can support compliance-driven aircraft maintenance without compromising safety, authority, or regulatory trust.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/login" className="rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-400">
              Schedule a Technical Walkthrough
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800">
        <div className="mx-auto max-w-6xl px-6 py-12 text-sm text-slate-400">
          <div className="grid gap-6 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div>
              <h3 className="text-lg font-semibold text-white">SkyMaintain</h3>
              <p className="mt-2 text-slate-400">Enterprise AI for regulated aircraft maintenance operations.</p>
              <p className="mt-2 text-slate-400">Built for compliance. Designed for accountability.</p>
            </div>
            <div>
              <div className="font-semibold text-white">Product</div>
              <ul className="mt-3 space-y-2">
                <li>Platform</li>
                <li>Compliance</li>
                <li>Security</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-white">Company</div>
              <ul className="mt-3 space-y-2">
                <li>Contact</li>
                <li>Compliance</li>
                <li>Security</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-white">Legal</div>
              <ul className="mt-3 space-y-2">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-6 text-xs">
            <span>© 2026 SkyMaintain. All rights reserved.</span>
            <span>SkyMaintain</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
