<template>
  <!-- Form container with dark mode background -->
  <v-container class="form-wrapper form-input pa-6">
    <v-form v-model="formValid" @submit.prevent="onSubmit">
      <v-row>
        <!-- General Section -->
        <v-col cols="12" md="6">
          <h3 class="form-heading">General</h3>
          <v-select
            v-model="form.academicTitle"
            :items="academicTitles"
            label="Academic title"
            required
            :rules="[v => !!v || 'Academic title is required']"
            variant="outlined"
            density="comfortable"
          />
          <v-select
            v-model="form.gender"
            :items="genders"
            label="Gender"
            required
            :rules="[v => !!v || 'Gender is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
          />
          <v-text-field
            v-model="form.firstName"
            label="First name"
            required
            :rules="[v => !!v || 'First name is required', v => v?.length >= 1 || 'First name is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
          />
          <v-text-field
            v-model="form.lastName"
            label="Last name"
            required
            :rules="[v => !!v || 'Last name is required', v => v?.length >= 1 || 'Last name is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
          />
          <v-text-field
            v-model="form.dateOfBirth"
            label="Date of birth"
            type="date"
            required
            :rules="[v => !!v || 'Date of birth is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
          />
          <v-text-field
            v-model="form.email"
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
          />
          <v-text-field
            v-model="form.phone"
            label="Phone"
            required
            :rules="[v => !!v || 'Phone is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
          />
          <v-text-field
            v-model="form.position"
            label="Position"
            required
            :rules="[v => !!v || 'Position is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
          />
        </v-col>
        <!-- Address Section -->
        <v-col cols="12" md="6">
          <h3 class="form-heading">Address</h3>
          <v-select
            v-model="form.country"
            :items="countries"
            label="Country"
            required
            :rules="[v => !!v || 'Country is required']"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="form.postcode"
            label="Postcode"
            required
            :rules="[v => !!v || 'Postcode is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
          />
          <v-text-field
            v-model="form.state"
            label="State"
            variant="outlined"
            density="comfortable"
            class="mt-4"
          />
          <v-text-field
            v-model="form.city"
            label="City"
            required
            :rules="[v => !!v || 'City is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
          />
          <v-text-field
            v-model="form.street"
            label="Street"
            required
            :rules="[v => !!v || 'Street is required']"
            variant="outlined"
            density="comfortable"
            class="mt-4"
          />
          <v-text-field
            v-model="form.houseNumber"
            label="House number"
            variant="outlined"
            density="comfortable"
            class="mt-4"
          />
          <v-text-field
            v-model="form.additionalAddressInfo"
            label="Additional address information"
            variant="outlined"
            density="comfortable"
            class="mt-4"
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
import { ref, onMounted } from "vue"
import { useMe } from "~/composables/useMe"

const academicTitles = ["No title", "Dr.", "Prof.", "Mr.", "Ms."]
const genders = ["Male", "Female", "Other"]
const countries = ["Germany", "France", "UK", "USA", "Other"]

const formValid = ref(false)
const error = ref("")
const success = ref(false)
const isLoading = ref(false)

// Use the composable to fetch initial user data
const { data: userData } = useMe()

/**
 * Form state with default values.
 * This is initialized once on mount with backend data if available.
 */
const form = ref({
  academicTitle: "No title",
  gender: "",
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  email: "",
  phone: "",
  position: "",
  country: "Germany",
  postcode: "",
  state: "",
  city: "",
  street: "",
  houseNumber: "",
  additionalAddressInfo: ""
})

onMounted(() => {
  // Only load if form is empty (prevents overwriting user edits)
  if (userData.value && form.value.firstName === "") {
    form.value = {
      academicTitle: userData.value.academicTitle || "No title",
      gender: userData.value.gender || "",
      firstName: userData.value.firstName || "",
      lastName: userData.value.lastName || "",
      dateOfBirth: userData.value.dateOfBirth || "",
      email: userData.value.email || "",
      phone: userData.value.phone || "",
      position: userData.value.position || "",
      country: userData.value.country || "Germany",
      postcode: userData.value.zip || "",
      state: userData.value.state || "",
      city: userData.value.city || "",
      street: userData.value.address || "",
      houseNumber: userData.value.houseNumber || "",
      additionalAddressInfo: userData.value.additionalAddressInfo || ""
    }
  }
})

async function onSubmit() {
  error.value = ""
  success.value = false
  isLoading.value = true

  try {
    // Form validation is already done by Vuetify v-form
    // Prepare payload with only the fields shown in this form
    const payload = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      phone: form.value.phone,
      position: form.value.position,
      country: form.value.country,
      zip: form.value.postcode,
      state: form.value.state,
      city: form.value.city,
      address: form.value.street
    }

    // Submit via composable
    const { updateMe } = useMe()
    const result = await updateMe(payload)

    if (result.success) {
      success.value = true
      // Clear success message after 3 seconds
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
