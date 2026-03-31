import { test, expect } from "@playwright/test";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function typeCommand(page: import("@playwright/test").Page, cmd: string) {
  const input = page.locator('input[type="text"]').first();
  await input.fill(cmd);
  await input.press("Enter");
}

// ---------------------------------------------------------------------------
// WI-6.2 E2E Smoke Suite (updated for WI-2.x slash command UX)
// ---------------------------------------------------------------------------

test.describe("Terminal load", () => {
  test("renders welcome message on /", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/Welcome to Tony Jiang's terminal/)).toBeVisible();
  });

  test("command input is present and focused", async ({ page }) => {
    await page.goto("/");
    const input = page.locator('input[type="text"]').first();
    await expect(input).toBeVisible();
    await expect(input).toBeFocused();
  });

  test("welcome message suggests /help", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/\/help/)).toBeVisible();
  });
});

test.describe("help command", () => {
  test("typing `/help` shows command list with resume and clear", async ({ page }) => {
    await page.goto("/");
    await typeCommand(page, "/help");
    // The help output contains a block with command summaries.
    // Use first() to handle the case where names appear in multiple places.
    await expect(page.getByText(/resume/).first()).toBeVisible();
    await expect(page.getByText(/clear/).first()).toBeVisible();
    // Check for the help entry text that is unique to help output
    await expect(page.getByText(/List available commands/i)).toBeVisible();
  });

  test("/help output shows slash-prefixed commands", async ({ page }) => {
    await page.goto("/");
    await typeCommand(page, "/help");
    await expect(page.getByText(/\/about/).first()).toBeVisible();
  });
});

test.describe("slash command routing — non-slash input", () => {
  test("typing a known command without slash suggests /command", async ({ page }) => {
    await page.goto("/");
    await typeCommand(page, "about");
    await expect(page.getByText(/Did you mean `\/about`/)).toBeVisible();
  });

  test("typing unknown non-slash input shows 'chat mode is coming soon'", async ({ page }) => {
    await page.goto("/");
    await typeCommand(page, "foobarqux");
    await expect(page.getByText(/Chat mode is coming soon/i)).toBeVisible();
  });
});

test.describe("unknown slash commands", () => {
  test("shows 'command not found' for unknown slash command", async ({ page }) => {
    await page.goto("/");
    await typeCommand(page, "/foobarqux");
    await expect(page.getByText(/command not found/)).toBeVisible();
  });

  test("shows 'Did you mean' suggestion for close slash typo", async ({ page }) => {
    await page.goto("/");
    await typeCommand(page, "/prjects");
    await expect(page.getByText(/Did you mean/)).toBeVisible();
  });
});

test.describe("section navigation via slash commands", () => {
  test("`/about` command renders PM section heading", async ({ page }) => {
    await page.goto("/");
    await typeCommand(page, "/about");
    // In terminal transcript, the section heading will appear
    await expect(page.getByRole("heading", { name: /Product Manager/i }).first()).toBeVisible();
  });

  test("`/ai` command renders AI section heading", async ({ page }) => {
    await page.goto("/");
    await typeCommand(page, "/ai");
    await expect(page.getByRole("heading", { name: /AI Research/i }).first()).toBeVisible();
  });

  test("`/projects` command renders projects section heading", async ({ page }) => {
    await page.goto("/");
    await typeCommand(page, "/projects");
    await expect(page.getByRole("heading", { name: /Projects/i }).first()).toBeVisible();
  });

  test("`/contact` command renders contact section heading", async ({ page }) => {
    await page.goto("/");
    await typeCommand(page, "/contact");
    await expect(page.getByRole("heading", { name: /Contact/i }).first()).toBeVisible();
  });

  test("`/home` command navigates back to home", async ({ page }) => {
    await page.goto("/");
    await typeCommand(page, "/about");
    await typeCommand(page, "/home");
    // After home, the URL should be / with no ?r= param
    expect(page.url()).toMatch(/localhost:3000\/$/);
  });
});

test.describe("shareable URL behavior", () => {
  test("/?r=about loads about section directly", async ({ page }) => {
    await page.goto("/?r=about");
    await expect(page.getByRole("heading", { name: /Product Manager/i }).first()).toBeVisible();
  });

  test("/?r=projects loads projects section directly", async ({ page }) => {
    await page.goto("/?r=projects");
    await expect(page.getByRole("heading", { name: /Projects/i }).first()).toBeVisible();
  });

  test("/?r=contact loads contact section directly", async ({ page }) => {
    await page.goto("/?r=contact");
    await expect(page.getByRole("heading", { name: "Contact" }).first()).toBeVisible();
  });

  test("/?r=unknown falls back to home with a system notice", async ({ page }) => {
    await page.goto("/?r=unknownroute");
    await expect(page.getByText(/Unknown route in URL/i)).toBeVisible();
  });

  test("navigating via slash command updates URL to /?r=<route>", async ({ page }) => {
    await page.goto("/");
    await typeCommand(page, "/projects");
    await expect(page).toHaveURL(/\?r=projects/);
  });

  test("navigating to home sets URL back to /", async ({ page }) => {
    await page.goto("/?r=about");
    await typeCommand(page, "/home");
    const url = new URL(page.url());
    expect(url.pathname).toBe("/");
    expect(url.search).toBe("");
  });
});

test.describe("readable companion (scan mode)", () => {
  test("readable companion aside is present on page load", async ({ page }) => {
    await page.goto("/");
    const companion = page.locator('[aria-label="Readable companion — scan mode"]');
    await expect(companion).toBeVisible();
  });

  test("readable mode contains h1 heading for hero section", async ({ page }) => {
    await page.goto("/");
    // h1 is rendered inside ReadableCompanion for HeroSection readable variant
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("readable mode contains h2 headings for all sections", async ({ page }) => {
    await page.goto("/");
    const h2s = page.locator("h2");
    await expect(h2s.first()).toBeVisible();
    const count = await h2s.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test("scan mode shows Resume PDF link", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /Resume PDF/i })).toBeVisible();
  });
});

test.describe("resume link", () => {
  test("Resume PDF link points to /resume.pdf", async ({ page }) => {
    await page.goto("/");
    const resumeLink = page.getByRole("link", { name: /Resume PDF/i });
    const href = await resumeLink.getAttribute("href");
    expect(href).toContain("resume.pdf");
  });
});

test.describe("project drill-down", () => {
  test("`/project <unknown>` shows friendly error", async ({ page }) => {
    await page.goto("/");
    await typeCommand(page, "/project unknownxyz");
    // Should show "project not found: unknownxyz" error message
    await expect(page.getByText(/project not found/i).first()).toBeVisible();
  });
});
