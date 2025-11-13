<template>
  <v-layout class="rounded rounded-md border">
    <v-app-bar title="Taxmaro Front End Assessment" />

    <NavigationDrawer />

    <v-main>
      <v-container>
        <div class="personal-layout">
          <FormTabs />
          <div class="content">
            <slot />
          </div>
        </div>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import FormTabs from "~/components/FormTabs.vue"
import NavigationDrawer from "~/components/NavigationDrawer.vue"
</script>

<style scoped>
.personal-layout {
  padding: 20px;
  background-color: #121212;
  min-height: 100vh;
}

.content {
  background-color: rgba(30, 30, 30, 0.8);
  border-radius: 8px;
  padding: 20px;
  backdrop-filter: blur(10px);
  margin-top: 20px;
}
</style>
