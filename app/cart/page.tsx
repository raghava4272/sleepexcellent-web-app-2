import { StitchFrame } from "@/components/stitch/stitch-frame";

export default function CartPage() {
  return (
    <main aria-label="Shopping cart">
      <StitchFrame
        className="stitch-frame--listing"
        src="/stitch-shopping-cart.html"
        title="SleepExcellent approved shopping cart"
      />
    </main>
  );
}
