import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LinkArrow({
  href,
  children,
  className,
  tone = "ink",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  tone?: "ink" | "white" | "accent";
}) {
  const tones = {
    ink: "text-ink hover:text-accent",
    white: "text-white hover:text-cream",
    accent: "text-accent hover:text-accent-600",
  };
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 text-[15px] font-medium transition-colors",
        tones[tone],
        className
      )}
    >
      <span className="underline-offset-4 group-hover:underline">{children}</span>
      <ArrowRight className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" aria-hidden />
    </Link>
  );
}
