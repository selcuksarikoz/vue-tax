<template>
  <div class="personal-page">
    <!-- Tab Navigation: tabs update query params -->
    <v-tabs
      grow
      class="tabs-section"
      :model-value="activeTab"
      @update:model-value="navigateToTab"
    >
      <v-tab value="personal">Personal</v-tab>
      <v-tab value="bank">Bank Data</v-tab>
      <v-tab value="tax">Tax Data</v-tab>
    </v-tabs>

    <!-- Dynamic Form Component with lazy loading -->
    <div class="form-container">
      <keep-alive>
        <component
          :is="currentComponent"
          :form-data="currentFormData"
          :is-loading="isSubmitting"
          :error="submitError"
          :success="submitSuccess"
          @update:form-data="handleUpdate"
          @submit="handleSubmit"
        />
      </keep-alive>
    </div>
  </div>
</template>

<script setup lang="ts" async>
import { computed, ref, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from '#vue-router'
import { useMe } from '~/composables/useMe'
import { useFormValidation } from '~/composables/useFormValidation'
import { useFormData } from '~/composables/useFormData'

// Lazy load components
const PersonalForm = defineAsyncComponent(() => import('~/components/PersonalForm.vue'))
const BankDataForm = defineAsyncComponent(() => import('~/components/BankDataForm.vue'))
const TaxDataForm = defineAsyncComponent(() => import('~/components/TaxDataForm.vue'))

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
 * Determine active tab based on query param.
 */
const activeTab = computed({
  get: () => (route.query.tab as string) || 'personal',
  set: (value: string) => {
    if (value === 'personal') {
      router.replace({ query: {} })
    } else {
      router.replace({ query: { tab: value } })
    }
  }
})

/**
 * Get current component based on active tab
 */
const currentComponent = computed(() => {
  switch (activeTab.value) {
    case 'bank':
      return BankDataForm
    case 'tax':
      return TaxDataForm
    default:
      return PersonalForm
  }
})

/**
 * Get current form data based on active tab
 */
const currentFormData = computed(() => {
  switch (activeTab.value) {
    case 'bank':
      return { bankDetail: formData.bankDetail }
    case 'tax':
      return { tax: formData.tax, insurance: formData.insurance }
    default:
      return formData
  }
})

/**
 * Navigate to the selected tab by updating query params.
 */
function navigateToTab(tab: string) {
  activeTab.value = tab
}

/**
 * Handle form updates based on current tab
 */
function handleUpdate(updates: Record<string, unknown>) {
  switch (activeTab.value) {
    case 'bank':
      handleBankUpdate(updates)
      break
    case 'tax':
      handleTaxUpdate(updates)
      break
    default:
      handlePersonalUpdate(updates)
      break
  }
}

/**
 * Handle form submission based on current tab
 */
function handleSubmit() {
  handleFormSubmit(activeTab.value as 'personal' | 'bank' | 'tax')
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
        firstName: formData.firstName,
        academicTitle: formData.academicTitle,
        gender: formData.gender,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        country: formData.country,
        zip: formData.zip,
        state: formData.state,
        city: formData.city,
        address: formData.address
      }
    } else if (formType === 'bank') {
      payload = {
        bankDetail: formData.bankDetail
      }
    } else if (formType === 'tax') {
      payload = {
        tax: formData.tax,
        insurance: formData.insurance
      }
    }

    // Validate payload against schema
    let validationResult
    if (formType === 'personal') {
      validationResult = await validatePayload(null, payload)
    } else if (formType === 'bank') {
      validationResult = await validatePayload("bankDetail", formData.bankDetail)
    } else {
      // Validate both tax and insurance
      const taxValidation = await validatePayload("tax", formData.tax)
      const insuranceValidation = await validatePayload("insurance", formData.insurance)
      validationResult = {
        success: taxValidation.success && insuranceValidation.success,
        errors: [...(taxValidation.errors || []), ...(insuranceValidation.errors || [])]
      }
      payload = { tax: formData.tax, insurance: formData.insurance }
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
      
      // Refresh formData from updated userData, and i dont need to do it, because useMe already updates userData
      // refreshFromUserData()
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
