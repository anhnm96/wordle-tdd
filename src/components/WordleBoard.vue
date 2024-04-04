<script setup lang="ts">
import { DEFEAT_MESSAGE, VICTORY_MESSAGE, WORD_SIZE } from '@/settings'
import { computed, ref } from 'vue'
import englishWords from '@/englishWordsWith5Letters.json'

defineProps({
  wordOfTheDay: {
    type: String,
    validator: (wordGiven: string) => englishWords.includes(wordGiven)
  }
})

const guessInProgress = ref('')
const guessSubmitted = ref('')

const formattedGuessInProgress = computed({
  get() {
    return guessInProgress.value
  },
  set(rawValue: string) {
    guessInProgress.value = rawValue.slice(0, WORD_SIZE)
  }
})
</script>

<template>
  <input type="text" :maxlength="WORD_SIZE" v-model="formattedGuessInProgress"
    @keydown.enter="guessSubmitted = guessInProgress">
  <template v-if="guessSubmitted.length > 0">
    <p v-if="guessSubmitted === wordOfTheDay">{{ VICTORY_MESSAGE }}</p>
    <p else>{{ DEFEAT_MESSAGE }}</p>
  </template>
</template>
