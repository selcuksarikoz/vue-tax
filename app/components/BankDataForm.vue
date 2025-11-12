<template>
  <!-- Form container with dark mode background -->
  <v-container class="form-wrapper pa-6">
    <v-form v-model="formValid" @submit.prevent="onSubmit">
      <v-row>
        <v-col cols="12">
          <h3 class="mb-4">Bank Data</h3>
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
import { ref, onMounted } from "vue"
import { useMe } from "~/composables/useMe"

const formValid = ref(false)
const error = ref("")
const success = ref(false)
const isLoading = ref(false)

// Use the composable to fetch initial user data
const { data: userData } = useMe()

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
 * Load initial bank data from backend once on component mount.
 */
onMounted(() => {
  if (userData.value?.bankDetail) {
    form.value.bankName = userData.value.bankDetail.bankName || ""
    form.value.bankBic = userData.value.bankDetail.bankBic || ""
    form.value.iban = userData.value.bankDetail.iban || ""
    form.value.id = userData.value.bankDetail.id || ""
    form.value.bankId = userData.value.bankDetail.bankId || ""
    form.value.payee = userData.value.bankDetail.payee || ""
    form.value.paymentMethod = userData.value.bankDetail.paymentMethod || "Cash"
  }
})

/**
 * Validates and submits the bank data form.
 * Form validation is handled by Vuetify rules.
 * Only bankDetail fields are submitted to /api/me endpoint.
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

<style scoped>
/**
 * Form styling with dark mode support.
 * Uses Vuetify theme colors for consistency.
 */
.form-wrapper {
  background-color: rgba(30, 30, 30, 0.8);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

h3 {
  color: #ffffff;
  font-weight: 600;
}

:deep(.v-text-field) {
  color: #ffffff;
}

:deep(.v-radio-group) {
  color: #ffffff;
}
</style>
