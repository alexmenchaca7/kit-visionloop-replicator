"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown, Menu, X, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import Container from "./Container";
import Button from "@/components/ui/Button";

const expertiseItems = [
  { label: "Wind Energy", href: "/en/our-expertise/wind-energy/" },
  { label: "Solar Energy", href: "/en/our-expertise/solar-energy/" },
  { label: "Hydrogen development", href: "/en/our-expertise/hydrogen-development/" },
  { label: "Service companies", href: "/en/our-expertise/service-companies/" },
  { label: "Energy supply", href: "/en/our-expertise/energy-supply/" },
];

const activityItems = [
  { label: "Manufacturing operations", href: "/en/your-activity/manufacturing-operations/" },
  { label: "Logistics Service Providers", href: "/en/your-activity/logistics-service-providers/" },
  { label: "Retail Businesses", href: "/en/your-activity/retail-businesses/" },
  { label: "Solutions for landowners", href: "/en/your-activity/landowners/" },
  { label: "Local Communities", href: "/en/your-activity/local-communities/" },
];

const navLinks = [
  { label: "About Us", href: "/en/about-us/" },
  { label: "Resources", href: "/en/resources/" },
  { label: "News", href: "/en/news/" },
  { label: "Cooperatives", href: "/en/cooperatives/" },
  { label: "Careers", href: "/en/careers/" },
  { label: "Projects", href: "/en/projects/" },
];

function Dropdown({ label, items }: { label: string; items: { label: string; href: string }[] }) {
  return (
    <div className="group relative">
      <button
        className="flex items-center gap-1 text-[15px] font-medium text-ink/85 hover:text-brand transition-colors"
        type="button"
      >
        {label}
        <ChevronDown className="size-4 transition-transform group-hover:rotate-180" aria-hidden />
      </button>
      <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        <div className="mt-3 min-w-[260px] rounded-2xl border border-ink/5 bg-white p-3 shadow-[0_20px_60px_-20px_rgba(15,67,56,0.25)]">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="block rounded-lg px-3 py-2.5 text-[14.5px] text-ink/85 hover:bg-cream hover:text-brand transition-colors"
            >
              {it.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-white/95 backdrop-blur-sm">
      <Container className="flex h-[72px] items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Virya Energy home">
          <Image
            src="/images/shared/virya-logo-1.png"
            alt="Virya Energy"
            width={130}
            height={36}
            priority
            className="h-9 w-auto"
          />
        </Link>
        <nav className="hidden xl:flex items-center gap-7">
          <Dropdown label="Our expertise" items={expertiseItems} />
          <Dropdown label="Your activity" items={activityItems} />
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[15px] font-medium text-ink/85 hover:text-brand transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-4">
          <button
            type="button"
            className="flex items-center gap-1 text-[14px] font-medium text-ink/70 hover:text-brand"
            aria-label="Language"
          >
            <Globe className="size-4" aria-hidden /> EN
          </button>
          <Button href="/contact/" variant="primary" size="md">
            Build with us
          </Button>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden p-2 -mr-2"
          aria-label="Toggle menu"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </Container>
      {/* Mobile menu */}
      <div className={cn("lg:hidden overflow-hidden transition-[max-height] duration-300", open ? "max-h-[80vh]" : "max-h-0")}>
        <div className="px-5 pb-6 space-y-1 border-t border-ink/5 bg-white">
          <details className="group py-1">
            <summary className="flex items-center justify-between py-2.5 cursor-pointer text-[15px] font-medium">
              Our expertise <ChevronDown className="size-4 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="pl-3 pb-2">
              {expertiseItems.map((i) => (
                <Link key={i.href} href={i.href} className="block py-2 text-[14px] text-ink/80">{i.label}</Link>
              ))}
            </div>
          </details>
          <details className="group py-1">
            <summary className="flex items-center justify-between py-2.5 cursor-pointer text-[15px] font-medium">
              Your activity <ChevronDown className="size-4 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="pl-3 pb-2">
              {activityItems.map((i) => (
                <Link key={i.href} href={i.href} className="block py-2 text-[14px] text-ink/80">{i.label}</Link>
              ))}
            </div>
          </details>
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="block py-2.5 text-[15px] font-medium">{l.label}</Link>
          ))}
          <div className="pt-4">
            <Button href="/contact/" variant="primary" className="w-full">Build with us</Button>
          </div>
        </div>
      </div>
    </header>
  );
}
