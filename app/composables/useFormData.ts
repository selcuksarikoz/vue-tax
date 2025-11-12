import { reactive, type Ref, watch } from "vue";
import type * as z from "zod";
import type { meSchema } from "~/schemas/me.schema";

/**
 * Form data state derived directly from schema
 */
export type FormDataState = z.infer<typeof meSchema>;

const defaultFormData: FormDataState = {
  firstName: "",
  lastName: "",
  gender: "",
  academicTitle: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "Germany",
  position: "",
  department: null,
  bankDetail: {
    bankName: "",
    bankBic: "",
    iban: "",
    id: "",
    bankId: "",
    payee: "",
    paymentMethod: "Cash",
  },
  tax: {
    taxId: "",
    noTaxId: false,
    extraJob: "",
    disability: "None",
    information: "",
    employmentStatus: "",
    secondSalary: "",
  },
  insurance: {
    ssn: "",
    noSsn: false,
    birthCountry: "",
    birthName: "",
    haveChildren: "",
    healthInsuranceType: "",
    healthInsurance: "",
    desiredHealthInsuranceCompany: "",
    privateHealthInsuranceName: "",
    privateHealthInsuranceContribution: "",
    privateNursingInsuranceContribution: "",
    lastPrivateHealthInsurance: "",
    requestFromPensionInsurance: false,
  },
};

/**
 * Composable to manage form data state and form field updates.
 * Syncs with userData from server on initial load, preserves user edits afterwards.
 */
export function useFormData(
  userData: Ref<z.infer<typeof meSchema> | null | undefined>
) {
  /**
   * Initialize formData - merge userData with defaults, creating deep copies
   */
  const initializeFormData = (): FormDataState => {
    const data = userData.value;
    return {
      firstName: data?.firstName || defaultFormData.firstName,
      lastName: data?.lastName || defaultFormData.lastName,
      gender: data?.gender || defaultFormData.gender,
      academicTitle: data?.academicTitle || defaultFormData.academicTitle,
      email: data?.email || defaultFormData.email,
      phone: data?.phone || defaultFormData.phone,
      address: data?.address || defaultFormData.address,
      city: data?.city || defaultFormData.city,
      state: data?.state || defaultFormData.state,
      zip: data?.zip || defaultFormData.zip,
      country: data?.country || defaultFormData.country,
      position: data?.position || defaultFormData.position,
      department: data?.department ?? defaultFormData.department,
      bankDetail: data?.bankDetail
        ? { ...data.bankDetail }
        : { ...defaultFormData.bankDetail },
      tax: data?.tax ? { ...data.tax } : { ...defaultFormData.tax },
      insurance: data?.insurance
        ? { ...data.insurance }
        : { ...defaultFormData.insurance },
    };
  };

  const formData = reactive<FormDataState>(initializeFormData());

  // Watch for changes in userData and update formData accordingly
  watch(
    userData,
    () => {
      const newData = initializeFormData();
      Object.assign(formData, newData);
    },
    { immediate: false } // immediate: false to avoid double initialization
  );

  /**
   * Handle personal form updates - merge all personal fields
   */
  function handlePersonalUpdate(updates: Record<string, unknown>) {
    Object.assign(formData, updates);
  }

  /**
   * Handle bank form updates - merge only bankDetail
   */
  function handleBankUpdate(updates: Record<string, unknown>) {
    if (updates.bankDetail) {
      Object.assign(
        formData.bankDetail,
        updates.bankDetail as Record<string, unknown>
      );
    }
  }

  /**
   * Handle tax form updates - merge tax and insurance separately
   */
  function handleTaxUpdate(updates: Record<string, unknown>) {
    if (updates.tax) {
      Object.assign(formData.tax, updates.tax as Record<string, unknown>);
    }

    if (updates.insurance) {
      Object.assign(
        formData.insurance,
        updates.insurance as Record<string, unknown>
      );
    }
  }

  /**
   * Refresh formData from latest userData (call after server update)
   */
  function refreshFromUserData() {
    const newData = initializeFormData();
    Object.assign(formData, newData);
  }

  return {
    formData,
    handlePersonalUpdate,
    handleBankUpdate,
    handleTaxUpdate,
    refreshFromUserData,
  };
}
