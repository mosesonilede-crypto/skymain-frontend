"use client";

/* eslint-disable @next/next/no-img-element */
/**
 * @skymain.design
 * fileKey: qz3ERP8jfbTpTHQrdPSawI
 * nodeId: 11-8217
 * specHash: sha256:pre-login-page-v2
 */
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { CONTACT_DEMO } from "@/lib/routes";

// Image assets
const imgImageGlobalAeroAirlinesFleet = "https://www.figma.com/api/mcp/asset/0436cf19-7c86-47b6-a946-2bbbea9c16cf";
const imgImageAiPoweredPredictiveAnalytics = "https://www.figma.com/api/mcp/asset/f2cb14ef-455b-4442-9b9b-4a5fafb29347";
const imgImageRegulatoryComplianceAutomation = "https://www.figma.com/api/mcp/asset/0eca4127-0917-4059-ab75-ff3deb12e0f9";
const imgImageRealTimeIoTMonitoring = "https://www.figma.com/api/mcp/asset/8fed5449-8da1-4d37-83ae-fa10633afd67";
const imgImageSmartMaintenanceWorkflows = "https://www.figma.com/api/mcp/asset/88d104f5-5ce0-4483-a441-85531ea5dd42";
const imgImageAviationPartsAndComponents = "https://www.figma.com/api/mcp/asset/5b80ae9d-7561-4e96-a64d-b7b2a5df7cc3";

// Icon assets
const imgIconTrendDown = "https://www.figma.com/api/mcp/asset/04549f5e-7bb1-4c65-861a-d5b1486a9521";
const imgIconCompliance = "https://www.figma.com/api/mcp/asset/910e5d57-29f9-43e3-b787-3273b17b531b";
const imgIconSpeed = "https://www.figma.com/api/mcp/asset/6e662f88-4477-4a59-8af8-372a2ce10b75";
const imgIconDollar = "https://www.figma.com/api/mcp/asset/da6c617d-13b4-4023-b6b5-988fce459a6d";
const imgIconPlane = "https://www.figma.com/api/mcp/asset/1b3a1729-aee1-415d-b134-23a2e759fbb4";
const imgIconCheck = "https://www.figma.com/api/mcp/asset/99f015d0-e9fe-4c32-8bab-8e2d9c20d3fa";
const imgIconArrowRightWhite = "https://www.figma.com/api/mcp/asset/b7100499-1b1e-4962-a19a-49894f83d1b0";
const imgIconArrowRightBlue = "https://www.figma.com/api/mcp/asset/934cf7e1-46b8-4b11-a9ba-90f86f2170ab";
const imgIconArrowRightWhite2 = "https://www.figma.com/api/mcp/asset/739bdcf3-ce15-451b-a391-9a75925d59a0";
const imgIconQuote1 = "https://www.figma.com/api/mcp/asset/1b6c2f65-ea65-4cf2-a914-f68abdee202e";
const imgIconStar = "https://www.figma.com/api/mcp/asset/9221caf9-7160-41af-bfdd-d86078443d79";
const imgIconQuote2 = "https://www.figma.com/api/mcp/asset/f9da456b-4fa4-4c59-8bd4-3cf2fb927dfa";
const imgIconStar2 = "https://www.figma.com/api/mcp/asset/f2122a80-aecd-459d-b4e9-adbb85b6e1fd";
const imgIconTools = "https://www.figma.com/api/mcp/asset/e380161f-7a76-48c1-a965-309353caf3dc";
const imgIconCheckOrange = "https://www.figma.com/api/mcp/asset/25619639-2ace-4864-9aaf-921de1b99a0e";
const imgIconTag = "https://www.figma.com/api/mcp/asset/cd8fb53a-c9bf-4e32-9538-daa7ed18b21c";
const imgIconArrowRightOrange = "https://www.figma.com/api/mcp/asset/a6dcafd8-5d46-4ff1-b203-ed8eb9a56e0e";
const imgIconChevronUp = "https://www.figma.com/api/mcp/asset/84a5a206-095e-4e57-a69a-c02704b07497";
const imgIconChevronDown = "https://www.figma.com/api/mcp/asset/9ab302e9-d5e0-4ff8-85e8-f7a42aed805e";
const imgIconRocket = "https://www.figma.com/api/mcp/asset/bd1ba56e-d28a-4810-aa2a-845297a7db12";
const imgIconArrowRightPurple = "https://www.figma.com/api/mcp/asset/cd4faa9f-ceb9-43a7-89d2-ca98828b9b23";
const imgIconCheckPurple = "https://www.figma.com/api/mcp/asset/fec8ffb4-c986-4e61-aed7-e35a89fb33c3";

// Vector/SVG assets for icons
const imgVectorBrain1 = "https://www.figma.com/api/mcp/asset/7a735ab8-3e48-4302-bdde-f6192625c0e5";
const imgVectorShield = "https://www.figma.com/api/mcp/asset/8f399e4d-0727-4359-9683-ac85c10a65c1";
const imgVectorWifi = "https://www.figma.com/api/mcp/asset/b6434d70-8f6e-4cc6-ba21-10408a0b83f4";
const imgVectorClipboard = "https://www.figma.com/api/mcp/asset/bb86cace-10ad-4b7b-a4fb-ce0ec35f72c0";
const imgVectorPlane = "https://www.figma.com/api/mcp/asset/a22f6b9d-0688-4024-949a-209d7b261e7a";

// Login modal assets (node 1:1128)
const imgLoginVector = "https://www.figma.com/api/mcp/asset/86dd66a3-8408-45bb-8d8e-410300189295";
const imgLoginClose = "https://www.figma.com/api/mcp/asset/4a9ad43c-a11a-405c-bd03-6f7e7d2761a8";
const imgLoginEmail = "https://www.figma.com/api/mcp/asset/a7bb699c-160b-4e4d-a52b-a5c24369bd9f";
const imgLoginOrg = "https://www.figma.com/api/mcp/asset/f7a6352d-299b-4171-89d0-84a454e9e5bb";
const imgLoginLock = "https://www.figma.com/api/mcp/asset/06f60c78-2174-4421-b27d-c4db7dd3681f";
const imgLoginArrow = "https://www.figma.com/api/mcp/asset/536b49f5-3b47-4b06-a26d-f34ef185d44d";
const imgLoginDemoA = "https://www.figma.com/api/mcp/asset/56ba247a-9a2d-484a-b277-6d3dbe4a0bfe";
const imgLoginDemoB = "https://www.figma.com/api/mcp/asset/69bbe477-5fe5-4ed8-9492-cf58425f4516";

export default function PreLoginPage() {
    const [showLogin, setShowLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [organization, setOrganization] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    const handleDemoAccount = (type: "fleet" | "maintenance") => {
        if (type === "fleet") {
            setEmail("fleet.manager@skywings.com");
            setOrganization("SkyWings Airlines");
            setPassword("demo-fleet");
        } else {
            setEmail("maintenance.engineer@skywings.com");
            setOrganization("SkyWings Airlines");
            setPassword("demo-maintenance");
        }
    };

    return (
        <div className="bg-white relative w-full min-h-screen" data-name="SkyMaintain Login Page" data-node-id="1:566">
            {showLogin && (
                <div
                    className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.6)] flex items-center justify-center"
                    data-name="ProfessionalLandingPage"
                    data-node-id="1:1128"
                >
                    <div
                        className="bg-white border border-black/10 rounded-[14px] w-[448px] h-[614.875px] relative overflow-hidden"
                        data-name="Card"
                        data-node-id="1:1129"
                    >
                        <div className="relative rounded-[inherit] p-[0.8px] size-full">
                            <div className="relative w-[431.2px] h-[645.563px]">
                                <div className="absolute left-6 top-6 flex items-center justify-between w-[383.2px]">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="size-10 rounded-[10px] flex items-center justify-center"
                                            style={{ background: "linear-gradient(135deg, #155dfc 0%, #1447e6 100%)" }}
                                        >
                                            <div className="size-6 overflow-hidden">
                                                <img alt="" className="size-full" src={imgLoginVector} />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[#0a0a0a] text-[20px] font-bold leading-[28px]">Welcome Back</p>
                                            <p className="text-[#4a5565] text-[12px] leading-[16px]">Sign in to your account</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowLogin(false)}
                                        className="size-10 rounded-[8px] flex items-center justify-center"
                                        aria-label="Close login"
                                    >
                                        <img alt="" className="size-5" src={imgLoginClose} />
                                    </button>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="absolute left-6 top-[91.99px] w-[383.2px] flex flex-col gap-4"
                                    data-name="Form"
                                    data-node-id="1:1145"
                                >
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[#0a0a0a] text-[14px] leading-[20px]">Email Address</label>
                                        <div className="relative">
                                            <img alt="" className="absolute left-3 top-2.5 size-4" src={imgLoginEmail} />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(event) => setEmail(event.target.value)}
                                                placeholder="john@company.com"
                                                className="w-full h-9 bg-[#f3f3f5] rounded-[8px] pl-10 pr-3 text-[14px] text-[#0a0a0a] placeholder:text-[#717182]"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-[#0a0a0a] text-[14px] leading-[20px]">Organization Name</label>
                                        <div className="relative">
                                            <img alt="" className="absolute left-3 top-2.5 size-4" src={imgLoginOrg} />
                                            <input
                                                type="text"
                                                value={organization}
                                                onChange={(event) => setOrganization(event.target.value)}
                                                placeholder="Your Company Name"
                                                className="w-full h-9 bg-[#f3f3f5] rounded-[8px] pl-10 pr-3 text-[14px] text-[#0a0a0a] placeholder:text-[#717182]"
                                            />
                                        </div>
                                        <p className="text-[12px] text-[#6a7282] leading-[16px]">
                                            Must match your organization&apos;s license agreement
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-[#0a0a0a] text-[14px] leading-[20px]">Password</label>
                                        <div className="relative">
                                            <img alt="" className="absolute left-3 top-2.5 size-4" src={imgLoginLock} />
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(event) => setPassword(event.target.value)}
                                                placeholder="••••••••"
                                                className="w-full h-9 bg-[#f3f3f5] rounded-[8px] pl-10 pr-3 text-[14px] text-[#0a0a0a] placeholder:text-[#717182]"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-2 text-[#4a5565] text-[16px]">
                                            <input
                                                type="checkbox"
                                                checked={rememberMe}
                                                onChange={(event) => setRememberMe(event.target.checked)}
                                                className="size-[13px] accent-[#155dfc]"
                                            />
                                            Remember me
                                        </label>
                                        <Link href="/signin" className="text-[#155dfc] text-[14px]">
                                            Forgot password?
                                        </Link>
                                    </div>

                                    <button
                                        type="submit"
                                        className="bg-[#155dfc] text-white text-[14px] rounded-[8px] h-9 flex items-center justify-center gap-2"
                                    >
                                        Sign In
                                        <img alt="" className="size-4" src={imgLoginArrow} />
                                    </button>
                                </form>

                                <Link
                                    href="/get-started"
                                    className="absolute left-[115.81px] top-[442.38px] text-[#155dfc] text-[14px]"
                                    data-name="Button"
                                    data-node-id="1:1192"
                                >
                                    Don&apos;t have an account? Sign up
                                </Link>

                                <div
                                    className="absolute left-6 top-[487.98px] w-[383.2px] bg-[#f9fafb] border border-[#e5e7eb] rounded-[10px] px-[16.8px] pt-[16.8px] pb-[0.8px] flex flex-col gap-3"
                                    data-name="Container"
                                    data-node-id="1:1194"
                                >
                                    <p className="text-[#364153] text-[12px] font-bold">Try Demo Accounts:</p>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleDemoAccount("fleet")}
                                            className="w-full h-8 bg-white border border-black/10 rounded-[8px] flex items-center gap-3 px-3 text-[12px] text-[#0a0a0a]"
                                        >
                                            <img alt="" className="size-3" src={imgLoginDemoA} />
                                            Fleet Manager - SkyWings Airlines
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDemoAccount("maintenance")}
                                            className="w-full h-8 bg-white border border-black/10 rounded-[8px] flex items-center gap-3 px-3 text-[12px] text-[#0a0a0a]"
                                        >
                                            <img alt="" className="size-3" src={imgLoginDemoB} />
                                            Maintenance Engineer - SkyWings
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="w-full max-w-[1148px] mx-auto">
                {/* Hero Section */}
                <section
                    className="pt-32 pb-24 px-[86px] overflow-hidden"
                    style={{ background: "linear-gradient(152deg, #9810fa 0%, #8200db 50%, #372aac 100%)" }}
                    data-name="Section"
                    data-node-id="11:8729"
                >
                    <div className="flex flex-col gap-8 items-center text-center">
                        <div className="space-y-6">
                            <h1 className="text-6xl font-bold text-white leading-[1.25] max-w-[860px]">
                                AI-Powered Predictive Aircraft Maintenance
                            </h1>
                            <p className="text-2xl text-[#f3e8ff]">
                                Built for Safety, Compliance, and Scale
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex gap-4 mt-4">
                            <Link
                                href="/get-started"
                                className="flex items-center gap-2 px-6 py-3 bg-white text-[#8200db] font-bold text-lg rounded-[14px] shadow-2xl hover:bg-gray-50 transition-colors"
                            >
                                Start Your Free Trial
                                <img alt="" className="size-5" src={imgIconArrowRightPurple} />
                            </Link>
                            <Link
                                href={CONTACT_DEMO}
                                className="px-10 py-3 bg-white text-[#155dfc] font-bold text-lg rounded-[14px] shadow-2xl hover:bg-gray-50 transition-colors"
                            >
                                Request Demo
                            </Link>
                        </div>

                        {/* Trial Features */}
                        <div className="flex items-center gap-8 mt-6">
                            <div className="flex items-center gap-2">
                                <img alt="" className="size-5" src={imgIconCheckPurple} />
                                <span className="text-sm text-[#e9d4ff]">14-day free trial</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <img alt="" className="size-5" src={imgIconCheckPurple} />
                                <span className="text-sm text-[#e9d4ff]">No credit card required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <img alt="" className="size-5" src={imgIconCheckPurple} />
                                <span className="text-sm text-[#e9d4ff]">Full platform access</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section
                    className="py-16 px-6"
                    style={{ background: "linear-gradient(to right, #155dfc, #9810fa)" }}
                    data-name="Section"
                    data-node-id="11:8219"
                >
                    <div className="grid grid-cols-4 gap-8">
                        {[
                            { icon: imgIconTrendDown, value: "35%", label: "Reduction in Downtime" },
                            { icon: imgIconCompliance, value: "99.8%", label: "Compliance Rate" },
                            { icon: imgIconSpeed, value: "60%", label: "Faster Task Completion" },
                            { icon: imgIconDollar, value: "$250K", label: "Annual Cost Savings" },
                        ].map((stat, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center">
                                <div className="size-12 bg-white/20 rounded-[14px] flex items-center justify-center mb-4">
                                    <img alt="" className="size-6" src={stat.icon} />
                                </div>
                                <p className="text-4xl font-bold text-white leading-tight">{stat.value}</p>
                                <p className="text-sm text-[#dbeafe] mt-2">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Featured Partner Advertisement */}
                <section
                    className="py-12 px-6 border-t-4 border-b-4 border-[#155dfc]"
                    style={{ background: "linear-gradient(148deg, #f8fafc 0%, #f3f4f6 100%)" }}
                    data-name="AdvertisementDisplay"
                    data-node-id="11:8256"
                >
                    <div className="text-center mb-6">
                        <span className="inline-block px-4 py-2 bg-[#4a5565] text-white text-xs rounded-lg">
                            FEATURED PARTNER
                        </span>
                    </div>

                    <div className="bg-white border-4 border-[#e5e7eb] rounded-2xl shadow-2xl overflow-hidden relative">
                        <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-[#4a5565] text-white text-xs rounded-lg">
                            Sponsored
                        </div>
                        <div className="grid grid-cols-2">
                            {/* Left Content */}
                            <div
                                className="p-12"
                                style={{ background: "linear-gradient(139deg, #1c398e 0%, #312c85 100%)" }}
                            >
                                <div className="flex flex-col h-full">
                                    <div className="size-16 bg-white/20 rounded-[10px] flex items-center justify-center mb-6">
                                        <img alt="" className="size-8" src={imgIconPlane} />
                                    </div>
                                    <h3 className="text-4xl font-bold text-white mb-6">GlobalAero Airlines</h3>
                                    <p className="text-xl text-[#dbeafe] leading-relaxed mb-8">
                                        &ldquo;Partnering with the world&apos;s leading carriers. Experience excellence in aviation with our premium fleet services and 24/7 maintenance support.&rdquo;
                                    </p>
                                    <div className="flex gap-6 mb-8">
                                        <div className="flex items-center gap-2">
                                            <img alt="" className="size-5" src={imgIconCheck} />
                                            <span className="text-sm text-white">500+ Aircraft Fleet</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <img alt="" className="size-5" src={imgIconCheck} />
                                            <span className="text-sm text-white">Global Coverage</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <img alt="" className="size-5" src={imgIconCheck} />
                                            <span className="text-sm text-white">ISO Certified</span>
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-2 px-6 py-2 bg-white text-[#1c398e] font-bold text-sm rounded-lg w-fit">
                                        Learn More
                                        <img alt="" className="size-4" src={imgIconArrowRightWhite} />
                                    </button>
                                </div>
                            </div>
                            {/* Right Image */}
                            <div className="relative h-[480px]">
                                <img
                                    alt="GlobalAero Airlines Fleet"
                                    className="absolute inset-0 w-full h-full object-cover"
                                    src={imgImageGlobalAeroAirlinesFleet}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 bg-[#f3f4f6] rounded-[10px] p-3">
                        <span className="font-bold text-xs text-[#4a5565]">DEV INFO: </span>
                        <span className="text-xs text-[#4a5565]">
                            Ad ID: ad-001-globalaero | Contract: 2026-01-01 to 2026-12-31 | Annual contract - Premium airline partner
                        </span>
                    </div>
                </section>

                {/* Platform Capabilities Section */}
                <section
                    className="py-16 px-6 bg-[#f9fafb]"
                    data-name="Section"
                    data-node-id="11:8304"
                >
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-2 bg-[#155dfc] text-white text-xs rounded-lg mb-6">
                            Platform Capabilities
                        </span>
                        <h2 className="text-4xl font-bold text-[#101828] mb-4">
                            Comprehensive AI-Driven Maintenance Solution
                        </h2>
                        <p className="text-xl text-[#4a5565] max-w-3xl mx-auto">
                            Built specifically for aviation maintenance operations with regulatory compliance at its core
                        </p>
                    </div>

                    <div className="space-y-16">
                        {/* Feature 1: AI-Powered Predictive Analytics */}
                        <div className="grid grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <div className="size-12 overflow-hidden">
                                    <img alt="" className="size-full" src={imgVectorBrain1} />
                                </div>
                                <h3 className="text-3xl font-bold text-[#101828]">AI-Powered Predictive Analytics</h3>
                                <p className="text-lg text-[#4a5565] leading-relaxed">
                                    Advanced machine learning algorithms predict maintenance needs before failures occur, reducing unplanned downtime by up to 35%.
                                </p>
                                <Link
                                    href="/platform-features"
                                    className="inline-flex items-center gap-2 px-6 py-2 bg-[#155dfc] text-white text-sm rounded-lg"
                                >
                                    Learn More
                                    <img alt="" className="size-4" src={imgIconArrowRightBlue} />
                                </Link>
                            </div>
                            <div className="border-4 border-white rounded-2xl shadow-2xl overflow-hidden">
                                <img
                                    alt="AI-Powered Predictive Analytics"
                                    className="w-full h-80 object-cover"
                                    src={imgImageAiPoweredPredictiveAnalytics}
                                />
                            </div>
                        </div>

                        {/* Feature 2: Regulatory Compliance Automation */}
                        <div className="grid grid-cols-2 gap-12 items-center">
                            <div className="border-4 border-white rounded-2xl shadow-2xl overflow-hidden">
                                <img
                                    alt="Regulatory Compliance Automation"
                                    className="w-full h-80 object-cover"
                                    src={imgImageRegulatoryComplianceAutomation}
                                />
                            </div>
                            <div className="space-y-6">
                                <div className="size-12 overflow-hidden">
                                    <img alt="" className="size-full" src={imgVectorShield} />
                                </div>
                                <h3 className="text-3xl font-bold text-[#101828]">Regulatory Compliance Automation</h3>
                                <p className="text-lg text-[#4a5565] leading-relaxed">
                                    Automated tracking of FAA/EASA airworthiness directives with real-time alerts and compliance deadline management.
                                </p>
                                <Link
                                    href="/regulatory-compliance-automation"
                                    className="inline-flex items-center gap-2 px-6 py-2 bg-[#155dfc] text-white text-sm rounded-lg"
                                >
                                    Learn More
                                    <img alt="" className="size-4" src={imgIconArrowRightWhite2} />
                                </Link>
                            </div>
                        </div>

                        {/* Feature 3: Real-Time IoT Monitoring */}
                        <div className="grid grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <div className="size-12 overflow-hidden">
                                    <img alt="" className="size-full" src={imgVectorWifi} />
                                </div>
                                <h3 className="text-3xl font-bold text-[#101828]">Real-Time IoT Monitoring</h3>
                                <p className="text-lg text-[#4a5565] leading-relaxed">
                                    Continuous aircraft health monitoring through integrated sensor data providing instant visibility into all critical systems.
                                </p>
                                <Link
                                    href="/platform-features"
                                    className="inline-flex items-center gap-2 px-6 py-2 bg-[#155dfc] text-white text-sm rounded-lg"
                                >
                                    Learn More
                                    <img alt="" className="size-4" src={imgIconArrowRightBlue} />
                                </Link>
                            </div>
                            <div className="border-4 border-white rounded-2xl shadow-2xl overflow-hidden">
                                <img
                                    alt="Real-Time IoT Monitoring"
                                    className="w-full h-80 object-cover"
                                    src={imgImageRealTimeIoTMonitoring}
                                />
                            </div>
                        </div>

                        {/* Feature 4: Smart Maintenance Workflows */}
                        <div className="grid grid-cols-2 gap-12 items-center">
                            <div className="border-4 border-white rounded-2xl shadow-2xl overflow-hidden">
                                <img
                                    alt="Smart Maintenance Workflows"
                                    className="w-full h-80 object-cover"
                                    src={imgImageSmartMaintenanceWorkflows}
                                />
                            </div>
                            <div className="space-y-6">
                                <div className="size-12 overflow-hidden">
                                    <img alt="" className="size-full" src={imgVectorClipboard} />
                                </div>
                                <h3 className="text-3xl font-bold text-[#101828]">Smart Maintenance Workflows</h3>
                                <p className="text-lg text-[#4a5565] leading-relaxed">
                                    Interactive digital checklists with photo documentation requirements and team collaboration features for efficient task management.
                                </p>
                                <Link
                                    href="/platform-features"
                                    className="inline-flex items-center gap-2 px-6 py-2 bg-[#155dfc] text-white text-sm rounded-lg"
                                >
                                    Learn More
                                    <img alt="" className="size-4" src={imgIconArrowRightWhite2} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Customer Success / Testimonials Section */}
                <section
                    className="py-20 px-6 bg-white"
                    data-name="Section"
                    data-node-id="11:8385"
                >
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-2 bg-[#9810fa] text-white text-xs rounded-lg mb-6">
                            Customer Success
                        </span>
                        <h2 className="text-4xl font-bold text-[#101828]">
                            Trusted by Aviation Professionals
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        {/* Testimonial 1 */}
                        <div className="bg-white border border-black/10 rounded-[14px] p-8">
                            <img alt="" className="size-12 mb-8" src={imgIconQuote1} />
                            <div className="flex gap-1 mb-8">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <img key={i} alt="" className="size-5" src={imgIconStar} />
                                ))}
                            </div>
                            <p className="text-lg italic text-[#364153] mb-8">
                                &ldquo;SkyMaintain&apos;s AI predictions helped us avoid two major engine failures, saving over $400,000 in emergency repairs.&rdquo;
                            </p>
                            <div className="border-t border-[#e5e7eb] pt-6">
                                <p className="font-bold text-[#101828]">Michael Rodriguez</p>
                                <p className="text-sm text-[#4a5565]">Director of Maintenance</p>
                                <p className="text-sm text-[#155dfc]">Global Airways</p>
                            </div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="bg-white border border-black/10 rounded-[14px] p-8">
                            <img alt="" className="size-12 mb-8" src={imgIconQuote2} />
                            <div className="flex gap-1 mb-8">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <img key={i} alt="" className="size-5" src={imgIconStar2} />
                                ))}
                            </div>
                            <p className="text-lg italic text-[#364153] mb-8">
                                &ldquo;The regulatory compliance tracking is exceptional. We&apos;ve achieved 100% AD compliance since implementation.&rdquo;
                            </p>
                            <div className="border-t border-[#e5e7eb] pt-6">
                                <p className="font-bold text-[#101828]">Sarah Chen</p>
                                <p className="text-sm text-[#4a5565]">Fleet Manager</p>
                                <p className="text-sm text-[#155dfc]">Pacific Aviation</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Industry Partner Advertisement (AeroTech) */}
                <section
                    className="py-12 px-6 border-t-4 border-b-4 border-[#f54900]"
                    style={{ background: "linear-gradient(146deg, #fff7ed 0%, #fffbeb 100%)" }}
                    data-name="AdvertisementDisplay"
                    data-node-id="11:8440"
                >
                    <div className="text-center mb-6">
                        <span className="inline-block px-4 py-2 bg-[#f54900] text-white text-xs rounded-lg">
                            INDUSTRY PARTNER
                        </span>
                    </div>

                    <div className="bg-white border-4 border-[#e5e7eb] rounded-2xl shadow-2xl overflow-hidden relative">
                        <div className="grid grid-cols-2">
                            {/* Left Image */}
                            <div className="relative h-[530px]">
                                <img
                                    alt="Aviation Parts and Components"
                                    className="absolute inset-0 w-full h-full object-cover"
                                    src={imgImageAviationPartsAndComponents}
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
                                <span className="absolute top-4 left-4 px-3 py-1 bg-[#f54900] text-white text-xs rounded-lg">
                                    Sponsored
                                </span>
                            </div>
                            {/* Right Content */}
                            <div
                                className="p-12"
                                style={{ background: "linear-gradient(136deg, #f54900 0%, #e7000b 100%)" }}
                            >
                                <div className="flex flex-col h-full">
                                    <div className="size-16 bg-white/20 rounded-[10px] flex items-center justify-center mb-6">
                                        <img alt="" className="size-8" src={imgIconTools} />
                                    </div>
                                    <h3 className="text-4xl font-bold text-white mb-6">AeroTech Parts &amp; Supply</h3>
                                    <p className="text-xl text-[#ffedd4] leading-relaxed mb-6">
                                        &ldquo;Your trusted source for certified aircraft parts and components. Fast delivery, competitive pricing, and unmatched quality assurance.&rdquo;
                                    </p>
                                    <div className="flex gap-6 mb-6">
                                        <div className="flex items-center gap-2">
                                            <img alt="" className="size-5" src={imgIconCheckOrange} />
                                            <span className="text-sm text-white">FAA/EASA Certified</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <img alt="" className="size-5" src={imgIconCheckOrange} />
                                            <span className="text-sm text-white">24-Hour Shipping</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <img alt="" className="size-5" src={imgIconCheckOrange} />
                                            <span className="text-sm text-white">50,000+ Parts</span>
                                        </div>
                                    </div>
                                    <div className="bg-white/10 rounded-[10px] p-3 flex items-center gap-3 mb-6">
                                        <img alt="" className="size-5" src={imgIconTag} />
                                        <div>
                                            <p className="text-xs text-[#ffedd4]">Special Offer</p>
                                            <p className="text-sm font-bold text-white">15% Off First Order - Use Code: SKYMAINT15</p>
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-2 px-6 py-2 bg-white text-[#f54900] font-bold text-sm rounded-lg w-fit">
                                        Shop Parts Catalog
                                        <img alt="" className="size-4" src={imgIconArrowRightOrange} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 bg-[#f3f4f6] rounded-[10px] p-3">
                        <span className="font-bold text-xs text-[#4a5565]">DEV INFO: </span>
                        <span className="text-xs text-[#4a5565]">
                            Ad ID: ad-002-aerotech | Contract: 2026-01-15 to 2026-07-15 | 6-month contract with promo code tracking
                        </span>
                    </div>
                </section>

                {/* Industry Partners Section */}
                <section
                    className="py-20 px-6"
                    style={{ background: "linear-gradient(147deg, #f9fafb 0%, #eff6ff 100%)" }}
                    data-name="Section"
                    data-node-id="11:8497"
                >
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-2 bg-[#9810fa] text-white text-xs rounded-lg mb-6">
                            Industry Partners
                        </span>
                        <h2 className="text-4xl font-bold text-[#101828] mb-4">
                            Connecting Aviation Excellence
                        </h2>
                        <p className="text-xl text-[#4a5565]">
                            Featured partners providing trusted solutions to the aviation maintenance community
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Partner Card 1 */}
                        <div className="bg-white border border-black/10 rounded-[14px] p-8 relative">
                            <span className="absolute top-4 right-4 px-3 py-1 bg-[#f3f4f6] text-[#4a5565] text-xs rounded-full">
                                Sponsored
                            </span>
                            <div className="flex flex-col items-center text-center gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 bg-[#dbeafe] rounded-[10px] flex items-center justify-center">
                                        <span className="text-[#155dfc] text-lg">⚙️</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#101828]">AeroTech Solutions</h3>
                                </div>
                                <p className="text-[#364153]">
                                    Advanced diagnostic tools and predictive analytics for modern aircraft fleets.
                                </p>
                                <button className="w-full py-2 bg-[#155dfc] text-white text-sm rounded-lg flex items-center justify-center gap-2">
                                    Learn More
                                    <img alt="" className="size-4" src={imgIconArrowRightWhite2} />
                                </button>
                                <p className="text-xs text-[#6a7282]">
                                    Sponsored content. SkyMaintain does not endorse products.
                                </p>
                            </div>
                        </div>

                        {/* Partner Slot Available */}
                        <div className="bg-white border border-black/10 rounded-[14px] p-8">
                            <div className="flex flex-col items-center text-center gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 bg-[#e5e7eb] rounded-[10px] flex items-center justify-center">
                                        <span className="text-[#6a7282] text-lg">⚙️</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#6a7282]">Partner Slot Available</h3>
                                </div>
                                <p className="text-[#6a7282]">
                                    Join our network of industry partners and reach aviation maintenance professionals worldwide.
                                </p>
                                <button className="w-full py-2 bg-[#4a5565] text-white text-sm rounded-lg flex items-center justify-center gap-2">
                                    Become a Partner
                                    <img alt="" className="size-4" src={imgIconArrowRightWhite2} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-xs text-[#6a7282] mt-8 max-w-3xl mx-auto">
                        <span className="font-bold">Partner Disclosure: </span>
                        SkyMaintain displays sponsored partner content. Sponsorship does not influence AI responses, maintenance recommendations, or compliance assessments. All partnerships are reviewed for aviation industry relevance and quality standards.
                    </p>
                </section>

                {/* Compliance FAQ Section */}
                <section
                    className="py-12 px-6 bg-[#f9fafb]"
                    data-name="ComplianceFAQ"
                    data-node-id="11:8562"
                >
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-[#101828] mb-4">
                                Compliance &amp; Trust — Frequently Asked Questions
                            </h2>
                            <p className="text-lg text-[#4a5565]">
                                How SkyMaintain supports maintenance professionals safely, responsibly, and in line with regulations.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {/* Expanded FAQ Items */}
                            {[
                                {
                                    question: "Does SkyMaintain replace approved maintenance manuals?",
                                    answer: "No.\nSkyMaintain does not replace AMM, MEL, SRM, IPC, or any approved maintenance documentation.\n\nSkyMaintain works with the manuals you are authorized to use and assists by organizing, cross-referencing, and interpreting them. The manuals remain the sole technical authority.",
                                    expanded: true
                                },
                                {
                                    question: "Does SkyMaintain need FAA or EASA approval?",
                                    answer: "No.\nSkyMaintain is a maintenance decision-support tool, not a maintenance approval or certification system.\n\nIt does not issue approvals, certify work, modify aircraft configuration, or replace regulatory authority. Therefore, FAA or EASA approval is not required.",
                                    expanded: true
                                },
                                {
                                    question: "Can SkyMaintain give answers without manuals?",
                                    answer: "No.\nSkyMaintain enforces a strict \"No Docs, No Answer\" rule.\n\nIf no applicable, authorized manual is available, the SkyMaintain AI Mechanic's Assistant will refuse to answer and will instead tell the user which documents are required to proceed. However, it can still reference official regulatory sources (FAA, EASA, ICAO) for general compliance guidance.",
                                    expanded: true
                                },
                            ].map((faq, idx) => (
                                <div key={idx} className="bg-white border border-[#e5e7eb] rounded-[14px] overflow-hidden">
                                    <div className="flex items-center justify-between p-6">
                                        <h3 className="font-bold text-lg text-[#101828]">{faq.question}</h3>
                                        <img
                                            alt=""
                                            className="size-5 rotate-180"
                                            src={imgIconChevronUp}
                                        />
                                    </div>
                                    <div className="px-6 pb-6 pt-0">
                                        <div className="border-t border-[#e5e7eb] pt-4">
                                            <p className="text-[#364153] whitespace-pre-line">{faq.answer}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Collapsed FAQ Items */}
                            {[
                                "Where do the manuals come from?",
                                "Does SkyMaintain store or modify original manuals?",
                                "How does SkyMaintain ensure accuracy?",
                                "Who is responsible for the maintenance decision?",
                                "Can SkyMaintain be used in regulated airline or MRO environments?",
                                "Is SkyMaintain an AI chatbot?",
                                "What happens if the wrong document or revision is uploaded?",
                            ].map((question, idx) => (
                                <div key={idx} className="bg-white border border-[#e5e7eb] rounded-[14px]">
                                    <div className="flex items-center justify-between p-6">
                                        <h3 className="font-bold text-lg text-[#101828]">{question}</h3>
                                        <img alt="" className="size-5" src={imgIconChevronDown} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-8">
                            <span className="text-sm text-[#4a5565]">Have more questions? </span>
                            <Link href="/contact" className="text-[#155dfc] hover:underline">
                                Contact our compliance team
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section
                    className="py-24 px-32"
                    style={{ background: "linear-gradient(151deg, #155dfc 0%, #9810fa 50%, #432dd7 100%)" }}
                    data-name="Section"
                    data-node-id="11:8645"
                >
                    <div className="text-center">
                        <div className="size-20 mx-auto mb-8">
                            <img alt="" className="size-full" src={imgIconRocket} />
                        </div>
                        <h2 className="text-5xl font-bold text-white mb-6 max-w-xl mx-auto leading-tight">
                            Ready to Transform Your Maintenance Operations?
                        </h2>
                        <p className="text-xl text-[#dbeafe] mb-10 max-w-3xl mx-auto">
                            Join 50+ airlines and operators using SkyMaintain to improve safety, reduce costs, and ensure 100% regulatory compliance.
                        </p>
                        <div className="flex justify-center gap-4 mb-6">
                            <Link
                                href="/get-started"
                                className="flex items-center gap-2 px-6 py-3 bg-white text-[#155dfc] text-lg rounded-lg shadow-2xl hover:bg-gray-50 transition-colors"
                            >
                                Start Your Free Trial
                                <img alt="" className="size-5" src={imgIconArrowRightPurple} />
                            </Link>
                            <Link
                                href={CONTACT_DEMO}
                                className="px-10 py-3 bg-white text-[#155dfc] text-lg rounded-lg shadow-2xl hover:bg-gray-50 transition-colors"
                            >
                                Schedule a Demo
                            </Link>
                        </div>
                        <p className="text-sm text-[#bedbff]">
                            ✓ 14-day free trial • ✓ No credit card required • ✓ Full platform access
                        </p>
                    </div>
                </section>

                {/* Footer */}
                <footer
                    className="bg-[#101828] py-8 px-6"
                    data-name="Footer"
                    data-node-id="11:8665"
                >
                    <div className="grid grid-cols-4 gap-8 mb-8">
                        {/* Brand Column */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="size-9 bg-[#155dfc] rounded-[10px] flex items-center justify-center">
                                    <img alt="" className="size-5" src={imgVectorPlane} />
                                </div>
                                <span className="text-lg font-bold text-white">SkyMaintain</span>
                            </div>
                            <p className="text-sm text-[#99a1af]">
                                AI-powered aircraft maintenance platform ensuring safety, compliance, and efficiency.
                            </p>
                        </div>

                        {/* Product Column */}
                        <div>
                            <h4 className="font-bold text-white mb-4">Product</h4>
                            <ul className="space-y-2">
                                <li><Link href="/platform-features" className="text-[#d1d5dc] hover:text-white">Features</Link></li>
                                <li><Link href="/pricing" className="text-[#d1d5dc] hover:text-white">Pricing</Link></li>
                                <li><Link href="/security" className="text-[#d1d5dc] hover:text-white">Security</Link></li>
                            </ul>
                        </div>

                        {/* Company Column */}
                        <div>
                            <h4 className="font-bold text-white mb-4">Company</h4>
                            <ul className="space-y-2">
                                <li><Link href="/about" className="text-[#d1d5dc] hover:text-white">About Us</Link></li>
                                <li><Link href="/careers" className="text-[#d1d5dc] hover:text-white">Careers</Link></li>
                                <li><Link href="/contact" className="text-[#d1d5dc] hover:text-white">Contact</Link></li>
                            </ul>
                        </div>

                        {/* Legal Column */}
                        <div>
                            <h4 className="font-bold text-white mb-4">Legal</h4>
                            <ul className="space-y-2">
                                <li><Link href="/privacy" className="text-[#d1d5dc] hover:text-white">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="text-[#d1d5dc] hover:text-white">Terms of Service</Link></li>
                                <li><Link href="/compliance" className="text-[#d1d5dc] hover:text-white">Compliance</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-[#1e2939] pt-8 text-center space-y-2">
                        <p className="text-sm text-[#d1d5dc]">
                            © 2026 <span className="text-[#51a2ff]">SkyMaintain</span>. All Rights Reserved.
                        </p>
                        <p className="text-sm text-[#6a7282]">
                            SkyMaintain is a product of EncycloAMTs LLC.
                        </p>
                        <p className="text-sm text-[#6a7282]">
                            A Regulatory-Compliant Architecture for AI-Assisted Aircraft Maintenance Decision Support
                        </p>
                        <p className="text-xs text-[#6a7282] mt-4">
                            <span className="font-bold">Partner Disclosure: </span>
                            SkyMaintain displays sponsored partner content. Sponsorship does not influence AI responses, maintenance recommendations, or compliance assessments.
                        </p>
                    </div>
                </footer>
            </main>
        </div>
    );
}
