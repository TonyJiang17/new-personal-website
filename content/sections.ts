// content/sections.ts
// Canonical content model for all five site sections.
// Non-contact sections carry status: 'placeholder' per MVP policy (R14).
// Contact data lives in content/contact.ts (always final / real).

export type SectionStatus = "placeholder" | "final";

export interface SectionContent {
  id: string;
  title: string;
  /** One-line or two-line summary shown in terminal output and readable companion. */
  summary: string;
  /** Additional detail lines rendered below summary. Use empty string for blank lines. */
  details: string[];
  /** Commands to suggest at the end of terminal output for this section. */
  nextHints: string[];
  status: SectionStatus;
}

// ---------------------------------------------------------------------------
// Hero (special: also has name, tagline, asciiArt)
// ---------------------------------------------------------------------------

export interface HeroContent {
  id: "hero";
  name: string;
  tagline: string;
  intro: string[];
  /** Multi-line ASCII art block. Placeholder until WI-1.4 pipeline runs. */
  asciiArt: string;
  status: SectionStatus;
}

export const HERO_CONTENT: HeroContent = {
  id: "hero",
  name: "Tony Jiang",
  tagline: "Product Manager · AI Product Builder",
  intro: [
    "Building products at the intersection of AI and human experience.",
    "[Placeholder — full bio coming in follow-up epic]",
  ],
  // ASCII art generated from context/assets/hero_source.jpg via scripts/generate_hero_ascii.py
  asciiArt: `
································                                                                  ·  ·······
·······························                                                                     ········
······························                                                                        ······
·····························                                                                        ·······
····························                        · · ·  ·  ·                                      ·······
···························                     · ·· · · ·· ··     · · ···· ·                        · ·····
···························                   · ·· ···· ·· ·   ·········· ·  · ·                      ······
··························                  · ·· ·· · ··· ·· ·· ·········· ··· ·····                  ······
···························               · · · ·· ··· ··· ············· ··· ··········                ·····
··························                 · · · ··· ··· ·· ······················· · ···             ······
··························              · · · ··· ···· ·············· ················· ·             ······
··························               · · · · ·· · ·· ·········· ········· ·· ··· ··· ·             ·····
···························            ·  · · · · ··············· ········· ·········· ·· ·           ······
··························            · ·   ·  · ·  · ········ ··················· ···· ·              ·····
··························           ·   · ·  · · · ·   · ·· ······················· ··· ··           ······
··························          ·  ·    · ····· · ·    ······················· ··· ··  ·         ·······
··························           ·  · · · · · ········ · · ········· · · · · ··· ·· ··          ········
······················             ·  · ·  · ·· ··········· · ··· ···· ·· ·    · · · · · ··          ·······
····················· ·             · · · · ·  ·     · ········ ···· ·· ········ ·· ··· ·· ·       ·········
·····················  ·  ·       ·  · · ··· ·           · · ············· ·········· ·· ···       ·········
······················  ·          · · ··· ··· ···· · ·· ···· · ····· ·· ·· ·· ··· ··· ·· · ·     ··········
···················· · · ·       ·   ·· ···· ················· ·········          ·· ·· ···       ··········
·····················  ·           · · ·· ······ ··········· ······ ······· · ·· ·  ·· ·· ··       ·········
······················ ·         ·  · ····················· ·· · ·························       ·   ·······
····················· · ·  ·   ·   · · · ················ ··· ······· ·············· ·· · ··   ·············
······················ ·           · ·· ··· ··········· ··· ·· ··················· ·······    ······ ·······
······················ · · ·        · ··· ··········· ··· ·· · ···· ··· ················ ··   ···· ·········
······················· · ·   ·       · ·················· · ····························· ·· ··············
························ · ·       · · · ···· ········· · · · · ···· ················· ·· · ················
··························  ·    ·     ·· · ····· · ·  · ··· ········· · ················ ····· ············
······························ ·     ·  · ···· ·······         ···· ······ · ········· · · ······ ··········
·······························    ·   · · · ·· · · ··· · ·       ·    ··· ····· ··· ···· ····· ············
································     ·  · ··· ·· ··· · ··· ·· · · ······ ··· · ······· · ···················
································  · · · · · ·· ··  · ················· ····· ··· ·· · · ····················
································    · · ·· ···· · · · ·  · · ············ ··· · ···· ·· ····················
·································   · ·· ·· · · ·           ·  · ·    · ·· ··· ·· · ·· ·····················
·································    · · · ········  · ·· ·· · · · · ·   ·· · ······ ·· ····················
··································   · ·· ·· ·· · ·· ·  ··············  · ····· · ··· ······················
···································    · ····· ··· ···· · ·········· ········ ···· ·· ······················
··································      · · ····· ··  ····· ·· ·· · ·· ···· ······· ························
·································  ·    · ·· · ···· ··  · ··············· ····· · · ························
································           ···· · ·· ·· ·· · ····· ·· ······· ··· ··························
·····························               · ··· ··· ········ · ······· ····· · ···························
····························   ·             · ··· · ··· ················· · ·  ····························
···························                    · ···· ····· ········ ·· ···· · ·····························
·························     · ·                ·  ··· ················· ·   ······························
························                          · · ··············· ·· ·  ································
·······················         · ·                     · ········ ··· ·      ······························
·····················              ··                  ·   · · · ··  ·   · ·· ······························
····················              ·  · ·                      ·    ·   · ··    ·····························
················· ·                   · ·                        ·  · ··· ·· · ·····························
··············                     · · · ·                  ·  ·  · ·· · ·    · ·    · ·····················
············                            ·····             ·   · · ·· ···· ·   · ··        · ················
·········                            ·   · ···· ·  ·  · ·   · · ·· ·· · · ·   · ··             · ···········
·······                                ·  ·· ··· ·  ·  · · · ·· ··· ··· · ·   ·  ··                  · ·····
····                                       ········· ·· · ··· ·· · ·· ···    · ···                        ··
                                        ·    · ········· ·· ··········· · ·    ····
                                          ·  ················· ···· ·· · ·   ·· ··
                                           ·   · ·········· ····· ····· ·    ·   ··
[portrait generated from hero_source.jpg]`,
  status: "placeholder",
};

// ---------------------------------------------------------------------------
// Section payloads (about / ai / projects)
// ---------------------------------------------------------------------------

export const PM_CONTENT: SectionContent = {
  id: "about",
  title: "Product Manager",
  summary:
    "[Placeholder] PM with experience shipping 0→1 products and leading cross-functional teams.",
  details: [
    "· Led product strategy for [Placeholder Product].",
    "· Shipped features reaching [N]+ users.",
    "· Cross-functional leadership across engineering, design, and data.",
    "",
    "[Full PM content coming in follow-up epic — R15]",
  ],
  nextHints: ["ai", "projects", "contact"],
  status: "placeholder",
};

export const AI_CONTENT: SectionContent = {
  id: "ai",
  title: "AI Product Builder",
  summary:
    "[Placeholder] Builder at the frontier of applied AI — LLM-powered products and automation tools.",
  details: [
    "· Built [Placeholder AI Product] using [LLM / tools].",
    "· Shipped production AI features with measurable user impact.",
    "· Comfortable at the boundary of PM and engineering for AI systems.",
    "",
    "[Full AI content coming in follow-up epic — R15]",
  ],
  nextHints: ["projects", "about", "contact"],
  status: "placeholder",
};

export const PROJECTS_CONTENT: SectionContent = {
  id: "projects",
  title: "Projects",
  summary: "[Placeholder] Selected projects spanning product management and AI engineering.",
  details: [
    "  project-alpha  — [Placeholder: description coming soon]",
    "  project-beta   — [Placeholder: description coming soon]",
    "  project-gamma  — [Placeholder: description coming soon]",
    "",
    "Use `project <name>` to drill into a specific project.",
    "[Full project content coming in follow-up epic — R15]",
  ],
  nextHints: ["about", "ai", "contact"],
  status: "placeholder",
};

// Known project ids for `project <name>` drill-down (WI-4.2, MVP-lite placeholders).
export const KNOWN_PROJECTS: Record<string, { title: string; description: string }> = {
  "project-alpha": {
    title: "Project Alpha",
    description: "[Placeholder] Details coming in follow-up epic.",
  },
  "project-beta": {
    title: "Project Beta",
    description: "[Placeholder] Details coming in follow-up epic.",
  },
  "project-gamma": {
    title: "Project Gamma",
    description: "[Placeholder] Details coming in follow-up epic.",
  },
};

// All section payloads indexed by RouteId for convenient lookup.
export const SECTION_MAP: Record<string, SectionContent> = {
  about: PM_CONTENT,
  ai: AI_CONTENT,
  projects: PROJECTS_CONTENT,
};
