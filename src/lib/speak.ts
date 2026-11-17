/** Browser TTS fallback — replace with pre-recorded Opus clips per string ID later. */
export function speak(text: string, locale: string = 'en') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = locale === 'si' ? 'si-LK' : locale === 'ta' ? 'ta-LK' : 'en-LK'
  utter.rate = 0.92
  window.speechSynthesis.speak(utter)
}
