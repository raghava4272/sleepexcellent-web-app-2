import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/layout";

const footerGroups = [
  {
    title: "Shop",
    links: [
      ["Mattresses", "/shop/mattresses"],
      ["Sofas", "/shop/sofas"],
      ["Beds", "/shop/beds"],
      ["Interiors", "/shop/interiors"],
    ],
  },
  {
    title: "Service",
    links: [
      ["Build your mattress", "/build-your-mattress"],
      ["Delivery", "/delivery"],
      ["Order tracking", "/order-tracking"],
      ["Care guide", "/care-guide"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About SleepExcellent", "/about"],
      ["Contact", "/contact"],
      ["Warranty", "/warranty"],
      ["Privacy", "/privacy"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-canvas">
      <Container className="grid gap-px border-x border-line bg-line md:grid-cols-[1.7fr_repeat(3,1fr)]">
        <section className="bg-canvas p-6 sm:p-8">
          <Link aria-label="SleepExcellent home" className="relative block h-[52px] w-[230px] overflow-hidden bg-white" href="/">
            <Image alt="SleepExcellent" className="object-cover object-center" fill sizes="230px" src="/logo.png" />
          </Link>
          <p className="mt-6 max-w-xs text-sm leading-6 text-muted-ink">
            Purposeful sleep systems and interiors, made for how you live.
          </p>
        </section>
        {footerGroups.map((group) => (
          <section className="bg-canvas p-6 sm:p-8" key={group.title}>
            <h2 className="eyebrow text-timber">{group.title}</h2>
            <ul className="mt-6 space-y-3 text-sm">
              {group.links.map(([label, href]) => (
                <li key={label}>
                  <Link className="hover:underline" href={href}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </Container>
      <Container className="flex flex-col gap-2 border-x border-b border-line py-4 text-[0.68rem] tracking-[0.08em] text-muted-ink sm:flex-row sm:justify-between">
        <span>© {new Date().getFullYear()} SLEEPEXCELLENT</span>
        <span>DESIGNED FOR DEEPER REST</span>
      </Container>
    </footer>
  );
}
