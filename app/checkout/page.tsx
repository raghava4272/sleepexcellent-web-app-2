import { StitchFrame } from "@/components/stitch/stitch-frame";

export default function CheckoutPage() {
  return (
    <main aria-label="Secure checkout">
      <StitchFrame
        className="stitch-frame--listing"
        src="/stitch-secure-checkout.html"
        title="SleepExcellent approved secure checkout"
      />
    </main>
  );
}
