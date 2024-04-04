<script setup lang="ts">
import { DEFEAT_MESSAGE, VICTORY_MESSAGE } from '@/settings'
import { ref } from 'vue'
import GuessInput from './GuessInput.vue'
import englishWords from '@/englishWordsWith5Letters.json'

defineProps({
  wordOfTheDay: {
    type: String,
    validator: (wordGiven: string) => englishWords.includes(wordGiven)
  }
})

const guessSubmitted = ref('')
</script>

<template>
  <GuessInput @guess-submitted="(guess: string) => guessSubmitted = guess" />
  <template v-if="guessSubmitted.length > 0">
    <p v-if="guessSubmitted === wordOfTheDay">{{ VICTORY_MESSAGE }}</p>
    <p v-else>{{ DEFEAT_MESSAGE }}</p>
  </template>
</template>
