import { mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'
import { DEFEAT_MESSAGE, VICTORY_MESSAGE, WORD_SIZE } from '@/settings'

describe('WordleBoard', () => {
  const wordOfTheDay = 'TESTS'
  let wrapper: ReturnType<typeof mount>
  beforeEach(() => {
    wrapper = mount(WordleBoard, { props: { wordOfTheDay } })
  })

  async function playerSubmitsGuess(guess: string) {
    const guessInput = wrapper.find('input[type=text]')
    await guessInput.setValue(guess)
    await guessInput.trigger('keydown.enter')
  }

  describe('End of the game messages', () => {
    it('a victory message appears when the user makes a guess that matches the word of the day', async () => {
      await playerSubmitsGuess(wordOfTheDay)

      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })

    it('a defeat message appears if the user makes a guess that is incorrect', async () => {
      await playerSubmitsGuess('WRONG')

      expect(wrapper.text()).toContain(DEFEAT_MESSAGE)
    })

    it('no end-of-game message appears if the user has not yet made a guess', () => {
      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE)
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)
    })
  })

  describe('Rules for defining the word of the day', () => {
    beforeEach(() => {
      // vi.spyOn(console, 'warn')
      console.warn = vi.fn()
    })

    it.each([
      { wordOfTheDay: 'FLY', reason: 'word-of-the-day must have 5 characters' },
      { wordOfTheDay: 'tests', reason: 'word-of-the-day must be all in uppercase' },
      { wordOfTheDay: 'ASDF', reason: 'word-of-the-day must be a valid English word' }
    ])('Since $reason: $wordOfTheDay is invalid, therefore a warning must be emitted', async ({ wordOfTheDay }) => {
      mount(WordleBoard, { props: { wordOfTheDay } })
      expect(console.warn).toHaveBeenCalled()
    })

    it('no warning is emitted if the word of the day provided is a real uppercase English word with 5 characters', async () => {
      mount(WordleBoard, { props: { wordOfTheDay: 'TESTS' } })
      expect(console.warn).not.toHaveBeenCalled()
    })
  })

  describe('Player input', () => {
    it(`player guesses are limited to ${WORD_SIZE} letters`, async () => {
      await playerSubmitsGuess(wordOfTheDay + 'EXTRA')
      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })
    it('player guesses can only be submitted if they are real words', async () => {
      await playerSubmitsGuess('ASDF')

      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE)
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)
    })
    it.todo('player guesses are not case-sensitive')
    it.todo('player guesses can only contain letters')
  })
})
