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
          @update:form-data="handlePersonalUpdate"
          @submit="() => handleFormSubmit('personal')"
        />
        <BankDataForm 
          v-show="activeTab === 'bank'" 
          :form-data="{ bankDetail: formData?.bankDetail }"
          :is-loading="isSubmitting"
          :error="submitError"
          :success="submitSuccess"
          @update:form-data="handleBankUpdate"
          @submit="() => handleFormSubmit('bank')"
        />
        <TaxDataForm 
          v-show="activeTab === 'tax'" 
          :form-data="{ tax: formData?.tax, insurance: formData?.insurance }"
          :is-loading="isSubmitting"
          :error="submitError"
          :success="submitSuccess"
          @update:form-data="handleTaxUpdate"
          @submit="() => handleFormSubmit('tax')"
        />
      </div>
    </keep-alive>
  </div>
</template>

<script setup lang="ts" async>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from '#vue-router'
import { useMe } from '~/composables/useMe'
import { useFormValidation } from '~/composables/useFormValidation'
import { useFormData } from '~/composables/useFormData'
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
 * Use composable to manage form data state and updates
 */
const { formData, handlePersonalUpdate, handleBankUpdate, handleTaxUpdate, refreshFromUserData } = useFormData(userData)

/**
 * Page-level submission state
 */
const isSubmitting = ref(false)
const submitError = ref("")
const submitSuccess = ref(false)

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
        academicTitle: formData.value.academicTitle,
        gender: formData.value.gender,
        lastName: formData.value.lastName,
        email: formData.value.email,
        phone: formData.value.phone,
        position: formData.value.position,
        country: formData.value.country,
        zip: formData.value.zip,
        state: formData.value.state,
        city: formData.value.city,
        address: formData.value.address
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
      // Refresh formData from updated userData
      refreshFromUserData()
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
