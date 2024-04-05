<script setup lang="ts">
import { WORD_SIZE } from '@/settings'
import { computed, nextTick, ref, triggerRef } from 'vue'
import englishWords from '@/englishWordsWith5Letters.json'
import GuessView from './GuessView.vue'

withDefaults(defineProps<{ disabled?: boolean }>(), { disabled: false })

const emit = defineEmits<{
  'guess-submitted': [guess: string]
}>()
const guessInProgress = ref<string | null>(null)
const formattedGuessInProgress = computed<string>({
  get() {
    return guessInProgress.value ?? ''
  },
  set(rawValue: string) {
    guessInProgress.value = rawValue
      .slice(0, WORD_SIZE)
      .toUpperCase()
      .replace(/[^A-Z]+/gi, '')
    // need force update to trigger reactivity
    triggerRef(formattedGuessInProgress);
  }
})

function onSubmit() {
  if (!englishWords.includes(formattedGuessInProgress.value)) return
  emit('guess-submitted', formattedGuessInProgress.value)
  guessInProgress.value = null
}

async function blur(event: Event) {
  await nextTick()
  requestAnimationFrame(() => {
    (event.target as HTMLInputElement).focus()
  })
}
</script>

<template>
  <GuessView v-if="!disabled" :guess="formattedGuessInProgress" />

  <input type="text" :maxlength="WORD_SIZE" :disabled="disabled" aria-label="Make your guess for the word of the day!"
    autofocus @blur="blur" v-model="formattedGuessInProgress" @keydown.enter="onSubmit">
</template>

<style scoped>
input {
  position: absolute;
  opacity: 0;
}
</style>