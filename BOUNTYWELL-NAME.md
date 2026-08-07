# BOUNTYWELL — Name Change Decision Record

**Project:** Daily Dozen Tracker → Bountywell
**Repo:** `JacobStephens2/bountywell` (migrated 2026-08-05)
**Live origins:** `bountywell.com` / `bountywell.app` (live); `dailydozen.stephens.page` retained temporarily for installed-app compatibility
**Author:** Jacob Stephens
**Date:** 2026-08-05
**Status:** Rename deployed at the owner's direction on 2026-08-05. The manual USPTO and Pennsylvania entity searches were completed the same day. **BOUNTYWELL has no exact or close federal match and no Pennsylvania entity match, but DR. GREGER'S DAILY DOZEN is a live federal registration in the app's exact software class. Deployment does not imply legal clearance.**

---

## 1. Summary

The app is being renamed from **Daily Dozen Tracker** to **Bountywell**.

The old name is not clearly unlawful, but it is unusable as a product identity: it collides head-on with a first-party incumbent app in the same category on the same stores, it forfeits all search equity, it creates a live Google Play Impersonation exposure, and it describes a default preset rather than the product that was actually built.

This document records **why the old name failed**, not merely why the new one won — following the precedent set by `FARELOCH-NAME.md` and `HORARIUM-NAME.md`.

---

## 2. Why "Daily Dozen Tracker" Failed

### 2.1 Incumbent collision (primary)

"Dr. Greger's Daily Dozen" is a free, actively maintained first-party app published by NutritionFacts.org on both the Apple App Store and Google Play. Package name: `org.nutritionfacts.dailydozen`. It is promoted by name in Greger's books (*How Not to Die*, *How Not to Diet*, *How Not to Age*), on effectively every page of nutritionfacts.org, and in virtually every "best plant-based apps" roundup published in the last decade.

Consequence: an app titled "Daily Dozen Tracker" is a second-source product wearing a first-source name.

### 2.2 Google Play Impersonation policy (operational risk)

This is the live threat, and it is more immediate than trademark law.

Play policy prohibits "app titles and icons that are so similar to those of existing products or services that users may be misled," and prohibits implying an app "is related to or authorized by someone that it isn't."

The repo contains an `android-twa/` directory — i.e. Play distribution is on the roadmap. A listing titled "Daily Dozen Tracker" whose description says it tracks Dr. Greger's Daily Dozen is a textbook first-pass enforcement target. These reviews are automated or near-automated; they do not weigh nominative fair use. Appeal cycles run days each.

### 2.3 CC BY-NC 4.0 licensing wrinkle

NutritionFacts.org original materials are licensed **CC BY-NC 4.0 — non-commercial only**. Their Terms of Service define "non-commercial" broadly, reserve the right to demand removal where commercial intent is unclear, and forbid using their content "to promote a product" without written approval.

The Terms **separately require written approval for any use of Dr. Greger's name.** The current README uses his name repeatedly.

Relevance: this project already has user accounts, a Node server, and cloud sync. Chart35's sync tier was made paid. If Bountywell follows the same trajectory, reproducing the checklist verbatim under their branding moves from gray to cleanly out of license.

*Note on scope:* a list of foods and serving quantities is factual and not itself copyrightable. The exposure is in the **branding and name**, not the data.

### 2.4 Search and brand equity (strategic)

A decade of backlinks, book mentions, podcast references, and roundup articles all point the query "daily dozen" at NutritionFacts. Sharing the name inherits zero equity and forfeits all of our own.

### 2.5 The name describes the preset, not the product

This is the argument that stands even if every legal concern above evaporated.

The GitHub description already reads "or a custom version." The actual differentiator — the thing no competing tracker has — is the Catholic framing: the blessing before meals, stewardship, temperance, the 1 Cor 6:19 anchor. What was built is a **Catholic virtue-and-habit tracker that ships with Greger's checklist as its default preset**. It was named after the preset.

### 2.6 Federal registration confirms the primary risk

The 2026-08-05 manual USPTO search found **DR. GREGER'S DAILY DOZEN**, U.S. Registration **6,662,527**, serial **90/273,898**, on the Principal Register. It is live and active, owned by Michael Greger, and covers Class 009 downloadable mobile software for managing healthy eating, dietary and nutritional guidance, and healthy weight. First use and use in commerce are claimed from 2015-12-10.

That is the app's exact channel and subject matter. The age and descriptive character of the words “daily dozen” remain relevant context, but they do not erase a live composite registration covering directly overlapping software. The rename is therefore both strategic and a concrete reduction in trademark and platform-enforcement risk; it is not a concession that every factual reference to the checklist infringes.

---

## 3. Why "Bountywell"

### 3.1 Derivation

From the blessing already shipping in the app:

> "Bless us, O Lord, and these Thy gifts, which we are about to receive **from Thy bounty**, through Christ our Lord."

- **Bounty** — God's provision, abundance, gift. Directly sourced from the product's own text.
- **Well** — nourishment, wellness, and a source drawn from.

Catholic-compatible without being so devotional that a secular installer bounces. Covers food, water, exercise, custom habits, and fasting — it does not box the product into twelve categories.

### 3.2 Fit with established naming convention

Matches the house pattern of compact, coined, ownable single-word marks:

`Fareloch` · `Keeplore` · `Inkvoke` · `Horarium` · **`Bountywell`**

### 3.3 Tagline

> **Bountywell** — *Daily nourishment, gratefully tracked.*

Store subtitle when clarity is needed: **Bountywell — Catholic Food & Habit Tracker**

---

## 4. Alternatives Considered and Rejected

| Candidate | Source of appeal | Why rejected |
|---|---|---|
| **Twelve Baskets** | Jn 6:13; twelve containers = the literal UI; "gather up the fragments, that nothing be lost" (Jn 6:12) is the stewardship verse | **Lost on the `.com`.** `twelvebaskets.com` is aftermarket at **$16,295 + transfer fee** vs. `bountywell.com` at **$11.08/yr** — a ~590× premium. Also crowded in food-adjacent commerce: TWELVE BASKETS, INC. is an active Florida entity; plus a Michigan food pantry, Seattle caterer, Alabama vending firm. None in software, so confusion risk was low — but building on a rented `.com` was not acceptable. **Strongest runner-up; the better story, the worse asset.** |
| **Harvest & Hearth / Hearth & Harvest** | Continuity with `harvest-hearth-style-board.png` already in the repo | Badly crowded on the exact phrase: an App Store app literally named "Harvest Hearth," a wood-fired pizzeria, a TikTok gardening account, a fashion collection. **Retained as the visual theme; rejected as the brand.** |
| **Refectory** | Monastic dining hall; distinctive; near-zero app-space collision; same register as Horarium | Loses the numeric hook; many users can't spell or pronounce it cold. Genuine third place. |
| **Cellarer** | Benedictine monk responsible for provisions (Rule of St. Benedict, ch. 31); thematically perfect for stewardship-of-food | Unguessable to ~99% of installers. |
| **Daily Steward** | Names the Catholic stewardship thesis outright | "Steward" reads as labor-union or finance/productivity to most Americans. Heavy search noise. |
| **Temperance** | Cardinal virtue; one of three stated design principles | Reads primarily as *alcohol* temperance in the US; would misfile the app in the sobriety category. |
| **Table & Temple** | Food + theology of the body; communicates instantly | Live wellness/spirituality brand already using the phrase. |
| **Nourish Well** | Clear and descriptive | Multiple existing nutrition/wellness businesses. Descriptive = weak mark. |
| **FaithFull** | — | **Already exists** as a Christian AI nutrition app using near-identical "steward your health" / "body as God's temple" positioning. |
| **Temple Tracker** | Direct 1 Cor 6:19 nod | Generic, slightly guilt-flavored, and the Catholic health niche is no longer empty (see §4.1). |
| **From Thy Bounty / Bounty** | Same blessing source as the winner | Short form collides with Bounty paper towels and the candy bar; SEO disaster. Long form is unwieldy as a home-screen label. |
| **Daily Dozen Plus / My Daily Dozen / Daily Dozen Catholic** | — | Sharpens the affiliation problem instead of resolving it. |
| **Greger Tracker / How Not to Die Tracker** | — | Maximum exposure; ties product's future to one author. |
| **PlantRx / Daily Dose / Nutrition Protocol** | — | Implies medical claims the app's own disclaimer denies. |
| **Twelve a Day / Plate Twelve / Verdant / Dozen Check** | Secular-safe fallbacks | Clean but forgettable. Only relevant if a non-devotional fork is ever wanted. |

### 4.1 Market note: the Catholic health niche closed

Worth recording, because it kills every descriptive option:

- **Hypuro Fit** — markets itself as the first authentically Catholic fitness & nutrition app, built on John Paul II's theology of self-gift; press coverage in Aleteia and NCR.
- **FaithFull** — Christian AI-powered nutrition tracker using our exact README language.
- **Holy Habits** — Catholic habit tracking for spiritual growth.

Descriptive names ("Catholic Nutrition," "Catholic Fitness") are unavailable and unownable. This raises the value of a coined mark.

---

## 5. Domain Decision

| Domain | 1st year | Renewal | Decision |
|---|---|---|---|
| `bountywell.com` | $11.08 | $11.08 | **REGISTERED / LIVE** |
| `bountywell.app` | $8.75 (sale) | $14.93 | **REGISTERED / LIVE** |
| `twelvebaskets.app` | $8.75 (sale) | $14.93 | Pass |
| `twelvebaskets.com` | **$16,295 aftermarket + transfer fee** | — | **Pass — decisive** |

**Total: $19.83 first year, $27.01 renewal, both TLDs.**

Rationale for buying the `.com` despite `.app` being the "modern" choice: for a consumer PWA with a Play listing, the `.com` is the address users type from memory, the one email clients and iMessage auto-link, and a necessary defensive hold so no competing nutrition site parks there later. At $11.08 this is not a real decision.

Registrar: Porkbun (house standard).

---

## 6. Clearance Status

### 6.1 Completed — BOUNTYWELL exact/near-match clear

| Layer | Method | Result |
|---|---|---|
| **GitHub organization** | GitHub API + authenticated setup | Parent organization **[`stephens-page`](https://github.com/stephens-page)** created for Stephens Page LLC on 2026-08-05. A separate `bountywell` organization was intentionally not created. |
| **GitHub repos** | GitHub API, name + description + README + topics | **0 results.** Nothing on the platform. |
| **USPTO federal register** | Official Trademark Search, all live and dead records | **0 results** for BOUNTYWELL, BOUNT\*WELL variants, BOUNTY WELL, or BOUNTY-WELL; **0 results** in coordinated Class 009 and International Classes 042/044. |
| **Pennsylvania entities** | Official PA DOS Business Search, “Contains,” all filing types and all statuses | **0 results** for BOUNTYWELL. Database reported filings processed through 2026-08-04. |
| **App Store / Google Play** | Web search | No BOUNTYWELL app. Nearest: *BondWell* (mental-health scheduling), *Be Well* (rewards). Different marks, different services. |
| **BOUNTIWELL / BOUNT\*WELL** | Web search | Zero hits across all sources. |
| **"BOUNTY WELL" (spaced)** | Web search | Only incidental prose (Aesop essay, 1977 boat classified). No trademark use. |
| **General web** | Web search | Three non-conflicting entities — see §6.2. |

### 6.2 Known non-US / non-class entities (documented, non-blocking)

- **BOUNTYWELL ESTATES LTD** — UK Companies House #03670250, residents' property management, **dissolved 20 April 2010**. Dead, wrong country, wrong class.
- **BOUNTYWELL CORP.** — Philippines, SEC No. CS201618583, plastics/raw materials trading. No US commerce, unrelated goods.
- **Bountywell** — a creature in *Mary Skelter: Finale*. Fictional; not source-identifying use.

### 6.3 Adjacent mark to watch

**The Bountiful Company** — supplements manufacturer, acquired by Nestlé for $5.75B, FTC-fined $600K in 2023 over health claims. Different mark, but `BOUNTIFUL` remains the most plausible field of §2(d) citations against `BOUNTYWELL`. The completed Classes 009/042/044 search returned 33 BOUNTIFUL-form records; none was BOUNTYWELL, but several live registrations cover software or health-adjacent services.

### 6.4 Completed — material findings

The official manual searches materially changed the record:

- **BOUNTYWELL itself is clear at the exact and close-variant level.** The official federal register returned no live or dead result for the exact mark, regex close variants, spaced/hyphenated versions, or BOUNT\*WELL in Classes 009, 042, or 044.
- **BOUNTIFUL is crowded but distinguishable.** `CM:bountiful* AND IC:(009 042 044)` returned 33 live and dead records. The live set includes unrelated uses such as BOUNTIFUL for agriculture-technology consulting/software, BOUNTIFUL LABS for online software, BOUNTIFUL ORTHODONTICS, and assorted media/gaming marks. This is not an exact blocker, but it remains the nearest field of marks for any attorney-level likelihood-of-confusion review.
- **DR. GREGER'S DAILY DOZEN is registered in the exact product class.** Registration 6,662,527 is live on the Principal Register in Class 009 for mobile software covering healthy eating, nutrition guidance, and weight management. This resolves the earlier open question against the project and raises the severity of using that wording in the app, README, store listing, or promotion.
- **Pennsylvania is clear.** The official entity database returned no BOUNTYWELL result across active and inactive statuses.

**Clearance conclusion:** the BOUNTYWELL house mark remains a reasonable candidate, but the embedded Daily Dozen content and Dr. Greger attribution are a separate, material licensing and trademark issue. Written permission is the correct gate before monetization or expanded distribution. This record is not a legal opinion.

---

## 7. Manual Clearance Checklist

The official Trademark Search and TSDR records were queried directly; no third-party trademark index was used for the conclusions below.

**USPTO Advanced Search** (`tmsearch.uspto.gov`) — completed 2026-08-05:

- [x] `bountywell` — all statuses, live and dead: 0 results
- [x] `CM:.*bount.*well.*` — catches Bountiwell, Bountywel, Bounteewell: 0 results
- [x] `CM:"bounty well"` and `CM:"bounty-well"`: 0 results each
- [x] `CM:bount*well* AND CC:009` — coordinated class search: 0 results
- [x] `CM:bount*well* AND IC:042` — SaaS: 0 results
- [x] `CM:bount*well* AND IC:044` — nutrition / health advisory: 0 results
- [x] `CM:bountiful* AND IC:(009 042 044)` — 33 live/dead adjacent records; no BOUNTYWELL match
- [x] `CM:"daily dozen"` — 5 results; one live Class 009 registration owned by Michael Greger

**State + platform:**

- [x] `file.dos.pa.gov/search/business` — “Contains,” all filing types, all statuses: 0 BOUNTYWELL results
- [ ] Apple App Store, exact and near-match
- [ ] Google Play, exact and near-match
- [ ] Social handles: `@bountywell` across platforms

### 7.1 Evidence appendix

| Source | Query / record | Result captured 2026-08-05 |
|---|---|---|
| USPTO Trademark Search | `bountywell` | No results, live and dead |
| USPTO Trademark Search | `CM:.*bount.*well.*` | No results |
| USPTO Trademark Search | `CM:"bounty well"`; `CM:"bounty-well"` | No results for either exact phrase |
| USPTO Trademark Search | `CM:bount*well* AND CC:009`; `... AND IC:042`; `... AND IC:044` | No results for each class query |
| USPTO Trademark Search | `CM:bountiful* AND IC:(009 042 044)` | 33 live/dead adjacent records |
| USPTO Trademark Search | `CM:"daily dozen"` | 5 records; DR. GREGER'S DAILY DOZEN live in Class 009 |
| USPTO TSDR | Serial 90/273,898; Registration 6,662,527 | Principal Register; issued 2022-03-08; active; owner Michael Greger |
| PA DOS Business Search | BOUNTYWELL, Contains, All filing types, All statuses | No results; filings processed through 2026-08-04 |

The official USPTO application did not complete image capture in this session, so the exact query strings, counts, registration identifiers, goods description, owner, and database dates are preserved here instead. Export a fresh USPTO search history and obtain counsel review before filing a federal application.

---

## 8. Migration Plan

**Order matters. Do not reorder.** Steps 2–3 are where installs get orphaned.

### Phase 0 — Now (reversible, low risk)

1. Register `bountywell.com` + `bountywell.app` on Porkbun — $19.83.
2. Create the parent `stephens-page` GitHub organization for Stephens Page LLC rather than one organization per product — completed 2026-08-05. Product repository transfers remain separate decisions.

### Phase 1 — Gate

3. **Complete §7 manual BOUNTYWELL clearance and resolve the separate Daily Dozen permission issue before monetization or store expansion.**

**Execution note (2026-08-05):** the owner explicitly directed the migration before the manual clearance record was completed. The two outstanding official searches are now complete. They support BOUNTYWELL as the house mark but uncovered a live, directly overlapping DR. GREGER'S DAILY DOZEN registration; written permission remains the content/attribution gate. The remaining store and social-handle checklist items do not convert this record into a legal opinion.

### Phase 2 — Prepare (do not break existing installs)

4. **Set an explicit stable `id` in `manifest.json` BEFORE touching `name` or `start_url`.** Changing `id` — or `start_url` when `id` is absent — makes browsers treat this as a *different* PWA and orphans every existing install.
5. Serve the app on both the old and new origins simultaneously. **Do not 301 yet.**
6. **`.well-known/assetlinks.json` — the landmine.** TWA Digital Asset Links verification is bound to the current origin. Publish assetlinks on the new host with the existing package name and **both** the upload-key and Play-App-Signing SHA-256 fingerprints. Verify with the Statement List Tester. **Keep the old origin's assetlinks live throughout.** Breaking this drops installed TWAs out of fullscreen and shows the browser URL bar. *(Same trap worked through during the Horarium migration — see `HORARIUM-NAME.md`.)*
7. Bump cache names/versions in `sw.js`. A rename is exactly the scenario where users get served the stale shell forever. See `CACHE_CONTROL.md`.

### Phase 3 — Rename

8. `manifest.json`: `name`, `short_name`, icon paths. (`id` already set in step 4.)
9. **Android package name.** If not yet published: use a new permanent id, e.g. `page.stephens.bountywell`. Keep obvious daylight from `org.nutritionfacts.dailydozen`. **Play package names are immutable after publish** — if already published, the package cannot be renamed; a new listing must be created and the old one deprecated.
10. Content sweep: `README.md`, `DESIGN.md`, `index.html` (title, meta, OG tags), `package.json` name, `app.js` string constants, icon assets, `SESSION_NOTES_*`. **Grep case-insensitively for "daily dozen" before shipping.**
11. Rename the GitHub repo. GitHub auto-redirects the old URL and git remotes keep working — lowest-risk step, so do it late.

### Phase 4 — Cut over

12. 301 `dailydozen.stephens.page` → `bountywell.com` **only after** the TWA update has reached 100% rollout and asset-link verification is confirmed on the new origin.
13. Keep the old hostname resolving indefinitely as a redirect.

---

## 9. Permission and Attribution Policy (post-rename)

Rename the brand and treat the Greger association as **permission-gated**, not as a settled nominative-fair-use conclusion. NutritionFacts.org's Terms place original materials under CC BY-NC 4.0, define noncommercial use broadly, reserve takedown rights where commercial intent is unclear, forbid using their content to promote a product without approval, and separately require written staff approval for Dr. Greger's name. The live Class 009 registration for DR. GREGER'S DAILY DOZEN makes the overlap more direct.

**Do:**

- Title is **Bountywell** — never "Bountywell: Daily Dozen"
- If written permission is granted, use a narrow plain-text compatibility line below the fold:
  > *Ships with a checklist based on the twelve food groups popularized by Dr. Michael Greger's Daily Dozen (NutritionFacts.org). Not affiliated with or endorsed by Dr. Greger or NutritionFacts.org.*
- **Keep the non-affiliation disclaimer at the top of any store listing and in the app's first-run screen.** It improves clarity but does not substitute for permission.
- Make the twelve categories **user-editable at first launch**; label the default "Daily Dozen–inspired preset." This reframes the product as a checklist engine with a preset — a stronger product *and* a cleaner legal posture. The GitHub description already says "or a custom version," so most of the way there.
- **Request written permission for both the Greger attribution and the shipped checklist.** The request should disclose the current free status and promise to seek fresh approval before monetization or commercial promotion.

**Don't:**

- Use Greger's photo, the NutritionFacts logo, or their color palette (written approval required).
- Center the README on Dr. Greger. Lead with: *"Bountywell is an offline-first food and wellness checklist with customizable plans and optional cloud synchronization."*
- Treat the CC BY-NC license as permission for a future paid tier. If permission is denied or materially limited, replace the default plan with independently authored categories and remove Dr. Greger/Daily Dozen wording from product and promotional surfaces.

---

## 10. Brand Architecture

```
Bountywell
Daily nourishment, gratefully tracked.

├── Brand:            Bountywell
├── Descriptor:       Catholic food & habit tracker
├── Faith feature:    Optional meal blessing / gratitude
├── Disclosure:       Independent; not affiliated with NutritionFacts.org
└── Plans
    ├── Daily Dozen–inspired  (default preset)
    ├── Custom
    ├── Simple Five-a-Day
    └── Personal Rule
```

Home-screen copy:

> **Bountywell**
> *Today's nourishment*
> **Daily Dozen–inspired plan** · 0 of 24 servings
> "Bless us, O Lord…"

---

## 11. Decision Log

| Date | Decision |
|---|---|
| 2026-06-08 | First flagged: `daily_dozen` name carries trademark/confusion risk. Initial candidates floated (Harvest Hearth, Nourish Well, Temple Tracker, Daily Steward). |
| 2026-08-05 | Full evaluation run. Rename confirmed as necessary. Shortlist narrowed to Bountywell / Twelve Baskets / Hearth & Harvest. |
| 2026-08-05 | Hearth & Harvest eliminated — exact-phrase collisions incl. an App Store app of that name. |
| 2026-08-05 | **Bountywell selected** over Twelve Baskets on domain economics ($19.83 vs. $16,295+ for the matched `.com`). |
| 2026-08-05 | Initial clearance run: GitHub confirmed clear via API; stores, variants, and general web clear. USPTO and PA manual passes were still outstanding at the moment of deployment. |
| 2026-08-05 | Owner directed execution of the rename before the manual USPTO and PA DOS checks were complete. |
| 2026-08-05 | `bountywell.com` and `bountywell.app` pointed to production, secured with one automatically renewed TLS certificate, and verified live. |
| 2026-08-05 | Stable PWA `id` published before the rename; cache version rolled; new and legacy Android asset links retained. |
| 2026-08-05 | Android wrapper renamed to unpublished package `page.stephens.bountywell` and signed release bundle verified. |
| 2026-08-05 | GitHub repository renamed to `JacobStephens2/bountywell`; description, homepage, topics, and deployment remotes updated. |
| 2026-08-05 | Official PA DOS “Contains” search across all filing types/statuses returned 0 BOUNTYWELL entities. |
| 2026-08-05 | Official USPTO searches returned 0 BOUNTYWELL exact/near/class matches and 33 adjacent BOUNTIFUL records in Classes 009/042/044. |
| 2026-08-05 | USPTO search found live Principal Register registration 6,662,527, DR. GREGER'S DAILY DOZEN, owned by Michael Greger in Class 009 for directly overlapping nutrition-app software. Earlier “unverified” language withdrawn. |
| 2026-08-05 | NutritionFacts permission request submitted through its official support channel from `jacob@stephens.page`. Zendesk receipt confirmed; email-address verification remains outstanding before staff processing. |
| 2026-08-05 | Parent GitHub organization [`stephens-page`](https://github.com/stephens-page) created for Stephens Page LLC, given the existing Steward Goods bee from `stephens.page/bee-favicon.png` as its avatar, and published with the Stephens Page name, description, and `https://stephens.page/` website. A separate Bountywell organization was not created; no repositories were transferred. |
| 2026-08-07 | Ahead of a reply, all Daily Dozen / Dr. Greger / NutritionFacts.org references were stripped from `bountywell.com` and the `/dd-kmp/` demo, and the site shipped with no such reference. |
| 2026-08-07 | **Dr. Greger granted written permission by email**, replying directly rather than through the Zendesk queue: *“You’re welcome to put it back to the way it was! happy to help! -Michael”*. He is the named owner of registration 6,662,527, so this is consent from the mark owner himself, not merely from NutritionFacts staff. |
| 2026-08-07 | References restored across the web app and the KMP demo, each noting use by permission; the non-affiliation disclaimer retained. §12.1 closed. |

---

## 12. Open Questions

1. ~~Will NutritionFacts grant written permission for the Greger attribution and shipped checklist?~~ **Resolved 2026-08-07: granted.** Dr. Greger replied directly by email: *“You’re welcome to put it back to the way it was! happy to help! -Michael”*. **Preserve that email** — it is the written approval §2.3 identifies as required for any use of his name, and it comes from the owner of registration 6,662,527. Scope: it covers the descriptive compatibility line, the shipped preset, and the nutritionfacts.org topic links. It is *not* a grant to use the NutritionFacts logo, Dr. Greger's photo, or their color palette, and it does not create affiliation or endorsement — so the disclaimer stays. It also does not resolve §2.3's CC BY-NC question if the app is ever monetized; re-ask before charging.
2. Do the 33 BOUNTIFUL records in Classes 009/042/044 create a material §2(d) issue for BOUNTYWELL? No exact match surfaced, but counsel should assess the adjacent field before a federal filing.
3. Should the app remove or independently rewrite the current preset if monetization begins? Permission is now granted for the current non-commercial use, so this is no longer urgent — but §2.3's non-commercial licensing wrinkle is untouched by it. Re-confirm with Dr. Greger before any paid tier.
4. The old Android package returned no public Google Play listing on 2026-08-05. The wrapper now uses `page.stephens.bountywell`; confirm Play Console state before creating any listing.
5. Secular fork later? If broad-market distribution is ever wanted without the Catholic framing, revisit *Twelve a Day* / *Verdant*. Not now.

---

*Precedent docs: `FARELOCH-NAME.md`, `HORARIUM-NAME.md`. Maintain the same standard — record what failed, not just what won.*
