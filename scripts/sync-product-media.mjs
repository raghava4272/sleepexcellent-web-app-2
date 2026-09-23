import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const sourceRoot = process.argv[2];
const videoRoot = process.argv[3];

if (!sourceRoot || !videoRoot) {
  console.error("Usage: node scripts/sync-product-media.mjs <source-folder> <prepared-video-folder>");
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const contentTypes = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".m4v": "video/x-m4v",
};

const aliases = {
  "sofas:coronasofa": "corner-sofa",
  "ceilings:circularfeaturefalseceiling": "acoustic-ceiling",
  "ceilings:cofferedfalseceiling": "industrial-exposed-ceiling",
  "ceilings:covelightingfalseceiling": "cove-lighting-ceiling",
  "ceilings:floatingfalseceiling": "minimalist-false-ceiling",
  "ceilings:geometricgypsumfalseceiling": "geometric-pattern-ceiling",
  "ceilings:layeredpopfalseceiling": "luxury-layered-ceiling",
  "ceilings:moderntrayfalseceiling": "modern-tray-false-ceiling",
  "ceilings:walltoceilingpaneldesign": "pvc-panel-ceiling",
  "ceilings:woodenpanelfalseceiling": "gypsum-pop-ceiling",
  "ceilings:woodenslatfalseceiling": "wooden-beam-ceiling",
  "kitchen:gshapedmodularkitchen": "g-shaped-kitchen",
  "kitchen:islandmodularkitchen": "island-kitchen",
  "kitchen:lshapedmodularkitchen": "l-shaped-modular-kitchen",
  "kitchen:luxuryhandlesskitchenwithisland": "handleless-kitchen",
  "kitchen:onewallkitchenwithtallpantry": "luxury-modular-kitchen",
  "kitchen:openplanmodernkitchen": "open-kitchen",
  "kitchen:parallelgalleykitchen": "parallel-galley-kitchen",
  "kitchen:peninsulamodularkitchen": "industrial-style-kitchen",
  "kitchen:straightlinemodularkitchen": "straight-line-kitchen",
  "kitchen:ushapedmodularkitchen": "u-shaped-modular-kitchen",
  "tv-units:curvededgetvunit": "corner-tv-unit",
  "tv-units:floatingminimalisttvunit": "floating-minimalist-tv-unit",
  "tv-units:flutedpaneltvunit": "wall-panel-tv-unit",
  "tv-units:japanditvunit": "scandinavian-tv-unit",
  "tv-units:ledbacklittvunit": "modern-entertainment-wall",
  "tv-units:luxuryfullwalltvunit": "classic-wooden-tv-unit",
  "tv-units:marblebackdroptvunit": "luxury-marble-tv-console",
  "tv-units:modularstoragetvunit": "compact-tv-unit",
  "tv-units:smartmediawalltvunit": "industrial-tv-unit",
  "tv-units:woodenslattvunit": "low-profile-tv-console",
};

function normalize(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function mediaOrder(file) {
  const numbers = path.basename(file, path.extname(file)).match(/\d+/g);
  return numbers?.length ? Number(numbers.at(-1)) : Number.MAX_SAFE_INTEGER;
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  }));
  return nested.flat();
}

function sourceGroup(filePath) {
  const parts = path.relative(sourceRoot, filePath).split(path.sep).map((part) => part.trim());
  if (parts[0] === "Mattress") return { category: "mattresses", name: parts[1] };
  if (parts[0] === "Sofas") return { category: "sofas", name: parts[1] };
  if (parts[0] === "Padding Beds") return { category: "padding-beds", name: parts[1] };
  if (parts[0] === "Interior") {
    const category = parts[1] === "Bedroom Ceilings" ? "ceilings" : parts[1] === "Modern kitchen" ? "kitchen" : parts[1] === "Tv Unit" ? "tv-units" : null;
    return category ? { category, name: parts[2] } : null;
  }
  return null;
}

async function mapLimit(items, limit, task) {
  let cursor = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      await task(items[index], index);
    }
  });
  await Promise.all(workers);
}

const { data: products, error: productsError } = await supabase.from("products").select("id,name,slug,categories(slug)");
if (productsError) throw productsError;

const productByName = new Map(products.map((product) => [product.categories.slug + ":" + normalize(product.name), product]));
const productBySlug = new Map(products.map((product) => [product.slug, product]));
const files = (await walk(sourceRoot)).filter((file) => imageExtensions.has(path.extname(file).toLowerCase()));
const grouped = new Map();

for (const file of files) {
  const group = sourceGroup(file);
  if (!group?.name) continue;
  const key = group.category + ":" + normalize(group.name);
  const slug = aliases[key];
  const product = slug ? productBySlug.get(slug) : productByName.get(key);
  if (!product) {
    console.warn("Unmapped folder:", group.category, group.name);
    continue;
  }
  const current = grouped.get(product.id) ?? { product, files: [] };
  current.files.push(file);
  grouped.set(product.id, current);
}

const missingProducts = products.filter((product) => !grouped.has(product.id));
if (missingProducts.length) {
  throw new Error("No source images mapped for: " + missingProducts.map((product) => product.name).join(", "));
}

const rows = [];
const uploads = [];
for (const { product, files: productFiles } of grouped.values()) {
  const sorted = productFiles.sort((left, right) => {
    const orderDifference = mediaOrder(left) - mediaOrder(right);
    return orderDifference || path.basename(left).localeCompare(path.basename(right), undefined, { numeric: true });
  });
  const seen = new Set();
  let sortOrder = 0;
  for (const file of sorted) {
    const bytes = await readFile(file);
    const hash = createHash("sha256").update(bytes).digest("hex");
    if (seen.has(hash)) continue;
    seen.add(hash);
    const extension = path.extname(file).toLowerCase();
    const storagePath = product.categories.slug + "/" + product.slug + "/" + String(sortOrder + 1).padStart(2, "0") + (sortOrder === 0 ? "-hero" : "-gallery") + "-" + hash.slice(0, 12) + extension;
    uploads.push({ bytes, contentType: contentTypes[extension], storagePath });
    rows.push({ product_id: product.id, storage_path: storagePath, alt_text: product.name + (sortOrder === 0 ? " hero view" : " gallery view " + (sortOrder + 1)), sort_order: sortOrder });
    sortOrder++;
  }
}

await mapLimit(uploads, 8, async (upload) => {
  const { error } = await supabase.storage.from("product-images").upload(upload.storagePath, upload.bytes, { contentType: upload.contentType, upsert: true });
  if (error) throw error;
});

const productIds = [...grouped.keys()];
const { error: deleteError } = await supabase.from("product_images").delete().in("product_id", productIds);
if (deleteError) throw deleteError;
const { error: insertError } = await supabase.from("product_images").insert(rows);
if (insertError) throw insertError;

const { error: bucketError } = await supabase.storage.updateBucket("product-images", {
  public: true,
  fileSizeLimit: 20 * 1024 * 1024,
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/x-m4v"],
});
if (bucketError) throw bucketError;

const videos = ["mattresses.m4v", "sofas.m4v", "padding-beds.mp4", "interiors.mp4"];
for (const filename of videos) {
  const extension = path.extname(filename).toLowerCase();
  const bytes = await readFile(path.join(videoRoot, filename));
  const { error } = await supabase.storage.from("product-images").upload("videos/" + filename, bytes, { contentType: contentTypes[extension], upsert: true });
  if (error) throw error;
}

console.log(JSON.stringify({
  mappedProducts: grouped.size,
  uploadedImages: uploads.length,
  linkedImages: rows.length,
  uploadedVideos: videos.length,
}, null, 2));
