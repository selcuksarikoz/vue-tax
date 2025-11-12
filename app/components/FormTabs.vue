<template>
  <v-tabs v-model="tab" grow>
    <v-tab to="/personal">Personal</v-tab>
    <v-tab to="/bank-data">Bank Data</v-tab>
    <v-tab to="/tax-data">Tax Data</v-tab>
  </v-tabs>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

const props = defineProps<{ activeTab: string }>()
const tab = ref(props.activeTab)
const router = useRouter()
const route = useRoute()

watch(tab, (val) => {
  router.push({ path: `/${val}` })
})
</script>
