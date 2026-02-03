"use client";

import { useState } from "react";
import { createDocument, type DocumentCreate, type DocumentOut } from "@/src/lib/api";

const DEFAULT_PAYLOAD: DocumentCreate = {
  kind: "AMM",
  aircraft: "B737-800",
  ata: "29-11-00",
  revision: "Rev 45",
  title: "Hydraulic System - Task 29-11-00",
  storage_uri: "s3://skymain-dev/documents/amm-29-11-00.pdf",
};

export default function DocumentsPage() {
  const [payload, setPayload] = useState<DocumentCreate>(DEFAULT_PAYLOAD);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DocumentOut | null>(null);

  const updateField = (field: keyof DocumentCreate) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayload((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const created = await createDocument(payload);
      setResult(created);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Document creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-900">Register Document</h1>
          <p className="mt-2 text-sm text-slate-600">
            Create a document metadata record (no file upload yet).
          </p>
        </header>

        <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="text-sm text-slate-700">
              Kind
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                value={payload.kind}
                onChange={updateField("kind")}
              />
            </label>
            <label className="text-sm text-slate-700">
              Aircraft
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                value={payload.aircraft}
                onChange={updateField("aircraft")}
              />
            </label>
            <label className="text-sm text-slate-700">
              ATA
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                value={payload.ata}
                onChange={updateField("ata")}
              />
            </label>
            <label className="text-sm text-slate-700">
              Revision
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                value={payload.revision}
                onChange={updateField("revision")}
              />
            </label>
          </div>

          <label className="text-sm text-slate-700 block">
            Title
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
              value={payload.title}
              onChange={updateField("title")}
            />
          </label>

          <label className="text-sm text-slate-700 block">
            Storage URI
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
              value={payload.storage_uri}
              onChange={updateField("storage_uri")}
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
            {loading ? "Submitting..." : "Create Document"}
          </button>
        </form>

        {result ? (
          <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Created</h2>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600">
              <div><span className="font-medium text-slate-800">ID:</span> {result.id}</div>
              <div><span className="font-medium text-slate-800">Org:</span> {result.org_id}</div>
              <div><span className="font-medium text-slate-800">Kind:</span> {result.kind}</div>
              <div><span className="font-medium text-slate-800">Aircraft:</span> {result.aircraft}</div>
              <div><span className="font-medium text-slate-800">ATA:</span> {result.ata}</div>
              <div><span className="font-medium text-slate-800">Revision:</span> {result.revision}</div>
              <div className="md:col-span-2"><span className="font-medium text-slate-800">Title:</span> {result.title}</div>
              <div className="md:col-span-2"><span className="font-medium text-slate-800">Storage URI:</span> {result.storage_uri}</div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
