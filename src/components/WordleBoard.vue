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
  <main>
    <GuessInput @guess-submitted="(guess: string) => guessSubmitted = guess" />
    <template v-if="guessSubmitted.length > 0">
      <p v-if="guessSubmitted === wordOfTheDay">{{ VICTORY_MESSAGE }}</p>
      <p v-else>{{ DEFEAT_MESSAGE }}</p>
    </template>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
}

.end-of-game-message {
  font-size: 3rem;
  animation: end-of-game-message-animation 700ms forwards;
  white-space: nowrap;
  text-align: center;
}

@keyframes end-of-game-message-animation {
  0% {
    opacity: 0;
    transform: rotateZ(0);
  }

  100% {
    opacity: 1;
    transform: translateY(2rem);
  }
}
</style>