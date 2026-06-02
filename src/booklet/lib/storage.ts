export function storeGet(storage: Storage, key: string): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

export function storeSet(storage: Storage, key: string, value: string): void {
  try {
    storage.setItem(key, value);
  } catch {
    /* quota / private mode */
  }
}

export function storeGetInt(
  storage: Storage,
  key: string,
  min: number,
  max: number,
  fallback: number
): number {
  const saved = parseInt(storeGet(storage, key) || '', 10);
  return Number.isFinite(saved) && saved >= min && saved <= max ? saved : fallback;
}
