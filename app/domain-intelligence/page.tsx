"use client";

import { useState } from "react";
import {
  answerDomainIntelligence,
  type DomainIntelligenceRequest,
  type DomainIntelligenceResponse,
} from "@/src/lib/api";

const DEFAULT_PAYLOAD: DomainIntelligenceRequest = {
  aircraft_family: "B737",
  subsystem: "Hydraulics",
  question: "What are common causes of low system A pressure?",
  ata: "29",
};

export default function DomainIntelligencePage() {
  const [payload, setPayload] = useState<DomainIntelligenceRequest>(DEFAULT_PAYLOAD);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DomainIntelligenceResponse | null>(null);

  const updateField = (field: keyof DomainIntelligenceRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setPayload((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const response = await answerDomainIntelligence({
        ...payload,
        ata: payload.ata?.trim() ? payload.ata.trim() : null,
      });
      setResult(response);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-900">Domain Intelligence</h1>
          <p className="mt-2 text-sm text-slate-600">
            Ask a maintenance question and receive an auditable answer with citations.
          </p>
        </header>

        <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="text-sm text-slate-700">
              Aircraft Family
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                value={payload.aircraft_family}
                onChange={updateField("aircraft_family")}
              />
            </label>
            <label className="text-sm text-slate-700">
              Subsystem
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                value={payload.subsystem}
                onChange={updateField("subsystem")}
              />
            </label>
            <label className="text-sm text-slate-700">
              ATA (optional)
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                value={payload.ata ?? ""}
                onChange={updateField("ata")}
              />
            </label>
          </div>

          <label className="text-sm text-slate-700 block">
            Question
            <textarea
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm min-h-[120px]"
              value={payload.question}
              onChange={updateField("question")}
            />
          </label>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl border px-3 py-2 text-sm font-medium shadow-sm disabled:opacity-60"
          >
            {loading ? "Asking..." : "Ask Domain Intelligence"}
          </button>
        </form>

        {result ? (
          <div className="mt-6 space-y-6">
            <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Answer</h2>
              <p className="mt-3 text-sm text-slate-700 whitespace-pre-wrap">
                {result.answer_text ?? result.answer}
              </p>
              <div className="mt-4 text-xs text-slate-500">
                <span className="font-medium text-slate-700">Aircraft:</span> {result.metadata.aircraft_family} ·{" "}
                <span className="font-medium text-slate-700">Subsystem:</span> {result.metadata.subsystem}
              </div>
            </section>

            {result.answer_blocks && result.answer_blocks.length > 0 ? (
              <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Guidance Blocks</h2>
                <div className="mt-4 space-y-4">
                  {result.answer_blocks.map((block, idx) => (
                    <div key={`${block.type}-${idx}`} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <div className="text-sm font-semibold text-slate-800">{block.title}</div>
                      <ul className="mt-2 list-disc list-inside text-sm text-slate-700 space-y-1">
                        {block.items.map((item, itemIdx) => (
                          <li key={`${block.type}-${itemIdx}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Citations</h2>
              {result.citations.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">No citations returned.</p>
              ) : (
                <ul className="mt-3 space-y-3 text-sm text-slate-700">
                  {result.citations.map((citation) => (
                    <li key={`${citation.kind}-${citation.document_id}`} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <div className="font-medium text-slate-800">{citation.title}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {citation.kind} · {citation.aircraft} · ATA {citation.ata} · {citation.revision}
                      </div>
                      <div className="text-xs text-slate-500">Document ID: {citation.document_id}</div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Sources</h2>
              {result.sources.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">No sources returned.</p>
              ) : (
                <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700">
                  {result.sources.map((source) => (
                    <li key={source.kind} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <div className="font-medium text-slate-800">{source.kind}</div>
                      <div className="text-xs text-slate-500">Documents: {source.count}</div>
                      <ul className="mt-2 space-y-1 text-xs text-slate-600">
                        {source.documents.map((doc) => (
                          <li key={`${doc.kind}-${doc.document_id}`}>
                            {doc.title} (ATA {doc.ata}, {doc.revision})
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        ) : null}
      </div>
    </main>
  );
}
