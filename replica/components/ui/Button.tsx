import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "light";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2";

const sizeMap = {
  md: "px-6 py-3 text-[15px]",
  lg: "px-7 py-3.5 text-base",
};

const variantMap: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-600 active:bg-accent-700 shadow-sm",
  secondary:
    "bg-transparent text-white border border-white/60 hover:bg-white hover:text-brand",
  ghost:
    "bg-transparent text-ink hover:bg-ink/5",
  light:
    "bg-white text-brand hover:bg-cream",
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  showArrow = false,
  external = false,
}: {
  href?: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: keyof typeof sizeMap;
  className?: string;
  showArrow?: boolean;
  external?: boolean;
}) {
  const cls = cn(base, sizeMap[size], variantMap[variant], className);
  const content = (
    <>
      {children}
      {showArrow && <ArrowUpRight className="size-4 -translate-y-[1px]" aria-hidden />}
    </>
  );
  if (!href) {
    return <button className={cls}>{content}</button>;
  }
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={cls}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}

export default Button;
