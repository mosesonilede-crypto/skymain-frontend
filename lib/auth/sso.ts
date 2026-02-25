/**
 * SSO / SAML / OIDC Foundation
 *
 * This module provides the configuration and callback handlers for enterprise
 * Single Sign-On via SAML 2.0 and OpenID Connect (OIDC).
 *
 * Supabase Auth supports third-party SSO providers natively:
 * https://supabase.com/docs/guides/auth/enterprise-sso
 *
 * Architecture:
 *   1. Admin configures an SSO provider (SAML IdP or OIDC provider) via the
 *      Super Admin panel or API.
 *   2. Provider metadata is stored in `sso_providers` table with org_name binding.
 *   3. At login, if user's email domain matches a configured provider, the
 *      UI redirects to `/api/auth/sso/login?provider=<id>`.
 *   4. Supabase handles the SAML/OIDC handshake and redirects back to
 *      `/api/auth/sso/callback` with a Supabase session.
 *   5. This module creates the `sm_session` cookie from the Supabase session.
 */

import { supabaseServer } from "@/lib/supabaseServer";

export type SsoProviderType = "saml" | "oidc";

export type SsoProviderConfig = {
    id: string;
    org_name: string;
    provider_type: SsoProviderType;
    display_name: string;
    /** SAML: IdP metadata URL; OIDC: issuer URL */
    metadata_url: string;
    /** OIDC only: client_id */
    client_id?: string;
    /** Email domains that should auto-route to this provider */
    email_domains: string[];
    enabled: boolean;
    created_at: string;
};

/**
 * List SSO providers for a given org.
 */
export async function listSsoProviders(orgName: string): Promise<SsoProviderConfig[]> {
    if (!supabaseServer) return [];

    const { data, error } = await supabaseServer
        .from("sso_providers")
        .select("*")
        .eq("org_name", orgName)
        .eq("enabled", true);

    if (error) {
        console.error("SSO provider listing error:", error);
        return [];
    }

    return (data || []) as SsoProviderConfig[];
}

/**
 * Find an SSO provider by email domain (for auto-routing at login).
 */
export async function findProviderByDomain(emailDomain: string): Promise<SsoProviderConfig | null> {
    if (!supabaseServer) return null;

    const { data, error } = await supabaseServer
        .from("sso_providers")
        .select("*")
        .eq("enabled", true)
        .contains("email_domains", [emailDomain]);

    if (error || !data?.length) return null;

    return data[0] as SsoProviderConfig;
}

/**
 * Build the SSO login redirect URL using Supabase's built-in SSO support.
 * The `domain` parameter is the email domain to match against configured providers.
 */
export async function getSsoLoginUrl(
    domain: string,
    redirectTo: string
): Promise<string | null> {
    if (!supabaseServer) return null;

    try {
        const { data, error } = await supabaseServer.auth.signInWithSSO({
            domain,
            options: { redirectTo },
        });

        if (error) {
            console.error("SSO login URL error:", error);
            return null;
        }

        return data?.url || null;
    } catch (e) {
        console.error("SSO login URL exception:", e);
        return null;
    }
}
