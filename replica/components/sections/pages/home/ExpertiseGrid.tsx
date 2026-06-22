import { Wind, Sun, Atom, Plug, Activity, Factory } from "lucide-react";
import Container from "@/components/sections/shared/Container";
import LinkArrow from "@/components/ui/LinkArrow";
import Carousel from "@/components/ui/Carousel";
import Reveal from "@/components/ui/Reveal";

const cards = [
  { icon: Wind, title: "Community-centered wind energy development.", body: "We finance, develop and operate onshore wind energy projects, centred around community interests and environmental stewardship.", linkLabel: "Wind Energy", href: "/en/our-expertise/wind-energy/" },
  { icon: Sun, title: "Large and medium scale solar and agrovoltaic solutions.", body: "Our industrial-scale solar projects and innovative agrovoltaic solutions are seamlessly integrated with local grid systems.", linkLabel: "Solar Energy", href: "/en/our-expertise/solar-energy/" },
  { icon: Atom, title: "Pioneering of renewable hydrogen production.", body: "We lead in RFNBO hydrogen development, adding an essential component to the zero-emission energy landscape.", linkLabel: "Hydrogen development", href: "/en/our-expertise/hydrogen-development/" },
  { icon: Plug, title: "Enabling the transition for everyone.", body: "Through our DATS 24 brand, we provide a network of fueling stations, green energy contracts for homes and EV charging parks ensuring clean energy accessibility for all.", linkLabel: "Energy supply", href: "/en/our-expertise/energy-supply/" },
  { icon: Activity, title: "Comprehensive energy infrastructure monitoring.", body: "Our infrastructure monitoring services ensure optimal performance of energy installations on land and sea.", linkLabel: "Service companies", href: "/en/our-expertise/service-companies/" },
  { icon: Factory, title: "Tailor made, fit for purpose B2B sustainable energy solutions", body: "We guide our B2B clients in their energy transition, with minimum disruption, through a frictionless integration of behind-the-meter solutions.", linkLabel: "Your Activity", href: "/en/your-activity/manufacturing-operations/" },
];

export default function ExpertiseGrid() {
  return (
    <section className="bg-white py-24 lg:py-36">
      <Container>
        <Reveal>
          <div className="mb-12 lg:mb-16">
            <h2 className="font-semibold tracking-[-0.02em] text-[clamp(36px,5vw,72px)] leading-[1.05]">
              <span className="text-ink/30">Our</span> <span className="text-brand">expertise</span>
            </h2>
          </div>
        </Reveal>

        <Carousel preset="expertise" ariaLabel="Our expertise areas">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <article
                key={c.linkLabel}
                className="group flex flex-col shrink-0 grow-0 basis-[85%] sm:basis-[55%] md:basis-[40%] lg:basis-[28%] xl:basis-[23%] p-2"
              >
                <div className="mb-6 inline-flex size-14 items-center justify-center rounded-full bg-cream text-brand">
                  <Icon className="size-6" aria-hidden strokeWidth={1.6} />
                </div>
                <h3 className="mb-3 text-[20px] font-semibold leading-[1.25] text-ink min-h-[3em]">
                  {c.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-ink/70 mb-5 line-clamp-4">{c.body}</p>
                <div className="mt-auto pt-1">
                  <LinkArrow href={c.href} tone="accent">{c.linkLabel}</LinkArrow>
                </div>
              </article>
            );
          })}
        </Carousel>
      </Container>
    </section>
  );
}
