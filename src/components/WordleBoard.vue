<script setup lang="ts">
import { VICTORY_MESSAGE } from '@/settings'

defineProps<{
  wordOfTheDay: string
}>()
</script>

<template>
  <input type="text">
  <p>You won!</p>
  <h1>{{ VICTORY_MESSAGE }}</h1>
</template>
