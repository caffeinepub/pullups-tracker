# Specification

## Summary
**Goal:** Build an offline-first, luxury-feel pull-up tracking app with wheel-only input, rich animations, ranks, analytics, sound effects + haptics, and manual backup/restore.

**Planned changes:**
- Implement a fully offline local data layer for creating/editing/viewing pull-up sessions and derived metrics, with unlimited lifetime storage.
- Add manual Export Backup / Restore Backup in Settings to export all local data to a single file and restore safely with clear success/error handling.
- Enforce “no keyboard anywhere”: all numeric selections via inertial vertical wheel pickers (snap, center glow, tick SFX) and notes via predefined selectable tags only.
- Create core navigation and screens: Dashboard, Log, History, Analytics, Settings, with icon-based minimal nav and smooth blur/depth transitions.
- Dashboard UI: animated rolling counter for today’s total, animated metallic hex rank badge, streak flame animation, fatigue indicator ring, and an energy orb that fills toward a daily goal on a subtle animated frosted gradient background.
- Log flow: wheel-based sets/reps per set with optional duration/weight, tag notes, and on-save persist locally + confirmation pulse animation + save chime SFX + medium haptics (when supported).
- History: animated 365-day graph (draw left-to-right), tap day for details, and show weekly average, monthly total, and personal records computed from local data.
- Analytics: compute and display max pullups, streaks, daily average, fatigue score, consistency score, and rank progress; trigger PR celebration (visual + SFX + haptic) on new records and show an in-UI formula description for fatigue/consistency.
- Rank ladder: Bronze III → Ascendant with animated metallic hex badges (texture, inner glow, moving shine, particle aura) and promotion animation + impact SFX + strong haptics; show rank progress on Dashboard and Analytics.
- Sound effects system (no music): button click, wheel tick, save chime, rank promotion impact, streak ignition flame, metal touch, PR bass pulse; include global volume control.
- Settings: interactive stickman pull-up volume control (drag to increase; at 100% auto drop and reset to 0 with physics-like animation and special vibration) and Reset Data with confirmation animation.
- Add haptic patterns (light/medium/strong/special) with graceful fallback where unsupported; ensure performance/smoothness across animations and interactions and avoid unnecessary network dependence for core features.

**User-visible outcome:** Users can log pull-up sessions entirely offline using wheel pickers (no typing), see animated dashboard/status/ranks, review 365-day history and analytics computed from their data, experience SFX + haptics with a stickman volume control, and manually export/import a full backup file.
