/** Migrate a saved browser preference from the retired product key on first read. */
export function readSylpaceStorage(key: string, legacyKey: string): string | null {
  const current = localStorage.getItem(key);
  if (current !== null) return current;
  const legacy = localStorage.getItem(legacyKey);
  if (legacy !== null) {
    localStorage.setItem(key, legacy);
    localStorage.removeItem(legacyKey);
  }
  return legacy;
}

export function writeSylpaceStorage(key: string, value: string, legacyKey: string): void {
  localStorage.setItem(key, value);
  localStorage.removeItem(legacyKey);
}

export function removeSylpaceStorage(key: string, legacyKey: string): void {
  localStorage.removeItem(key);
  localStorage.removeItem(legacyKey);
}