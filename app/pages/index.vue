<template>
  <div class="welcome-page">
    <v-container class="pa-6">
      <v-row>
        <v-col cols="12">
          <h1 class="text-h3 welcome-heading">Welcome To Taxmaro Front End Assessment</h1>
          <p class="welcome-description">
            Navigate to the Personal section to manage your information, bank details, and tax/insurance data.
          </p>
          <v-btn 
            to="/personal" 
            color="primary" 
            size="large"
            class="mt-4"
          >
            Go to Personal Forms
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
/**
 * Page-specific styling for the welcome page.
 * Uses global CSS variables for consistency with form styling.
 */
.welcome-page {
  background-color: #121212;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-heading {
  color: var(--text-primary);
  font-weight: var(--text-heading-weight);
  margin-bottom: 1rem;
}

.welcome-description {
  color: var(--text-primary);
  font-size: 1.1rem;
  line-height: 1.6;
  opacity: 0.9;
  margin-bottom: 1.5rem;
}
</style>

