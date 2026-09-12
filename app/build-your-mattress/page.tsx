import { StitchFrame } from "@/components/stitch/stitch-frame";

export default function BuildYourMattressPage() {
  return (
    <main aria-label="Custom mattress builder">
      <StitchFrame
        className="stitch-frame--listing"
        src="/stitch-custom-mattress-builder.html"
        title="SleepExcellent approved custom mattress builder"
      />
    </main>
  );
}
