import Container from "@/components/sections/shared/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

export default function FinalCta() {
  return (
    <section className="bg-white py-10 lg:py-16">
      <Container>
        <Reveal>
        <div className="relative overflow-hidden rounded-[28px] bg-brand text-white p-12 lg:p-20 text-center">
          <p className="text-[13px] uppercase tracking-[0.18em] text-cream/70 mb-5">Get in touch</p>
          <h2 className="mx-auto max-w-3xl font-semibold tracking-[-0.02em] text-[clamp(36px,4.5vw,64px)] leading-[1.06] text-cream">
            Start your <span className="text-accent">energy transition</span> today.
          </h2>
          <div className="mt-10 flex justify-center">
            <Button href="/contact/" variant="primary" size="lg">Get started</Button>
          </div>
          {/* deco rings */}
          <div aria-hidden className="pointer-events-none absolute -top-32 -left-24 size-[420px] rounded-full border border-white/10" />
          <div aria-hidden className="pointer-events-none absolute -bottom-44 -right-28 size-[520px] rounded-full border border-white/5" />
        </div>
        </Reveal>
      </Container>
    </section>
  );
}
