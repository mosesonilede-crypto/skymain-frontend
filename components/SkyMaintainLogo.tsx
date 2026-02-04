import Image from "next/image";
import Link from "next/link";
import * as React from "react";

type Props = {
    /** Where clicking the logo should go */
    href?: string;
    /** Show the wordmark text or icon only */
    showText?: boolean;
    /** Optional small subtitle (e.g., v1.0) */
    subtitle?: string;
    /** Control icon size */
    size?: "sm" | "md" | "lg";
    /** Optional className for the container */
    className?: string;
    /** Optional className for the text block */
    textClassName?: string;
};

const SIZE: Record<NonNullable<Props["size"]>, number> = {
    sm: 28,
    md: 36,
    lg: 44,
};

export default function SkyMaintainLogo({
    href = "/",
    showText = true,
    subtitle,
    size = "md",
    className = "",
    textClassName = "",
}: Props) {
    const px = SIZE[size];

    const content = (
        <div className={`flex items-center gap-3 ${className}`}>
            <div
                className="relative shrink-0"
                style={{ width: px, height: px }}
                aria-hidden="true"
            >
                <Image
                    src="/brand/skymaintain-logo.png"
                    alt="SkyMaintain"
                    fill
                    sizes={`${px}px`}
                    className="object-contain"
                    priority
                />
            </div>

            {showText ? (
                <div className={`leading-tight ${textClassName}`}>
                    <div className="text-base font-semibold tracking-tight text-slate-900">
                        SkyMaintain
                    </div>
                    {subtitle ? (
                        <div className="text-xs text-slate-500">{subtitle}</div>
                    ) : null}
                </div>
            ) : null}
        </div>
    );

    return (
        <Link href={href} className="inline-flex items-center focus:outline-none">
            {content}
        </Link>
    );
}
