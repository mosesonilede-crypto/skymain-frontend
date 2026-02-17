"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
    ArrowRight,
    Check,
    Plane,
    Shield,
    Activity,
    ExternalLink,
    Tag,
    Handshake,
    Users,
    Globe,
    Award,
} from "lucide-react";

// Partner types
type PartnerCard = {
    name: string;
    quote: string;
    bullets: string[];
    ctaLabel: string;
    ctaHref: string;
    imageUrl: string;
};

type PartnerContent = {
    featured: PartnerCard;
    industry: PartnerCard;
};

const PARTNER_STORAGE_KEY = "skymaintain.partnerContent";

// Default partner images
const imgGlobalAeroFleet = "https://www.figma.com/api/mcp/asset/d3926b89-b96a-4544-93f0-14aa7cf8b92f";
const imgAviationParts = "https://www.figma.com/api/mcp/asset/a5d2100f-d154-4213-995c-1b073c1f394c";

const imgGlobalAeroFallback = `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800" role="img" aria-label="GlobalAero Airlines">
    <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#1c398e" />
            <stop offset="100%" stop-color="#312c85" />
        </linearGradient>
    </defs>
    <rect width="1200" height="800" fill="url(#bg)" />
    <g fill="#ffffff" font-family="Arial, Helvetica, sans-serif">
        <text x="80" y="160" font-size="48" font-weight="700">GlobalAero Airlines</text>
        <text x="80" y="230" font-size="22" opacity="0.9">Partner Fleet Showcase</text>
    </g>
</svg>`
)}`;

const imgAviationPartsFallback = `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800" role="img" aria-label="AeroTech Parts and Supply">
    <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#f54900" />
            <stop offset="100%" stop-color="#e7000b" />
        </linearGradient>
    </defs>
    <rect width="1200" height="800" fill="url(#bg)" />
    <g fill="#ffffff" font-family="Arial, Helvetica, sans-serif">
        <text x="80" y="160" font-size="48" font-weight="700">AeroTech Parts &amp; Supply</text>
        <text x="80" y="230" font-size="22" opacity="0.9">Certified Parts Partner</text>
    </g>
</svg>`
)}`;

const defaultPartnerContent: PartnerContent = {
    featured: {
        name: "GlobalAero Airlines",
        quote:
            "Partnering with the world's leading carriers. Experience excellence in aviation with our premium fleet services and 24/7 maintenance support.",
        bullets: ["500+ Aircraft Fleet", "Global Coverage", "ISO Certified"],
        ctaLabel: "Learn More",
        ctaHref: "/contact",
        imageUrl: imgGlobalAeroFleet,
    },
    industry: {
        name: "AeroTech Parts & Supply",
        quote:
            "Your trusted source for certified aircraft parts and components. Fast delivery, competitive pricing, and unmatched quality assurance.",
        bullets: ["FAA/EASA Certified", "24-Hour Shipping", "50,000+ Parts"],
        ctaLabel: "Shop Parts Catalog",
        ctaHref: "/contact",
        imageUrl: imgAviationParts,
    },
};

const partnerBenefits = [
    {
        icon: <Users className="h-8 w-8 text-[#155dfc]" />,
        title: "Reach Aviation Professionals",
        description: "Connect with maintenance engineers, fleet managers, and aviation decision-makers worldwide.",
    },
    {
        icon: <Globe className="h-8 w-8 text-[#155dfc]" />,
        title: "Global Visibility",
        description: "Feature your products and services on a platform used by aviation professionals globally.",
    },
    {
        icon: <Award className="h-8 w-8 text-[#155dfc]" />,
        title: "Industry Recognition",
        description: "Associate your brand with a trusted, compliance-focused aviation technology platform.",
    },
    {
        icon: <Handshake className="h-8 w-8 text-[#155dfc]" />,
        title: "Co-Marketing Opportunities",
        description: "Collaborate on content, webinars, and industry events to expand your reach.",
    },
];

export default function PartnershipsPage() {
    const [partnerContent, setPartnerContent] = useState<PartnerContent>(defaultPartnerContent);
    const [globalAeroSrc, setGlobalAeroSrc] = useState(defaultPartnerContent.featured.imageUrl);
    const [aeroTechSrc, setAeroTechSrc] = useState(defaultPartnerContent.industry.imageUrl);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const loadPartnerContent = () => {
            try {
                const stored = window.localStorage.getItem(PARTNER_STORAGE_KEY);
                if (!stored) return;
                const parsed = JSON.parse(stored) as Partial<PartnerContent>;
                if (!parsed?.featured || !parsed?.industry) return;
                setPartnerContent({
                    featured: { ...defaultPartnerContent.featured, ...parsed.featured },
                    industry: { ...defaultPartnerContent.industry, ...parsed.industry },
                });
                setGlobalAeroSrc(parsed.featured?.imageUrl || defaultPartnerContent.featured.imageUrl);
                setAeroTechSrc(parsed.industry?.imageUrl || defaultPartnerContent.industry.imageUrl);
            } catch {
                // Ignore malformed storage content
            }
        };

        loadPartnerContent();
        const handleStorage = (event: StorageEvent) => {
            if (event.key === PARTNER_STORAGE_KEY) {
                loadPartnerContent();
            }
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#155dfc] via-[#1447e6] to-[#312c85] pt-24 pb-16">
                <div className="mx-auto max-w-6xl px-6 text-center">
                    <span className="inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white">
                        Partner Network
                    </span>
                    <h1 className="mt-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                        Our Industry Partners
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-[#dbeafe]">
                        SkyMaintain partners with leading aviation companies to bring you trusted solutions,
                        certified parts, and industry expertise.
                    </p>
                    <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <Link
                            href="/become-partner"
                            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-bold text-[#155dfc] hover:bg-gray-50 transition-colors"
                        >
                            Become a Partner
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 px-6 py-3 text-base font-medium text-white hover:bg-white/10 transition-colors"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Partner */}
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
                                <h3 className="text-3xl font-bold text-white md:text-4xl">{partnerContent.featured.name}</h3>
                                <p className="mt-4 text-lg leading-relaxed text-[#dbeafe]">
                                    &quot;{partnerContent.featured.quote}&quot;
                                </p>
                                <div className="mt-6 flex flex-wrap gap-4 text-sm text-white">
                                    {partnerContent.featured.bullets.map((bullet) => (
                                        <span key={bullet} className="flex items-center gap-2">
                                            <Check className="h-4 w-4" /> {bullet}
                                        </span>
                                    ))}
                                </div>
                                <Link
                                    href={partnerContent.featured.ctaHref}
                                    className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-[#1c398e] hover:bg-gray-50 transition-colors"
                                >
                                    {partnerContent.featured.ctaLabel}
                                    <ExternalLink className="h-4 w-4" />
                                </Link>
                            </div>

                            {/* Right Image */}
                            <div className="relative h-64 md:h-auto">
                                <Image
                                    src={globalAeroSrc}
                                    alt={`${partnerContent.featured.name} Fleet`}
                                    fill
                                    sizes="(min-width: 768px) 50vw, 100vw"
                                    unoptimized
                                    className="absolute inset-0 h-full w-full object-cover"
                                    onError={() => setGlobalAeroSrc(imgGlobalAeroFallback)}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                <span className="absolute right-4 top-4 rounded-lg bg-[#4a5565] px-3 py-1 text-xs text-white">
                                    Sponsored
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Industry Partner */}
            <section className="bg-white py-12">
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
                                <Image
                                    src={aeroTechSrc}
                                    alt={partnerContent.industry.name}
                                    fill
                                    sizes="(min-width: 768px) 50vw, 100vw"
                                    unoptimized
                                    className="absolute inset-0 h-full w-full object-cover"
                                    onError={() => setAeroTechSrc(imgAviationPartsFallback)}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                <span className="absolute left-4 top-4 rounded-lg bg-[#4a5565] px-3 py-1 text-xs text-white">
                                    Sponsored
                                </span>
                            </div>

                            {/* Right Content */}
                            <div className="bg-gradient-to-br from-[#f54900] to-[#e7000b] p-8 md:p-12">
                                <div className="mb-6 flex h-12 w-16 items-center justify-center rounded-lg bg-white/20">
                                    <Shield className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-3xl font-bold text-white md:text-4xl">{partnerContent.industry.name}</h3>
                                <p className="mt-4 text-lg leading-relaxed text-[#ffedd4]">
                                    &quot;{partnerContent.industry.quote}&quot;
                                </p>
                                <div className="mt-6 flex flex-wrap gap-4 text-sm text-white">
                                    {partnerContent.industry.bullets.map((bullet) => (
                                        <span key={bullet} className="flex items-center gap-2">
                                            <Check className="h-4 w-4" /> {bullet}
                                        </span>
                                    ))}
                                </div>

                                {/* Special Offer */}
                                <div className="mt-6 flex items-center gap-3 rounded-lg bg-white/10 p-3">
                                    <Tag className="h-5 w-5 text-white" />
                                    <div>
                                        <div className="text-xs text-[#ffedd4]">Special Offer</div>
                                        <div className="text-sm font-bold text-white">15% Off First Order - Use Code: SKYMAINT15</div>
                                    </div>
                                </div>

                                <Link
                                    href={partnerContent.industry.ctaHref}
                                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-[#f54900] hover:bg-gray-50 transition-colors"
                                >
                                    {partnerContent.industry.ctaLabel}
                                    <ExternalLink className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* More Partners */}
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
                                        <Handshake className="h-6 w-6 text-[#6a7282]" />
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
                </div>
            </section>

            {/* Partnership Benefits */}
            <section className="bg-white py-16">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="mb-12 text-center">
                        <span className="rounded-lg bg-[#155dfc] px-4 py-2 text-xs font-medium text-white">
                            Why Partner With Us
                        </span>
                        <h2 className="mt-4 text-3xl font-bold text-[#101828] md:text-4xl">
                            Partner Benefits
                        </h2>
                        <p className="mx-auto mt-4 max-w-3xl text-lg text-[#4a5565]">
                            Join our partner network and gain access to aviation maintenance professionals worldwide
                        </p>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {partnerBenefits.map((benefit) => (
                            <div
                                key={benefit.title}
                                className="rounded-2xl border border-black/10 bg-[#f9fafb] p-6 text-center"
                            >
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#dbeafe]">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-lg font-bold text-[#101828]">{benefit.title}</h3>
                                <p className="mt-2 text-sm text-[#4a5565]">{benefit.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <Link
                            href="/become-partner"
                            className="inline-flex items-center gap-2 rounded-lg bg-[#155dfc] px-8 py-4 text-base font-bold text-white hover:bg-[#1447e6] transition-colors"
                        >
                            Apply for Partnership
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Partner Disclosure */}
            <section className="bg-[#f9fafb] py-8">
                <div className="mx-auto max-w-4xl px-6">
                    <div className="rounded-xl border border-[#e5e7eb] bg-white p-6 text-center">
                        <p className="text-sm text-[#6a7282]">
                            <strong>Partner Disclosure:</strong> SkyMaintain displays sponsored partner content.
                            Sponsorship does not influence AI responses, maintenance recommendations, or compliance assessments.
                            All partnerships are reviewed for aviation industry relevance and quality standards.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
