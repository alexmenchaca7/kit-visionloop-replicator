import type { ElementType } from "react";
import { cn } from "@/lib/utils";

export default function Container({
  children,
  className,
  as: As = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return (
    <As className={cn("mx-auto w-full max-w-[1320px] px-5 sm:px-6 lg:px-10", className)}>
      {children}
    </As>
  );
}
