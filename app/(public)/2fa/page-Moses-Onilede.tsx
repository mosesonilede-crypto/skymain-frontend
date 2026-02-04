/**
 * @skymain.design
 * fileKey: qz3ERP8jfbTpTHQrdPSawI
 * nodeId: 1:1209
 * specHash: sha256:2fa-page-v2
 */

/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Figma Asset Icons - Matches node 1:1209
const imgIcon = "https://www.figma.com/api/mcp/asset/9c3fa5a7-660e-4d76-b9e5-8e96a56ba7c3"; // Shield icon
const imgIcon1 = "https://www.figma.com/api/mcp/asset/a6738c54-5fd6-45c7-9200-1f92c6cfa2ca"; // Email icon
const imgIcon2 = "https://www.figma.com/api/mcp/asset/9d4108fb-82fe-46d9-9a6e-60a75043afbb"; // Check icon
const imgIcon3 = "https://www.figma.com/api/mcp/asset/c1608d7e-3bea-4a63-976a-cd96ca2d1047"; // SMS icon
const imgIcon4 = "https://www.figma.com/api/mcp/asset/88f9226b-f3f4-40fc-a9a3-f7f330e0c65c"; // Authenticator icon
const imgIcon5 = "https://www.figma.com/api/mcp/asset/f40bfbc9-07e7-4ff0-a134-938637a838b6"; // Mail sent icon
const imgIcon6 = "https://www.figma.com/api/mcp/asset/e3ef1256-5689-4f7f-9ee4-eed916db120c"; // Back arrow icon
const imgIcon7 = "https://www.figma.com/api/mcp/asset/efe5d915-e477-4747-a7c3-1b014faae400"; // Security tip icon

type OtpMethod = "email" | "sms" | "auth";
type DataMode = "mock" | "live" | "hybrid";
type SendStatus = "idle" | "sending" | "sent" | "error";
type VerifyStatus = "idle" | "success" | "error";

// Storage key for session-specific mock OTP
const MOCK_OTP_KEY = "skymaintain.sessionMockOTP";
const SESSION_ID_KEY = "skymaintain.sessionId";

function getDataMode(): DataMode {
    const raw = (process.env.NEXT_PUBLIC_DATA_MODE || "mock").toLowerCase();
    if (raw === "live" || raw === "hybrid" || raw === "mock") return raw;
    return "mock";
}

// Generate a random 6-digit OTP
function generateMockOtp(): string {
    return String(Math.floor(100000 + Math.random() * 900000));
}

// Generate a unique session ID
function generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Get or create session-specific mock OTP
function getSessionMockOtp(): string {
    if (typeof window === "undefined") return "123456";

    const storedSessionId = sessionStorage.getItem(SESSION_ID_KEY);
    const storedOtp = sessionStorage.getItem(MOCK_OTP_KEY);

    // If we have a valid session OTP, return it
    if (storedSessionId && storedOtp) {
        return storedOtp;
    }

    // Generate new session ID and OTP for this login session
    const newSessionId = generateSessionId();
    const newOtp = generateMockOtp();

    sessionStorage.setItem(SESSION_ID_KEY, newSessionId);
    sessionStorage.setItem(MOCK_OTP_KEY, newOtp);

    return newOtp;
}

// Clear session OTP on successful verification (for next login)
function clearSessionMockOtp(): void {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(SESSION_ID_KEY);
    sessionStorage.removeItem(MOCK_OTP_KEY);
}

export default function TwoFactorPage() {
    const router = useRouter();
    const dataMode = useMemo(() => getDataMode(), []);

    // State - use lazy initialization for client-side values
    const [method, setMethod] = useState<OtpMethod>("email");
    const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
    const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>("idle");
    const [sendStatus, setSendStatus] = useState<SendStatus>("idle");
    const [resendTimer, setResendTimer] = useState(53);
    const [apiError, setApiError] = useState<string | null>(null);

    // User info - lazy initialization from localStorage
    const [email, setEmail] = useState(() => {
        if (typeof window === "undefined") return "";
        return localStorage.getItem("skymaintain.userEmail") || "";
    });
    const [phone, setPhone] = useState(() => {
        if (typeof window === "undefined") return "";
        return localStorage.getItem("skymaintain.userPhone") || "";
    });

    // Mock OTP - generated fresh each session using lazy initialization
    const [mockOtp] = useState(() => getSessionMockOtp());
    const [serverMockCode, setServerMockCode] = useState<string | null>(null);

    // Authenticator setup
    const [setupSecret, setSetupSecret] = useState<string | null>(null);

    // Track previous method for change detection
    const prevMethodRef = useRef<OtpMethod>(method);

    // Refs
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const emailInputRef = useRef<HTMLInputElement>(null);
    const phoneInputRef = useRef<HTMLInputElement>(null);

    // Save phone to localStorage
    useEffect(() => {
        if (typeof window === "undefined" || !phone) return;
        localStorage.setItem("skymaintain.userPhone", phone);
    }, [phone]);

    // Resend countdown timer
    useEffect(() => {
        if (resendTimer <= 0) return;
        const interval = setInterval(() => {
            setResendTimer((prev) => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(interval);
    }, [resendTimer]);

    // Redirect on successful verification
    useEffect(() => {
        if (verifyStatus !== "success") return;
        const timeout = setTimeout(() => {
            clearSessionMockOtp(); // Clear so next login gets new OTP
            router.push("/app");
        }, 900);
        return () => clearTimeout(timeout);
    }, [verifyStatus, router]);

    // Method change handler - reset state when method changes
    const handleMethodChange = useCallback((newMethod: OtpMethod) => {
        if (newMethod === method) return;

        // Reset all related state
        setDigits(Array(6).fill(""));
        setVerifyStatus("idle");
        setResendTimer(53);
        setApiError(null);
        setSendStatus("idle");
        setServerMockCode(null);
        setSetupSecret(null);
        setMethod(newMethod);
    }, [method]);

    // Handle authenticator setup when method is auth
    useEffect(() => {
        if (method !== "auth") return;

        // Setup authenticator
        fetch("/api/2fa/auth/setup", { method: "POST" })
            .then((res) => res.json())
            .then((data) => {
                if (data?.secret) setSetupSecret(data.secret);
            })
            .catch(() => null);
    }, [method]);

    // Focus appropriate input when method changes
    useEffect(() => {
        // Skip initial render
        if (prevMethodRef.current === method) {
            prevMethodRef.current = method;
            return;
        }
        prevMethodRef.current = method;

        // Focus appropriate input
        if (method === "email" && !email) {
            emailInputRef.current?.focus();
        } else if (method === "sms" && !phone) {
            phoneInputRef.current?.focus();
        } else {
            inputRefs.current[0]?.focus();
        }
    }, [method, email, phone]);

    // Masked destination display
    const maskedDestination = useMemo(() => {
        if (method === "sms") return phone || "+1 (***) ***-**42";
        if (method === "auth") return "your authenticator app";
        return email || "manager@skywings.com";
    }, [method, email, phone]);

    // Validation helpers
    const isValidEmail = (value: string) => /.+@.+\..+/.test(value.trim());
    const normalizePhone = (value: string) => value.replace(/[\s()-]/g, "").trim();
    const isValidPhone = (value: string) => /^\+\d{8,15}$/.test(normalizePhone(value));

    // Send OTP to destination
    const sendOtp = useCallback(async (destination: string) => {
        setApiError(null);
        setSendStatus("sending");

        try {
            const res = await fetch("/api/2fa/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ method, destination }),
            });

            const data = await res.json().catch(() => ({}));

            if (res.ok && data?.ok) {
                setSendStatus("sent");
                if (data?.mockCode) {
                    setServerMockCode(data.mockCode);
                }
                inputRefs.current[0]?.focus();
                return;
            }

            setSendStatus("error");
            setApiError(data?.error || "Unable to send code.");
        } catch {
            setSendStatus("error");
            setApiError("Unable to send code. Check your connection and try again.");
        }
    }, [method]);

    // Handle digit input
    const handleDigitChange = (index: number, value: string) => {
        if (!/^[0-9]*$/.test(value)) return;

        const newDigits = [...digits];
        newDigits[index] = value.slice(-1);
        setDigits(newDigits);

        // Auto-advance to next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handle backspace
    const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Backspace" && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Handle paste
    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (!pasted) return;

        const newDigits = Array.from({ length: 6 }, (_, i) => pasted[i] || "");
        setDigits(newDigits);

        const lastIndex = Math.min(pasted.length, 6) - 1;
        if (lastIndex >= 0) inputRefs.current[lastIndex]?.focus();

        event.preventDefault();
    };

    // Verify the entered code
    const handleVerify = async () => {
        const code = digits.join("");
        if (code.length < 6) {
            setVerifyStatus("error");
            return;
        }

        setApiError(null);

        // Check against session mock OTP first (dev/testing mode)
        if (dataMode !== "live" && code === mockOtp) {
            setVerifyStatus("success");
            return;
        }

        try {
            const res = await fetch("/api/2fa/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    method,
                    code,
                    destination: method === "email" ? email : method === "sms" ? phone : undefined,
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (res.ok && data?.ok) {
                setVerifyStatus("success");
                if (data?.mockCode) setServerMockCode(data.mockCode);
                return;
            }

            setApiError(data?.error || "Unable to verify code.");
            setVerifyStatus("error");
        } catch {
            setApiError("Verification failed. Please try again.");
            setVerifyStatus("error");
        }
    };

    // Send code button handler
    const handleSendCode = async () => {
        if (method === "auth") return;

        const destination = method === "email" ? email : phone;

        if (!destination) {
            setApiError("Enter a valid delivery address.");
            setSendStatus("error");
            return;
        }

        if (method === "email" && !isValidEmail(destination)) {
            setApiError("Enter a valid email address.");
            setSendStatus("error");
            return;
        }

        if (method === "sms") {
            const normalized = normalizePhone(destination);
            if (!isValidPhone(normalized)) {
                setApiError("Enter a phone number in +15551234567 format.");
                setSendStatus("error");
                return;
            }
            await sendOtp(normalized);
            return;
        }

        await sendOtp(destination);
    };

    // Resend handler
    const handleResend = async () => {
        if (resendTimer > 0) return;

        setResendTimer(53);
        setDigits(Array(6).fill(""));
        setVerifyStatus("idle");
        setApiError(null);
        setSendStatus("idle");
        inputRefs.current[0]?.focus();

        if (method === "auth") return;

        const destination = method === "email" ? email : phone;
        if (!destination) {
            setApiError("Enter a valid delivery address.");
            return;
        }

        await sendOtp(method === "sms" ? normalizePhone(destination) : destination);
    };

    // Apply mock code to inputs
    const applyMockCode = () => {
        const codeToApply = serverMockCode || mockOtp;
        const newDigits = Array.from({ length: 6 }, (_, i) => codeToApply[i] || "");
        setDigits(newDigits);
        inputRefs.current[5]?.focus();
    };

    return (
        <div
            className="flex min-h-dvh items-center justify-center px-4 py-8"
            style={{
                background: "linear-gradient(131deg, #eff6ff 0%, #dbeafe 100%)",
            }}
            data-name="2FA Page"
            data-node-id="1:1209"
        >
            <div className="w-full max-w-[448px]" data-name="Container" data-node-id="1:1210">
                {/* Header Section - Matches Figma node 1:1211 */}
                <div className="flex flex-col items-center text-center" data-name="Container" data-node-id="1:1211">
                    {/* Shield Icon */}
                    <div
                        className="flex h-16 w-16 items-center justify-center rounded-2xl"
                        style={{ backgroundColor: "#155dfc" }}
                        data-name="Container"
                        data-node-id="1:1212"
                    >
                        <img src={imgIcon} alt="" className="h-10 w-10" data-name="Icon" data-node-id="1:1213" />
                    </div>

                    {/* Title */}
                    <h1
                        className="mt-5 text-[30px] font-normal leading-9"
                        style={{ color: "#0a0a0a" }}
                        data-node-id="1:1216"
                    >
                        Two-Factor Authentication
                    </h1>

                    {/* Subtitle */}
                    <p
                        className="mt-3 text-base leading-6"
                        style={{ color: "#4a5565" }}
                        data-node-id="1:1218"
                    >
                        Verify your identity to continue
                    </p>
                </div>

                {/* Method Selection Card - Matches Figma node 1:1219 */}
                <div
                    className="mt-8 flex flex-col gap-9 rounded-[14px] bg-white px-6 py-6"
                    style={{ border: "0.8px solid rgba(0,0,0,0.1)" }}
                    data-name="Card"
                    data-node-id="1:1219"
                >
                    <p className="text-sm leading-5" style={{ color: "#0a0a0a" }} data-node-id="1:1221">
                        Choose Verification Method:
                    </p>

                    <div className="flex flex-col gap-2" data-name="VerificationScreen" data-node-id="1:1222">
                        {/* Email OTP Option */}
                        <button
                            type="button"
                            onClick={() => handleMethodChange("email")}
                            className="flex items-center gap-3 rounded-[10px] px-3 py-3"
                            style={{
                                backgroundColor: method === "email" ? "#eff6ff" : "transparent",
                                border: method === "email" ? "0.8px solid #2b7fff" : "0.8px solid #e5e7eb",
                            }}
                            data-name="Button"
                            data-node-id="1:1223"
                        >
                            <img src={imgIcon1} alt="" className="h-5 w-5" data-name="Icon" data-node-id="1:1224" />
                            <div className="flex flex-1 flex-col items-start" data-name="Container" data-node-id="1:1227">
                                <span className="text-sm leading-5" style={{ color: "#0a0a0a" }} data-node-id="1:1229">
                                    Email OTP
                                </span>
                                <span className="text-xs leading-4" style={{ color: "#6a7282" }} data-node-id="1:1231">
                                    Receive code via email
                                </span>
                            </div>
                            {method === "email" && (
                                <img src={imgIcon2} alt="" className="h-5 w-5" data-name="Icon" data-node-id="1:1232" />
                            )}
                        </button>

                        {/* SMS OTP Option */}
                        <button
                            type="button"
                            onClick={() => handleMethodChange("sms")}
                            className="flex items-center gap-3 rounded-[10px] px-3 py-3"
                            style={{
                                backgroundColor: method === "sms" ? "#eff6ff" : "transparent",
                                border: method === "sms" ? "0.8px solid #2b7fff" : "0.8px solid #e5e7eb",
                            }}
                            data-name="Button"
                            data-node-id="1:1235"
                        >
                            <img src={imgIcon3} alt="" className="h-5 w-5" data-name="Icon" data-node-id="1:1236" />
                            <div className="flex flex-1 flex-col items-start" data-name="Container" data-node-id="1:1239">
                                <span className="text-sm leading-5" style={{ color: "#0a0a0a" }} data-node-id="1:1241">
                                    SMS OTP
                                </span>
                                <span className="text-xs leading-4" style={{ color: "#6a7282" }} data-node-id="1:1243">
                                    Receive code via text message
                                </span>
                            </div>
                            {method === "sms" && (
                                <img src={imgIcon2} alt="" className="h-5 w-5" />
                            )}
                        </button>

                        {/* Authenticator Option */}
                        <button
                            type="button"
                            onClick={() => handleMethodChange("auth")}
                            className="flex items-center gap-3 rounded-[10px] px-3 py-3"
                            style={{
                                backgroundColor: method === "auth" ? "#eff6ff" : "transparent",
                                border: method === "auth" ? "0.8px solid #2b7fff" : "0.8px solid #e5e7eb",
                            }}
                            data-name="Button"
                            data-node-id="1:1244"
                        >
                            <img src={imgIcon4} alt="" className="h-5 w-5" data-name="Icon" data-node-id="1:1245" />
                            <div className="flex flex-1 flex-col items-start" data-name="Container" data-node-id="1:1249">
                                <span className="text-sm leading-5" style={{ color: "#0a0a0a" }} data-node-id="1:1251">
                                    Authenticator
                                </span>
                                <span className="text-xs leading-4" style={{ color: "#6a7282" }} data-node-id="1:1253">
                                    Use authenticator app
                                </span>
                            </div>
                            {method === "auth" && (
                                <img src={imgIcon2} alt="" className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    {/* Email/Phone Input Fields */}
                    {method === "email" && (
                        <div className="flex flex-col gap-2">
                            <label className="text-xs" style={{ color: "#4a5565" }}>
                                Email address
                            </label>
                            <input
                                ref={emailInputRef}
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setApiError(null);
                                    setSendStatus("idle");
                                }}
                                placeholder="name@company.com"
                                className="h-10 w-full rounded-lg px-3 text-sm"
                                style={{ backgroundColor: "#f3f3f5", color: "#0a0a0a" }}
                            />
                            <button
                                type="button"
                                onClick={handleSendCode}
                                disabled={sendStatus === "sending"}
                                className="mt-2 h-9 w-full rounded-lg text-sm text-white disabled:opacity-50"
                                style={{ backgroundColor: "#155dfc" }}
                            >
                                {sendStatus === "sending" ? "Sending..." : "Send Code"}
                            </button>
                        </div>
                    )}

                    {method === "sms" && (
                        <div className="flex flex-col gap-2">
                            <label className="text-xs" style={{ color: "#4a5565" }}>
                                Mobile number
                            </label>
                            <input
                                ref={phoneInputRef}
                                type="tel"
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value);
                                    setApiError(null);
                                    setSendStatus("idle");
                                }}
                                placeholder="+15551234567"
                                className="h-10 w-full rounded-lg px-3 text-sm"
                                style={{ backgroundColor: "#f3f3f5", color: "#0a0a0a" }}
                            />
                            <p className="text-[11px]" style={{ color: "#6a7282" }}>
                                Use E.164 format with country code (e.g., +15551234567)
                            </p>
                            <button
                                type="button"
                                onClick={handleSendCode}
                                disabled={sendStatus === "sending"}
                                className="mt-2 h-9 w-full rounded-lg text-sm text-white disabled:opacity-50"
                                style={{ backgroundColor: "#155dfc" }}
                            >
                                {sendStatus === "sending" ? "Sending..." : "Send Code"}
                            </button>
                        </div>
                    )}
                </div>

                {/* Code Entry Card - Matches Figma node 1:1254 */}
                <div
                    className="mt-4 rounded-[14px] bg-white px-8 py-8"
                    style={{ border: "0.8px solid rgba(0,0,0,0.1)" }}
                    data-name="Card"
                    data-node-id="1:1254"
                >
                    {/* Sent Icon & Message - Matches Figma node 1:1255 */}
                    <div className="flex flex-col items-center text-center" data-name="VerificationScreen" data-node-id="1:1255">
                        <div
                            className="flex h-9 w-9 items-center justify-center rounded-full"
                            style={{ backgroundColor: "#dbeafe" }}
                            data-name="Container"
                            data-node-id="1:1256"
                        >
                            <img src={imgIcon5} alt="" className="h-5 w-5" data-name="Icon" data-node-id="1:1257" />
                        </div>
                        <p className="mt-3 text-sm leading-5" style={{ color: "#4a5565" }} data-node-id="1:1261">
                            {method === "auth"
                                ? "Open your authenticator app to get your code"
                                : `We sent a code to ${maskedDestination}`}
                        </p>
                        {method === "auth" && setupSecret && (
                            <div className="mt-3 rounded-lg bg-gray-100 px-3 py-2 text-xs" style={{ color: "#364153" }}>
                                Setup key: <span className="font-semibold">{setupSecret}</span>
                            </div>
                        )}
                    </div>

                    {/* 6-Digit Code Input - Matches Figma node 1:1262 */}
                    <div className="mt-12 flex flex-col items-center gap-3" data-name="VerificationScreen" data-node-id="1:1262">
                        <p className="text-sm leading-[14px]" style={{ color: "#0a0a0a" }} data-node-id="1:1264">
                            Enter 6-digit code
                        </p>
                        <div className="flex justify-center gap-2" data-name="Container" data-node-id="1:1265">
                            {digits.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { inputRefs.current[index] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleDigitChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    className="h-14 w-12 rounded-lg text-center text-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    style={{ backgroundColor: "#f3f3f5", color: "#0a0a0a" }}
                                    aria-label={`Digit ${index + 1}`}
                                    data-name="Input"
                                    data-node-id={`1:126${6 + index}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Demo Mode Box - Matches Figma node 1:1272 */}
                    {dataMode !== "live" && (
                        <div
                            className="mt-8 flex flex-col gap-1 rounded-[10px] px-3 py-3"
                            style={{
                                backgroundColor: "#fefce8",
                                border: "0.8px solid #fff085",
                            }}
                            data-name="VerificationScreen"
                            data-node-id="1:1272"
                        >
                            <div className="flex items-center gap-1" data-name="Paragraph" data-node-id="1:1273">
                                <span className="text-xs font-bold" style={{ color: "#894b00" }} data-node-id="1:1275">
                                    Demo Mode:
                                </span>
                                <span className="text-xs" style={{ color: "#894b00" }} data-node-id="1:1276">
                                    Use this code for testing
                                </span>
                            </div>
                            <div className="flex items-center justify-center gap-2" data-name="Container" data-node-id="1:1277">
                                <button
                                    type="button"
                                    onClick={applyMockCode}
                                    className="flex items-center justify-center rounded-lg px-4 py-1.5 text-lg text-white transition-transform hover:scale-105"
                                    style={{ backgroundColor: "#d08700" }}
                                    data-name="Badge"
                                    data-node-id="1:1278"
                                    title="Click to use this code"
                                >
                                    {serverMockCode || mockOtp}
                                </button>
                            </div>
                            <p className="mt-1 text-center text-[10px]" style={{ color: "#894b00" }}>
                                Code changes each login session
                            </p>
                        </div>
                    )}

                    {/* Error Message */}
                    {apiError && (
                        <div
                            className="mt-4 rounded-lg p-3"
                            style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}
                        >
                            <p className="text-xs" style={{ color: "#b42318" }}>
                                {apiError}
                            </p>
                        </div>
                    )}

                    {/* Status Messages */}
                    {sendStatus === "sent" && !apiError && method !== "auth" && (
                        <p className="mt-4 text-center text-xs" style={{ color: "#016630" }}>
                            Code sent. Check your {method === "email" ? "email" : "phone"}.
                        </p>
                    )}

                    {/* Verify Button - Matches Figma node 1:1280 */}
                    <button
                        type="button"
                        onClick={handleVerify}
                        className="mt-8 flex h-9 w-full items-center justify-center rounded-lg text-sm text-white"
                        style={{ backgroundColor: "#030213" }}
                        data-name="Button"
                        data-node-id="1:1280"
                    >
                        Verify Code
                    </button>

                    {/* Verification Status */}
                    {verifyStatus !== "idle" && (
                        <p
                            className="mt-3 text-center text-xs"
                            style={{ color: verifyStatus === "success" ? "#016630" : "#b42318" }}
                        >
                            {verifyStatus === "success"
                                ? "Code verified. Redirecting..."
                                : "Invalid code. Please try again."}
                        </p>
                    )}

                    {/* Resend Timer - Matches Figma node 1:1282 */}
                    <div className="mt-6 text-center" data-name="VerificationScreen" data-node-id="1:1282">
                        {resendTimer > 0 ? (
                            <p className="text-sm leading-5" style={{ color: "#6a7282" }} data-node-id="1:1283">
                                Resend code in{" "}
                                <span style={{ color: "#155dfc" }} data-node-id="1:1285">
                                    {resendTimer}s
                                </span>
                            </p>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResend}
                                className="text-sm"
                                style={{ color: "#155dfc" }}
                            >
                                Resend code
                            </button>
                        )}
                    </div>

                    {/* Back to Login - Matches Figma node 1:1286 */}
                    <div
                        className="mt-12 pt-6"
                        style={{ borderTop: "0.8px solid rgba(0,0,0,0.1)" }}
                        data-name="VerificationScreen"
                        data-node-id="1:1286"
                    >
                        <Link
                            href="/signin"
                            className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-white text-sm"
                            style={{ border: "0.8px solid rgba(0,0,0,0.1)", color: "#0a0a0a" }}
                            data-name="Button"
                            data-node-id="1:1287"
                        >
                            <img src={imgIcon6} alt="" className="h-4 w-4" data-name="Icon" data-node-id="1:1288" />
                            Back to Login
                        </Link>
                    </div>
                </div>

                {/* Security Tip Banner - Matches Figma node 1:1292 */}
                <div
                    className="mt-4 rounded-[14px] px-4 py-4"
                    style={{
                        backgroundColor: "#f0fdf4",
                        border: "0.8px solid #b9f8cf",
                    }}
                    data-name="Card"
                    data-node-id="1:1292"
                >
                    <div className="flex items-start gap-2" data-name="VerificationScreen" data-node-id="1:1293">
                        <img src={imgIcon7} alt="" className="mt-0.5 h-4 w-4" data-name="Icon" data-node-id="1:1294" />
                        <p className="text-xs leading-4" style={{ color: "#016630" }} data-node-id="1:1299">
                            <span className="font-bold" data-node-id="1:1298">Security Tip: </span>
                            Never share your verification code with anyone. SkyMaintain staff will never ask for your OTP.
                        </p>
                    </div>
                </div>

                {/* Footer - Matches Figma node 1:1300 */}
                <p
                    className="mt-8 text-center text-sm leading-5"
                    style={{ color: "#4a5565" }}
                    data-name="Container"
                    data-node-id="1:1300"
                >
                    Powered by SkyMaintain v1.0
                </p>
            </div>
        </div>
    );
}
