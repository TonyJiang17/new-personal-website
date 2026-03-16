// components/sections/SectionRenderer.tsx
// Dispatches to the appropriate section component based on route + variant.
// Single entry-point used by both terminal transcript and readable companion.

import type { RouteId } from "@/lib/terminal/commandRegistry";
import HeroSection from "./HeroSection";
import PMSection from "./PMSection";
import AISection from "./AISection";
import ProjectsSection from "./ProjectsSection";
import ContactSection from "./ContactSection";

export interface SectionRendererProps {
  route: RouteId;
  variant: "terminal" | "readable";
  /** Set when the user typed `project <name>` (projects sub-command). */
  projectName?: string;
}

export default function SectionRenderer({ route, variant, projectName }: SectionRendererProps) {
  switch (route) {
    case "home":
      return <HeroSection variant={variant} />;
    case "about":
      return <PMSection variant={variant} />;
    case "ai":
      return <AISection variant={variant} />;
    case "projects":
      return <ProjectsSection variant={variant} projectName={projectName} />;
    case "contact":
      return <ContactSection variant={variant} />;
    default:
      return null;
  }
}
