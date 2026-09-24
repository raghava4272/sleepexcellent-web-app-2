"use client";

import { useState } from "react";

type PasswordFieldProps = {
  autoComplete: "current-password" | "new-password";
  id?: string;
  inputClassName: string;
  minLength?: number;
};

function EyeIcon({ hidden }: { hidden: boolean }) {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="2.75" stroke="currentColor" strokeWidth="1.8" />
      {hidden ? <path d="m4 4 16 16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /> : null}
    </svg>
  );
}

export function PasswordField({ autoComplete, id, inputClassName, minLength }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input autoComplete={autoComplete} className={`${inputClassName} pr-11`} id={id} minLength={minLength} name="password" required type={visible ? "text" : "password"} />
      <button aria-label={visible ? "Hide password" : "Show password"} aria-pressed={visible} className="absolute inset-y-0 right-0 grid w-11 place-items-center text-[#5f4531] transition hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px]" onClick={() => setVisible((current) => !current)} type="button">
        <EyeIcon hidden={visible} />
      </button>
    </div>
  );
}
