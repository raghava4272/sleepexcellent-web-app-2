import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";

const fieldClass = "mt-2 min-h-12 w-full rounded-none border border-line bg-canvas-raised px-3 text-sm text-ink placeholder:text-muted-ink focus:border-ink";

export function FieldLabel({ htmlFor, label }: { htmlFor: string; label: string }) {
  return (
    <label className="eyebrow text-ink" htmlFor={htmlFor}>
      {label}
    </label>
  );
}

export function TextInput({ label, id, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <FieldLabel htmlFor={id ?? "input"} label={label} />
      <input className={fieldClass} id={id} {...props} />
    </div>
  );
}

export function SelectInput({
  children,
  label,
  id,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode; label: string }) {
  return (
    <div>
      <FieldLabel htmlFor={id ?? "select"} label={label} />
      <select className={fieldClass} id={id} {...props}>
        {children}
      </select>
    </div>
  );
}

export function Checkbox({ id, label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm" htmlFor={id}>
      <input className="h-4 w-4 appearance-none border border-ink bg-canvas-raised checked:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2" id={id} type="checkbox" {...props} />
      {label}
    </label>
  );
}

export function Radio({ id, label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm" htmlFor={id}>
      <input className="h-4 w-4 appearance-none border border-ink bg-canvas-raised checked:shadow-[inset_0_0_0_4px_var(--canvas-raised)] checked:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2" id={id} type="radio" {...props} />
      {label}
    </label>
  );
}
