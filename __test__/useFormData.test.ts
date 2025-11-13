import { describe, it, expect } from "vitest"
import { ref } from "vue"
import { useFormData } from "~/composables/useFormData"

describe("useFormData", () => {
  it("initializes with default values when userData is null", () => {
    const userData = ref(null)
    const { formData } = useFormData(userData)

    expect(formData.firstName).toBe("")
    expect(formData.country).toBe("Germany")
    expect(formData.bankDetail.bankName).toBe("")
    expect(formData.tax.taxId).toBe("")
  })

  it("initializes with userData values", () => {
    const userData = ref({
      firstName: "John",
      lastName: "Doe",
      country: "USA",
      bankDetail: { bankName: "Test Bank" },
      tax: { taxId: "123" },
      insurance: { ssn: "456" },
    })
    const { formData } = useFormData(userData)

    expect(formData.firstName).toBe("John")
    expect(formData.lastName).toBe("Doe")
    expect(formData.country).toBe("USA")
    expect(formData.bankDetail.bankName).toBe("Test Bank")
    expect(formData.tax.taxId).toBe("123")
  })

  it("handlePersonalUpdate updates form data", () => {
    const userData = ref(null)
    const { formData, handlePersonalUpdate } = useFormData(userData)

    handlePersonalUpdate({ firstName: "Jane", email: "jane@test.com" })

    expect(formData.firstName).toBe("Jane")
    expect(formData.email).toBe("jane@test.com")
  })

  it("handleBankUpdate updates bank detail", () => {
    const userData = ref(null)
    const { formData, handleBankUpdate } = useFormData(userData)

    handleBankUpdate({ bankDetail: { bankName: "New Bank", iban: "DE123" } })

    expect(formData.bankDetail.bankName).toBe("New Bank")
    expect(formData.bankDetail.iban).toBe("DE123")
  })

  it("handleTaxUpdate updates tax and insurance", () => {
    const userData = ref(null)
    const { formData, handleTaxUpdate } = useFormData(userData)

    handleTaxUpdate({
      tax: { taxId: "789" },
      insurance: { ssn: "101" },
    })

    expect(formData.tax.taxId).toBe("789")
    expect(formData.insurance.ssn).toBe("101")
  })
})
