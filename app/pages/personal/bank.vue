<template>
  <div class="bank-page">
    <div class="form-container">
      <BankDataForm
        :form-data="{ bankDetail: formData.bankDetail }"
        :is-loading="isSubmitting"
        :error="submitError"
        :success="submitSuccess"
        @update:form-data="handleUpdate"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useMe } from "~/composables/useMe"
import { useFormValidation } from "~/composables/useFormValidation"
import { useFormData } from "~/composables/useFormData"
import BankDataForm from "~/components/BankDataForm.vue"

// Set layout
definePageMeta({
  layout: "personal",
})

/**
 * Fetch user data on server-side (SSR-safe).
 * useAsyncData handles caching and SSR automatically.
 */
const { data: userData, updateMe } = useMe()
const { validatePayload } = useFormValidation()

/**
 * Use composable to manage form data state and updates
 */
const { formData, handleBankUpdate } = useFormData(userData)

/**
 * Page-level submission state
 */
const isSubmitting = ref(false)
const submitError = ref("")
const submitSuccess = ref(false)

/**
 * Handle form updates
 */
function handleUpdate(updates: Record<string, unknown>) {
  handleBankUpdate(updates)
}

/**
 * Handle form submission
 */
function handleSubmit() {
  handleFormSubmit()
}

/**
 * Handle form submission - validate entire form and submit to server.
 */
async function handleFormSubmit() {
  isSubmitting.value = true
  submitError.value = ""
  submitSuccess.value = false

  try {
    const payload = {
      bankDetail: formData.bankDetail,
    }

    // Validate payload against schema
    const validationResult = await validatePayload(
      "bankDetail",
      formData.bankDetail
    )

    if (!validationResult.success) {
      submitError.value =
        validationResult.errors
          ?.map((e: Record<string, string>) => `${e.path}: ${e.message}`)
          .join(", ") || "Validation failed"
      return
    }

    // All validation passed - call server to update
    const result = await updateMe(payload)

    if (result.success) {
      submitSuccess.value = true
      setTimeout(() => {
        submitSuccess.value = false
      }, 3000)
    } else {
      submitError.value =
        typeof result.error === "string" ? result.error : "Failed to save data."
    }
  } catch (err: unknown) {
    submitError.value =
      err instanceof Error ? err.message : "An unexpected error occurred."
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/**
 * Bank page styling
 */
</style>
