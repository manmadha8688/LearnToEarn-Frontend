// ── XP → Level (escalating curve) — mirrors backend LevelUtil ──
//
// Level is driven purely by lifetime XP. The per-level XP cost starts at 100 and
// grows by 15 each level, so early levels come fast and later ones take longer:
//   L1→L2 = 100, L2→L3 = 115, L3→L4 = 130, … (+15 each step)
//
// Cumulative XP required to reach level L:
//   cumulative(L) = 100*(L-1) + 15*(L-1)*(L-2)/2

/** Total lifetime XP needed to have reached `level` (level 1 = 0 XP). */
export function cumulativeXpForLevel(level) {
  if (level <= 1) return 0
  const n = level - 1
  return 100 * n + (15 * n * (n - 1)) / 2
}

/** Highest level whose cumulative XP requirement is satisfied by `xp` (min 1). */
export function levelForXp(xp = 0) {
  if (xp <= 0) return 1
  let level = 1
  while (cumulativeXpForLevel(level + 1) <= xp) level++
  return level
}

/**
 * Progress within the current level as { level, into, span, pct } where
 * `into` is XP earned into the current level, `span` is XP the level spans,
 * and `pct` is 0–100 progress toward the next level.
 */
export function levelProgress(xp = 0) {
  const level = levelForXp(xp)
  const floor = cumulativeXpForLevel(level)
  const ceil = cumulativeXpForLevel(level + 1)
  const span = ceil - floor
  const into = xp - floor
  const pct = span > 0 ? Math.round((into / span) * 100) : 100
  return { level, into, span, pct }
}

// ── Hunter Titles — cosmetic milestone names unlocked purely by Hunter Level ──
// Each title unlocks the moment the level threshold is reached. Colors run the same
// E→S palette used across the arena so they read as a rising ladder.
export const LEVEL_TITLES = [
  { level: 1,  title: 'Awakened',        icon: '🌑', color: '#64748B' },
  { level: 5,  title: 'Novice Hunter',   icon: '🗡️', color: '#4ADE80' },
  { level: 10, title: 'Skilled Hunter',  icon: '⚔️', color: '#22D3EE' },
  { level: 15, title: 'Elite Hunter',    icon: '🛡️', color: '#60A5FA' },
  { level: 20, title: 'Veteran Hunter',  icon: '🏹', color: '#818CF8' },
  { level: 25, title: 'Ace Hunter',      icon: '💠', color: '#9B6ED4' },
  { level: 30, title: 'Master Hunter',   icon: '👑', color: '#F59E0B' },
  { level: 40, title: 'Monarch',         icon: '🔥', color: '#FB7185' },
  { level: 50, title: 'Sovereign',       icon: '⭐', color: '#EF4444' },
]

/** Highest title unlocked at `level` (never returns null — Level 1 = Awakened). */
export function titleForLevel(level = 1) {
  let current = LEVEL_TITLES[0]
  for (const entry of LEVEL_TITLES) {
    if (level >= entry.level) current = entry
  }
  return current
}
