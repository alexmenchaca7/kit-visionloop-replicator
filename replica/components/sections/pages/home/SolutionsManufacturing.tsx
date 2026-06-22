import Image from "next/image";
import Container from "@/components/sections/shared/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { TrendingDown, ShieldCheck, Activity, BatteryCharging } from "lucide-react";

const benefits = [
  { icon: TrendingDown, label: "Energy Cost Reduction" },
  { icon: ShieldCheck, label: "Regulatory Compliance" },
  { icon: Activity, label: "Energy Resilience" },
  { icon: BatteryCharging, label: "Energy Independence" },
];

export default function SolutionsManufacturing() {
  return (
    <section className="bg-white py-10 lg:py-16">
      <Container>
        <Reveal>
        <div className="relative overflow-hidden rounded-[28px] min-h-[540px] lg:min-h-[620px] isolate">
          <Image
            src="/images/pages/home/Tailor-Made-Solutions.jpg"
            alt=""
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover -z-10"
          />
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-l from-brand/90 via-brand/70 to-brand/40" />
          <div className="relative p-10 lg:p-16 grid lg:grid-cols-2 gap-10 h-full">
            <ul className="grid grid-cols-2 gap-4 self-end order-2 lg:order-1">
              {benefits.map((b) => {
                const Icon = b.icon;
                return (
                  <li key={b.label} className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-5 text-white">
                    <Icon className="size-5 text-cream mb-3" strokeWidth={1.6} aria-hidden />
                    <p className="text-[14.5px] font-medium leading-snug">{b.label}</p>
                  </li>
                );
              })}
            </ul>
            <div className="text-white order-1 lg:order-2 lg:text-right lg:justify-self-end">
              <p className="text-[13px] uppercase tracking-[0.18em] text-cream/85 mb-4">Solutions</p>
              <h2 className="font-semibold tracking-[-0.02em] text-[clamp(32px,3.8vw,52px)] leading-[1.08] max-w-md lg:ml-auto">
                Business solutions for <span className="text-accent">Manufacturing Operations</span>
              </h2>
              <p className="mt-5 text-[16px] text-white/85 max-w-lg leading-relaxed lg:ml-auto">
                Reduce energy costs and increase resilience with behind-the-meter solar, hydrogen and supply solutions.
              </p>
              <div className="mt-8 flex lg:justify-end">
                <Button href="/en/your-activity/manufacturing-operations/" variant="primary">Learn more</Button>
              </div>
            </div>
          </div>
        </div>
        </Reveal>
      </Container>
    </section>
  );
}
