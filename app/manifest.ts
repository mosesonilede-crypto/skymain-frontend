import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "SkyMaintain - Aircraft Maintenance Intelligence",
        short_name: "SkyMaintain",
        description: "Regulatory-compliant aircraft maintenance platform with AI-powered insights",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#2563eb",
        orientation: "portrait-primary",
        categories: ["business", "productivity", "utilities"],
        icons: [
            {
                src: "/icon.svg",
                sizes: "any",
                type: "image/svg+xml",
                purpose: "any",
            },
            {
                src: "/apple-icon.svg",
                sizes: "180x180",
                type: "image/svg+xml",
            },
        ],
    };
}
