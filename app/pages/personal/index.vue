<template>
  <div class="personal-page">
    <!-- Tab Navigation: tabs are linked to routes for URL changes -->
    <v-tabs 
      grow
      class="tabs-section"
      :model-value="activeTab" 
      @update:model-value="navigateToTab"
    >
      <v-tab value="personal" to="/personal">Personal</v-tab>
      <v-tab value="bank" to="/personal/bank-data">Bank Data</v-tab>
      <v-tab value="tax" to="/personal/tax-data">Tax Data</v-tab>
    </v-tabs>

    <!-- Form Components: All forms are rendered simultaneously and toggled with v-show -->
    <!-- This ensures <keep-alive> properly caches all components and preserves their internal state -->
    <keep-alive>
      <div class="form-container">
        <PersonalForm v-show="activeTab === 'personal'" />
        <BankDataForm v-show="activeTab === 'bank'" />
        <TaxDataForm v-show="activeTab === 'tax'" />
      </div>
    </keep-alive>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from '#vue-router'
import PersonalForm from '~/components/PersonalForm.vue'
import BankDataForm from '~/components/BankDataForm.vue'
import TaxDataForm from '~/components/TaxDataForm.vue'

const route = useRoute()
const router = useRouter()

/**
 * Determine active tab based on current route path.
 * Provides tab indicator for v-tabs component and form selection.
 * 
 * @returns {string} Active tab value: 'personal', 'bank', or 'tax'
 */
const activeTab = computed(() => {
  const path = route.path
  if (path.includes('bank')) return 'bank'
  if (path.includes('tax')) return 'tax'
  return 'personal'
})

/**
 * Navigate to the selected tab by updating the route.
 * This ensures the URL reflects the current tab and preserves browser history.
 * 
 * @param {string} tab - The tab value: 'personal', 'bank', or 'tax'
 */
function navigateToTab(tab: string) {
  const routes: Record<string, string> = {
    personal: '/personal',
    bank: '/personal/bank-data',
    tax: '/personal/tax-data'
  }
  router.push(routes[tab] || '/personal')
}


</script>

<style scoped>
/**
 * Personal page styling with dark mode support.
 * Page background is set to dark, form sections have semi-transparent containers.
 */
.personal-page {
  padding: 20px;
  background-color: #121212;
  min-height: 100vh;
}

.tabs-section {
  margin-bottom: 20px;
}

.form-container {
  background-color: rgba(30, 30, 30, 0.8);
  border-radius: 8px;
  padding: 20px;
  backdrop-filter: blur(10px);
}
</style>
