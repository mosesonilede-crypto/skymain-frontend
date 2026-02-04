"use client";

import * as React from "react";
import { CONTACT_SUPPORT } from "@/lib/routes";

type DataMode = "mock" | "live" | "hybrid";

type AboutInfo = {
  tagline: string;
  version: string;
  ai_model: {
    model_version_label: string;
    model_version_value: string;
    training_dataset_label: string;
    training_dataset_value: string;
    last_updated_label: string;
    last_updated_value: string;
  };
  regulatory_scope: {
    faa_compliance_label: string;
    faa_compliance_ok: boolean;
    easa_certified_label: string;
    easa_certified_ok: boolean;
    iso_9001_2015_label: string;
    iso_9001_2015_ok: boolean;
  };
  disclaimer_title: string;
  disclaimer_body: string;
  support_resources: {
    contact_support_label: string;
    documentation_label: string;
    terms_privacy_label: string;
  };
  legal: {
    copyright_line: string;
    product_of_line: string;
    built_with_line: string;
  };
};

type ApiEnvelope<T> = { ok: boolean; data: T; meta?: { request_id?: string } };

const DEFAULT_ABOUT: AboutInfo = {
  tagline: "A Regulatory-Compliant Architecture for AI-Assisted Aircraft Maintenance Decision Support",
  version: "Version 1.0",
  ai_model: {
    model_version_label: "Model Version:",
    model_version_value: "SkyMaintain ML v2.1.0",
    training_dataset_label: "Training Dataset:",
    training_dataset_value: "10M+ Flight Hours",
    last_updated_label: "Last Updated:",
    last_updated_value: "January 15, 2026",
  },
  regulatory_scope: {
    faa_compliance_label: "FAA Compliance:",
    faa_compliance_ok: true,
    easa_certified_label: "EASA Certified:",
    easa_certified_ok: true,
    iso_9001_2015_label: "ISO 9001:2015:",
    iso_9001_2015_ok: true,
  },
  disclaimer_title: "Important Disclaimer",
  disclaimer_body:
    "SkyMaintain is a decision support system designed to assist qualified aviation maintenance professionals. All AI predictions and recommendations must be reviewed and approved by certified personnel. This system does not replace regulatory requirements or the judgment of experienced maintenance engineers. Always consult applicable regulations, manufacturer documentation, and approved procedures.",
  support_resources: {
    contact_support_label: "Contact Support",
    documentation_label: "Documentation",
    terms_privacy_label: "Terms & Privacy",
  },
  legal: {
    copyright_line: "© 2026 SkyMaintain. All Rights Reserved.",
    product_of_line: "SkyMaintain is a product of EncycloAMTs LLC.",
    built_with_line: "Built with precision for aviation maintenance excellence.",
  },
};

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function getDataMode(): DataMode {
  const raw = (process.env.NEXT_PUBLIC_DATA_MODE || "mock").toLowerCase();
  if (raw === "mock" || raw === "live" || raw === "hybrid") return raw;
  return "mock";
}

function getApiBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
}

let mockStore: AboutInfo = structuredClone(DEFAULT_ABOUT);

function normalizeIncoming(incoming: Partial<AboutInfo> | null | undefined): AboutInfo {
  const safe = incoming ?? {};
  return {
    tagline: safe.tagline ?? DEFAULT_ABOUT.tagline,
    version: safe.version ?? DEFAULT_ABOUT.version,
    ai_model: {
      model_version_label: safe.ai_model?.model_version_label ?? DEFAULT_ABOUT.ai_model.model_version_label,
      model_version_value: safe.ai_model?.model_version_value ?? DEFAULT_ABOUT.ai_model.model_version_value,
      training_dataset_label: safe.ai_model?.training_dataset_label ?? DEFAULT_ABOUT.ai_model.training_dataset_label,
      training_dataset_value: safe.ai_model?.training_dataset_value ?? DEFAULT_ABOUT.ai_model.training_dataset_value,
      last_updated_label: safe.ai_model?.last_updated_label ?? DEFAULT_ABOUT.ai_model.last_updated_label,
      last_updated_value: safe.ai_model?.last_updated_value ?? DEFAULT_ABOUT.ai_model.last_updated_value,
    },
    regulatory_scope: {
      faa_compliance_label: safe.regulatory_scope?.faa_compliance_label ?? DEFAULT_ABOUT.regulatory_scope.faa_compliance_label,
      faa_compliance_ok:
        typeof safe.regulatory_scope?.faa_compliance_ok === "boolean"
          ? safe.regulatory_scope.faa_compliance_ok
          : DEFAULT_ABOUT.regulatory_scope.faa_compliance_ok,
      easa_certified_label: safe.regulatory_scope?.easa_certified_label ?? DEFAULT_ABOUT.regulatory_scope.easa_certified_label,
      easa_certified_ok:
        typeof safe.regulatory_scope?.easa_certified_ok === "boolean"
          ? safe.regulatory_scope.easa_certified_ok
          : DEFAULT_ABOUT.regulatory_scope.easa_certified_ok,
      iso_9001_2015_label: safe.regulatory_scope?.iso_9001_2015_label ?? DEFAULT_ABOUT.regulatory_scope.iso_9001_2015_label,
      iso_9001_2015_ok:
        typeof safe.regulatory_scope?.iso_9001_2015_ok === "boolean"
          ? safe.regulatory_scope.iso_9001_2015_ok
          : DEFAULT_ABOUT.regulatory_scope.iso_9001_2015_ok,
    },
    disclaimer_title: safe.disclaimer_title ?? DEFAULT_ABOUT.disclaimer_title,
    disclaimer_body: safe.disclaimer_body ?? DEFAULT_ABOUT.disclaimer_body,
    support_resources: {
      contact_support_label:
        safe.support_resources?.contact_support_label ?? DEFAULT_ABOUT.support_resources.contact_support_label,
      documentation_label:
        safe.support_resources?.documentation_label ?? DEFAULT_ABOUT.support_resources.documentation_label,
      terms_privacy_label:
        safe.support_resources?.terms_privacy_label ?? DEFAULT_ABOUT.support_resources.terms_privacy_label,
    },
    legal: {
      copyright_line: safe.legal?.copyright_line ?? DEFAULT_ABOUT.legal.copyright_line,
      product_of_line: safe.legal?.product_of_line ?? DEFAULT_ABOUT.legal.product_of_line,
      built_with_line: safe.legal?.built_with_line ?? DEFAULT_ABOUT.legal.built_with_line,
    },
  };
}

async function apiGetAbout(signal?: AbortSignal): Promise<AboutInfo> {
  const mode = getDataMode();
  if (mode === "mock") {
    await new Promise((r) => setTimeout(r, 140));
    return structuredClone(mockStore);
  }

  const base = getApiBaseUrl();
  if (!base) {
    await new Promise((r) => setTimeout(r, 100));
    return structuredClone(mockStore);
  }

  const res = await fetch(`${base}/v1/settings/about`, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
    signal,
  });

  if (!res.ok) {
    if (mode === "hybrid") return structuredClone(mockStore);
    throw new Error(`GET /v1/settings/about failed (${res.status})`);
  }

  const json = (await res.json()) as ApiEnvelope<AboutInfo>;
  if (!json?.ok || !json?.data) {
    if (mode === "hybrid") return structuredClone(mockStore);
    throw new Error("Unexpected response shape from GET /v1/settings/about");
  }

  const normalized = normalizeIncoming(json.data);
  if (mode === "hybrid") mockStore = structuredClone(normalized);
  return normalized;
}

async function apiPutAbout(payload: AboutInfo): Promise<void> {
  const mode = getDataMode();

  if (mode === "mock") {
    await new Promise((r) => setTimeout(r, 140));
    mockStore = structuredClone(payload);
    return;
  }

  const base = getApiBaseUrl();
  if (!base) {
    await new Promise((r) => setTimeout(r, 100));
    mockStore = structuredClone(payload);
    if (mode === "live") throw new Error("NEXT_PUBLIC_API_BASE_URL is not set (live mode requires backend).");
    return;
  }

  const res = await fetch(`${base}/v1/settings/about`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    if (mode === "hybrid") {
      mockStore = structuredClone(payload);
      return;
    }
    throw new Error(`PUT /v1/settings/about failed (${res.status})`);
  }

  if (mode === "hybrid") mockStore = structuredClone(payload);
}

function StatusDot({ ok }: { ok: boolean }): React.ReactElement {
  return (
    <span
      className={cx(
        "inline-flex h-5 w-5 items-center justify-center rounded-full border",
        ok ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-800"
      )}
      aria-label={ok ? "Status: OK" : "Status: Not OK"}
      title={ok ? "OK" : "Not OK"}
    >
      {ok ? "✓" : "!"}
    </span>
  );
}

export default function AboutSkyMaintainPage(): React.ReactElement {
  const mode = getDataMode();

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [about, setAbout] = React.useState<AboutInfo>(structuredClone(DEFAULT_ABOUT));

  React.useEffect(() => {
    const ac = new AbortController();
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiGetAbout(ac.signal);
        setAbout(normalizeIncoming(data));
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to load About information.";
        setError(msg);
        setAbout(structuredClone(DEFAULT_ABOUT));
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  return (
    <div className="w-full">
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="px-6 py-7">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
              <span className="text-xl font-semibold">✈</span>
            </div>

            <h1 className="text-lg font-semibold text-slate-900">SkyMaintain</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">{about.tagline}</p>

            <div className="mt-4 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {about.version}
            </div>

            <div className="mt-4">
              <span
                className={cx(
                  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
                  mode === "live"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : mode === "hybrid"
                      ? "border-amber-200 bg-amber-50 text-amber-800"
                      : "border-slate-200 bg-slate-50 text-slate-700"
                )}
                title="Data mode is controlled by NEXT_PUBLIC_DATA_MODE"
              >
                Data: {mode.toUpperCase()}
              </span>
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {error}
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 px-6 py-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <section className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                  ✶
                </span>
                <h2 className="text-sm font-semibold text-slate-900">AI Model Information</h2>
              </div>

              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-600">{about.ai_model.model_version_label}</dt>
                  <dd className="font-semibold text-slate-900">{about.ai_model.model_version_value}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-600">{about.ai_model.training_dataset_label}</dt>
                  <dd className="font-semibold text-slate-900">{about.ai_model.training_dataset_value}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-600">{about.ai_model.last_updated_label}</dt>
                  <dd className="font-semibold text-slate-900">{about.ai_model.last_updated_value}</dd>
                </div>
              </dl>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  ⛨
                </span>
                <h2 className="text-sm font-semibold text-slate-900">Regulatory Scope</h2>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-600">{about.regulatory_scope.faa_compliance_label}</span>
                  <StatusDot ok={about.regulatory_scope.faa_compliance_ok} />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-600">{about.regulatory_scope.easa_certified_label}</span>
                  <StatusDot ok={about.regulatory_scope.easa_certified_ok} />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-600">{about.regulatory_scope.iso_9001_2015_label}</span>
                  <StatusDot ok={about.regulatory_scope.iso_9001_2015_ok} />
                </div>
              </div>
            </section>
          </div>

          <section className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-5">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-amber-700">
                ⚠
              </span>
              <h2 className="text-sm font-semibold text-slate-900">{about.disclaimer_title}</h2>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-slate-700">{about.disclaimer_body}</p>
          </section>

          <section className="mt-6">
            <h3 className="text-sm font-semibold text-slate-900">Support &amp; Resources</h3>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <a
                href={CONTACT_SUPPORT}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-300"
              >
                ✉ {about.support_resources.contact_support_label}
              </a>

              <a
                href="/documentation"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-300"
              >
                📄 {about.support_resources.documentation_label}
              </a>

              <a
                href="/terms"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-300"
              >
                ⓘ {about.support_resources.terms_privacy_label}
              </a>
            </div>

            <div className="mt-6 border-t border-slate-200 pt-4 text-center text-sm text-slate-600">
              <div>{about.legal.copyright_line}</div>
              <div className="mt-1">{about.legal.product_of_line}</div>
              <div className="mt-1">{about.legal.built_with_line}</div>
            </div>
          </section>
        </div>
      </div>

      {loading ? null : null}
    </div>
  );
}
