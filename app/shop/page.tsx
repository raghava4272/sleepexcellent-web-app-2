import { StitchFrame } from "@/components/stitch/stitch-frame";

export default function ShopPage() {
  return (
    <main aria-label="SleepExcellent mattress catalog">
      <StitchFrame
        className="stitch-frame--listing"
        src="/stitch-product-listing.html"
        title="SleepExcellent approved product listing"
      />
    </main>
  );
}
