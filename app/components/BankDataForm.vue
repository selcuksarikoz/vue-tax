<template>
  <v-container class="form-wrapper form-input pa-6">
    <v-form v-model="formValid" @submit.prevent="onSubmit">
      <v-row class="mt-4">
        <v-col cols="12">
          <v-alert v-if="error" type="error" variant="tonal" closable @click:close="error = ''">{{ error }}</v-alert>
          <v-alert v-if="success" type="success" variant="tonal" closable @click:close="success = ''">Saved successfully!</v-alert>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <h3 class="form-heading">Bank Data</h3>
          <v-text-field
            :model-value="(bankDetail.bankName as string)"
            label="Bank name"
            required
            :rules="[v => !!v || 'Bank name is required']"
            variant="outlined"
            density="comfortable"
            @update:model-value="updateField('bankName', $event)"
          />
          <v-text-field
            :model-value="(bankDetail.bankBic as string)"
            label="BIC"
            required
            :rules="[v => !!v || 'BIC is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateField('bankBic', $event)"
          />
          <v-text-field
            :model-value="(bankDetail.iban as string)"
            label="IBAN"
            required
            :rules="[v => !!v || 'IBAN is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateField('iban', $event)"
          />
          <v-text-field
            :model-value="(bankDetail.id as string)"
            label="Account ID"
            required
            :rules="[v => !!v || 'Account ID is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateField('id', $event)"
          />
          <v-text-field
            :model-value="(bankDetail.bankId as string)"
            label="Bank ID"
            required
            :rules="[v => !!v || 'Bank ID is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateField('bankId', $event)"
          />
          <v-text-field
            :model-value="(bankDetail.payee as string)"
            label="Payee"
            required
            :rules="[v => !!v || 'Payee is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateField('payee', $event)"
          />
          <v-radio-group
            :model-value="(bankDetail.paymentMethod as string)"
            label="Payment method"
            required
            :rules="[v => !!v || 'Payment method is required']"
            class="mt-4"
            @update:model-value="updateField('paymentMethod', $event)"
          >
            <v-radio label="Cash" value="Cash" />
            <v-radio label="Bank Transfer" value="Bank Transfer" />
            <v-radio label="Cheque" value="Cheque" />
          </v-radio-group>
        </v-col>
      </v-row>
      <v-row class="mt-4">
        <v-col cols="3" class="ml-auto">
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
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"

/**
 * Props passed from parent page component.
 * Page manages all form data, validation, and submission.
 * Form component only renders UI and emits changes.
 */
interface Props {
  formData: Record<string, unknown>
  isLoading?: boolean
  error?: string
  success?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  error: "",
  success: false
})

/**
 * Emit events for parent component.
 */
const emit = defineEmits<{
  submit: []
  'update:form-data': [updates: Record<string, unknown>]
}>()

const formValid = ref(false)

/**
 * Display error from parent
 */
const error = computed(() => props.error)

/**
 * Display success from parent
 */
const success = computed(() => props.success)

/**
 * Display loading state from parent
 */
const isLoading = computed(() => props.isLoading)

/**
 * Get bankDetail from formData
 */
const bankDetail = computed(() => (props.formData.bankDetail as Record<string, unknown>) || {})

/**
 * Handle input changes - emit to parent to update central formData.
 */
function updateField(field: string, value: unknown) {
  emit("update:form-data", {
    bankDetail: {
      ...bankDetail.value,
      [field]: value
    }
  })
}

/**
 * Handle submit - parent will validate and call updateMe.
 */
function onSubmit() {
  emit("submit")
}
</script>
