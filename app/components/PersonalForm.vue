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
            :model-value="(personal.firstName as string)"
            label="First name"
            required
            :rules="[v => !!v || 'First name is required', v => v?.length >= 1 || 'First name is required']"
            variant="outlined"
            density="comfortable"
            @update:model-value="updateField('firstName', $event)"
          />
          <v-text-field
            :model-value="(personal.lastName as string)"
            label="Last name"
            required
            :rules="[v => !!v || 'Last name is required', v => v?.length >= 1 || 'Last name is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateField('lastName', $event)"
          />
          <v-text-field
            :model-value="(personal.email as string)"
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
            :model-value="(personal.phone as string)"
            label="Phone"
            required
            :rules="[v => !!v || 'Phone is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateField('phone', $event)"
          />
          <v-text-field
            :model-value="(personal.position as string)"
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
            :model-value="(personal.country as string)"
            :items="countries"
            label="Country"
            required
            :rules="[v => !!v || 'Country is required']"
            variant="outlined"
            density="comfortable"
            @update:model-value="updateField('country', $event)"
          />
          <v-text-field
            :model-value="(personal.zip as string)"
            label="Zip"
            required
            :rules="[v => !!v || 'Zip is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateField('zip', $event)"
          />
          <v-text-field
            :model-value="(personal.state as string)"
            label="State"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateField('state', $event)"
          />
          <v-text-field
            :model-value="(personal.city as string)"
            label="City"
            required
            :rules="[v => !!v || 'City is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateField('city', $event)"
          />
          <v-text-field
            :model-value="(personal.address as string)"
            label="Address"
            required
            :rules="[v => !!v || 'Address is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @update:model-value="updateField('address', $event)"
          />
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

const countries = ["Germany", "France", "UK", "USA", "Other"]
const academicTitles = ["No title", "Dr.", "Prof.", "Mr.", "Ms."]
const genders = ["Male", "Female", "Other"]

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
 * Get personal section from formData
 */
const personal = computed(() => (props.formData as Record<string, unknown>) || {})

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
