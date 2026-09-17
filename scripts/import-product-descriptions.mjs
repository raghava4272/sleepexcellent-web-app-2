#!/usr/bin/env node
/**
 * Imports only descriptions whose source product name normalizes to one and
 * only one live Supabase product. Run with --apply to write; otherwise it is
 * a read-only mapping preview. The source DOCX is deliberately retained in
 * docs/reference-sources so this import remains reviewable and repeatable.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const source = "docs/reference-sources/Sleep_Excellent_Product_Descriptions.docx";
const apply = process.argv.includes("--apply");
const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
const decode = (value) => value.replace(/&amp;/g, "&").replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");

for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (match) process.env[match[1]] = match[2].replace(/^"|"$/g, "");
}

const xml = execFileSync("unzip", ["-p", source, "word/document.xml"], { encoding: "utf8" });
const paragraphs = [...xml.matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)].map(([paragraph]) => decode([...paragraph.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g)].map(([, text]) => text).join(""))).filter(Boolean);
const categoryForNumber = (number) => number <= 10 ? "Mattresses" : number <= 26 ? "Sofas" : number <= 36 ? "Padding Beds" : number <= 46 ? "TV Units" : number <= 56 ? "Kitchens" : "Ceilings";
const sourceRows = [];
for (let index = 0; index < paragraphs.length - 1; index += 1) {
  const match = paragraphs[index].match(/^(\d+)\.\s+(.+)$/);
  if (match) sourceRows.push({ number: Number(match[1]), category: categoryForNumber(Number(match[1])), sourceName: match[2], description: paragraphs[index + 1] });
}
if (sourceRows.length !== 66) throw new Error(`Expected 66 source rows, found ${sourceRows.length}.`);

const root = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!root || !key) throw new Error("Missing Supabase configuration.");
const auth = { apikey: key, Authorization: `Bearer ${key}` };
const response = await fetch(`${root}/rest/v1/products?select=id,name,slug,description&order=slug`, { headers: auth });
if (!response.ok) throw new Error(`Could not read products: ${response.status}`);
const products = await response.json();
const byNormalizedName = new Map();
for (const product of products) {
  const normalized = normalize(product.name);
  byNormalizedName.set(normalized, [...(byNormalizedName.get(normalized) ?? []), product]);
}
const matches = [];
const unresolved = [];
for (const row of sourceRows) {
  const candidates = byNormalizedName.get(normalize(row.sourceName)) ?? [];
  if (candidates.length === 1) matches.push({ ...row, product: candidates[0] });
  else unresolved.push({ ...row, reason: candidates.length ? "multiple normalized-name matches" : "no exact normalized-name match" });
}

console.log(JSON.stringify({ sourceCount: sourceRows.length, verifiedCount: matches.length, unresolvedCount: unresolved.length, verified: matches.map(({ number, category, sourceName, product }) => ({ number, category, sourceName, slug: product.slug })), unresolved: unresolved.map(({ number, category, sourceName, reason }) => ({ number, category, sourceName, reason })) }, null, 2));

if (apply) {
  await Promise.all(matches.map(async ({ description, product }) => {
    const updateResponse = await fetch(`${root}/rest/v1/products?id=eq.${encodeURIComponent(product.id)}`, { method: "PATCH", headers: { ...auth, "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify({ description, short_description: description }) });
    if (!updateResponse.ok) throw new Error(`Could not import ${product.slug}: ${updateResponse.status} ${await updateResponse.text()}`);
  }));
  console.log(`Applied ${matches.length} verified product descriptions.`);
}
