<template>
  <v-navigation-drawer>
    <v-list nav>
      <v-list-item title="Home" link to="/" />
      <v-list-item
        title="Personal Data"
        link
        to="/personal"
        :active="isPersonalActive"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()

const isPersonalActive = computed(() => route.path.startsWith("/personal"))
</script>
