# Specification

## Summary
**Goal:** Add a fully offline coin economy and a probabilistic chest shop (inside Settings) with premium animations, SFX, and haptics while preserving all existing Pullups Tracker features and wheel-only UX.

**Planned changes:**
- Extend offline storage to persist: coin balance, chest opening history (with timestamp/type/cost/results), and a card wallet/inventory (with timestamp/chest type/value), without breaking existing stored data.
- Update Settings Backup & Restore export/import JSON to include coins/history/wallet while remaining compatible with older backups missing these fields.
- Implement offline coin awarding tied into existing flows: saving sessions, milestone detection, streak changes/bonuses, and achievement unlocks (no network required).
- Add a Dashboard top-right coin balance UI with an animated rolling counter and subtle glow burst on increases, without changing existing Dashboard layout/animations.
- Add a new “Chest Shop” section within Settings showing coin balance, purchasable chests (Common 250, Rare 500, Epic 1000), and a scrollable chest history list (most recent first).
- Implement chest purchase/open flow: tap chest → confirm → deduct coins immediately → play tiered chest-opening animation → reveal cards sequentially with flip/slide + glow → persist results to wallet and history; block insufficient-funds attempts with a clear error/toast.
- Implement exact independent probability tables and draw counts per chest (Common 3, Rare 5, Epic 7), allowing duplicates within a chest.
- Apply tier-based visuals consistent with the existing luxury cold aesthetic: Common bronze soft glow, Rare silver shimmering aura, Epic gold/amber with particles + aura sweep.
- Extend existing SFX system (respecting global volume) for chest open sounds and per-card reveal sounds, with stronger feedback for high-value reveals; add subtle haptics/feedback for coin awards and stronger tiered feedback for openings/reveals (graceful degradation when vibration unsupported).
- Add optional chest modifiers (default off) with Settings controls: chest streak bonus and daily first-chest bonus; persist modifier state and relevant counters/timestamps offline, and indicate when a bonus is active.

**User-visible outcome:** Users earn coins automatically offline from normal app activity, see their coin total on the Dashboard, and can open Common/Rare/Epic chests from a new Settings section to reveal and collect cards with premium animations, sounds, history tracking, and optional bonus toggles—without changing existing app behavior or requiring any network.
