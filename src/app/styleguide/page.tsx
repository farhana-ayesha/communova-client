import { ArrowRight, Plus } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Monogram, Wordmark } from "@/components/brand/wordmark";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

const colours = [
  { name: "paper", hex: "#FAF6ED", dark: "#0F1613", className: "bg-paper", usage: "Canvas" },
  { name: "sand", hex: "#F1E9DA", dark: "#16211C", className: "bg-sand", usage: "Alt surface, hover, skeleton" },
  { name: "bark", hex: "#DED2BD", dark: "#2A362F", className: "bg-bark", usage: "Hairlines, borders" },
  { name: "ink", hex: "#14201A", dark: "#ECE6D8", className: "bg-ink", usage: "Primary text" },
  { name: "ink-muted", hex: "#5A655D", dark: "#9BA79E", className: "bg-ink-muted", usage: "Secondary text" },
  { name: "canopy", hex: "#1B3A2C", dark: "#204636", className: "bg-canopy", usage: "Brand, dark panels" },
  { name: "fern", hex: "#2C5A43", dark: "#2F6A4E", className: "bg-fern", usage: "Hover, open state" },
  { name: "clay", hex: "#A54B25", dark: "#E08A5F", className: "bg-clay", usage: "Accent text, focus ring" },
  { name: "ember", hex: "#B3542B", dark: "#D2734A", className: "bg-ember", usage: "Accent fill" },
  { name: "marigold", hex: "#D99A4E", dark: "#D9A25E", className: "bg-marigold", usage: "Highlight wash only" },
] as const;

const contrastPairs = [
  ["ink on paper", "15.6:1", "AAA"],
  ["ink-muted on paper", "5.6:1", "AA"],
  ["clay on paper", "5.4:1", "AA"],
  ["paper on canopy", "11.5:1", "AAA"],
  ["paper on ember", "5.0:1", "AA"],
  ["ink on dark canvas", "13.3:1", "AAA"],
  ["clay on dark canvas", "7.0:1", "AAA"],
] as const;

const spacing = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128] as const;

const navLinks = [
  ["identity", "Identity"],
  ["colour", "Colour"],
  ["typography", "Type"],
  ["space", "Space"],
  ["components", "Components"],
  ["composition", "Composition"],
  ["rules", "Rules"],
] as const;

function Section({
  id,
  index,
  title,
  intro,
  children,
}: {
  id: string;
  index: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-bark pt-8 md:pt-10">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-meta text-clay">{index}</span>
        <h2 className="font-serif text-h2 text-ink">{title}</h2>
      </div>
      {intro ? <p className="mt-3 max-w-[62ch] text-body text-ink-muted">{intro}</p> : null}
      <div className="mt-8">{children}</div>
    </section>
  );
}

function SwatchRow({
  name,
  hex,
  className,
  usage,
}: {
  name: string;
  hex: string;
  className: string;
  usage: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className={cn("size-9 shrink-0 rounded-[2px] border border-bark", className)} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-mono text-meta text-ink">{name}</span>
          <span className="font-mono text-[10px] tracking-[0.06em] text-ink-muted">{hex}</span>
        </div>
        <p className="mt-0.5 truncate text-[12px] leading-4 text-ink-muted">{usage}</p>
      </div>
    </div>
  );
}

function TypeRow({
  token,
  spec,
  children,
}: {
  token: string;
  spec: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-3 border-t border-bark py-6 first:border-t-0 first:pt-0 md:grid-cols-12 md:gap-8">
      <div className="md:col-span-3">
        <p className="font-mono text-meta text-ink">{token}</p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
          {spec}
        </p>
      </div>
      <div className="md:col-span-9">{children}</div>
    </div>
  );
}

function Rule({ index, title, children }: { index: string; title: string; children: ReactNode }) {
  return (
    <div className="border-t border-bark pt-4">
      <p className="font-mono text-[10px] tracking-[0.16em] text-clay">{index}</p>
      <h3 className="mt-2 font-serif text-h3 text-ink">{title}</h3>
      <p className="mt-2 max-w-[48ch] text-small leading-relaxed text-ink-muted">{children}</p>
    </div>
  );
}

export default function StyleguidePage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <div className="min-h-full bg-background">
      <header className="border-b border-bark">
        <Container className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Monogram className="size-6 text-ink" />
            <Wordmark className="text-lg" />
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden font-mono text-meta uppercase tracking-[0.14em] text-ink-muted sm:inline">
              v0.1 · Phase 00
            </span>
            <ThemeToggle />
          </div>
        </Container>
      </header>

      <nav aria-label="Design system sections" className="sticky top-0 z-20 border-b border-bark bg-background">
        <Container className="flex gap-6 overflow-x-auto py-3">
          {navLinks.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="whitespace-nowrap font-mono text-meta uppercase tracking-[0.14em] text-ink-muted transition-colors hover:text-ink"
            >
              {label}
            </a>
          ))}
        </Container>
      </nav>

      <main className="pb-24">
        <Container className="pt-12 md:pt-16">
          <p className="font-mono text-eyebrow uppercase text-clay">Internal · not in navigation</p>
          <h1 className="mt-5 max-w-[20ch] text-balance font-serif text-h1 text-ink">
            The Civic Almanac design system
          </h1>
          <p className="mt-5 max-w-[58ch] text-body text-ink-muted">
            Warm paper, deep canopy green, one clay accent, and an editorial grid.
            Every page composes from the tokens and primitives documented here — no
            page invents its own spacing, radius, or type size.
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-px border border-bark bg-bark sm:grid-cols-4">
            {[
              ["Typefaces", "3"],
              ["Colour tokens", "10"],
              ["Radius steps", "2px / 4px"],
              ["Grid", "12 col"],
            ].map(([label, value]) => (
              <div key={label} className="bg-background px-4 py-4">
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">{label}</dt>
                <dd className="mt-2 font-serif text-h3 text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </Container>

        <Container className="mt-16 space-y-16 md:mt-20 md:space-y-20">
          <Section
            id="identity"
            index="01"
            title="Identity"
            intro="A field journal for a city's collective effort. The wordmark is set in Instrument Serif, sentence case, tracked slightly tight. The monogram is a participant ring with one accent bead — never a leaf, heart, or handshake."
          >
            <div className="grid items-end gap-10 border border-bark bg-paper p-6 md:grid-cols-2 md:p-10">
              <div>
                <Wordmark className="text-[clamp(2.5rem,6vw,4.5rem)] leading-none" />
                <p className="mt-4 font-mono text-meta uppercase tracking-[0.14em] text-ink-muted">
                  The record of what a city does for itself
                </p>
              </div>
              <div className="flex items-end justify-start gap-6 md:justify-end">
                <div className="text-center">
                  <Monogram className="mx-auto size-14 text-ink" />
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                    32px
                  </p>
                </div>
                <div className="text-center">
                  <Monogram className="mx-auto size-6 text-ink" />
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                    24px
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {[
                ["Voice", "Plain and specific. “Blanket drive, Mohammadpur. 38 going.”"],
                ["Record numbers", "No. 014 — every event and section carries one."],
                ["Photography", "Documentary, male-only subjects, captions in mono."],
              ].map(([title, body]) => (
                <div key={title} className="border-t border-bark pt-4">
                  <h3 className="text-[13px] font-medium text-ink">{title}</h3>
                  <p className="mt-2 text-small leading-relaxed text-ink-muted">{body}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section
            id="colour"
            index="02"
            title="Colour"
            intro="Ten brand tokens, mapped onto the shadcn/ui semantic contract (background, foreground, primary, muted, border, ring…). Values flip between themes; the palette never gains a third hue."
          >
            <div className="grid gap-px border border-bark bg-bark lg:grid-cols-2">
              <div className="bg-paper p-5 md:p-7">
                <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                  Light
                </p>
                <div className="space-y-3.5">
                  {colours.map((colour) => (
                    <SwatchRow
                      key={colour.name}
                      name={colour.name}
                      hex={colour.hex}
                      className={colour.className}
                      usage={colour.usage}
                    />
                  ))}
                </div>
              </div>

              <div className="dark bg-paper p-5 text-ink md:p-7">
                <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                  Dark
                </p>
                <div className="space-y-3.5">
                  {colours.map((colour) => (
                    <SwatchRow
                      key={colour.name}
                      name={colour.name}
                      hex={colour.dark}
                      className={colour.className}
                      usage={colour.usage}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                  Measured contrast
                </p>
                <table className="mt-3 w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-bark">
                      <th className="py-2 font-mono text-[10px] font-normal uppercase tracking-[0.14em] text-ink-muted">
                        Pair
                      </th>
                      <th className="py-2 text-right font-mono text-[10px] font-normal uppercase tracking-[0.14em] text-ink-muted">
                        Ratio
                      </th>
                      <th className="py-2 text-right font-mono text-[10px] font-normal uppercase tracking-[0.14em] text-ink-muted">
                        Level
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {contrastPairs.map(([pair, ratio, level]) => (
                      <tr key={pair} className="border-b border-bark/60">
                        <td className="py-2 text-[13px] text-ink">{pair}</td>
                        <td className="py-2 text-right font-mono text-meta text-ink">{ratio}</td>
                        <td className="py-2 text-right font-mono text-meta text-ink-muted">{level}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="lg:col-span-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                  Rules
                </p>
                <ul className="mt-3 space-y-3 text-small leading-relaxed text-ink-muted">
                  <li className="border-t border-bark pt-3">
                    Marigold never carries text on paper (2.2:1) — it is a wash behind canopy only.
                  </li>
                  <li className="border-t border-bark pt-3">
                    Clay lifts to <span className="font-mono text-meta text-ink">#E08A5F</span> in dark so
                    accent text stays above 7:1.
                  </li>
                  <li className="border-t border-bark pt-3">
                    No gradients. One shadow, reserved for menus and dialogs.
                  </li>
                </ul>
              </div>
            </div>
          </Section>

          <Section
            id="typography"
            index="03"
            title="Typography"
            intro="Instrument Serif for editorial voice, Instrument Sans for interface, IBM Plex Mono for records. Hierarchy comes from size and colour, never from invented weights."
          >
            <div>
              <TypeRow token="text-display" spec="Instrument Serif · clamp(3rem → 5.75rem) · 0.94">
                <p className="font-serif text-display text-ink">Show up. Keep a record.</p>
              </TypeRow>
              <TypeRow token="text-h1" spec="Serif · clamp(2.5rem → 4rem) · -0.02em">
                <p className="font-serif text-h1 text-ink">Upcoming events</p>
              </TypeRow>
              <TypeRow token="text-h2" spec="Serif · clamp(1.875rem → 2.75rem)">
                <p className="font-serif text-h2 text-ink">What the city is doing this month</p>
              </TypeRow>
              <TypeRow token="text-h3" spec="Serif · 1.5rem">
                <p className="font-serif text-h3 text-ink">Blanket distribution, Mohammadpur</p>
              </TypeRow>
              <TypeRow token="text-body" spec="Instrument Sans · 17px · 1.65 · 68ch max">
                <p className="max-w-[64ch] text-body text-ink">
                  Any resident can post a service event: a cleanup, a plantation drive, a
                  blanket collection. Neighbours join in one click, and the record keeps
                  what actually happened.
                </p>
              </TypeRow>
              <TypeRow token="text-small" spec="Instrument Sans · 14px · 1.5">
                <p className="max-w-[56ch] text-small text-ink-muted">
                  Supporting copy, helper text, and table secondary cells use this size.
                </p>
              </TypeRow>
              <TypeRow token="text-eyebrow" spec="IBM Plex Mono · 11px · 0.18em · uppercase">
                <p className="font-mono text-eyebrow uppercase text-clay">
                  The civic almanac · Dhaka
                </p>
              </TypeRow>
              <TypeRow token="text-meta" spec="IBM Plex Mono · 12px · 0.06em">
                <p className="font-mono text-meta text-ink-muted">
                  Sat 14 Nov · 09:00 · 23.8069° N, 90.3687° E
                </p>
              </TypeRow>
            </div>
          </Section>

          <Section
            id="space"
            index="04"
            title="Space & geometry"
            intro="An 8px baseline with a four-step floor for dense UI. Two radii only: 2px for controls and cards, 4px for dialogs. Circles belong to avatars alone."
          >
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                  Spacing scale
                </p>
                <ul className="mt-4 space-y-2">
                  {spacing.map((value) => (
                    <li key={value} className="flex items-center gap-4">
                      <span className="w-8 shrink-0 font-mono text-[10px] text-ink-muted">{value}</span>
                      <span
                        className="h-2 rounded-[1px] bg-canopy"
                        style={{ width: `${value}px` }}
                        aria-hidden
                      />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                    Radius
                  </p>
                  <div className="mt-4 flex items-end gap-4">
                    {[2, 4].map((radius) => (
                      <div key={radius} className="text-center">
                        <div
                          className="size-16 border border-bark bg-sand"
                          style={{ borderRadius: `${radius}px` }}
                          aria-hidden
                        />
                        <p className="mt-2 font-mono text-[10px] text-ink-muted">{radius}px</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-[12px] leading-5 text-ink-muted">
                    Pill shapes and large radii are excluded from the system.
                  </p>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                    Elevation
                  </p>
                  <div className="mt-4 rounded-[2px] border border-bark bg-card px-4 py-3 text-[13px] text-ink shadow-overlay">
                    Overlay panel
                  </div>
                  <div className="mt-3 rounded-[2px] border border-bark bg-card px-4 py-3 text-[13px] text-ink">
                    Static card — border only
                  </div>
                  <p className="mt-4 text-[12px] leading-5 text-ink-muted">
                    Cards never float. Shadows belong to menus and dialogs.
                  </p>
                </div>
              </div>
            </div>
          </Section>

          <Section
            id="components"
            index="05"
            title="Components"
            intro="Controls are 44px tall, square-cornered, and bordered. The primary action is a filled canopy block; everything else steps back."
          >
            <div className="space-y-10">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                  Buttons
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Button>
                    Browse events
                    <ArrowRight className="size-4 transition-transform group-hover/button:translate-x-0.5" />
                  </Button>
                  <Button variant="secondary">Start an event</Button>
                  <Button variant="ghost">Ghost action</Button>
                  <Button variant="destructive">Delete event</Button>
                  <Button variant="link">View all events</Button>
                  <Button disabled>Disabled</Button>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon" aria-label="Add event">
                    <Plus className="size-4" aria-hidden />
                  </Button>
                </div>
              </div>

              <div className="grid gap-10 lg:grid-cols-2">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                    Form field
                  </p>
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="sample-title">Event title</Label>
                    <Input id="sample-title" placeholder="Winter clothes distribution" />
                    <p className="text-[12px] leading-5 text-ink-muted">
                      Keep it specific: what is being distributed, and where.
                    </p>
                  </div>
                  <div className="mt-6 space-y-2">
                    <Label htmlFor="sample-error">Event date</Label>
                    <Input
                      id="sample-error"
                      type="date"
                      aria-invalid
                      defaultValue="2024-01-04"
                      aria-describedby="sample-error-message"
                    />
                    <p id="sample-error-message" className="text-[12px] leading-5 text-clay">
                      The date must be in the future.
                    </p>
                  </div>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                    Tags & status
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Tag tone="upcoming">Upcoming</Tag>
                    <Tag tone="joined">Joined</Tag>
                    <Tag tone="full">Full</Tag>
                    <Tag tone="past">Past</Tag>
                    <Tag tone="neutral">Cleanup</Tag>
                  </div>
                  <p className="mt-3 max-w-[40ch] text-[12px] leading-5 text-ink-muted">
                    Colour lives in the dot so the label keeps full contrast in both themes.
                  </p>

                  <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                    Skeleton
                  </p>
                  <div className="mt-4 max-w-[280px] space-y-3">
                    <Skeleton className="aspect-[3/2] w-full" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-2/3" />
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Section
            id="composition"
            index="06"
            title="Composition"
            intro="Section openers and event cards are shared components, so the homepage strip, the listing grid, and the create-event preview cannot drift apart."
          >
            <SectionHeader
              label="Happening soon"
              title="Six events, closest first"
              description="Pulled live from the API, filtered to future dates, sorted by event date."
              action={
                <Button variant="link" asChild>
                  <a href="#composition">
                    All events
                    <ArrowRight className="size-3.5" aria-hidden />
                  </a>
                </Button>
              }
            />

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <article className="group flex h-full flex-col overflow-hidden rounded-[2px] border border-bark bg-card">
                <div className="relative aspect-[3/2] w-full border-b border-bark bg-sand">
                  <span className="absolute inset-0 grid place-items-center font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                    3:2 · Plate A1
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <Tag tone="neutral">Cleanup</Tag>
                    <span className="font-mono text-[10px] tracking-[0.12em] text-ink-muted">No. 014</span>
                  </div>
                  <h3 className="line-clamp-2 font-serif text-h3 leading-tight text-ink">
                    Winter clothes distribution, Mirpur 10
                  </h3>
                  <p className="font-mono text-meta text-ink-muted">Sat 14 Nov · 09:00</p>
                  <div className="mt-auto flex items-center justify-between border-t border-bark pt-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
                      38 going
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-small font-medium text-ink transition-colors group-hover:text-clay">
                      View event
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </div>
                </div>
              </article>

              <p className="max-w-[46ch] self-center text-small leading-relaxed text-ink-muted sm:col-span-1 lg:col-span-2">
                Cards keep a fixed 3:2 image, a two-line title clamp, and a bottom-anchored
                meta row, so a grid of events never produces uneven heights. Hover darkens
                the border and scales the image 1.02 — nothing moves on click.
              </p>
            </div>
          </Section>

          <Section
            id="rules"
            index="07"
            title="System rules"
            intro="The constraints that keep nine pages looking like one product."
          >
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Rule index="01" title="One accent per view">
                Clay marks the action or the number. If two things compete, one of them is wrong.
              </Rule>
              <Rule index="02" title="Borders before shadows">
                Structure comes from hairlines. Shadows belong to overlays only.
              </Rule>
              <Rule index="03" title="No centred body copy">
                Headlines left-align to the grid. Short standalone states are the only exception.
              </Rule>
              <Rule index="04" title="Motion is feedback">
                120–200ms, 8px travel, no parallax. All of it disabled under reduced motion.
              </Rule>
              <Rule index="05" title="Focus is visible">
                A 2px clay outline at 2px offset on every interactive element, in both themes.
              </Rule>
              <Rule index="06" title="Both themes ship">
                Every section is reviewed at 375px and 1440px in light and dark before merge.
              </Rule>
            </div>

            <p className="mt-10 border-t border-bark pt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
              Dev-only route · hidden from production builds · update this page with every new primitive
            </p>
          </Section>
        </Container>
      </main>
    </div>
  );
}
