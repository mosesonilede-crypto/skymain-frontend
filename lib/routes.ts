export type ContactIntent = "general" | "support" | "partnerships" | "demo" | "pricing";

export type ContactTopic =
    | "help-center"
    | "support-forum"
    | "youtube"
    | "release-notes"
    | "legal"
    | "community"
    | "support"
    | "abuse"
    | "keyboard-layout"
    | "language";

export function contactUrl(intent: ContactIntent = "general", opts?: { topic?: ContactTopic; ref?: string }) {
    const params = new URLSearchParams();
    params.set("intent", intent);

    if (opts?.topic) params.set("topic", opts.topic);
    if (opts?.ref) params.set("ref", opts.ref);

    return `/contact?${params.toString()}`;
}

export const CONTACT_GENERAL = contactUrl("general");
export const CONTACT_SUPPORT = contactUrl("support");
export const CONTACT_PARTNERSHIPS = contactUrl("partnerships");
export const CONTACT_DEMO = contactUrl("demo");
export const CONTACT_PRICING = contactUrl("pricing");

export const HELP_CENTER = contactUrl("support", { topic: "help-center", ref: "help_fab" });
export const SUPPORT_FORUM = contactUrl("support", { topic: "support-forum", ref: "help_fab" });
export const YOUTUBE = contactUrl("support", { topic: "youtube", ref: "help_fab" });
export const RELEASE_NOTES = contactUrl("support", { topic: "release-notes", ref: "help_fab" });
export const ASK_COMMUNITY = contactUrl("support", { topic: "community", ref: "help_fab" });
export const REPORT_ABUSE = contactUrl("support", { topic: "abuse", ref: "help_fab" });
export const KEYBOARD_LAYOUT = contactUrl("support", { topic: "keyboard-layout", ref: "help_fab" });
export const LANGUAGE = contactUrl("support", { topic: "language", ref: "help_fab" });
