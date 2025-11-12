<template>
  <v-layout class="rounded rounded-md border">
    <v-app-bar title="Taxmaro Front End Assessment" />

    <NavigationDrawer />

    <v-main>
      <v-container>
        <slot />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import NavigationDrawer from "./NavigationDrawer.vue";
</script>
