<template>
  <v-container class="form-wrapper form-input pa-6">
    <v-form v-model="formValid" @submit.prevent="onSubmit">
      <v-row>
        <!-- Tax Details -->
        <v-col cols="12" md="6">
          <h3 class="form-heading">Tax details</h3>
          <v-switch
            :model-value="(tax.noTaxId as boolean)"
            label="No Tax ID"
            color="primary"
            class="mb-2"
            @update:model-value="updateTaxField('noTaxId', $event)"
          />
          <v-text-field
            :model-value="(tax.taxId as string)"
            label="Tax ID"
            :disabled="(tax.noTaxId as boolean)"
            maxlength="11"
            :rules="[(tax.noTaxId as boolean) || !!tax.taxId || 'Tax ID is required if not disabled']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateTaxField('taxId', $event)"
          />
          <v-select
            :model-value="(tax.disability as string)"
            :items="disabilities"
            label="Degree of disability"
            :rules="[v => !!v || 'Disability degree is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateTaxField('disability', $event)"
          />
          <v-radio-group
            :model-value="(tax.extraJob as string)"
            label="Do you have more than one employment?"
            :rules="[v => !!v || 'Employment status is required']"
            class="mt-4"
            @update:model-value="updateTaxField('extraJob', $event)"
          >
            <v-radio label="Yes" value="Yes" />
            <v-radio label="No" value="No" />
          </v-radio-group>
          <v-textarea
            :model-value="(tax.information as string)"
            label="Extra Tax or Employment information"
            :rules="[v => !!v || 'Employment information is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateTaxField('information', $event)"
          />
          <v-text-field
            :model-value="(tax.employmentStatus as string)"
            label="Employment status"
            required
            :rules="[v => !!v || 'Employment status is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateTaxField('employmentStatus', $event)"
          />
          <v-text-field
            :model-value="(tax.secondSalary as string)"
            label="Second salary"
            required
            :rules="[v => !!v || 'Second salary is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateTaxField('secondSalary', $event)"
          />
        </v-col>
        <!-- Health Insurance Data -->
        <v-col cols="12" md="6">
          <h3 class="form-heading">Health insurance data</h3>
          <v-switch
            :model-value="(insurance.noSsn as boolean)"
            label="No SSN"
            color="primary"
            class="mb-2"
            @update:model-value="updateInsuranceField('noSsn', $event)"
          />
          <v-text-field
            :model-value="(insurance.ssn as string)"
            label="SSN"
            :disabled="(insurance.noSsn as boolean)"
            maxlength="12"
            :rules="[(insurance.noSsn as boolean) || !!insurance.ssn || 'SSN is required if not disabled']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateInsuranceField('ssn', $event)"
          />
          <v-text-field
            :model-value="(insurance.birthCountry as string)"
            label="Place of birth"
            :rules="[v => !!v || 'Place of birth is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateInsuranceField('birthCountry', $event)"
          />
          <v-text-field
            :model-value="(insurance.birthName as string)"
            label="Birth name"
            required
            :rules="[v => !!v || 'Birth name is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateInsuranceField('birthName', $event)"
          />
          <v-text-field
            :model-value="(insurance.healthInsuranceType as string)"
            label="Health insurance type"
            required
            :rules="[v => !!v || 'Health insurance type is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateInsuranceField('healthInsuranceType', $event)"
          />
          <v-text-field
            :model-value="(insurance.healthInsurance as string)"
            label="Health insurance"
            required
            :rules="[v => !!v || 'Health insurance is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateInsuranceField('healthInsurance', $event)"
          />
          <v-text-field
            :model-value="(insurance.desiredHealthInsuranceCompany as string)"
            label="Desired health insurance company"
            required
            :rules="[v => !!v || 'Desired health insurance company is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateInsuranceField('desiredHealthInsuranceCompany', $event)"
          />
          <v-text-field
            :model-value="(insurance.privateHealthInsuranceName as string)"
            label="Private health insurance name"
            required
            :rules="[v => !!v || 'Private health insurance name is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateInsuranceField('privateHealthInsuranceName', $event)"
          />
          <v-text-field
            :model-value="(insurance.privateHealthInsuranceContribution as string)"
            label="Private health insurance contribution"
            required
            :rules="[v => !!v || 'Private health insurance contribution is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateInsuranceField('privateHealthInsuranceContribution', $event)"
          />
          <v-text-field
            :model-value="(insurance.privateNursingInsuranceContribution as string)"
            label="Private nursing insurance contribution"
            required
            :rules="[v => !!v || 'Private nursing insurance contribution is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateInsuranceField('privateNursingInsuranceContribution', $event)"
          />
          <v-text-field
            :model-value="(insurance.lastPrivateHealthInsurance as string)"
            label="Last private health insurance"
            required
            :rules="[v => !!v || 'Last private health insurance is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateInsuranceField('lastPrivateHealthInsurance', $event)"
          />
          <v-switch
            :model-value="(insurance.requestFromPensionInsurance as boolean)"
            label="Request from pension insurance"
            color="primary"
            class="mt-4"
            @update:model-value="updateInsuranceField('requestFromPensionInsurance', $event)"
          />
          <v-radio-group
            :model-value="(insurance.haveChildren as string)"
            label="Do you have children?"
            :rules="[v => !!v || 'Children status is required']"
            class="mt-4"
            @update:model-value="updateInsuranceField('haveChildren', $event)"
          >
            <v-radio label="Yes" value="Yes" />
            <v-radio label="No" value="No" />
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

const disabilities = ["None", "Mild", "Moderate", "Severe"]
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
 * Get tax and insurance sections from formData
 */
const tax = computed(() => (props.formData.tax as Record<string, unknown>) || {})
const insurance = computed(() => (props.formData.insurance as Record<string, unknown>) || {})

/**
 * Handle input changes - emit to parent to update central formData.
 */
function updateTaxField(field: string, value: unknown) {
  emit("update:form-data", {
    tax: {
      ...tax.value,
      [field]: value
    }
  })
}

/**
 * Handle insurance field changes - emit to parent to update central formData.
 */
function updateInsuranceField(field: string, value: unknown) {
  emit("update:form-data", {
    insurance: {
      ...insurance.value,
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
