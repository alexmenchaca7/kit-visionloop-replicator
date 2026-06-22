import Image from "next/image";
import Container from "@/components/sections/shared/Container";
import LinkArrow from "@/components/ui/LinkArrow";
import Carousel from "@/components/ui/Carousel";
import Reveal from "@/components/ui/Reveal";

const projects = [
  { title: "Ollignies North", category: "Wind", image: "/images/pages/home/2024_10_22-Vyria-Assets-c-Tof-Studio-Antoine-BRODKOM-_brod.kom-87-768x512.jpg" },
  { title: "Groupe Bonnin", category: "Solar", image: "/images/pages/home/Bonnin_drone-5.jpg" },
  { title: "HQ DRSD Malakoff", category: "Solar", image: "/images/pages/home/DRSD-Malakoff-.jpg" },
  { title: "Fresenius Kabi", category: "Solar", image: "/images/pages/home/240513-Fresenius-Brezins.jpg" },
  { title: "Agence Léon Grosse Aix-les Bains", category: "Solar", image: "/images/pages/home/Aix-les-Bains-Ombriere-2.jpg" },
  { title: "Parc de Lislet 2", category: "Wind", image: "/images/pages/home/Colruyt-spa015-768x512.avif" },
];

const categoryTone: Record<string, string> = {
  Wind: "bg-brand/10 text-brand",
  Solar: "bg-accent/10 text-accent-600",
  Hydrogen: "bg-cream text-brand",
};

export default function FeaturedProjects() {
  return (
    <section className="bg-white py-24 lg:py-36">
      <Container>
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <h2 className="font-semibold tracking-[-0.02em] text-[clamp(36px,5vw,72px)] leading-[1.05]">
              <span className="text-ink/30">Our</span> <span className="text-brand">projects</span>
            </h2>
            <LinkArrow href="/en/projects/" tone="accent">Discover our projects</LinkArrow>
          </div>
        </Reveal>

        <Carousel preset="projects" ariaLabel="Featured projects">
          {projects.map((p) => (
            <article
              key={p.title}
              className="group shrink-0 grow-0 basis-[85%] sm:basis-[55%] md:basis-[42%] lg:basis-[32%] overflow-hidden rounded-2xl bg-surface-subtle"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 85vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                />
                <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[12px] font-medium ${categoryTone[p.category] ?? "bg-cream text-brand"}`}>
                  {p.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-[18px] font-semibold text-ink leading-snug">{p.title}</h3>
              </div>
            </article>
          ))}
        </Carousel>
      </Container>
    </section>
  );
}
