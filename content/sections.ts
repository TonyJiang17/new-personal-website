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
  tagline: "Product Manager · AI Researcher & Engineer",
  intro: [
    "MIT LGO Fellow (MS EECS + MBA). Applied AI Scientist at AWS GenAI Innovation Center.",
    "PM background at TikTok and Salesforce. Working at the intersection of AI research, product, and engineering.",
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
                                           ·   · ·········· ····· ····· ·    ·   ··`,
  status: "final",
};

// ---------------------------------------------------------------------------
// Section payloads (about / ai / projects)
// ---------------------------------------------------------------------------

export const PM_CONTENT: SectionContent = {
  id: "about",
  title: "Product Manager",
  summary:
    "PM with experience shipping 0→1 products and leading cross-functional teams at TikTok and Salesforce.",
  details: [
    "· TikTok (2022–2023): Senior PM, Ads Monetization. Revamped Ad Creation Flow; shipped Saved Audience and AI Auto-Targeting. Improved CSAT ~30% across Enterprise and SMB.",
    "· Salesforce (2020–2022): PM rotational program. Built Slack App Builder (0→1, ~300 customers in first month). Led Workforce Engagement ML forecasting product from 0→1.",
    "· TopicSpace (2020–2021): Co-founded social learning app. Led 0→1 product development (~800 total users).",
  ],
  nextHints: ["ai", "projects", "contact"],
  status: "final",
};

export const AI_CONTENT: SectionContent = {
  id: "ai",
  title: "AI Research & Engineering",
  summary:
    "Applied AI Scientist at AWS GenAI Innovation Center. Building multi-agent systems, LLM applications, and computer vision pipelines.",
  details: [
    "· AWS GenAI Innovation Center (2024–present): Multi-agent AI system for Coinbase (smart contract vulnerability detection); IDP with RAG deployed to 20+ enterprise customers.",
    "· AWS GenAI Innovation Center: Multimodal Vision LLM (LLaVA-Next) research for soccer video understanding. Paper published at CVPR CVSports 2025.",
    "· Walmart Labs (2019–2020): Full-stack computer vision pipeline using MaskRCNN for vehicle detection.",
    "· MIT MS EECS: Coursework in Deep Generative Models, Deep Learning, and Robotics Manipulation.",
  ],
  nextHints: ["projects", "about", "contact"],
  status: "final",
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
