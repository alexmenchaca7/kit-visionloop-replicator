import Link from "next/link";
import Image from "next/image";
import { Linkedin } from "lucide-react";
import Container from "./Container";

const columns = [
  {
    heading: "Our expertise",
    items: [
      { label: "Wind Energy", href: "/en/our-expertise/wind-energy/" },
      { label: "Solar Energy", href: "/en/our-expertise/solar-energy/" },
      { label: "Hydrogen development", href: "/en/our-expertise/hydrogen-development/" },
      { label: "Energy supply", href: "/en/our-expertise/energy-supply/" },
      { label: "Service companies", href: "/en/our-expertise/service-companies/" },
    ],
  },
  {
    heading: "Your Activity",
    items: [
      { label: "Local Communities", href: "/en/your-activity/local-communities/" },
      { label: "Logistics Service Providers", href: "/en/your-activity/logistics-service-providers/" },
      { label: "Manufacturing operations", href: "/en/your-activity/manufacturing-operations/" },
      { label: "Retail Businesses", href: "/en/your-activity/retail-businesses/" },
      { label: "Solutions for landowners", href: "/en/your-activity/landowners/" },
    ],
  },
  {
    heading: "Company",
    items: [
      { label: "About Us", href: "/en/about-us/" },
      { label: "Resources", href: "/en/resources/" },
      { label: "News", href: "/en/news/" },
      { label: "Cooperatives", href: "/en/cooperatives/" },
      { label: "Careers", href: "/en/careers/" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-brand text-white">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 lg:gap-8 lg:grid-cols-[1.2fr_3fr] items-start">
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center" aria-label="Virya Energy">
              <Image
                src="/images/shared/virya-logo-1.png"
                alt="Virya Energy"
                width={140}
                height={40}
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-[15px] text-white/70 max-w-xs leading-relaxed">
              Fit For Purpose Energy. We develop, finance, construct, and operate sustainable energy assets worldwide.
            </p>
            <a
              href="https://be.linkedin.com/company/virya-energy"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LinkedIn"
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/20 text-white/80 hover:bg-white hover:text-brand transition-colors"
            >
              <Linkedin className="size-4" />
            </a>
          </div>
          <div className="grid gap-10 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.heading}>
                <h3 className="text-[14px] font-semibold uppercase tracking-wider text-white/80 mb-4">
                  {col.heading}
                </h3>
                <ul className="space-y-2.5">
                  {col.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-[14.5px] text-white/70 hover:text-white transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-[13px] text-white/55">© {new Date().getFullYear()} Virya Energy. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-white/65">
            <Link href="/privacy-policy/" className="hover:text-white">Privacy Policy</Link>
            <Link href="/cookie-policy-eu/" className="hover:text-white">Cookie Policy</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
