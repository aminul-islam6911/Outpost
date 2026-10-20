import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  LayoutGrid,
  MessageSquareText,
  Sparkles,
  UsersRound,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeatureMock } from "./_components/FeatureMocks";
import { landingCopy } from "./_data/landing";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PricingTable } from "@clerk/nextjs";

const PRICING_TAB =
  "rounded-full px-5 py-1.5 data-active:bg-primary data-active:text-primary-foreground dark:data-active:bg-primary dark:data-active:text-primary-foreground";

const featureIcons = {
  canvas: Workflow,
  docs: FileText,
  "team-board": LayoutGrid,
} as const;

const stepIcons = [MessageSquareText, Sparkles, UsersRound] as const;

export default function Home() {
  const { hero, audience, features, howItWorks, pricing, closing, footer } =
    landingCopy;

  return (
    <main className="flex flex-1 flex-col">
      <section className="topo-bg flex min-h-[calc(100svh-4.5rem)] flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mb-7 inline-flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-primary uppercase">
          <span aria-hidden="true" className="size-2 rotate-45 bg-primary" />
          {hero.eyebrow}
        </div>

        <h1 className="max-w-5xl text-balance text-5xl leading-[1.04] font-semibold tracking-[-0.045em] sm:text-6xl md:text-7xl lg:text-8xl">
          {hero.titleStart}{" "}
          <span className="text-primary">{hero.titleHighlight}</span>{" "}
          {hero.titleEnd}
        </h1>

        <p className="mt-7 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
          {hero.description}
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Button asChild className="h-12 px-6 text-base">
            <Link href="/sign-up">{hero.primaryAction}</Link>
          </Button>
          <Button asChild variant="outline" className="h-12 px-6 text-base">
            <Link href="#how-it-works">{hero.secondaryAction}</Link>
          </Button>
        </div>

        <div className="survey-frame scroll-tilt mt-20 w-full max-w-7xl">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-card shadow-2xl shadow-black/30">
            <video
              autoPlay
              muted
              loop
              playsInline
              poster="/videos/hero-poster.jpg"
              aria-label={hero.videoLabel}
              className="aspect-video w-full object-cover"
            >
              <source src="/videos/hero.webm" type="video/webm" />
              <source src="/videos/hero.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      <section
        aria-label={audience.label}
        className="border-y border-white/8 bg-card/40 px-6 py-6"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
          <span className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
            {audience.label}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-foreground/80 sm:gap-x-8">
            {audience.groups.map((group) => (
              <span key={group}>{group}</span>
            ))}
          </div>
        </div>
      </section>

      <section
        id="product"
        className="px-6 py-16 sm:py-24"
        aria-labelledby="features-heading"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
            <p className="mb-4 font-mono text-xs tracking-[0.16em] text-primary uppercase">
              {features.eyebrow}
            </p>
            <h2
              id="features-heading"
              className="text-balance text-3xl leading-tight font-semibold tracking-tight sm:text-5xl"
            >
              {features.heading}
            </h2>
            <p className="mt-5 text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
              {features.description}
            </p>
          </div>

          <div className="space-y-14 sm:space-y-20">
            {features.items.map((feature, index) => {
              const Icon = featureIcons[feature.id];
              const reversed = index % 2 === 1;

              return (
                <article
                  key={feature.id}
                  className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                    reversed ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div className="max-w-xl">
                    <div className="mb-5 flex size-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                      <Icon aria-hidden="true" className="size-5" />
                    </div>
                    <h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                      {feature.title}
                    </h3>
                    <p className="mt-4 text-base leading-7 text-muted-foreground">
                      {feature.description}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {feature.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex items-start gap-3 text-sm leading-6 text-foreground/85"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2 size-1.5 shrink-0 rotate-45 bg-primary"
                          />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <FeatureMock surface={feature.id} />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="scroll-mt-20 border-y border-white/8 bg-card/30 px-6 py-16 sm:py-24"
        aria-labelledby="how-it-works-heading"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
            <p className="mb-4 font-mono text-xs tracking-[0.16em] text-primary uppercase">
              {howItWorks.eyebrow}
            </p>
            <h2
              id="how-it-works-heading"
              className="text-balance text-3xl leading-tight font-semibold tracking-tight sm:text-5xl"
            >
              {howItWorks.heading}
            </h2>
            <p className="mt-5 text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
              {howItWorks.description}
            </p>
          </div>

          <div className="relative grid gap-8 md:grid-cols-3 md:gap-8">
            <svg
              aria-hidden="true"
              viewBox="0 0 1000 44"
              preserveAspectRatio="none"
              className="pointer-events-none absolute left-0 top-0 hidden h-11 w-full lg:block"
            >
              <path
                d="M167 22 C260 22 260 8 333 8 S430 36 500 22 S667 8 733 8 S780 22 833 22"
                fill="none"
                stroke="currentColor"
                strokeDasharray="5 7"
                strokeLinecap="round"
                className="text-primary/45"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            {howItWorks.steps.map((step, index) => {
              const Icon = stepIcons[index];

              return (
                <article key={step.title} className="relative md:px-3">
                  <div className="relative z-10 mb-6 flex size-11 items-center justify-center rounded-full border border-primary/40 bg-background text-primary shadow-[0_0_24px_oklch(0.74_0.16_55_/_12%)] md:mx-auto">
                    <Icon aria-hidden="true" className="size-4" />
                  </div>
                  <p className="mb-2 font-mono text-[10px] tracking-[0.14em] text-primary uppercase">
                    Waypoint 0{index + 1}
                  </p>
                  <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="scroll-mt-20 px-6 py-16 sm:py-24"
        aria-labelledby="pricing-heading"
      >
        <div className="mx-auto max-w-6xl text-center">
          <div className="mx-auto max-w-2xl">
            <p className="mb-4 font-mono text-xs tracking-[0.16em] text-primary uppercase">
              {pricing.eyebrow}
            </p>
            <h2
              id="pricing-heading"
              className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl"
            >
              {pricing.heading}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-7 text-muted-foreground">
              {pricing.description}
            </p>
          </div>
          <Tabs
            defaultValue="user"
            className="mx-auto mt-8 w-full items-center gap-7 sm:mt-10 sm:gap-9"
          >
            <TabsList className="h-auto rounded-full border border-white/10 bg-white/3 p-1">
              <TabsTrigger value="user" className={PRICING_TAB}>
                Personal
              </TabsTrigger>
              <TabsTrigger value="organization" className={PRICING_TAB}>
                Team
              </TabsTrigger>
            </TabsList>
            <TabsContent value="user" className="w-full">
              <div className="mx-auto w-full max-w-5xl">
                <PricingTable for="user" />
              </div>
            </TabsContent>
            <TabsContent value="organization" className="w-full">
              <div className="mx-auto w-full max-w-5xl">
                <PricingTable for="organization" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="topo-bg relative isolate overflow-hidden border-t border-white/8 px-6 py-16 sm:py-20">
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 text-center md:flex-row md:justify-between md:text-left">
          <div className="max-w-2xl">
            <p className="mb-4 font-mono text-xs tracking-[0.16em] text-primary uppercase">
              {closing.eyebrow}
            </p>
            <h2 className="text-balance text-4xl leading-tight font-semibold tracking-tight sm:text-6xl">
              {closing.heading}
            </h2>
            <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
              {closing.description}
            </p>
            <Button asChild className="mt-8 h-12 px-6 text-base">
              <Link href="/sign-up">
                {closing.action}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <Image
            src="/brand/mascot-dark.png"
            alt={closing.mascotAlt}
            width={500}
            height={500}
            className="w-36 shrink-0 drop-shadow-[0_0_40px_oklch(0.74_0.16_55_/_15%)] sm:w-48 md:w-60"
          />
        </div>
      </section>

      <footer className="border-t border-white/8 px-6 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <span>{footer.copyright}</span>
          <span>{footer.tagline}</span>
        </div>
      </footer>
    </main>
  );
}
