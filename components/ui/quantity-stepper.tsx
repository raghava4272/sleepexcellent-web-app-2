"use client";

export function QuantityStepper({
  onChange,
  value,
}: {
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <div aria-label="Quantity" className="inline-flex h-11 items-center border border-line bg-canvas-raised">
      <button aria-label="Decrease quantity" className="grid h-full w-10 place-items-center hover:bg-canvas-pressed disabled:cursor-not-allowed disabled:text-muted-ink" disabled={value <= 1} onClick={() => onChange(value - 1)} type="button">−</button>
      <output className="grid h-full min-w-10 place-items-center border-x border-line text-sm">{value}</output>
      <button aria-label="Increase quantity" className="grid h-full w-10 place-items-center hover:bg-canvas-pressed" onClick={() => onChange(value + 1)} type="button">+</button>
    </div>
  );
}
