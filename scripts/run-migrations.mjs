#!/usr/bin/env node
/**
 * run-migrations.mjs
 *
 * Applies SQL migration files from supabase/migrations/ in order
 * against the Supabase database via the REST API.
 *
 * Env vars:
 *   SUPABASE_STAGING_URL — Supabase project URL (or NEXT_PUBLIC_SUPABASE_URL)
 *   SUPABASE_STAGING_SERVICE_ROLE_KEY — service role key (or SUPABASE_SERVICE_ROLE_KEY)
 */

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_STAGING_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey =
  process.env.SUPABASE_STAGING_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing SUPABASE_STAGING_URL or SUPABASE_STAGING_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
});

const migrationsDir = join(process.cwd(), "supabase", "migrations");

async function run() {
  let files;
  try {
    files = (await readdir(migrationsDir)).filter((f) => f.endsWith(".sql")).sort();
  } catch {
    console.log("No supabase/migrations/ directory found. Nothing to apply.");
    return;
  }

  if (files.length === 0) {
    console.log("No migration files found.");
    return;
  }

  console.log(`Found ${files.length} migration(s):`);
  for (const file of files) {
    const sql = await readFile(join(migrationsDir, file), "utf-8");
    console.log(`  Applying ${file}...`);
    const { error } = await supabase.rpc("exec_sql", { sql_text: sql });
    if (error) {
      console.error(`  ✗ ${file}: ${error.message}`);
      process.exit(1);
    }
    console.log(`  ✓ ${file}`);
  }
  console.log("All migrations applied successfully.");
}

run().catch((err) => {
  console.error("Migration runner error:", err);
  process.exit(1);
});
