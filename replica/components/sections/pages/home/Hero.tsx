import Image from "next/image";
import Container from "@/components/sections/shared/Container";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative isolate -mt-[72px] pt-[72px] h-[820px] lg:h-[920px] overflow-hidden bg-brand-950 text-white">
      <Image
        src="/images/pages/home/2024_10_22-Vyria-Drone-c-Tof-Studio-Antoine-BRODKOM-_brod.kom-31.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center -z-10"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-950/20 via-transparent to-brand-950/70"
      />
      <Container className="relative h-full flex items-end pb-16 lg:pb-20">
        <div className="w-full grid lg:grid-cols-[1.6fr_1fr] gap-10 items-end">
          <h1 className="font-semibold leading-[0.9] tracking-[-0.025em] text-[clamp(80px,12vw,176px)]">
            <span className="text-accent block">Fit For</span>
            <span className="text-cream block">Purpose</span>
            <span className="text-accent block">Energy</span>
          </h1>
          <div className="lg:pb-2">
            <div className="rounded-2xl bg-brand/65 backdrop-blur-md border border-white/10 p-6">
              <p className="text-[12px] uppercase tracking-[0.22em] text-cream/90 mb-3">Energy</p>
              <p className="text-[14px] leading-relaxed text-white/90">
                We develop sustainable energy solutions across 15+ countries — wind, solar, hydrogen and supply.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button href="/contact/" variant="primary" size="md">Build with us</Button>
                <Button href="/en/projects/" variant="secondary" size="md">Discover our work</Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
