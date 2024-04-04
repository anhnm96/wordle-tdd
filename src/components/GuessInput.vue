<script setup lang="ts">
import { WORD_SIZE } from '@/settings'
import { computed, ref, triggerRef } from 'vue'
import englishWords from '@/englishWordsWith5Letters.json'

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
}
</script>

<template>
  <input type="text" :maxlength="WORD_SIZE" v-model="formattedGuessInProgress" @keydown.enter="onSubmit">
</template>
