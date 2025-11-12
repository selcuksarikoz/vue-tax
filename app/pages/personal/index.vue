<template>
  <div class="personal-page">
    <!-- Tab Navigation: tabs are linked to routes for URL changes -->
    <v-tabs 
      grow
      class="tabs-section"
      :model-value="activeTab" 
      @update:model-value="navigateToTab"
    >
      <v-tab value="personal" to="/personal">Personal</v-tab>
      <v-tab value="bank" to="/personal/bank-data">Bank Data</v-tab>
      <v-tab value="tax" to="/personal/tax-data">Tax Data</v-tab>
    </v-tabs>

    <!-- Form Components: All forms are rendered simultaneously and toggled with v-show -->
    <!-- This ensures <keep-alive> properly caches all components and preserves their internal state -->
    <keep-alive>
      <div class="form-container">
        <PersonalForm 
          v-show="activeTab === 'personal'" 
          :form-data="formData"
          :is-loading="isSubmitting"
          :error="submitError"
          :success="submitSuccess"
          @update:form-data="(updates) => ({...formData, ...updates})"
          @submit="() => handleFormSubmit('personal')"
        />
        <BankDataForm 
          v-show="activeTab === 'bank'" 
          :form-data="formData"
          :is-loading="isSubmitting"
          :error="submitError"
          :success="submitSuccess"
          @update:form-data="(updates) => ({...formData, ...updates})"
          @submit="() => handleFormSubmit('bank')"
        />
        <TaxDataForm 
          v-show="activeTab === 'tax'" 
          :form-data="formData"
          :is-loading="isSubmitting"
          :error="submitError"
          :success="submitSuccess"
          @update:form-data="(updates) => ({...formData, ...updates})"
          @submit="() => handleFormSubmit('tax')"
        />
      </div>
    </keep-alive>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from '#vue-router'
import { useMe } from '~/composables/useMe'
import { useFormValidation } from '~/composables/useFormValidation'
import PersonalForm from '~/components/PersonalForm.vue'
import BankDataForm from '~/components/BankDataForm.vue'
import TaxDataForm from '~/components/TaxDataForm.vue'

const route = useRoute()
const router = useRouter()

/**
 * Fetch user data on server-side (SSR-safe).
 * useAsyncData handles caching and SSR automatically.
 */
const { data: userData, updateMe } = useMe()
const { validatePayload } = useFormValidation()

/**
 * Page-level form data state - single source of truth for all forms.
 * All form components sync their changes to this ref.
 */
const formData = ref({
  // Personal data
  academicTitle: "No title",
  gender: "",
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  email: "",
  phone: "",
  position: "",
  country: "Germany",
  postcode: "",
  state: "",
  city: "",
  street: "",
  houseNumber: "",
  additionalAddressInfo: "",
  // Bank data
  bankDetail: {
    bankName: "",
    bankBic: "",
    iban: "",
    id: "",
    bankId: "",
    payee: "",
    paymentMethod: "Cash"
  },
  // Tax data
  tax: {
    taxId: "",
    noTaxId: false,
    extraJob: "",
    disability: "None",
    information: "",
    employmentStatus: "",
    secondSalary: ""
  },
  // Insurance data
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
    requestFromPensionInsurance: false
  }
})

/**
 * Page-level submission state
 */
const isSubmitting = ref(false)
const submitError = ref("")
const submitSuccess = ref(false)

/**
 * Sync server data (userData) to local formData when it changes.
 * This populates the form on initial load.
 */
watch(
  () => userData.value,
  (data) => {
    if (data) {
      formData.value = {
        academicTitle: (data.academicTitle as string) || "No title",
        gender: (data.gender as string) || "",
        firstName: (data.firstName as string) || "",
        lastName: (data.lastName as string) || "",
        dateOfBirth: (data.dateOfBirth as string) || "",
        email: (data.email as string) || "",
        phone: (data.phone as string) || "",
        position: (data.position as string) || "",
        country: (data.country as string) || "Germany",
        postcode: (data.zip as string) || "",
        state: (data.state as string) || "",
        city: (data.city as string) || "",
        street: (data.address as string) || "",
        houseNumber: (data.houseNumber as string) || "",
        additionalAddressInfo: (data.additionalAddressInfo as string) || "",
        bankDetail: (data.bankDetail as Record<string, unknown>) || formData.value.bankDetail,
        tax: (data.tax as Record<string, unknown>) || formData.value.tax,
        insurance: (data.insurance as Record<string, unknown>) || formData.value.insurance
      }
    }
  },
  { immediate: true, deep: true }
)

/**
 * Determine active tab based on current route path.
 */
const activeTab = computed(() => {
  const path = route.path
  if (path.includes('bank')) return 'bank'
  if (path.includes('tax')) return 'tax'
  return 'personal'
})

/**
 * Navigate to the selected tab by updating the route.
 */
function navigateToTab(tab: string) {
  const routes: Record<string, string> = {
    personal: '/personal',
    bank: '/personal/bank-data',
    tax: '/personal/tax-data'
  }
  router.push(routes[tab] || '/personal')
}

/**
 * Handle form data updates from child form components.
 * Form components emit changes, page accumulates them in formData.
 */
function _handleFormChange(updates: Record<string, unknown>) {
  formData.value = {
    ...formData.value,
    ...updates
  }
}

/**
 * Handle form submission - validate entire form and submit to server.
 * All validation happens here once, not in individual form components.
 */
async function handleFormSubmit(formType: 'personal' | 'bank' | 'tax') {
  isSubmitting.value = true
  submitError.value = ""
  submitSuccess.value = false

  try {
    let payload: Record<string, unknown> = {}

    // Prepare payload based on which form was submitted
    if (formType === 'personal') {
      payload = {
        firstName: formData.value.firstName,
        lastName: formData.value.lastName,
        email: formData.value.email,
        phone: formData.value.phone,
        position: formData.value.position,
        country: formData.value.country,
        zip: formData.value.postcode,
        state: formData.value.state,
        city: formData.value.city,
        address: formData.value.street
      }
    } else if (formType === 'bank') {
      payload = {
        bankDetail: formData.value.bankDetail
      }
    } else if (formType === 'tax') {
      payload = {
        tax: formData.value.tax,
        insurance: formData.value.insurance
      }
    }

    // Validate payload against schema
    let validationResult
    if (formType === 'personal') {
      validationResult = await validatePayload(null, payload)
    } else if (formType === 'bank') {
      validationResult = await validatePayload("bankDetail", formData.value.bankDetail)
    } else {
      // Validate both tax and insurance
      const taxValidation = await validatePayload("tax", formData.value.tax)
      const insuranceValidation = await validatePayload("insurance", formData.value.insurance)
      validationResult = {
        success: taxValidation.success && insuranceValidation.success,
        errors: [...(taxValidation.errors || []), ...(insuranceValidation.errors || [])]
      }
      payload = { tax: formData.value.tax, insurance: formData.value.insurance }
    }

    if (!validationResult.success) {
      submitError.value = validationResult.errors
        ?.map((e: Record<string, string>) => `${e.path}: ${e.message}`)
        .join(", ") || "Validation failed"
      return
    }

    // All validation passed - call server to update
    const result = await updateMe(payload)

    if (result.success) {
      submitSuccess.value = true
      setTimeout(() => { submitSuccess.value = false }, 3000)
    } else {
      submitError.value = typeof result.error === "string" ? result.error : "Failed to save data."
    }
  } catch (err: unknown) {
    submitError.value = err instanceof Error ? err.message : "An unexpected error occurred."
  } finally {
    isSubmitting.value = false
  }
}

</script>

<style scoped>
/**
 * Personal page styling with dark mode support.
 * Page background is set to dark, form sections have semi-transparent containers.
 */
.personal-page {
  padding: 20px;
  background-color: #121212;
  min-height: 100vh;
}

.tabs-section {
  margin-bottom: 20px;
}

.form-container {
  background-color: rgba(30, 30, 30, 0.8);
  border-radius: 8px;
  padding: 20px;
  backdrop-filter: blur(10px);
}
</style>
