<template>
  <v-tabs grow>
    <v-tab value="personal" to="/personal">Personal</v-tab>
    <v-tab value="bank" to="/personal/bank">Bank Data</v-tab>
    <v-tab value="tax" to="/personal/tax">Tax Data</v-tab>
  </v-tabs>
  <slot />
</template>
