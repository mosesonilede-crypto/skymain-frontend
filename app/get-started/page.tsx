"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronUp, ArrowRight, Check, Plane, Shield, TrendingDown, DollarSign, Zap, FileCheck, Activity, ClipboardList, Star, ExternalLink, Tag, Home } from "lucide-react";
import { startTrialIfMissing } from "@/lib/trial";
import { useAuth } from "@/lib/AuthContext";

// Image assets from Figma
const imgGlobalAeroFleet = "https://www.figma.com/api/mcp/asset/d3926b89-b96a-4544-93f0-14aa7cf8b92f";
const imgAIPredictive = "https://www.figma.com/api/mcp/asset/c16c67db-c090-4e03-94e3-afbe9675c31f";
const imgCompliance = "https://www.figma.com/api/mcp/asset/d5555a73-d1cd-44fc-8c01-5039f4ca20e8";
const imgIoTMonitoring = "https://www.figma.com/api/mcp/asset/c82488e3-6f72-447b-94ac-c118957c7ad5";
const imgSmartWorkflows = "https://www.figma.com/api/mcp/asset/afc7be7f-955f-45e8-ba64-eb332330262d";
const imgAviationParts = "https://www.figma.com/api/mcp/asset/a5d2100f-d154-4213-995c-1b073c1f394c";

// Types
type Stat = { value: string; label: string; icon: React.ReactNode };
type Capability = {
    title: string;
    description: string;
    image: string;
    position: "left" | "right";
};
type Testimonial = {
    quote: string;
    name: string;
    title: string;
    company: string;
};
type FAQ = {
    question: string;
    answer: string;
    expanded?: boolean;
};

// Data
const stats: Stat[] = [
    { value: "35%", label: "Reduction in Downtime", icon: <TrendingDown className="h-6 w-6 text-white" /> },
    { value: "99.8%", label: "Compliance Rate", icon: <Shield className="h-6 w-6 text-white" /> },
    { value: "60%", label: "Faster Task Completion", icon: <Zap className="h-6 w-6 text-white" /> },
    { value: "$250K", label: "Annual Cost Savings", icon: <DollarSign className="h-6 w-6 text-white" /> },
];

const capabilities: Capability[] = [
    {
        title: "AI-Powered Predictive Analytics",
        description: "Advanced machine learning algorithms predict maintenance needs before failures occur, reducing unplanned downtime by up to 35%.",
        image: imgAIPredictive,
        position: "right",
    },
    {
        title: "Regulatory Compliance Automation",
        description: "Automated tracking of FAA/EASA airworthiness directives with real-time alerts and compliance deadline management.",
        image: imgCompliance,
        position: "left",
    },
    {
        title: "Real-Time IoT Monitoring",
        description: "Continuous aircraft health monitoring through integrated sensor data providing instant visibility into all critical systems.",
        image: imgIoTMonitoring,
        position: "right",
    },
    {
        title: "Smart Maintenance Workflows",
        description: "Interactive digital checklists with photo documentation requirements and team collaboration features for efficient task management.",
        image: imgSmartWorkflows,
        position: "left",
    },
];

const testimonials: Testimonial[] = [
    {
        quote: "SkyMaintain's AI predictions helped us avoid two major engine failures, saving over $400,000 in emergency repairs.",
        name: "Michael Rodriguez",
        title: "Director of Maintenance",
        company: "Global Airways",
    },
    {
        quote: "The regulatory compliance tracking is exceptional. We've achieved 100% AD compliance since implementation.",
        name: "Sarah Chen",
        title: "Fleet Manager",
        company: "Pacific Aviation",
    },
];

const faqs: FAQ[] = [
    {
        question: "Does SkyMaintain replace approved maintenance manuals?",
        answer: "No.\n\nSkyMaintain does not replace AMM, MEL, SRM, IPC, or any approved maintenance documentation.\n\nSkyMaintain works with the manuals you are authorized to use and assists by organizing, cross-referencing, and interpreting them. The manuals remain the sole technical authority.",
        expanded: true,
    },
    {
        question: "Does SkyMaintain need FAA or EASA approval?",
        answer: "No.\n\nSkyMaintain is a maintenance decision-support tool, not a maintenance approval or certification system.\n\nIt does not issue approvals, certify work, modify aircraft configuration, or replace regulatory authority. Therefore, FAA or EASA approval is not required.",
        expanded: true,
    },
    {
        question: "Can SkyMaintain give answers without manuals?",
        answer: "No.\n\nSkyMaintain enforces a strict \"No Docs, No Answer\" rule.\n\nIf no applicable, authorized manual is available, the AI Assistant will refuse to answer and will instead tell the user which documents are required to proceed.",
        expanded: true,
    },
    {
        question: "Where do the manuals come from?",
        answer: "Manuals are provided by your organization based on authorized access and controlled document distribution. SkyMaintain does not source manuals independently.",
        expanded: false,
    },
    {
        question: "Does SkyMaintain store or modify original manuals?",
        answer: "SkyMaintain does not modify original manuals. Document handling preserves source integrity while enabling controlled indexing and traceable retrieval.",
        expanded: false,
    },
    {
        question: "How does SkyMaintain ensure accuracy?",
        answer: "Outputs are designed to be traceable and governed by policy boundaries. Human authority remains the final decision point.",
        expanded: false,
    },
    {
        question: "Who is responsible for the maintenance decision?",
        answer: "The authorized maintenance organization and certifying personnel remain responsible. SkyMaintain provides decision support, not approvals or sign-off authority.",
        expanded: false,
    },
    {
        question: "Can SkyMaintain be used in regulated airline or MRO environments?",
        answer: "Yes. The platform is designed for compliance-driven workflows, auditability, and governance controls typical in airline and MRO environments.",
        expanded: false,
    },
    {
        question: "Is SkyMaintain an AI chatbot?",
        answer: "No. SkyMaintain is an enterprise decision-support platform built for regulated aviation maintenance, including guided workflows, traceable outputs, and governance controls.",
        expanded: false,
    },
    {
        question: "What happens if the wrong document or revision is uploaded?",
        answer: "SkyMaintain surfaces document identity and revision context. If inconsistencies are detected, users are prompted to correct the source set before proceeding.",
        expanded: false,
    },
];

export default function GetStartedPage() {
    const [expandedFaqs, setExpandedFaqs] = useState<number[]>([0, 1, 2]);
    const { isAuthenticated, isLoading } = useAuth();

    const toggleFaq = (index: number) => {
        setExpandedFaqs(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Authenticated User Banner - Show "Go to Hub" option */}
            {!isLoading && isAuthenticated && (
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-3">
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="flex items-center justify-center gap-4 text-white">
                            <span className="text-sm font-medium">
                                👋 Welcome back! You&apos;re already logged in.
                            </span>
                            <Link
                                href="/app/welcome"
                                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-1.5 text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-colors"
                            >
                                <Home className="h-4 w-4" />
                                Go to Hub
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#9810fa] via-[#8200db] to-[#372aac] pt-32 pb-0">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="flex flex-col items-center text-center">
                        <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                            Partnerships & Platform Evaluation
                        </h1>
                        <p className="mt-6 text-xl text-[#f3e8ff] md:text-2xl">
                            Explore partnership opportunities or evaluate SkyMaintain for your operation.
                        </p>
                        <Link
                            href="/#signup"
                            onClick={() => startTrialIfMissing()}
                            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-lg font-bold text-[#8200db] shadow-xl hover:bg-gray-50 transition-colors"
                        >
                            Start Free Trial
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                        <Link
                            href="/contact?intent=partnerships"
                            className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-lg font-bold text-white shadow-xl hover:bg-white/20 transition-colors"
                        >
                            Partner with Us
                        </Link>
                    </div>

                    {/* Trust badges */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-[#e9d4ff]">
                        <span className="flex items-center gap-2">
                            <Check className="h-5 w-5" />
                            14-day free trial
                        </span>
                        <span className="flex items-center gap-2">
                            <Check className="h-5 w-5" />
                            No credit card required
                        </span>
                        <span className="flex items-center gap-2">
                            <Check className="h-5 w-5" />
                            Full platform access
                        </span>
                    </div>
                </div>
            </section>

            {/* Stats Banner */}
            <section className="bg-gradient-to-r from-[#155dfc] to-[#9810fa] py-16">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                        {stats.map((stat) => (
                            <div key={stat.label} className="flex flex-col items-center text-center">
                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                                    {stat.icon}
                                </div>
                                <div className="text-3xl font-bold text-white md:text-4xl">{stat.value}</div>
                                <div className="mt-2 text-sm text-[#dbeafe]">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Partner - GlobalAero */}
            <section className="border-y-4 border-[#155dfc] bg-gradient-to-br from-[#f8fafc] to-[#f3f4f6] py-12">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="mb-4 flex justify-center">
                        <span className="rounded-lg bg-[#4a5565] px-4 py-2 text-xs font-medium text-white">
                            FEATURED PARTNER
                        </span>
                    </div>

                    <div className="overflow-hidden rounded-2xl border-4 border-[#e5e7eb] bg-white shadow-2xl">
                        <div className="grid md:grid-cols-2">
                            {/* Left Content */}
                            <div className="bg-gradient-to-br from-[#1c398e] to-[#312c85] p-8 md:p-12">
                                <div className="mb-6 flex h-12 w-16 items-center justify-center rounded-lg bg-white/20">
                                    <Plane className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-3xl font-bold text-white md:text-4xl">GlobalAero Airlines</h3>
                                <p className="mt-4 text-lg leading-relaxed text-[#dbeafe]">
                                    &quot;Partnering with the world&apos;s leading carriers. Experience excellence in aviation with our premium fleet services and 24/7 maintenance support.&quot;
                                </p>
                                <div className="mt-6 flex flex-wrap gap-4 text-sm text-white">
                                    <span className="flex items-center gap-2">
                                        <Check className="h-4 w-4" /> 500+ Aircraft Fleet
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Check className="h-4 w-4" /> Global Coverage
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Check className="h-4 w-4" /> ISO Certified
                                    </span>
                                </div>
                                <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-[#1c398e] hover:bg-gray-50 transition-colors">
                                    Learn More
                                    <ExternalLink className="h-4 w-4" />
                                </Link>
                            </div>

                            {/* Right Image */}
                            <div className="relative h-64 md:h-auto">
                                <img
                                    src={imgGlobalAeroFleet}
                                    alt="GlobalAero Airlines Fleet"
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                <span className="absolute right-4 top-4 rounded-lg bg-[#4a5565] px-3 py-1 text-xs text-white">
                                    Sponsored
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Dev Info */}
                    <div className="mt-4 rounded-lg bg-[#f3f4f6] p-3">
                        <span className="text-xs font-bold text-[#4a5565]">DEV INFO: </span>
                        <span className="text-xs text-[#4a5565]">
                            Ad ID: ad-001-globalaero | Contract: 2026-01-01 to 2026-12-31 | Annual contract - Premium airline partner
                        </span>
                    </div>
                </div>
            </section>

            {/* Platform Capabilities */}
            <section className="bg-[#f9fafb] py-16">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="mb-12 text-center">
                        <span className="rounded-lg bg-[#155dfc] px-4 py-2 text-xs font-medium text-white">
                            Platform Capabilities
                        </span>
                        <h2 className="mt-4 text-3xl font-bold text-[#101828] md:text-4xl">
                            Comprehensive AI-Driven Maintenance Solution
                        </h2>
                        <p className="mx-auto mt-4 max-w-3xl text-lg text-[#4a5565]">
                            Built specifically for aviation maintenance operations with regulatory compliance at its core
                        </p>
                    </div>

                    <div className="space-y-16">
                        {capabilities.map((cap, idx) => (
                            <div
                                key={cap.title}
                                className={`flex flex-col items-center gap-8 lg:flex-row ${cap.position === "left" ? "lg:flex-row-reverse" : ""}`}
                            >
                                {/* Content */}
                                <div className="flex-1 space-y-4">
                                    <div className="h-12 w-12 text-[#155dfc]">
                                        {idx === 0 && <Zap className="h-12 w-12" />}
                                        {idx === 1 && <FileCheck className="h-12 w-12" />}
                                        {idx === 2 && <Activity className="h-12 w-12" />}
                                        {idx === 3 && <ClipboardList className="h-12 w-12" />}
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#101828] md:text-3xl">{cap.title}</h3>
                                    <p className="text-lg text-[#4a5565]">{cap.description}</p>
                                    <Link
                                        href={idx === 0 ? "/platform-features" : idx === 1 ? "/regulatory-compliance-automation" : "/platform-features"}
                                        className="inline-flex items-center gap-2 rounded-lg bg-[#155dfc] px-4 py-2 text-sm font-medium text-white hover:bg-[#1447e6] transition-colors"
                                    >
                                        Learn More
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>

                                {/* Image */}
                                <div className="flex-1">
                                    <div className="relative h-64 w-full overflow-hidden rounded-2xl border-4 border-white shadow-2xl lg:h-80">
                                        <img
                                            src={cap.image}
                                            alt={cap.title}
                                            className="absolute inset-0 h-full w-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Customer Success */}
            <section className="bg-white py-16">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="mb-12 text-center">
                        <span className="rounded-lg bg-[#9810fa] px-4 py-2 text-xs font-medium text-white">
                            Customer Success
                        </span>
                        <h2 className="mt-4 text-3xl font-bold text-[#101828] md:text-4xl">
                            Trusted by Aviation Professionals
                        </h2>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">
                        {testimonials.map((testimonial) => (
                            <div
                                key={testimonial.name}
                                className="rounded-2xl border border-black/10 bg-white p-8"
                            >
                                <div className="mb-6 h-12 w-12 rounded-full bg-[#155dfc]/10 flex items-center justify-center">
                                    <Plane className="h-6 w-6 text-[#155dfc]" />
                                </div>
                                <div className="mb-6 flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 fill-[#fbbf24] text-[#fbbf24]" />
                                    ))}
                                </div>
                                <p className="mb-6 text-lg italic text-[#364153]">
                                    &quot;{testimonial.quote}&quot;
                                </p>
                                <div className="border-t border-[#e5e7eb] pt-6">
                                    <div className="font-bold text-[#101828]">{testimonial.name}</div>
                                    <div className="text-sm text-[#4a5565]">{testimonial.title}</div>
                                    <div className="text-sm text-[#155dfc]">{testimonial.company}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Industry Partner - AeroTech */}
            <section className="border-y-4 border-[#f54900] bg-gradient-to-br from-[#fff7ed] to-[#fffbeb] py-12">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="mb-4 flex justify-center">
                        <span className="rounded-lg bg-[#f54900] px-4 py-2 text-xs font-medium text-white">
                            INDUSTRY PARTNER
                        </span>
                    </div>

                    <div className="overflow-hidden rounded-2xl border-4 border-[#e5e7eb] bg-white shadow-2xl">
                        <div className="grid md:grid-cols-2">
                            {/* Left Image */}
                            <div className="relative h-64 md:h-auto">
                                <img
                                    src={imgAviationParts}
                                    alt="Aviation Parts and Components"
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
                                <span className="absolute left-4 top-4 rounded-lg bg-[#f54900] px-3 py-1 text-xs text-white">
                                    Sponsored
                                </span>
                            </div>

                            {/* Right Content */}
                            <div className="bg-gradient-to-br from-[#f54900] to-[#e7000b] p-8 md:p-12">
                                <div className="mb-6 flex h-12 w-16 items-center justify-center rounded-lg bg-white/20">
                                    <Shield className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-3xl font-bold text-white md:text-4xl">AeroTech Parts &amp; Supply</h3>
                                <p className="mt-4 text-lg leading-relaxed text-[#ffedd4]">
                                    &quot;Your trusted source for certified aircraft parts and components. Fast delivery, competitive pricing, and unmatched quality assurance.&quot;
                                </p>
                                <div className="mt-6 flex flex-wrap gap-4 text-sm text-white">
                                    <span className="flex items-center gap-2">
                                        <Check className="h-4 w-4" /> FAA/EASA Certified
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Check className="h-4 w-4" /> 24-Hour Shipping
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Check className="h-4 w-4" /> 50,000+ Parts
                                    </span>
                                </div>

                                {/* Special Offer */}
                                <div className="mt-6 flex items-center gap-3 rounded-lg bg-white/10 p-3">
                                    <Tag className="h-5 w-5 text-white" />
                                    <div>
                                        <div className="text-xs text-[#ffedd4]">Special Offer</div>
                                        <div className="text-sm font-bold text-white">15% Off First Order - Use Code: SKYMAINT15</div>
                                    </div>
                                </div>

                                <button className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-[#f54900] hover:bg-gray-50 transition-colors">
                                    Shop Parts Catalog
                                    <ExternalLink className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Dev Info */}
                    <div className="mt-4 rounded-lg bg-[#f3f4f6] p-3">
                        <span className="text-xs font-bold text-[#4a5565]">DEV INFO: </span>
                        <span className="text-xs text-[#4a5565]">
                            Ad ID: ad-002-aerotech | Contract: 2026-01-15 to 2026-07-15 | 6-month contract with promo code tracking
                        </span>
                    </div>
                </div>
            </section>

            {/* Connecting Aviation Excellence */}
            <section className="bg-gradient-to-br from-[#f9fafb] to-[#eff6ff] py-16">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="mb-12 text-center">
                        <span className="rounded-lg bg-[#9810fa] px-4 py-2 text-xs font-medium text-white">
                            Industry Partners
                        </span>
                        <h2 className="mt-4 text-3xl font-bold text-[#101828] md:text-4xl">
                            Connecting Aviation Excellence
                        </h2>
                        <p className="mx-auto mt-4 max-w-3xl text-lg text-[#4a5565]">
                            Featured partners providing trusted solutions to the aviation maintenance community
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">
                        {/* AeroTech Solutions */}
                        <div className="relative rounded-2xl border border-black/10 bg-white p-8">
                            <span className="absolute right-4 top-4 rounded-full bg-[#f3f4f6] px-3 py-1 text-xs text-[#4a5565]">
                                Sponsored
                            </span>
                            <div className="flex items-center justify-center">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#dbeafe]">
                                        <Activity className="h-6 w-6 text-[#155dfc]" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#101828]">AeroTech Solutions</h3>
                                </div>
                            </div>
                            <p className="mt-6 text-center text-[#364153]">
                                Advanced diagnostic tools and predictive analytics for modern aircraft fleets.
                            </p>
                            <Link href="/contact" className="mt-6 inline-flex w-full justify-center rounded-lg bg-[#155dfc] py-3 text-sm font-medium text-white hover:bg-[#1447e6] transition-colors">
                                Learn More <ArrowRight className="inline h-4 w-4 ml-1" />
                            </Link>
                            <p className="mt-3 text-center text-xs text-[#6a7282]">
                                Sponsored content. SkyMaintain does not endorse products.
                            </p>
                        </div>

                        {/* Partner Slot Available */}
                        <div className="rounded-2xl border border-black/10 bg-white p-8">
                            <div className="flex items-center justify-center">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e5e7eb]">
                                        <Activity className="h-6 w-6 text-[#6a7282]" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#6a7282]">Partner Slot Available</h3>
                                </div>
                            </div>
                            <p className="mt-6 text-center text-[#6a7282]">
                                Join our network of industry partners and reach aviation maintenance professionals worldwide.
                            </p>
                            <Link href="/become-partner" className="mt-6 inline-flex w-full justify-center rounded-lg bg-[#4a5565] py-3 text-sm font-medium text-white hover:bg-[#3d4654] transition-colors">
                                Become a Partner <ArrowRight className="inline h-4 w-4 ml-1" />
                            </Link>
                        </div>
                    </div>

                    {/* Partner Disclosure */}
                    <p className="mt-8 text-center text-xs text-[#6a7282]">
                        <strong>Partner Disclosure:</strong> SkyMaintain displays sponsored partner content. Sponsorship does not influence AI responses, maintenance recommendations, or compliance assessments. All partnerships are reviewed for aviation industry relevance and quality standards.
                    </p>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-[#f9fafb] py-16">
                <div className="mx-auto max-w-4xl px-6">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold text-[#101828] md:text-4xl">
                            Compliance &amp; Trust — Frequently Asked Questions
                        </h2>
                        <p className="mt-4 text-lg text-[#4a5565]">
                            How SkyMaintain supports maintenance professionals safely, responsibly, and in line with regulations.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div
                                key={faq.question}
                                className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white"
                            >
                                <button
                                    onClick={() => toggleFaq(idx)}
                                    className="flex w-full items-center justify-between p-6 text-left"
                                >
                                    <span className="text-lg font-bold text-[#101828]">{faq.question}</span>
                                    {expandedFaqs.includes(idx) ? (
                                        <ChevronUp className="h-5 w-5 text-[#4a5565]" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-[#4a5565]" />
                                    )}
                                </button>
                                {expandedFaqs.includes(idx) && (
                                    <div className="border-t border-[#e5e7eb] px-6 pb-6 pt-4">
                                        <p className="whitespace-pre-line text-[#364153]">{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 text-center text-[#4a5565]">
                        Have more questions?{" "}
                        <Link href="/contact" className="text-[#155dfc] hover:underline">
                            Contact our compliance team
                        </Link>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="bg-gradient-to-br from-[#155dfc] via-[#9810fa] to-[#432dd7] py-20">
                <div className="mx-auto max-w-4xl px-6 text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
                            <Plane className="h-10 w-10 text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-white md:text-5xl">
                        Ready to Transform Your Maintenance Operations?
                    </h2>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-[#dbeafe]">
                        Join 50+ airlines and operators using SkyMaintain to improve safety, reduce costs, and ensure 100% regulatory compliance.
                    </p>

                    <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href="/signin"
                            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-lg font-medium text-[#155dfc] shadow-xl hover:bg-gray-50 transition-colors"
                        >
                            Start Your Free Trial
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-lg font-medium text-[#155dfc] shadow-xl hover:bg-gray-50 transition-colors"
                        >
                            Schedule a Demo
                        </Link>
                    </div>

                    <p className="mt-6 text-sm text-[#bedbff]">
                        ✓ 14-day free trial • ✓ No credit card required • ✓ Full platform access
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#101828] py-12">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="grid gap-8 md:grid-cols-4">
                        {/* Brand */}
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#155dfc]">
                                    <Plane className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-lg font-bold text-white">SkyMaintain</span>
                            </div>
                            <p className="mt-4 text-sm text-[#99a1af]">
                                AI-powered aircraft maintenance platform ensuring safety, compliance, and efficiency.
                            </p>
                        </div>

                        {/* Product */}
                        <div>
                            <h4 className="mb-4 font-bold text-white">Product</h4>
                            <ul className="space-y-2">
                                <li><Link href="/platform-features" className="text-[#d1d5dc] hover:text-white">Features</Link></li>
                                <li><Link href="/pricing" className="text-[#d1d5dc] hover:text-white">Pricing</Link></li>
                                <li><Link href="/security" className="text-[#d1d5dc] hover:text-white">Security</Link></li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="mb-4 font-bold text-white">Company</h4>
                            <ul className="space-y-2">
                                <li><Link href="/about" className="text-[#d1d5dc] hover:text-white">About Us</Link></li>
                                <li><Link href="/careers" className="text-[#d1d5dc] hover:text-white">Careers</Link></li>
                                <li><Link href="/contact" className="text-[#d1d5dc] hover:text-white">Contact</Link></li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 className="mb-4 font-bold text-white">Legal</h4>
                            <ul className="space-y-2">
                                <li><Link href="/privacy" className="text-[#d1d5dc] hover:text-white">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="text-[#d1d5dc] hover:text-white">Terms of Service</Link></li>
                                <li><Link href="/compliance" className="text-[#d1d5dc] hover:text-white">Compliance</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-[#1e2939] pt-8 text-center">
                        <p className="text-sm text-[#d1d5dc]">
                            © 2026 <span className="text-[#51a2ff]">SkyMaintain</span>. All Rights Reserved.
                        </p>
                        <p className="mt-2 text-xs text-[#6a7282]">
                            SkyMaintain is a product of EncycloAMTs LLC.
                        </p>
                        <p className="mt-1 text-xs text-[#6a7282]">
                            A Regulatory-Compliant Architecture for AI-Assisted Aircraft Maintenance Decision Support
                        </p>
                        <p className="mt-4 text-xs text-[#6a7282]">
                            <strong>Partner Disclosure:</strong> SkyMaintain displays sponsored partner content. Sponsorship does not influence AI responses, maintenance recommendations, or compliance assessments.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
