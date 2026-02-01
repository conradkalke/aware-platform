import { chromium } from "playwright"

const baseUrl = process.env.APP_URL || "http://localhost:3000"
const results = []

const step = async (name, fn) => {
  try {
    await fn()
    results.push({ name, ok: true })
  } catch (error) {
    results.push({ name, ok: false, error })
  }
}

const expectVisibleText = async (page, text) => {
  await page.getByText(text, { exact: false }).first().waitFor({ state: "visible" })
}

const run = async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  await step("Home loads", async () => {
    await page.goto(baseUrl, { waitUntil: "networkidle" })
    await expectVisibleText(page, "AWARE")
  })

  await step("Header navigation works", async () => {
    await page.getByRole("link", { name: /Explore Labs/i }).first().click()
    await page.waitForURL(`${baseUrl}/labs`)
    await expectVisibleText(page, "Explore Labs")
  })

  await step("Labs search filters", async () => {
    await page.getByRole("searchbox").fill("Neuro")
    await expectVisibleText(page, "Neuroplasticity Research Lab")
  })

  await step("Lab detail tabs render", async () => {
    await page.getByRole("link", { name: /Neuroplasticity Research Lab/i }).click()
    await page.waitForURL(/\/labs\/neuro-lab$/)
    await page.getByRole("tab", { name: "Updates" }).click()
    await expectVisibleText(page, "New video update")
    await page.getByRole("tab", { name: "Team" }).click()
    await expectVisibleText(page, "Dr. Sarah Chen")
  })

  await step("Donate flow validation + review", async () => {
    await page.getByRole("link", { name: /Donate Now/i }).click()
    await page.waitForURL(/\/donate\/neuro-lab$/)
    await page.getByText("Custom").click()
    await page.getByLabel("Enter amount").fill("0")
    await page.getByRole("button", { name: /Continue to Payment/i }).isDisabled()
    await page.getByText("$10").click()
    await page.getByRole("button", { name: /Continue to Payment/i }).click()
    await expectVisibleText(page, "Review Your Donation")
    await page.getByRole("button", { name: /Back/i }).click()
    await expectVisibleText(page, "Choose an amount")
  })

  await step("About page loads", async () => {
    await page.goto(`${baseUrl}/about`, { waitUntil: "networkidle" })
    await expectVisibleText(page, "Mission")
  })

  await step("Contact page loads", async () => {
    await page.goto(`${baseUrl}/contact`, { waitUntil: "networkidle" })
    await expectVisibleText(page, "Contact")
  })

  await step("Privacy + Terms load", async () => {
    await page.goto(`${baseUrl}/privacy`, { waitUntil: "networkidle" })
    await expectVisibleText(page, "Privacy")
    await page.goto(`${baseUrl}/terms`, { waitUntil: "networkidle" })
    await expectVisibleText(page, "Terms")
  })

  await step("Robots + Sitemap load", async () => {
    await page.goto(`${baseUrl}/robots.txt`, { waitUntil: "networkidle" })
    await expectVisibleText(page, "User-agent")
    await page.goto(`${baseUrl}/sitemap.xml`, { waitUntil: "networkidle" })
    await expectVisibleText(page, "urlset")
  })

  await step("Mobile menu toggles", async () => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto(baseUrl, { waitUntil: "networkidle" })
    await page.getByRole("button", { name: /Toggle menu/i }).click()
    await page.locator("#mobile-menu").waitFor({ state: "visible" })
    await page.getByRole("link", { name: "About" }).first().waitFor({ state: "visible" })
    await page.getByRole("button", { name: /Toggle menu/i }).click()
  })

  await browser.close()

  const failed = results.filter(r => !r.ok)
  if (failed.length) {
    console.log("\nUI SMOKE RESULTS (FAIL):")
    for (const r of results) {
      console.log(`${r.ok ? "✓" : "✗"} ${r.name}`)
      if (!r.ok && r.error) {
        console.log(`  ${r.error.message || r.error}`)
      }
    }
    process.exitCode = 1
  } else {
    console.log("\nUI SMOKE RESULTS (PASS):")
    for (const r of results) {
      console.log(`✓ ${r.name}`)
    }
  }
}

run()
