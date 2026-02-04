"use client";

import * as React from "react";

type BadgeVariant = "default" | "secondary" | "outline" | "destructive";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
    default: "bg-slate-900 text-white",
    secondary: "bg-slate-100 text-slate-900",
    outline: "border border-slate-300 text-slate-900",
    destructive: "bg-red-600 text-white",
};

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ className = "", variant = "default", children, ...props }, ref) => {
        const baseStyles =
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";

        const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

        return (
            <div ref={ref} className={combinedClassName} {...props}>
                {children}
            </div>
        );
    }
);

Badge.displayName = "Badge";
