/**
 * Zero-literacy pictogram set (Phase 1).
 * Flat Kraft/Ink/Board drawings — not Lucide, not emoji.
 * Import as URLs via Vite `?url` or as React components later.
 */
import chatUrl from './chat.svg'
import parcelUrl from './parcel.svg'
import purseUrl from './purse.svg'
import bikeUrl from './bike.svg'
import doorUrl from './door.svg'
import coinUrl from './coin.svg'
import cameraUrl from './camera.svg'
import speakerUrl from './speaker.svg'
import handUrl from './hand.svg'
import stampUrl from './stamp.svg'

export const pictograms = {
  chat: chatUrl,
  parcel: parcelUrl,
  purse: purseUrl,
  bike: bikeUrl,
  door: doorUrl,
  coin: coinUrl,
  camera: cameraUrl,
  speaker: speakerUrl,
  hand: handUrl,
  stamp: stampUrl,
} as const

export type PictogramId = keyof typeof pictograms

export const PICTOGRAM_IDS = Object.keys(pictograms) as PictogramId[]
