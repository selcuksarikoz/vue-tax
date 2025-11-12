<template>
  <!-- Form container with dark mode background -->
  <v-container class="form-wrapper form-input pa-6">
    <v-form v-model="formValid" @submit.prevent="onSubmit">
      <v-row>
        <!-- General Section -->
        <v-col cols="12" md="6">
          <h3 class="form-heading">General</h3>
          <v-select
            :model-value="(formData.academicTitle as string)"
            :items="academicTitles"
            label="Academic title"
            required
            :rules="[v => !!v || 'Academic title is required']"
            variant="outlined"
            density="comfortable"
            @update:model-value="updateField('academicTitle', $event)"
          />
          <v-select
            :model-value="(formData.gender as string)"
            :items="genders"
            label="Gender"
            required
            :rules="[v => !!v || 'Gender is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateField('gender', $event)"
          />
          <v-text-field
            :model-value="(formData.firstName as string)"
            label="First name"
            required
            :rules="[v => !!v || 'First name is required', v => v?.length >= 1 || 'First name is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateField('firstName', $event)"
          />
          <v-text-field
            :model-value="(formData.lastName as string)"
            label="Last name"
            required
            :rules="[v => !!v || 'Last name is required', v => v?.length >= 1 || 'Last name is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateField('lastName', $event)"
          />
          <v-text-field
            :model-value="(formData.dateOfBirth as string)"
            label="Date of birth"
            type="date"
            required
            :rules="[v => !!v || 'Date of birth is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateField('dateOfBirth', $event)"
          />
          <v-text-field
            :model-value="(formData.email as string)"
            label="E-mail"
            type="email"
            required
            :rules="[
              v => !!v || 'Email is required',
              v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Email must be valid'
            ]"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateField('email', $event)"
          />
          <v-text-field
            :model-value="(formData.phone as string)"
            label="Phone"
            required
            :rules="[v => !!v || 'Phone is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateField('phone', $event)"
          />
          <v-text-field
            :model-value="(formData.position as string)"
            label="Position"
            required
            :rules="[v => !!v || 'Position is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateField('position', $event)"
          />
        </v-col>
        <!-- Address Section -->
        <v-col cols="12" md="6">
          <h3 class="form-heading">Address</h3>
          <v-select
            :model-value="(formData.country as string)"
            :items="countries"
            label="Country"
            required
            :rules="[v => !!v || 'Country is required']"
            variant="outlined"
            density="comfortable"
            @update:model-value="updateField('country', $event)"
          />
          <v-text-field
            :model-value="(formData.postcode as string)"
            label="Postcode"
            required
            :rules="[v => !!v || 'Postcode is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateField('postcode', $event)"
          />
          <v-text-field
            :model-value="(formData.state as string)"
            label="State"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateField('state', $event)"
          />
          <v-text-field
            :model-value="(formData.city as string)"
            label="City"
            required
            :rules="[v => !!v || 'City is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateField('city', $event)"
          />
          <v-text-field
            :model-value="(formData.street as string)"
            label="Street"
            required
            :rules="[v => !!v || 'Street is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateField('street', $event)"
          />
          <v-text-field
            :model-value="(formData.houseNumber as string)"
            label="House number"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateField('houseNumber', $event)"
          />
          <v-text-field
            :model-value="(formData.additionalAddressInfo as string)"
            label="Additional address information"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateField('additionalAddressInfo', $event)"
          />
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

const academicTitles = ["No title", "Dr.", "Prof.", "Mr.", "Ms."]
const genders = ["Male", "Female", "Other"]
const countries = ["Germany", "France", "UK", "USA", "Other"]

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
 * Handle input changes - emit to parent to update central formData.
 */
function updateField(field: string, value: unknown) {
  emit("update:form-data", { [field]: value })
}

/**
 * Handle submit - parent will validate and call updateMe.
 */
function onSubmit() {
  emit("submit")
}
</script>
