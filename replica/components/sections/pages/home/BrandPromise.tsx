import Container from "@/components/sections/shared/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

export default function BrandPromise() {
  return (
    <section className="bg-white py-10 lg:py-16">
      <Container>
        <Reveal>
        <div className="rounded-[28px] bg-cream p-12 lg:p-24">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[13px] uppercase tracking-[0.18em] text-ink/55 mb-4">Brand promise</p>
              <h2 className="font-semibold tracking-[-0.02em] text-[clamp(36px,4.5vw,68px)] leading-[1.05] text-brand">
                Our <span className="text-ink">Fit For Purpose</span> <br className="hidden md:block" /> Brand Promise
              </h2>
            </div>
            <div className="space-y-6">
              <p className="text-[17px] leading-relaxed text-ink/80">
                For Virya Energy, the energy transition must be adapted to each reality. Our &lsquo;fit for purpose&rsquo; approach reflects our commitment to developing customized solutions that exactly meet everyone&rsquo;s needs. By simplifying access to renewable energy, we are building a path towards a sustainable future.
              </p>
              <Button href="/en/about-us/" variant="primary" size="md">Learn more</Button>
            </div>
          </div>
        </div>
        </Reveal>
      </Container>
    </section>
  );
}
