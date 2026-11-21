# Phase 1 — Design system (kade counter + parcel table)

**Status:** Ready for review — **do not start Phase 2 screen rebuild until approved**  
**Capability rule:** Presentation only. All processes in [phase-0-audit.md](./phase-0-audit.md) stay **Keep**.

---

## 1. Concept

The desk is a **Sri Lankan kade counter and packing table**, not an office SaaS dashboard.

- Orders are **parcel tags** (kraft, string hole, rubber stamp).
- Money is a **purse + coin piles**.
- Couriers are a **bike on the road**.
- Delivery is a **door**.
- Help is a **speaker** (spoken label).

### The Stamp (only expressive motion)

On every status change, a rubber stamp thumps onto the tag (slight rotation, ink bleed). With `prefers-reduced-motion: reduce`, the stamp **appears** with no motion. Sound/vibration optional later; mute in Shop.

No section fade-ups, card hover lifts, parallax, or gradient glass.

---

## 2. Color tokens (`data-theme="kade"`)

Seeded in `src/index.css`. Existing lagoon / night / market themes **kept**. Theme switcher includes **Kade** for preview.

| Token | Hex | Role | Shape cue (not color alone) |
|---|---|---|---|
| Board Blue | `#1D3F9E` | Brand, nav | — |
| Bus Yellow | `#FFC20E` | Single primary CTA | Heavy button |
| Leaf Green | `#1F8A4C` | Money in / done | Tick |
| Chilli Red | `#D8283A` | Problem / returned | Cross / hand |
| Tin | `#E8EDF4` | Page background | Flat panels |
| Ink | `#101B3D` | All text | — |
| Kraft | `#B98B52` | Parcel art only | Tag fill |

Contrast targets: body ≥7:1; yellow-on-Ink for CTA text; status never color-only.

### Typography

| Role | Face | Size / weight |
|---|---|---|
| Body / labels | Noto Sans Sinhala / Tamil / Plus Jakarta | ≥18px body, ≥16px labels, weight 600–800, LH 1.5–1.7 for SI/TA |
| Money / stamp Latin | **Archivo** 700–800 (`.font-money`) | Money ≥32px; “today kept” ≥56px; tabular nums |
| No | ALL CAPS eyebrows, Inter-only, tiny captions above headings | — |

Loaded via `index.html` (Archivo + Noto 800).

---

## 3. Shape language

| Object | Shape | Component (Phase 2) |
|---|---|---|
| Order | Notched tag + stamp pad | `OrderTag` + `Stamp` |
| Product | Square photo + price corner | `PhotoTile` |
| Customer | Full-width row + trust mark | `TrustMark` |
| Money | Coin pile / purse heights | `CoinPile`, `Purse` |
| Journey | 5 stops | `Road` |
| Action | 64px full-width, picture left | `BigButton` |

Do not use identical soft-shadow cards for every content type.

---

## 4. Pictograms

Location: `src/assets/pictograms/` (+ `index.ts` export map).

| ID | File | Meaning |
|---|---|---|
| chat | chat.svg | Order from message |
| parcel | parcel.svg | Pack / parcels |
| purse | purse.svg | Money kept |
| bike | bike.svg | Courier / on the road |
| door | door.svg | Delivered |
| coin | coin.svg | Cash in |
| camera | camera.svg | Photo product / slip |
| speaker | speaker.svg | Hear this |
| hand | hand.svg | Stop / trust warning |
| stamp | stamp.svg | Status confirmation |

Flat Kraft/Ink/Board drawings. **Not** Lucide-in-circles, emoji, or undraw blobs.

### Shot list (real photos — placeholders until shot)

Mark UI slots `[PHOTO: … — replace with real sellers]`:

1. Hands packing a kraft parcel on a table  
2. Phone showing WhatsApp chat → order  
3. Courier bike / tuk with parcel bag  
4. Doorstep handoff  
5. Purse / cash counting (stylised notes if banknote photos restricted)  
6. Seller at kitchen table with phone (Nimali archetype)  
7. 8s silent demo loops per key screen (Phase 2+ `DemoLoop`)

---

## 5. Component kit (build in Phase 2 — inventory only)

`BigButton`, `Keypad`, `SpeakButton`, `LangPicker`, `OrderTag`, `Stamp`, `Road`, `CoinPile`, `Purse`, `PhotoTile`, `TrustMark`, `PictureChoice`, `HoldToConfirm`, `UndoBar`, `DemoLoop`, `EmptyState`, `OfflineBadge`.

Each accepts a string ID → label + audio + demo from one catalog. **Existing store actions remain the source of business truth.**

---

## 6. Core ASCII wireframes

### A — First run (language)

```
+--------------------------------+
|                                |
|   [speaker] pick language      |
|                                |
|  +--------------------------+  |
|  |   සිංහල     [speaker]    |  |
|  +--------------------------+  |
|  |   தமிழ்      [speaker]    |  |
|  +--------------------------+  |
|  |   English    [speaker]    |  |
|  +--------------------------+  |
|                                |
+--------------------------------+
```
Then existing phone OTP / demo login (**Keep**).

### B — Today

```
+--------------------------------+
| [shop]  Nimali Sarees  (spk)   |
|                                |
|  Today you kept                |
|  Rs. 4,200                     |
|  [coin pile / purse]           |
|                                |
| +tag--------+  +tag---------+  |
| | 3 pack    |  | 5 on road  |  |
| | [parcel]  |  | [bike]     |  |
| +-----------+  +------------+  |
| Couriers owe Rs. 18,500 [bike] |
|                                |
| [Parcels] [NEW] [Money] [Shop] |
+--------------------------------+
```
Charts optional behind Shop; not deleted.

### C — New order from chat

```
+--------------------------------+
| chat paste / share             |
| "akka saree red 2, Kandy…"     |
|   ^name ^item ^where ^phone    |
+--------------------------------+
| ORDER TAG                      |
| who / what [photo] / where     |
| price Rs. … + courier          |
| [tick Correct] [pencil Fix]    |
+--------------------------------+
```
Same `addOrder` path (**Keep**).

### D — Parcels + Road

```
 Table → Bag → Bike → Door → Money
   o------o------O - - - o - - o
         [yellow: Pack it]
+tag---------------------------+
| LL-10482   [STAMP area]      |
| Dilani · Nugegoda            |
+------------------------------+
```
Filters = tap road stops. Detail keeps slip / hold / advance (**Keep**).

### F — Money purse

```
 Came in   Rs. 12,000  [green coins]
 Went out  Rs.  7,800  [red stacks]
 You kept  Rs.  4,200  [purse]
 --------------------------------
 On the road (owed)  Rs. 18,500 →
 Came back           2 parcels  →
```
Links to COD match, payments, returns, expenses — all **Keep**.

---

## 7. Anti-generic self-check (what we rejected)

| Generic AI SaaS look | This design |
|---|---|
| Sidebar + KPI row + line chart home | One profit figure + two tag counts |
| Cream + serif + terracotta | Tin + Board Blue + Bus Yellow |
| Purple / pink gradients, glass | Flat enamel board colors |
| Lucide icons in identical rounded cards | Object pictograms + tag/purse shapes |
| Fade-slide every section | Stamp only |
| Three-column “feature” icon grids | Process road: chat → parcel → bike → money |
| ALL CAPS eyebrows, `01/02/03` | Spoken labels + speaker |
| Remove secondary features for “simplicity” | **Forbidden** — progressive disclosure only |

---

## 8. How to preview tokens now

1. Open desk → Settings / theme switcher → **Kade**.  
2. Confirm Board Blue nav feel and Bus Yellow cash CTAs via existing `cash` / `lagoon` token mapping.  
3. Pictograms: import from `@/assets/pictograms` in Phase 2 components (not wired to screens yet).

---

## 9. Phase 1 acceptance

- [x] `data-theme="kade"` seeded; old themes kept  
- [x] Archivo + `.font-money` available  
- [x] Pictogram set + index export  
- [x] Five core wireframes documented  
- [x] Component kit listed  
- [x] Anti-generic check written  
- [ ] **Your approval** before Phase 2 coding  

---

## Next (only after you say go)

**Phase 2:** Language → login → New order → Parcels/Road → courier booking, with Stamp + BigButton, without removing any store workflows.  
Then Phase 3 Money, Phase 4 rest, Phase 5 landing.
