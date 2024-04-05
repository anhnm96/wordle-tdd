import { mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'
import { DEFEAT_MESSAGE, MAX_GUESSES_COUNT, VICTORY_MESSAGE, WORD_SIZE } from '@/settings'
import { nextTick } from 'vue'
import GuessView from '../GuessView.vue'

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

    describe.each(
      Array.from(
        { length: MAX_GUESSES_COUNT + 1 },
        (_, numberOfGuesses) => ({
          numberOfGuesses,
          shouldSeeTheDefeatMessage: numberOfGuesses === MAX_GUESSES_COUNT
        })
      )
    )(`a defeat message appears if the user makes incorrect guesses ${MAX_GUESSES_COUNT} times in a row`, ({ numberOfGuesses, shouldSeeTheDefeatMessage }) => {
      it(`therefore for ${numberOfGuesses} guess(es), a defeat message should ${shouldSeeTheDefeatMessage ? "" : "not"} appear`, async () => {
        for (let i = 0; i < numberOfGuesses; i++) {
          await playerSubmitsGuess("WRONG")
        }

        if (shouldSeeTheDefeatMessage) {
          expect(wrapper.text()).toContain(DEFEAT_MESSAGE)
        } else {
          expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)
        }
      })
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
    it("remains in focus the entire time", async () => {
      wrapper = mount(WordleBoard, {
        props: { wordOfTheDay },
        attachTo: document.body
      })

      const inputEl = wrapper.find("input[type=text]")
      expect(inputEl.attributes("autofocus")).toBeDefined()

      await inputEl.trigger("blur")
      await nextTick()
      requestAnimationFrame(() => {
        expect(document.activeElement).toBe(inputEl.element)
      })
    })

    it('the input gets cleared after each submission', async () => {
      await playerSubmitsGuess('WRONG')

      expect(wrapper.find<HTMLInputElement>('input[type=text]').element.value).toEqual('')
    })

    it(`player guesses are limited to ${WORD_SIZE} letters`, async () => {
      await playerSubmitsGuess(wordOfTheDay + 'EXTRA')
      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })

    it('player guesses can only be submitted if they are real words', async () => {
      await playerSubmitsGuess('ASDF')

      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE)
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)
    })

    it('player guesses are not case-sensitive', async () => {
      await playerSubmitsGuess(wordOfTheDay.toLowerCase())
      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })

    it('player guesses can only contain letters', async () => {
      await playerSubmitsGuess('H3!RT')
      expect(wrapper.find<HTMLInputElement>('input[type=text]').element.value).toEqual('HRT')
    })

    it('non-letter characters do not render on the screen while being type', async () => {
      await playerSubmitsGuess('12')
      await playerSubmitsGuess('123')

      expect(wrapper.find<HTMLInputElement>('input[type=text]').element.value).toEqual('')
    })

    it('the player loses control after the max amount of guesses have been sent', async () => {
      const guesses = [
        'WRONG',
        'GUESS',
        'HELLO',
        'WORLD',
        'HAPPY',
        'CODER'
      ]

      for (const guess of guesses) {
        await playerSubmitsGuess(guess)
      }

      expect(wrapper.find('input[type=text]').attributes('disabled')).not.toBeUndefined()
    })

    it('the player loses control after the correct guess has been given', async () => {
      await playerSubmitsGuess(wordOfTheDay)

      expect(wrapper.find('input[type=text]').attributes('disabled')).not.toBeUndefined()
    })

    it('all previous guesses done by the player are visible in the page', async () => {
      const guesses = [
        'WRONG',
        'GUESS',
        'HELLO',
        'WORLD',
        'HAPPY',
        'CODER'
      ]

      for (const guess of guesses) {
        await playerSubmitsGuess(guess)
      }

      for (const guess of guesses) {
        expect(wrapper.text()).toContain(guess)
      }
    })
  })

  describe(`there should always be exactly ${MAX_GUESSES_COUNT} guess-views in the board`, async () => {
    it(`${MAX_GUESSES_COUNT} guess-views are present at the start of the game`, async () => {
      expect(wrapper.findAllComponents(GuessView)).toHaveLength(MAX_GUESSES_COUNT)
    })

    it(`${MAX_GUESSES_COUNT} guess-views are present when the player wins the game`, async () => {
      await playerSubmitsGuess(wordOfTheDay)

      expect(wrapper.findAllComponents(GuessView)).toHaveLength(MAX_GUESSES_COUNT)
    })

    it(`${MAX_GUESSES_COUNT} guess-views are present as the player loses the game`, async () => {
      const guesses = [
        "WRONG",
        "GUESS",
        "HELLO",
        "WORLD",
        "HAPPY",
        "CODER"
      ]

      for (const guess of guesses) {
        await playerSubmitsGuess(guess)
        expect(wrapper.findAllComponents(GuessView)).toHaveLength(MAX_GUESSES_COUNT)
      }
    })
  })
})
