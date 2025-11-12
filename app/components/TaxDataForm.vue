<template>
  <!-- Form container with dark mode background -->
  <v-container class="form-wrapper pa-6">
    <v-form v-model="formValid" @submit.prevent="onSubmit">
      <v-row>
        <!-- Tax Details -->
        <v-col cols="12" md="6">
          <h3 class="mb-4">Tax details</h3>
          <v-switch
            v-model="form.noTaxId"
            label="No Tax ID"
            color="primary"
            class="mb-2"
          />
          <v-text-field
            v-model="form.taxId"
            label="Tax ID"
            :disabled="form.noTaxId"
            maxlength="11"
            :rules="[v => form.noTaxId || !!v || 'Tax ID is required if not disabled']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
          />
          <v-select
            v-model="form.disability"
            :items="disabilities"
            label="Degree of disability"
            :rules="[v => !!v || 'Disability degree is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
          />
          <v-radio-group
            v-model="form.extraJob"
            label="Do you have more than one employment?"
            :rules="[v => !!v || 'Employment status is required']"
            class="mt-4"
          >
            <v-radio label="Yes" value="Yes" />
            <v-radio label="No" value="No" />
          </v-radio-group>
          <v-textarea
            v-model="form.information"
            label="Extra Tax or Employment information"
            :rules="[v => !!v || 'Employment information is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
          />
          <v-text-field
            v-model="form.employmentStatus"
            label="Employment status"
            required
            :rules="[v => !!v || 'Employment status is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
          />
          <v-text-field
            v-model="form.secondSalary"
            label="Second salary"
            required
            :rules="[v => !!v || 'Second salary is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
          />
        </v-col>
        <!-- Health Insurance Data -->
        <v-col cols="12" md="6">
          <h3 class="mb-4">Health insurance data</h3>
          <v-switch
            v-model="form.noSsn"
            label="No SSN"
            color="primary"
            class="mb-2"
          />
          <v-text-field
            v-model="form.ssn"
            label="SSN"
            :disabled="form.noSsn"
            maxlength="12"
            :rules="[v => form.noSsn || !!v || 'SSN is required if not disabled']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
          />
          <v-text-field
            v-model="form.birthCountry"
            label="Place of birth"
            :rules="[v => !!v || 'Place of birth is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
          />
          <v-text-field
            v-model="form.birthName"
            label="Birth name"
            required
            :rules="[v => !!v || 'Birth name is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
          />
          <v-text-field
            v-model="form.healthInsuranceType"
            label="Health insurance type"
            required
            :rules="[v => !!v || 'Health insurance type is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
          />
          <v-text-field
            v-model="form.healthInsurance"
            label="Health insurance"
            required
            :rules="[v => !!v || 'Health insurance is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
          />
          <v-text-field
            v-model="form.desiredHealthInsuranceCompany"
            label="Desired health insurance company"
            required
            :rules="[v => !!v || 'Desired health insurance company is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
          />
          <v-text-field
            v-model="form.privateHealthInsuranceName"
            label="Private health insurance name"
            required
            :rules="[v => !!v || 'Private health insurance name is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
          />
          <v-text-field
            v-model="form.privateHealthInsuranceContribution"
            label="Private health insurance contribution"
            required
            :rules="[v => !!v || 'Private health insurance contribution is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
          />
          <v-text-field
            v-model="form.privateNursingInsuranceContribution"
            label="Private nursing insurance contribution"
            required
            :rules="[v => !!v || 'Private nursing insurance contribution is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
          />
          <v-text-field
            v-model="form.lastPrivateHealthInsurance"
            label="Last private health insurance"
            required
            :rules="[v => !!v || 'Last private health insurance is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
          />
          <v-switch
            v-model="form.requestFromPensionInsurance"
            label="Request from pension insurance"
            color="primary"
            class="mt-4"
          />
          <v-radio-group
            v-model="form.haveChildren"
            label="Do you have children?"
            :rules="[v => !!v || 'Children status is required']"
            class="mt-4"
          >
            <v-radio label="Yes" value="Yes" />
            <v-radio label="No" value="No" />
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
/**
 * Tax Data Form validation is handled by Vuetify rules.
 * Form is disabled for submission until all required fields are valid.
 */

/**
 * TaxDataForm component displays tax and health insurance data form.
 * 
 * Design decisions:
 * - Initial data is fetched once on mount via useMe() composable
 * - Form state is preserved in <keep-alive> when switching tabs
 * - Validation and submission only occurs on SAVE button click
 * - No watch() to prevent unexpected data overwrites during user editing
 */

const disabilities = ["None", "Mild", "Moderate", "Severe"]
const formValid = ref(false)
const error = ref("")
const success = ref(false)
const isLoading = ref(false)

// Use the composable to fetch initial user data
const { data: userData } = useMe()

/**
 * Form state for tax and insurance fields.
 */
const form = ref({
  taxId: "",
  noTaxId: false,
  extraJob: "",
  disability: "None",
  information: "",
  employmentStatus: "",
  secondSalary: "",
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
})

/**
 * Load initial tax and insurance data from backend once on component mount.
 */
onMounted(() => {
  if (userData.value) {
    if (userData.value.tax) {
      form.value.taxId = userData.value.tax.taxId || ""
      form.value.noTaxId = userData.value.tax.noTaxId || false
      form.value.extraJob = userData.value.tax.extraJob || ""
      form.value.disability = userData.value.tax.disability || "None"
      form.value.information = userData.value.tax.information || ""
      form.value.employmentStatus = userData.value.tax.employmentStatus || ""
      form.value.secondSalary = userData.value.tax.secondSalary || ""
    }
    if (userData.value.insurance) {
      form.value.ssn = userData.value.insurance.ssn || ""
      form.value.noSsn = userData.value.insurance.noSsn || false
      form.value.birthCountry = userData.value.insurance.birthCountry || ""
      form.value.birthName = userData.value.insurance.birthName || ""
      form.value.haveChildren = userData.value.insurance.haveChildren || ""
      form.value.healthInsuranceType = userData.value.insurance.healthInsuranceType || ""
      form.value.healthInsurance = userData.value.insurance.healthInsurance || ""
      form.value.desiredHealthInsuranceCompany = userData.value.insurance.desiredHealthInsuranceCompany || ""
      form.value.privateHealthInsuranceName = userData.value.insurance.privateHealthInsuranceName || ""
      form.value.privateHealthInsuranceContribution = userData.value.insurance.privateHealthInsuranceContribution || ""
      form.value.privateNursingInsuranceContribution = userData.value.insurance.privateNursingInsuranceContribution || ""
      form.value.lastPrivateHealthInsurance = userData.value.insurance.lastPrivateHealthInsurance || ""
      form.value.requestFromPensionInsurance = userData.value.insurance.requestFromPensionInsurance || false
    }
  }
})

async function onSubmit() {
  error.value = ""
  success.value = false
  isLoading.value = true

  try {
    // Prepare payload with all tax and insurance fields
    const payload = {
      tax: {
        taxId: form.value.taxId,
        noTaxId: form.value.noTaxId,
        extraJob: form.value.extraJob,
        disability: form.value.disability,
        information: form.value.information,
        employmentStatus: form.value.employmentStatus,
        secondSalary: form.value.secondSalary
      },
      insurance: {
        ssn: form.value.ssn,
        noSsn: form.value.noSsn,
        birthCountry: form.value.birthCountry,
        birthName: form.value.birthName,
        haveChildren: form.value.haveChildren,
        healthInsuranceType: form.value.healthInsuranceType,
        healthInsurance: form.value.healthInsurance,
        desiredHealthInsuranceCompany: form.value.desiredHealthInsuranceCompany,
        privateHealthInsuranceName: form.value.privateHealthInsuranceName,
        privateHealthInsuranceContribution: form.value.privateHealthInsuranceContribution,
        privateNursingInsuranceContribution: form.value.privateNursingInsuranceContribution,
        lastPrivateHealthInsurance: form.value.lastPrivateHealthInsurance,
        requestFromPensionInsurance: form.value.requestFromPensionInsurance
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
    // Catch any unexpected errors
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

:deep(.v-select) {
  color: #ffffff;
}

:deep(.v-textarea) {
  color: #ffffff;
}

:deep(.v-radio-group) {
  color: #ffffff;
}

:deep(.v-switch) {
  color: #ffffff;
}
</style>
