import type { ComponentPropsWithoutRef } from "react";

type ContainerProps = ComponentPropsWithoutRef<"div">;

export function Container({ className = "", ...props }: ContainerProps) {
  return <div className={`site-container ${className}`.trim()} {...props} />;
}

export function ContentGrid({ className = "", ...props }: ContainerProps) {
  return (
    <div
      className={`site-container grid grid-cols-4 lg:grid-cols-12 ${className}`.trim()}
      {...props}
    />
  );
}
