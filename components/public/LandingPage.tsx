/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card } from "@/app/components/ui/card";
import {
    Plane,
    Brain,
    Shield,
    Activity,
    CheckCircle2,
    TrendingUp,
    Clock,
    DollarSign,
    Award,
    Users,
    ArrowRight,
    BarChart3,
    FileText,
    Bell,
    Star,
    Quote,
} from "lucide-react";

// SkyMaintain logo - using existing logo
const skyMaintainLogo = "/brand/SkyMaintain_logo.png";

interface LandingPageProps {
    onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
    const features = [
        {
            icon: <Brain className="size-8 text-blue-600" />,
            title: "AI-Powered Predictive Maintenance",
            description:
                "Predict maintenance needs before failures occur with advanced machine learning algorithms analyzing system health patterns.",
        },
        {
            icon: <Shield className="size-8 text-green-600" />,
            title: "Seamless Regulatory Compliance",
            description:
                "Automated tracking of Airworthiness Directives and Service Bulletins with real-time alerts and compliance deadlines.",
        },
        {
            icon: <Activity className="size-8 text-purple-600" />,
            title: "Real-Time Fleet Monitoring",
            description:
                "Continuous monitoring of aircraft health with IoT sensor integration providing instant visibility into system performance.",
        },
        {
            icon: <CheckCircle2 className="size-8 text-orange-600" />,
            title: "Smart Task Management",
            description:
                "Priority-based task sorting with interactive checklists, photo documentation, and AI-driven recommendations.",
        },
        {
            icon: <FileText className="size-8 text-indigo-600" />,
            title: "Document Version Control",
            description:
                "Enterprise-grade document management with full version history, change tracking, and compliance audit trails.",
        },
        {
            icon: <TrendingUp className="size-8 text-teal-600" />,
            title: "Cost Optimization Insights",
            description:
                "Data-driven recommendations to reduce maintenance costs while improving safety and operational efficiency.",
        },
    ];

    const benefits = [
        {
            icon: <Clock className="size-6 text-blue-600" />,
            stat: "35%",
            label: "Reduction in Unplanned Downtime",
        },
        {
            icon: <DollarSign className="size-6 text-green-600" />,
            stat: "$250K",
            label: "Average Annual Cost Savings",
        },
        {
            icon: <CheckCircle2 className="size-6 text-purple-600" />,
            stat: "99.8%",
            label: "Compliance Rate Achieved",
        },
        {
            icon: <Users className="size-6 text-orange-600" />,
            stat: "500+",
            label: "Aircraft Under Management",
        },
    ];

    const testimonials = [
        {
            name: "Michael Rodriguez",
            role: "Director of Maintenance, Global Airways",
            company: "Global Airways",
            quote:
                "SkyMaintain transformed our maintenance operations. The predictive insights helped us avoid two major engine failures, saving us over $400,000 in emergency repairs and downtime.",
            rating: 5,
        },
        {
            name: "Sarah Chen",
            role: "Fleet Manager, Pacific Aviation",
            company: "Pacific Aviation",
            quote:
                "The compliance tracking alone is worth it. We've never missed an AD deadline since implementing SkyMaintain, and our audit process is now seamless.",
            rating: 5,
        },
        {
            name: "James Thompson",
            role: "Chief Engineer, SkyFleet Services",
            company: "SkyFleet Services",
            quote:
                "The AI recommendations are incredibly accurate. We've optimized our maintenance intervals and reduced costs by 30% while actually improving safety metrics.",
            rating: 5,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Navigation Header */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                src={skyMaintainLogo}
                                alt="SkyMaintain Logo"
                                className="h-12 w-auto"
                            />
                            <div>
                                <h1 className="text-xl font-bold">SkyMaintain</h1>
                                <p className="text-xs text-gray-600">
                                    AI-Powered Aircraft Maintenance
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" onClick={onGetStarted}>
                                Sign In
                            </Button>
                            <Button
                                onClick={onGetStarted}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Get Started
                                <ArrowRight className="size-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background Image with Overlay */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-10"
                    style={{
                        backgroundImage:
                            'url("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920")',
                    }}
                ></div>

                <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Column - Text Content */}
                        <div>
                            <Badge className="mb-6 bg-blue-100 text-blue-700 px-4 py-2 text-sm">
                                <Star className="size-4 mr-2" />
                                Trusted by 50+ Airlines & Operators
                            </Badge>
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                                AI-Driven Aircraft Maintenance for a{" "}
                                <span className="text-blue-600">Safer, More Efficient</span>{" "}
                                Fleet
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                Streamline inspections, ensure regulatory compliance, and
                                predict maintenance needs before they become costly problems.
                                SkyMaintain revolutionizes aircraft maintenance with predictive
                                AI.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button
                                    size="lg"
                                    onClick={onGetStarted}
                                    className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6"
                                >
                                    Start Free Trial
                                    <ArrowRight className="size-5 ml-2" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="text-lg px-8 py-6"
                                >
                                    Request Demo
                                </Button>
                            </div>
                            <p className="text-sm text-gray-500 mt-4">
                                ✓ No credit card required • ✓ 14-day free trial • ✓ Cancel
                                anytime
                            </p>
                        </div>

                        {/* Right Column - Dashboard Preview */}
                        <div className="relative">
                            <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 p-6 transform hover:scale-105 transition-transform duration-300">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="size-3 rounded-full bg-red-500"></div>
                                    <div className="size-3 rounded-full bg-yellow-500"></div>
                                    <div className="size-3 rounded-full bg-green-500"></div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                                        <Brain className="size-8 text-blue-600" />
                                        <div className="flex-1">
                                            <div className="text-sm font-semibold mb-1">
                                                AI Predictive Alert
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                Engine #2 requires inspection in 150 FH
                                            </div>
                                        </div>
                                        <Badge className="bg-orange-100 text-orange-700 text-xs">
                                            87% Confidence
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-4 bg-green-50 rounded-lg">
                                            <div className="text-2xl font-bold mb-1">92%</div>
                                            <div className="text-xs text-gray-600">
                                                Fleet Health
                                            </div>
                                        </div>
                                        <div className="p-4 bg-blue-50 rounded-lg">
                                            <div className="text-2xl font-bold mb-1">24</div>
                                            <div className="text-xs text-gray-600">
                                                Active Tasks
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                                        <BarChart3 className="size-16 text-blue-600/30" />
                                    </div>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute -top-6 -right-6 bg-green-500 text-white p-4 rounded-lg shadow-lg animate-bounce">
                                <CheckCircle2 className="size-6" />
                            </div>
                            <div className="absolute -bottom-6 -left-6 bg-purple-500 text-white p-4 rounded-lg shadow-lg">
                                <Bell className="size-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-white py-16 border-y border-gray-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="text-center">
                                <div className="inline-flex items-center justify-center p-3 bg-gray-50 rounded-lg mb-4">
                                    {benefit.icon}
                                </div>
                                <div className="text-3xl font-bold mb-2">{benefit.stat}</div>
                                <div className="text-sm text-gray-600">{benefit.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-blue-100 text-blue-700 px-4 py-2">
                            Platform Features
                        </Badge>
                        <h2 className="text-4xl font-bold mb-6">
                            Everything You Need for Modern Aircraft Maintenance
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            SkyMaintain combines cutting-edge AI technology with
                            industry-leading compliance tools to deliver a comprehensive
                            maintenance platform.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <Card
                                key={index}
                                className="p-6 hover:shadow-xl transition-shadow border-2 border-gray-100 hover:border-blue-200"
                            >
                                <div className="mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-white/20 text-white px-4 py-2">
                            Customer Success Stories
                        </Badge>
                        <h2 className="text-4xl font-bold mb-6">
                            Trusted by Aviation Professionals Worldwide
                        </h2>
                        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                            Join hundreds of maintenance teams using SkyMaintain to improve
                            safety, reduce costs, and ensure compliance.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <Card
                                key={index}
                                className="p-6 bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-colors"
                            >
                                <Quote className="size-8 text-blue-200 mb-4" />
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="size-5 fill-yellow-400 text-yellow-400"
                                        />
                                    ))}
                                </div>
                                <p className="text-white/90 mb-6 leading-relaxed italic">
                                    &quot;{testimonial.quote}&quot;
                                </p>
                                <div className="border-t border-white/20 pt-4">
                                    <div className="text-white font-semibold mb-1">{testimonial.name}</div>
                                    <div className="text-sm text-blue-200">
                                        {testimonial.role}
                                    </div>
                                    <div className="text-sm text-blue-300">
                                        {testimonial.company}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-12 text-white shadow-2xl">
                        <Award className="size-16 mx-auto mb-6 text-yellow-300" />
                        <h2 className="text-4xl font-bold mb-6">
                            Ready to Transform Your Maintenance Operations?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Start your free 14-day trial today. No credit card required.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Button
                                size="lg"
                                onClick={onGetStarted}
                                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
                            >
                                Start Free Trial
                                <ArrowRight className="size-5 ml-2" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white text-white hover:bg-white/10 text-lg px-8 py-6"
                            >
                                Schedule Demo
                            </Button>
                        </div>
                        <p className="text-sm text-blue-200 mt-6">
                            Join 50+ airlines and operators already using SkyMaintain
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <Plane className="size-5 text-white" />
                                </div>
                                <span className="text-white text-lg font-bold">SkyMaintain</span>
                            </div>
                            <p className="text-sm text-gray-400">
                                AI-powered aircraft maintenance platform ensuring safety,
                                compliance, and efficiency.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Pricing
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Demo
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Careers
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Terms of Service
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Security
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-sm">
                        <p>
                            © {new Date().getFullYear()}{" "}
                            <span className="text-blue-400">SkyMaintain</span>. All Rights
                            Reserved.
                        </p>
                        <p className="text-gray-500 mt-2">
                            Regulatory-Compliant Aircraft Maintenance Platform
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
