import * as z from "zod"

import { meSchema } from "~/schemas/me.schema"

/**
 * Me class manages user data with validation.
 * Stores user information and provides update method with Zod validation.
 */
class Me {
  private data: z.infer<typeof meSchema> = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    position: "",
    department: null,
    bankDetail: {
      bankName: "",
      bankBic: "",
      iban: "",
      id: "",
      bankId: "",
      paymentMethod: "",
      payee: "",
    },
    tax: {
      taxId: "",
      noTaxId: false,
      extraJob: "",
      disability: "",
      information: "",
      employmentStatus: "",
      secondSalary: "",
    },
    insurance: {
      ssn: "",
      noSsn: false,
      birthCountry: "",
      birthName: "",
      healthInsuranceType: "",
      healthInsurance: "",
      desiredHealthInsuranceCompany: "",
      privateHealthInsuranceName: "",
      privateHealthInsuranceContribution: "",
      privateNursingInsuranceContribution: "",
      lastPrivateHealthInsurance: "",
      haveChildren: "",
      requestFromPensionInsurance: false,
    },
  }

  async update(newData: Partial<typeof this.data>) {
    try {
      const validation = await meSchema.partial().parseAsync(newData)

      if (validation) {
        this.data = {
          ...this.data,
          ...validation,
        }
      }

      return {
        success: true,
        data: this.data,
      }
    } catch (error: unknown) {
      return {
        success: false,
        message: z.prettifyError(error as z.ZodError),
      }
    }
  }

  get() {
    return this.data
  }
}

export const me = new Me()
