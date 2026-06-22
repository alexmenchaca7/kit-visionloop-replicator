import { pageRegistry } from "@/lib/page-registry";

export default function HomePage() {
  const Sections = pageRegistry.home.sections;
  return (
    <>
      {Sections.map((Section, i) => (
        <Section key={i} />
      ))}
    </>
  );
}
