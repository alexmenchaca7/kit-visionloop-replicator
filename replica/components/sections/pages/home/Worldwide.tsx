"use client";
import { useState } from "react";
import Container from "@/components/sections/shared/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Hydrogen", "Solar", "Wind"] as const;

const projects = [
  { name: "Parc de l'Extension de la Haute Borne", location: "Halluin", country: "France", category: "Wind" },
  { name: "Parc du Petit Jésus", location: "Le Souich", country: "France", category: "Wind" },
  { name: "Parc de la Voie des Prêtres 2 Ouest", location: "Fontaine-les-Croisilles", country: "France", category: "Wind" },
  { name: "Orla", location: "", country: "Poland", category: "Wind" },
  { name: "Parc du Champ Grand'mère", location: "Canteleux", country: "France", category: "Wind" },
  { name: "Evia Wind Farm", location: "", country: "Greece", category: "Wind" },
  { name: "Aveiro", location: "", country: "Portugal", category: "Wind" },
  { name: "Grabkowo", location: "", country: "Poland", category: "Wind" },
  { name: "Sandaya", location: "", country: "France", category: "Solar" },
  { name: "Yves du Manoir Stadium", location: "", country: "France", category: "Solar" },
  { name: "Moulins Dumée", location: "", country: "France", category: "Solar" },
  { name: "Fresenius Kabi", location: "Brézins", country: "France", category: "Solar" },
  { name: "Nestle Surat", location: "Surat Thani", country: "Thailand", category: "Solar" },
  { name: "Fuji Seal", location: "Bangkok", country: "Thailand", category: "Solar" },
  { name: "Hyoffwind", location: "", country: "Belgium", category: "Hydrogen" },
  { name: "Terneuzen", location: "", country: "Belgium", category: "Hydrogen" },
  { name: "Vallhyège", location: "", country: "Belgium", category: "Hydrogen" },
];

export default function Worldwide() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const filtered = filter === "All" ? projects : projects.filter((p) => p.category === filter);
  return (
    <section className="bg-white py-10 lg:py-16">
      <Container>
        <Reveal>
        <div className="rounded-[28px] bg-cream p-10 lg:p-20">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 items-start">
            <div>
              <p className="text-[13px] uppercase tracking-[0.18em] text-ink/55 mb-4">Projects</p>
              <h2 className="font-semibold tracking-[-0.02em] text-[clamp(36px,4.5vw,68px)] leading-[1.05] text-brand mb-6">
                Worldwide <br /> <span className="text-ink">impact</span>
              </h2>
              <p className="text-[17px] leading-relaxed text-ink/75 max-w-md mb-8">
                Present across 3 continents, in 15+ countries — over 100 projects shaping the energy transition.
              </p>

              {/* simplified map svg */}
              <div className="relative rounded-2xl bg-white/60 p-6 mb-8 overflow-hidden">
                <svg viewBox="0 0 600 280" className="w-full h-auto" aria-hidden>
                  <defs>
                    <pattern id="dotgrid" width="8" height="8" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1.2" className="fill-brand/25" />
                    </pattern>
                  </defs>
                  {/* simplified continents as silhouettes */}
                  <path d="M70,90 Q120,60 180,80 T260,90 Q280,110 250,140 L210,170 L160,170 L120,150 Q80,130 70,90Z" fill="url(#dotgrid)" />
                  <path d="M270,70 Q310,55 360,70 T440,85 Q470,110 450,150 L390,170 L340,175 L300,160 Q270,130 270,70Z" fill="url(#dotgrid)" />
                  <path d="M380,160 Q430,150 500,160 T580,180 Q570,220 520,235 L450,235 L400,220 Q370,200 380,160Z" fill="url(#dotgrid)" />
                  {/* pins */}
                  <g>
                    <circle cx="320" cy="120" r="10" className="fill-accent" />
                    <text x="338" y="124" className="fill-brand text-[12px] font-semibold">98 Europe</text>
                    <circle cx="500" cy="180" r="8" className="fill-accent" />
                    <text x="514" y="184" className="fill-brand text-[12px] font-semibold">3 Asia</text>
                  </g>
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/70 p-5">
                  <p className="text-[36px] font-semibold text-brand leading-none">98</p>
                  <p className="text-[14px] text-ink/70 mt-2">projects in Europe</p>
                </div>
                <div className="rounded-2xl bg-white/70 p-5">
                  <p className="text-[36px] font-semibold text-brand leading-none">3</p>
                  <p className="text-[14px] text-ink/70 mt-2">projects in Asia</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={cn(
                      "rounded-full px-4 py-2 text-[14px] font-medium transition-colors",
                      filter === f
                        ? "bg-brand text-white"
                        : "bg-white/70 text-ink/75 hover:bg-white"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <ul className="max-h-[440px] overflow-y-auto divide-y divide-ink/10 rounded-2xl bg-white/60">
                {filtered.map((p, i) => (
                  <li key={i} className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-[15px] font-medium text-ink">{p.name}</p>
                      {(p.location || p.country) && (
                        <p className="text-[13px] text-ink/55">
                          {[p.location, p.country].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>
                    <span className="text-[11px] uppercase tracking-wider rounded-full bg-cream px-2.5 py-1 text-brand">
                      {p.category}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button href="/en/projects/" variant="primary">Discover all our projects</Button>
              </div>
            </div>
          </div>
        </div>
        </Reveal>
      </Container>
    </section>
  );
}
