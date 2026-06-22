import Image from "next/image";
import Container from "@/components/sections/shared/Container";
import LinkArrow from "@/components/ui/LinkArrow";
import Carousel from "@/components/ui/Carousel";
import Reveal from "@/components/ui/Reveal";

const news = [
  {
    title: "Virya Energy and EBRD Partner to Accelerate Renewable Energy Expansion in Poland",
    categories: ["Solar", "General news"],
    location: "Braine L'Alleud",
    date: "26 Feb 2026",
    excerpt: "Virya Energy NV is pleased to announce the acceleration of its renewable energy expansion in Poland, through a strategic partnership with the European Bank for Reconstruction and Development.",
    image: "/images/pages/home/Virya-Energy-Image27.jpg",
  },
  {
    title: "Virya Energy Expands into Japan's Renewable Market through Integration of BayWa r.e.'s Japan Solar Platform",
    categories: ["General news", "Solar"],
    location: "Tokyo, Japan",
    date: "12 Dec 2025",
    excerpt: "Virya Energy, a prominent and trusted player in the global energy transition, today announced its formal entry into Japan's renewable power generation sector.",
    image: "/images/pages/home/Virya-Energy-Baywa-acquisition-1-768x432.jpg",
  },
  {
    title: "Belgium at the forefront in Europe's hydrogen mobility revolution",
    categories: ["Supply & Distribution"],
    location: "Spa-Francorchamps",
    date: "",
    excerpt: "Demonstration of hydrogen in heavy-duty transport — at the iconic Spa-Francorchamps circuit, Belgium signalled its ambition to lead Europe's hydrogen mobility transition.",
    image: "/images/pages/home/Virya-Energy-Image31.jpg",
  },
];

const pillTone: Record<string, string> = {
  Solar: "bg-accent/10 text-accent-700",
  "General news": "bg-brand/10 text-brand",
  Wind: "bg-brand/10 text-brand",
  Hydrogen: "bg-cream text-brand",
  "Supply & Distribution": "bg-cream text-brand",
};

export default function LatestNews() {
  return (
    <section className="bg-white py-24 lg:py-36">
      <Container>
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <h2 className="font-semibold tracking-[-0.02em] text-[clamp(36px,5vw,72px)] leading-[1.05]">
              <span className="text-ink/30">Latest</span> <span className="text-brand">news</span>
            </h2>
            <LinkArrow href="/en/news/" tone="accent">See all news</LinkArrow>
          </div>
        </Reveal>

        <Carousel preset="news" ariaLabel="Latest news articles">
          {news.map((n) => (
            <article
              key={n.title}
              className="group flex flex-col shrink-0 grow-0 basis-[88%] sm:basis-[60%] md:basis-[45%] lg:basis-[33%] overflow-hidden rounded-2xl bg-white border border-ink/5 hover:shadow-card transition-shadow"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={n.image}
                  alt={n.title}
                  fill
                  sizes="(max-width: 768px) 88vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  {n.categories.map((c) => (
                    <span key={c} className={`rounded-full px-3 py-1 text-[11.5px] font-medium ${pillTone[c] ?? "bg-cream text-brand"}`}>{c}</span>
                  ))}
                </div>
                <h3 className="text-[18px] font-semibold leading-snug text-ink mb-3 line-clamp-3">{n.title}</h3>
                <p className="text-[13.5px] text-ink/55 mb-4">
                  {n.location}{n.date ? ` · ${n.date}` : ""}
                </p>
                <p className="text-[15px] text-ink/75 leading-relaxed mb-6 line-clamp-3">{n.excerpt}</p>
                <div className="mt-auto pt-2">
                  <LinkArrow href="/en/news/" tone="accent">See more</LinkArrow>
                </div>
              </div>
            </article>
          ))}
        </Carousel>
      </Container>
    </section>
  );
}
