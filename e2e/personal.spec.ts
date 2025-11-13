import { test, expect } from "@playwright/test"

test.describe("Personal Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/personal")
    // Wait for the page to be fully loaded
    await page.waitForLoadState("networkidle")
  })

  test("should display personal page with tabs", async ({ page }) => {
    // Check that we're on the personal page
    await expect(page).toHaveURL(/\/personal$/)

    // Check tabs are visible
    await expect(page.getByRole("tab", { name: "Personal" })).toBeVisible()
    await expect(page.getByRole("tab", { name: "Bank Data" })).toBeVisible()
    await expect(page.getByRole("tab", { name: "Tax Data" })).toBeVisible()

    // Check Personal tab is active by default
    await expect(page.getByRole("tab", { name: "Personal" })).toHaveAttribute(
      "aria-selected",
      "true"
    )
  })

  test("should navigate between tabs", async ({ page }) => {
    // Start on Personal tab
    await expect(page.getByRole("tab", { name: "Personal" })).toHaveAttribute(
      "aria-selected",
      "true"
    )

    // Click Bank Data tab
    await page.getByRole("tab", { name: "Bank Data" }).click()
    await expect(page).toHaveURL("/personal/bank")
    await expect(page.getByRole("tab", { name: "Bank Data" })).toHaveAttribute(
      "aria-selected",
      "true"
    )

    // Click Tax Data tab
    await page.getByRole("tab", { name: "Tax Data" }).click()
    await expect(page).toHaveURL("/personal/tax")
    await expect(page.getByRole("tab", { name: "Tax Data" })).toHaveAttribute(
      "aria-selected",
      "true"
    )

    // Go back to Personal tab
    await page.getByRole("tab", { name: "Personal" }).click()
    await expect(page).toHaveURL("/personal")
    await expect(page.getByRole("tab", { name: "Personal" })).toHaveAttribute(
      "aria-selected",
      "true"
    )
  })

  test("should display form on personal page", async ({ page }) => {
    // Check that a form is present
    await expect(page.locator("form")).toBeVisible()

    // Check that some input fields are present
    const inputs = page.locator("input")
    await expect(inputs.first()).toBeVisible()
  })

  test("should navigate to bank data page", async ({ page }) => {
    await page.getByRole("tab", { name: "Bank Data" }).click()

    // Check URL
    await expect(page).toHaveURL("/personal/bank")

    // Check that a form is present
    await expect(page.locator("form")).toBeVisible()
  })

  test("should navigate to tax data page", async ({ page }) => {
    await page.getByRole("tab", { name: "Tax Data" }).click()

    // Check URL
    await expect(page).toHaveURL("/personal/tax")

    // Check that a form is present
    await expect(page.locator("form")).toBeVisible()
  })
})
