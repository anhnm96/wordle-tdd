<script setup lang="ts">
import { DEFEAT_MESSAGE, VICTORY_MESSAGE } from '@/settings'
import { ref } from 'vue';

defineProps<{
  wordOfTheDay: string
}>()

const guessInProgress = ref('')
const guessSubmitted = ref('')
</script>

<template>
  <input type="text" v-model="guessInProgress" @keydown.enter="guessSubmitted = guessInProgress">
  <template v-if="guessSubmitted.length > 0">
    <p v-if="guessSubmitted === wordOfTheDay">{{ VICTORY_MESSAGE }}</p>
    <p else>{{ DEFEAT_MESSAGE }}</p>
  </template>
</template>
