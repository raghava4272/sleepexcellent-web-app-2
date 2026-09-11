import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ContentGrid, Container } from "@/components/layout/layout";
import { Button, LinkButton } from "@/components/ui/button";
import { ImageFrame } from "@/components/ui/image-frame";
import { StatusBadge } from "@/components/ui/status-badge";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Header />
      <main>
        <Container className="py-4 md:py-5">
          <Breadcrumbs items={[{ label: "Foundation" }]} />
        </Container>

        <section className="border-y border-line bg-canvas-soft">
          <ContentGrid className="grid-rule min-h-[min(720px,calc(100vh-172px))]">
            <div className="col-span-full flex flex-col justify-between border-x border-line py-8 sm:py-12 lg:col-span-7 lg:py-16">
              <p className="eyebrow text-timber">Sleep systems, considered</p>
              <div className="max-w-3xl py-16 sm:py-24">
                <h1 className="font-display text-[clamp(3.25rem,9vw,8.5rem)] font-semibold leading-[0.88] tracking-[-0.055em]">
                  Sleep,
                  <br />
                  constructed.
                </h1>
                <p className="mt-8 max-w-xl text-base leading-7 text-muted-ink sm:text-lg">
                  The SleepExcellent digital showroom is taking shape around
                  precise craft, personal comfort, and considered interiors.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <LinkButton href="/shop" variant="primary">
                  Explore the collection
                </LinkButton>
                <LinkButton href="/build-your-mattress" variant="secondary">
                  Build your mattress
                </LinkButton>
              </div>
            </div>

            <div className="col-span-full flex min-h-[340px] border-x border-t border-line bg-stone p-4 sm:p-6 lg:col-span-5 lg:min-h-0 lg:border-l-0 lg:border-t-0">
              <ImageFrame
                label="Approved design foundation"
                className="h-full min-h-[310px] w-full"
              >
                <div className="flex h-full flex-col justify-between bg-[linear-gradient(135deg,#e8e1d5_0%,#c8b7a0_100%)] p-6 text-ink sm:p-8">
                  <span className="eyebrow">01 / 03</span>
                  <div>
                    <p className="font-display max-w-sm text-4xl font-semibold leading-none tracking-[-0.04em]">
                      Your rest has a structure.
                    </p>
                    <StatusBadge className="mt-6" tone="neutral">
                      Design system ready
                    </StatusBadge>
                  </div>
                </div>
              </ImageFrame>
            </div>
          </ContentGrid>
        </section>

        <section className="border-b border-line">
          <Container className="py-8 sm:py-12">
            <div className="grid gap-px border border-line bg-line md:grid-cols-3">
              {[
                ["01", "Material clarity", "Quiet surfaces, honest specifications, considered details."],
                ["02", "Personal comfort", "A future configurator shaped around the way you sleep."],
                ["03", "Delivery certainty", "Clear order visibility from production to your door."],
              ].map(([number, title, description]) => (
                <article key={number} className="bg-canvas-raised p-6 sm:p-8">
                  <p className="eyebrow text-timber">{number}</p>
                  <h2 className="font-display mt-10 text-2xl font-semibold tracking-[-0.035em]">
                    {title}
                  </h2>
                  <p className="mt-3 max-w-xs text-sm leading-6 text-muted-ink">{description}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section className="border-b border-line bg-ink text-canvas">
          <Container className="flex flex-col justify-between gap-8 py-10 sm:flex-row sm:items-end sm:py-14">
            <div>
              <p className="eyebrow text-[#d7b998]">In development</p>
              <p className="font-display mt-4 max-w-2xl text-3xl font-semibold leading-[0.95] tracking-[-0.045em] sm:text-5xl">
                A direct path from considered choice to restorative sleep.
              </p>
            </div>
            <Button variant="inverse" type="button">
              Sign in with Google
            </Button>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
}
