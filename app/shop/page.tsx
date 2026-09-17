import { StitchFrame } from "@/components/stitch/stitch-frame";
import { Header } from "@/components/layout/header";

export default function ShopPage() {
  return (
    <main aria-label="SleepExcellent mattress catalog">
      <Header />
      <StitchFrame
        className="stitch-frame--listing"
        hideEmbeddedHeader
        src="/stitch-product-listing.html"
        title="SleepExcellent approved product listing"
      />
    </main>
  );
}
