import Container from "@/components/sections/shared/Container";
import LinkArrow from "@/components/ui/LinkArrow";
import Reveal from "@/components/ui/Reveal";

const items = [
  { value: "625", unit: "MW", label: "Installed production capacity" },
  { value: "700+", unit: "", label: "Employees over multiple markets" },
  { value: "6", unit: "", label: "Hydrogen service stations" },
  { value: "15+", unit: "", label: "Countries with a Virya presence" },
];

export default function Stats() {
  return (
    <section className="bg-white py-10 lg:py-16">
      <Container>
        <Reveal>
        <div className="relative overflow-hidden rounded-[28px] bg-brand text-white">
          <div className="grid lg:grid-cols-[0.9fr_2.4fr] gap-10 p-10 lg:p-14">
            <div>
              <p className="text-[13px] uppercase tracking-[0.18em] text-cream/70 mb-4">
                Virya Energy
              </p>
              <h2 className="font-semibold tracking-[-0.02em] text-[clamp(36px,4vw,60px)] leading-[1.05] text-cream">
                In a few <br /> <span className="text-accent">numbers</span>
              </h2>
              <div className="mt-8">
                <LinkArrow href="/en/about-us/" tone="white">Learn more</LinkArrow>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 self-end">
              {items.map((s) => (
                <div key={s.label}>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[44px] lg:text-[56px] font-semibold leading-none text-white">{s.value}</span>
                    {s.unit && <span className="text-[20px] font-medium text-cream/85">{s.unit}</span>}
                  </div>
                  <p className="mt-3 text-[13.5px] text-white/75 leading-snug">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          {/* decorative ring */}
          <div aria-hidden className="pointer-events-none absolute -bottom-32 -right-20 size-[420px] rounded-full border border-white/10" />
          <div aria-hidden className="pointer-events-none absolute -bottom-44 -right-28 size-[520px] rounded-full border border-white/5" />
        </div>
        </Reveal>
      </Container>
    </section>
  );
}
