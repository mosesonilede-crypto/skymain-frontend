/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";

type AvatarProps = React.HTMLAttributes<HTMLDivElement> & {
    src?: string;
    alt?: string;
    fallback?: string;
};

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
    ({ className = "", src, alt = "", fallback = "", children, ...props }, ref) => {
        const [hasError, setHasError] = React.useState(false);

        const baseStyles = "relative flex shrink-0 overflow-hidden rounded-full";
        const combinedClassName = `${baseStyles} ${className}`;

        const handleError = () => {
            setHasError(true);
        };

        return (
            <div ref={ref} className={combinedClassName} {...props}>
                {src && !hasError ? (
                    <img
                        src={src}
                        alt={alt}
                        className="aspect-square h-full w-full object-cover"
                        onError={handleError}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-slate-600 text-sm font-medium">
                        {fallback || alt?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                )}
                {children}
            </div>
        );
    }
);

Avatar.displayName = "Avatar";

type AvatarImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
    alt: string;
};

export const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
    ({ className = "", alt, ...props }, ref) => {
        const baseStyles = "aspect-square h-full w-full object-cover";
        const combinedClassName = `${baseStyles} ${className}`;

        return <img ref={ref} className={combinedClassName} alt={alt} {...props} />;
    }
);

AvatarImage.displayName = "AvatarImage";

type AvatarFallbackProps = React.HTMLAttributes<HTMLDivElement>;

export const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
    ({ className = "", children, ...props }, ref) => {
        const baseStyles = "flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-slate-600 text-sm font-medium";
        const combinedClassName = `${baseStyles} ${className}`;

        return (
            <div ref={ref} className={combinedClassName} {...props}>
                {children}
            </div>
        );
    }
);

AvatarFallback.displayName = "AvatarFallback";
