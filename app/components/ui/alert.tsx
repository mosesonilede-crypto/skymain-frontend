"use client";

import * as React from "react";

type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "destructive";
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    ({ className = "", variant = "default", children, ...props }, ref) => {
        const baseStyles = "relative w-full rounded-lg border p-4";
        const variantStyles = {
            default: "bg-white border-slate-200 text-slate-950",
            destructive: "bg-red-50 border-red-200 text-red-900",
        };

        const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

        return (
            <div ref={ref} role="alert" className={combinedClassName} {...props}>
                {children}
            </div>
        );
    }
);

Alert.displayName = "Alert";

type AlertTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

export const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(
    ({ className = "", children, ...props }, ref) => {
        const baseStyles = "mb-1 font-medium leading-none tracking-tight";
        const combinedClassName = `${baseStyles} ${className}`;

        return (
            <h5 ref={ref} className={combinedClassName} {...props}>
                {children}
            </h5>
        );
    }
);

AlertTitle.displayName = "AlertTitle";

type AlertDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
    ({ className = "", children, ...props }, ref) => {
        const baseStyles = "text-sm [&_p]:leading-relaxed";
        const combinedClassName = `${baseStyles} ${className}`;

        return (
            <p ref={ref} className={combinedClassName} {...props}>
                {children}
            </p>
        );
    }
);

AlertDescription.displayName = "AlertDescription";
