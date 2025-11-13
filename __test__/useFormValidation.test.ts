import { describe, it, expect } from "vitest"
import { useFormValidation } from "~/composables/useFormValidation"

describe("useFormValidation", () => {
  it("validates valid full payload", async () => {
    const { validatePayload } = useFormValidation()

    const validPayload = {
      firstName: "John",
      lastName: "Doe",
      email: "john@test.com",
      country: "Germany",
    }

    const result = await validatePayload(null, validPayload)
    expect(result.success).toBe(true)
    expect(result.errors).toBeUndefined()
  })

  it("validates valid bankDetail", async () => {
    const { validatePayload } = useFormValidation()

    const validBankDetail = {
      bankName: "Test Bank",
      iban: "DE123456789",
    }

    const result = await validatePayload("bankDetail", validBankDetail)
    expect(result.success).toBe(true)
  })

  it("returns errors for invalid payload", async () => {
    const { validatePayload } = useFormValidation()

    const invalidPayload = {
      email: "invalid-email",
    }

    const result = await validatePayload(null, invalidPayload)
    expect(result.success).toBe(false)
    expect(result.errors).toBeDefined()
    expect(result.errors!.length).toBeGreaterThan(0)
  })

  it("returns error for invalid schema key", async () => {
    const { validatePayload } = useFormValidation()

    const result = await validatePayload("invalidKey" as string, {})
    expect(result.success).toBe(false)
    expect(result.errors).toBeDefined()
  })
})
