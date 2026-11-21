# Phase 0 — Screen audit (keep every business process)

**Status:** Complete — for sign-off before Phase 2 coding  
**Hard rule:** Every row is marked **Keep**. Redesign may reshape UI; capabilities stay.

Stack kept: Vite + React + Tailwind + Zustand + existing i18n (en/si/ta). Routes in `src/app/router.tsx` unchanged in Phase 0–1.

---

## Route → spec map

| Current route / screen | Job today | Confusing for non-reader | Maps to spec screen | Capability | Must-read text to proceed |
|---|---|---|---|---|---|
| `/` Landing | Sell product; demo CTAs | Long English marketing body; feature grids; charts metaphor | Screen §8 Landing (Phase 5) | **Keep** | Headlines + CTA labels |
| `/pricing` | Plan prices in LKR | Tables / plan jargon | Landing price pictures (Phase 5) | **Keep** | Plan names, prices, CTA |
| `/login` | Phone OTP + demo desk | OTP concept; English toasts | Screen A (auth) | **Keep** | Phone, OTP, demo button |
| `/register` | Create account | Form fields; email-like patterns | Screen A (auth) | **Keep** | Form labels + submit |
| `/onboarding` | First-run shop setup | Multi-step text wizard | Screen A steps 3–5 | **Keep** | Each step title + Next |
| `/app` Today / Dashboard | Daily overview; KPIs; charts (hidden in Simple Mode) | KPI language; charts | Screen B Today | **Keep** | Stat labels; task links |
| `/app/orders` | Filter/list parcels | Status chips; dense SI labels | Screen D Parcels list | **Keep** | Filters + row badges |
| `/app/orders/new` Quick order | Paste chat → create order | Parsing confidence; form fields | Screen C New order from chat | **Keep** | Paste hint; Correct/Save |
| `/app/orders/:id` | Advance status; slips; COD due | Many CTAs; long SI buttons | Screen D parcel detail + Stamp | **Keep** | Primary action labels |
| `/app/customers` | Search/filter buyers | Trust as text risk level | Screen I Customers | **Keep** | Search; risk badges |
| `/app/customers/:id` | Buyer history | Dense history text | Screen I detail | **Keep** | History section titles |
| `/app/products` | Catalog list | No camera-first path yet | Screen H Products | **Keep** | Product titles; prices |
| `/app/inventory` | Stock table | Table + SKUs | Screen H stock taps | **Keep** | Column headers; qty |
| `/app/dispatch` | Pack list + waybills | Courier jargon; cutoff copy | Screen E Courier + D Road | **Keep** | Pack / waybill buttons |
| `/app/cod` | Match courier remittances | CSV/import language; match dialog | Screen F Money (owed) | **Keep** | Match; import CTA |
| `/app/payments` | Bank slips verify/reject | Filter chips; account meta | Screen F + slip flow | **Keep** | Verify / reject / view |
| `/app/returns` | RTO / came-back records | Status text only | Screen G Came-back | **Keep** | Reason; update actions |
| `/app/invoices` | Bills list + send | Invoice jargon | Shop / More (still reachable) | **Keep** | Status; send |
| `/app/expenses` | Profit / spend entry | Category labels; forms | Screen F money out | **Keep** | Amount; category; save |
| `/app/tickets` | Support tickets | SLA / ticket jargon | Screen J support | **Keep** | Status; reply |
| `/app/settings` | Shop, bank, team, locale, simple mode | Tabbed settings wall | Screen J Shop | **Keep** | Tab labels; save |
| `/track/:waybill` | Buyer tracking + slip upload | Status English; waybill codes | Public Road view | **Keep** | Status; upload CTA |
| `/store/:slug` | Mini catalog + WA order | Mixed EN copy | Public shop | **Keep** | Product; chat order |
| Shell `AppLayout` | Nav, notifs, quick order, logout | Crowded header; long nav labels | Bottom bar + Shop | **Keep** | Nav labels; notif titles |
| `LanguageGate` | First language pick | Text-only buttons | Screen A lang (picture+speaker) | **Keep** | Language names |
| `CoachOverlay` | Tip overlay | Long coach copy | DemoLoop (later) | **Keep** | Tip body |

---

## Business processes inventory (all Keep)

| Process | Where it lives today | Store / UI hook | Redesign note |
|---|---|---|---|
| Demo / OTP login | LoginPage | `login()` | Picture-first OTP; same auth gate |
| Onboarding | OnboardingPage | `completeOnboarding()` | Picture “what you sell”; keep steps |
| Quick order from chat paste | QuickOrderPage | `addOrder`, `addCustomer` | Color-link chat → slip; keep parse |
| Order status advance | OrderDetailPage | `updateOrderStatus` | Stamp lands on each advance |
| Hold + ask advance | OrderDetailPage | status `on_hold` | Yellow “your turn”; keep hold |
| Bank slip attach | BankSlipDialog / OrderDetail / Tracking | `addBankPayment` | Camera pictogram; keep slip flow |
| Slip verify / reject | PaymentsPage | `setBankPaymentStatus` | Keep verify/reject |
| Pack + waybill | DispatchPage / OrderDetail | status + waybill fields | Road stops; keep courier names |
| COD remittance match | CodPage | `matchRemittance` | Purse / bike owed; keep match |
| Returns update | ReturnsPage | `updateReturn` | Came-back stamps + 4 reason pictures |
| Expenses | ExpensesPage | `addExpense` | Money-out stacks; keep categories |
| Invoices | InvoicesPage | seed + UI actions | Behind Shop; keep send/status |
| Tickets | TicketsPage | `updateTicketStatus` | Call/WhatsApp primary; keep list |
| Customers + trust | Customers* | risk on customer/order | TrustMark pictures; keep history |
| Products + inventory | Products / Inventory | seed products | PhotoTile; keep SKU/stock |
| Tenant / bank / team settings | SettingsPage | `updateTenant` | Shop screen; keep all fields |
| Notifications | AppLayout | `markNotificationRead*` | Panel kept; shorter picture titles later |
| Public track + mini-store | Tracking / MiniStore | read-only + slip | Keep public URLs |
| Marketing + pricing | Landing / Pricing | static | Phase 5 reshape; keep routes |
| i18n EN/SI/TA + Simple Mode | locale store | `setLocale`, `simpleMode` | Extend keys; never drop locales |
| Themes (lagoon/night/market) | theme store | themes | Add `kade`; migrate later, don’t delete yet |

---

## Nav rename map (progressive disclosure, not deletion)

| Current (Simple Mode bottom) | Spec label | Notes |
|---|---|---|
| Today (`/app`) | Today / home | Spec “Chats” tab may surface inbox later; Today stays |
| Orders | Parcels | Same `/app/orders` |
| Dispatch (`යවන්න`) | Parcels road / Send | Same `/app/dispatch` |
| Money (COD) | Money | COD + Payments both under Money; Payments still linked |
| More | Shop | Opens drawer: customers, products, inventory, payments, returns, invoices, expenses, tickets, settings — **all Keep** |
| Quick order (header) | Center NEW ORDER tag | Same `/app/orders/new` |

Full sidebar groups (`Sell`, `Money & care`) remain available on desktop / More drawer.

---

## Must-read path: first order today (literacy pain)

Minimum strings a new seller currently must decode to create and advance one order:

1. Language pick (EN / සිං / த)  
2. Login: demo or phone + OTP digits  
3. Onboarding: Next / step titles  
4. Today or Orders nav label  
5. Quick order / “New”  
6. Paste chat instructions; product/qty/address fields if parse incomplete  
7. Save / create confirmation  
8. Order detail: Confirm (or hold / slip) primary button  
9. Optional: Pack / waybill on Dispatch  

**Gap vs grandmother test:** No speaker, no process pictures, multiple competing CTAs, long SI labels, charts/KPIs on Today (when Simple Mode off).

---

## Backend asks (UI can mock; do not invent silent APIs)

| Need | Spec reference | Current app |
|---|---|---|
| PWA `share_target` from WhatsApp | Screen C entry | Not implemented |
| Screenshot / voice → order parse | Screen C | Text paste parse only (client demo) |
| Offline queue + sync badge | §3 / §12 | Not implemented |
| Native SI/TA audio clips | SpeakButton / DemoLoop | Not implemented (TTS fallback later) |
| Camera product capture | Screen H | Not implemented |
| Courier live booking APIs + brand marks | Screen E | Mock waybill / courier names |
| Currency note imagery rights | CoinPile | Use stylised Kraft drawings until cleared |
| Vibration API for Stamp | Stamp motion | Not wired |

---

## Open questions (non-blocking for Phase 1)

1. Confirm courier brand color usage (Domex / Pronto / Koombiyo) with legal.  
2. Audio recording budget (woman/man voice × string IDs).  
3. Whether “Chats” becomes a real inbox route or stays Quick-order entry.  
4. Real seller photo/video for Phase 5 landing.

---

## Phase 0 acceptance

- [x] Every router route listed  
- [x] Every business process marked **Keep**  
- [x] Must-read first-order path listed  
- [x] Backend asks listed  
- [x] Nav map preserves More/Shop access to secondary features  
