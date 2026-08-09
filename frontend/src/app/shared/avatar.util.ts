/** Deterministic gradient + initials avatar derived from a name/username. */
export function initialsOf(name: string | undefined | null, username: string): string {
  const source = (name && name.trim()) || username || '?';
  const parts = source.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Stable hue from a string so each user gets a consistent gradient. */
export function avatarGradient(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const h1 = Math.abs(hash) % 360;
  const h2 = (h1 + 48) % 360;
  return `linear-gradient(135deg, hsl(${h1} 70% 58%), hsl(${h2} 72% 48%))`;
}
