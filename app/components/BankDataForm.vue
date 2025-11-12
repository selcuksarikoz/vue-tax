<template>
  <!-- Form container with dark mode background -->
  <v-container class="form-wrapper form-input pa-6">
    <v-form v-model="formValid" @submit.prevent="onSubmit">
      <v-row>
        <v-col cols="12">
          <h3 class="form-heading">Bank Data</h3>
          <v-text-field
            v-model="form.bankName"
            label="Bank name"
            required
            :rules="[v => !!v || 'Bank name is required']"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="form.bankBic"
            label="BIC"
            required
            :rules="[v => !!v || 'BIC is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
          />
          <v-text-field
            v-model="form.iban"
            label="IBAN"
            required
            :rules="[v => !!v || 'IBAN is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
          />
          <v-text-field
            v-model="form.id"
            label="Account ID"
            required
            :rules="[v => !!v || 'Account ID is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
          />
          <v-text-field
            v-model="form.bankId"
            label="Bank ID"
            required
            :rules="[v => !!v || 'Bank ID is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
          />
          <v-text-field
            v-model="form.payee"
            label="Payee"
            required
            :rules="[v => !!v || 'Payee is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
          />
          <v-radio-group
            v-model="form.paymentMethod"
            label="Payment method"
            required
            :rules="[v => !!v || 'Payment method is required']"
            class="mt-4"
          >
            <v-radio label="Cash" value="Cash" />
            <v-radio label="Bank Transfer" value="Bank Transfer" />
            <v-radio label="Cheque" value="Cheque" />
          </v-radio-group>
        </v-col>
      </v-row>
      <v-row class="mt-4">
        <v-col cols="12">
          <!-- Save button is disabled until all required fields are valid -->
          <v-btn 
            type="submit" 
            color="primary" 
            block 
            size="large"
            :disabled="!formValid || isLoading"
          >
            {{ isLoading ? 'Saving...' : 'Save' }}
          </v-btn>
        </v-col>
      </v-row>
      <v-row class="mt-4">
        <v-col cols="12">
          <v-alert v-if="error" type="error" variant="tonal" closable @click:close="error = ''">{{ error }}</v-alert>
          <v-alert v-if="success" type="success" variant="tonal" closable @click:close="success = ''">Saved successfully!</v-alert>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { useMe } from "~/composables/useMe"
import { useFormValidation } from "~/composables/useFormValidation"

const formValid = ref(false)
const error = ref("")
const success = ref(false)
const isLoading = ref(false)

// Use composables
const { data: userData } = useMe()
const { validatePayload } = useFormValidation()

/**
 * Form state for bank details.
 */
const form = ref({
  bankName: "",
  bankBic: "",
  iban: "",
  id: "",
  bankId: "",
  payee: "",
  paymentMethod: "Cash"
})

/**
 * Watch userData for changes and populate form.
 * This works on both server-side and client-side rendering.
 * useAsyncData handles SSR automatically.
 */
watch(
  () => userData.value?.bankDetail,
  (bankDetail) => {
    if (bankDetail) {
      form.value.bankName = bankDetail.bankName || ""
      form.value.bankBic = bankDetail.bankBic || ""
      form.value.iban = bankDetail.iban || ""
      form.value.id = bankDetail.id || ""
      form.value.bankId = bankDetail.bankId || ""
      form.value.payee = bankDetail.payee || ""
      form.value.paymentMethod = bankDetail.paymentMethod || "Cash"
    }
  },
  { immediate: true }
)

/**
 * Validates and submits the bank data form.
 * Form validation is handled by Vuetify rules.
 * Schema validation is done via Zod before submission.
 */
async function onSubmit() {
  error.value = ""
  success.value = false
  isLoading.value = true

  try {
    // Prepare payload with all bankDetail fields
    const payload = {
      bankDetail: {
        bankName: form.value.bankName,
        bankBic: form.value.bankBic,
        iban: form.value.iban,
        id: form.value.id,
        bankId: form.value.bankId,
        payee: form.value.payee,
        paymentMethod: form.value.paymentMethod
      }
    }

    // Validate payload against schema for bankDetail section only
    const validationResult = await validatePayload("bankDetail", payload.bankDetail)
    if (!validationResult.success) {
      error.value = validationResult.errors
        ?.map(e => `${e.path}: ${e.message}`)
        .join(", ") || "Validation failed"
      return
    }

    // Submit if validation passes
    const { updateMe } = useMe()
    const result = await updateMe(payload)

    if (result.success) {
      success.value = true
      setTimeout(() => { success.value = false }, 3000)
    } else {
      error.value = typeof result.error === "string" ? result.error : "Failed to save data."
    }
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : "An unexpected error occurred."
  } finally {
    isLoading.value = false
  }
}
</script>
