"use client";

import * as React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className = "", children, ...props }, ref) => {
        const baseStyles = "rounded-xl border border-slate-200 bg-white shadow-sm";
        const combinedClassName = `${baseStyles} ${className}`;

        return (
            <div ref={ref} className={combinedClassName} {...props}>
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";

type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className = "", children, ...props }, ref) => {
        const baseStyles = "flex flex-col space-y-1.5 p-6";
        const combinedClassName = `${baseStyles} ${className}`;

        return (
            <div ref={ref} className={combinedClassName} {...props}>
                {children}
            </div>
        );
    }
);

CardHeader.displayName = "CardHeader";

type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
    ({ className = "", children, ...props }, ref) => {
        const baseStyles = "text-lg font-semibold leading-none tracking-tight";
        const combinedClassName = `${baseStyles} ${className}`;

        return (
            <h3 ref={ref} className={combinedClassName} {...props}>
                {children}
            </h3>
        );
    }
);

CardTitle.displayName = "CardTitle";

type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
    ({ className = "", children, ...props }, ref) => {
        const baseStyles = "text-sm text-slate-500";
        const combinedClassName = `${baseStyles} ${className}`;

        return (
            <p ref={ref} className={combinedClassName} {...props}>
                {children}
            </p>
        );
    }
);

CardDescription.displayName = "CardDescription";

type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
    ({ className = "", children, ...props }, ref) => {
        const baseStyles = "p-6 pt-0";
        const combinedClassName = `${baseStyles} ${className}`;

        return (
            <div ref={ref} className={combinedClassName} {...props}>
                {children}
            </div>
        );
    }
);

CardContent.displayName = "CardContent";

type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
    ({ className = "", children, ...props }, ref) => {
        const baseStyles = "flex items-center p-6 pt-0";
        const combinedClassName = `${baseStyles} ${className}`;

        return (
            <div ref={ref} className={combinedClassName} {...props}>
                {children}
            </div>
        );
    }
);

CardFooter.displayName = "CardFooter";
