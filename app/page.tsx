import { Homepage, type HeroSlide, type HomeCategory, type HomeProduct } from "@/components/home/homepage";
import { getPricingManifest, priceLabel } from "@/lib/catalog/pricing";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};
type ImageRow = { storage_path: string; alt_text: string; sort_order: number };
type ProductRow = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  category_id: string;
  product_images: ImageRow[] | null;
};

const categorySetup = [
  { slug: "mattresses", name: "Mattresses", href: "/shop" },
  { slug: "sofas", name: "Sofas", href: "/shop?category=sofas" },
  { slug: "padding-beds", name: "Beds", href: "/shop?category=padding-beds" },
  { slug: "tv-units", name: "TV Units", href: "/interiors/tv-units" },
  { slug: "kitchen", name: "Modern Kitchen", href: "/interiors/kitchen" },
  { slug: "ceilings", name: "Ceiling Solutions", href: "/interiors/ceilings" },
] as const;

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const slugs = categorySetup.map((category) => category.slug);
  const [{ data: categoryData }, pricing] = await Promise.all([supabase.from("categories").select("id, name, slug, description").in("slug", slugs).eq("is_active", true), getPricingManifest()]);
  const categories = (categoryData ?? []) as CategoryRow[];
  const categoryIds = categories.map((category) => category.id);
  const { data: productData } = categoryIds.length ? await supabase.from("products").select("id, name, slug, short_description, category_id, product_images(storage_path, alt_text, sort_order)").in("category_id", categoryIds).eq("status", "active").order("name") : { data: [] };
  const products = (productData ?? []) as ProductRow[];

  const imageFor = (product?: ProductRow) => {
    const image = [...(product?.product_images ?? [])].sort((left, right) => left.sort_order - right.sort_order)[0];
    return image
      ? {
          alt: image.alt_text || product?.name || "SleepExcellent product",
          src: supabase.storage.from("product-images").getPublicUrl(image.storage_path).data.publicUrl,
        }
      : null;
  };
  const productsFor = (categorySlug: string) => {
    const category = categories.find((entry) => entry.slug === categorySlug);
    return products.filter((product) => product.category_id === category?.id);
  };
  const mappedProduct = (product: ProductRow, categorySlug: string): HomeProduct => {
    const image = imageFor(product);
    return {
      category: categorySlug,
      configuration: categorySlug === "mattresses" ? "Single · Diwan · Queen · King" : "Made to order",
      href: `/products/${product.slug}`,
      imageAlt: image?.alt || `${product.name} image pending`,
      imageSrc: image?.src || "/product-placeholder.svg",
      name: product.name,
      price: priceLabel(pricing[product.slug]),
    };
  };

  const homeCategories: HomeCategory[] = categorySetup.map((setup) => {
    const category = categories.find((entry) => entry.slug === setup.slug);
    const categoryProducts = productsFor(setup.slug);
    const imageProduct = categoryProducts.find((product) => product.product_images?.length);
    const image = imageFor(imageProduct);
    return {
      ...setup,
      description: category?.description,
      imageAlt: image?.alt || `${setup.name} collection`,
      imageSrc: image?.src || "/product-placeholder.svg",
    };
  });

  const featured = {
    mattresses: productsFor("mattresses")
      .filter((product) => product.product_images?.length)
      .slice(0, 4)
      .map((product) => mappedProduct(product, "mattresses")),
    sofas: productsFor("sofas")
      .filter((product) => product.product_images?.length)
      .slice(0, 4)
      .map((product) => mappedProduct(product, "sofas")),
    beds: productsFor("padding-beds")
      .filter((product) => product.product_images?.length)
      .slice(0, 4)
      .map((product) => mappedProduct(product, "padding-beds")),
  };
  const preferredHero = productsFor("mattresses").find((product) => /feel good|ortho plus/i.test(product.name) && product.product_images?.length) ?? productsFor("mattresses").find((product) => product.product_images?.length);
  const heroImage = imageFor(preferredHero) ??
    homeCategories.find((category) => category.imageSrc !== "/product-placeholder.svg") ?? {
      alt: "SleepExcellent bedroom collection",
      src: "/product-placeholder.svg",
    };
  const categoryImage = (slug: string) => homeCategories.find((category) => category.slug === slug && category.imageSrc !== "/product-placeholder.svg");
  const heroSlides: HeroSlide[] = [
    {
      eyebrow: "SleepExcellent home collection",
      title: "Better sleep. Beautiful spaces.",
      copy: "Explore mattresses, sofas, beds, and interior solutions for a home that feels like you.",
      href: "#shop-by-category",
      action: "Explore Collections",
      imageAlt: "alt" in heroImage ? heroImage.alt : heroImage.imageAlt,
      imageSrc: "src" in heroImage ? heroImage.src : heroImage.imageSrc,
    },
    {
      eyebrow: "Comfort for every room",
      title: "Sit back. Settle in.",
      copy: "Discover made-to-order sofas and beds designed around comfortable everyday living.",
      href: "/shop?category=sofas",
      action: "Explore Sofas",
      imageAlt: categoryImage("sofas")?.imageAlt || "SleepExcellent sofa collection",
      imageSrc: categoryImage("sofas")?.imageSrc || ("src" in heroImage ? heroImage.src : heroImage.imageSrc),
    },
    {
      eyebrow: "Thoughtful interior solutions",
      title: "Bring the room together.",
      copy: "Explore TV units, modern kitchens, and ceiling solutions for a more considered home.",
      href: "/interiors",
      action: "Explore Interiors",
      imageAlt: categoryImage("tv-units")?.imageAlt || "SleepExcellent interior collection",
      imageSrc: categoryImage("tv-units")?.imageSrc || ("src" in heroImage ? heroImage.src : heroImage.imageSrc),
    },
  ];

  return <Homepage categories={homeCategories} featured={featured} heroSlides={heroSlides} />;
}
