import Link from "next/link";

type BreadcrumbItem = {
  href?: string;
  label: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-xs tracking-[0.08em] text-muted-ink">
        <li>
          <Link className="hover:text-ink" href="/">
            Home
          </Link>
        </li>
        {items.map((item) => (
          <li className="flex items-center gap-2" key={item.label}>
            <span aria-hidden="true">/</span>
            {item.href ? (
              <Link className="hover:text-ink" href={item.href}>
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
