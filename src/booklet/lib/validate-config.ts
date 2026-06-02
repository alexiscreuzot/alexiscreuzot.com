import type { BookletRuntimeConfig } from '../types';

export type InvalidConfigReason =
  | 'not-an-object'
  | 'missing-storage-prefix'
  | 'missing-wifi'
  | 'missing-strings'
  | 'invalid-export-libs';

export type ConfigValidationResult =
  | { ok: true; config: BookletRuntimeConfig }
  | { ok: false; reason: InvalidConfigReason };

export function validateBookletConfig(value: unknown): ConfigValidationResult {
  if (!value || typeof value !== 'object') return { ok: false, reason: 'not-an-object' };

  const c = value as Partial<BookletRuntimeConfig>;
  if (typeof c.storagePrefix !== 'string' || !c.storagePrefix) {
    return { ok: false, reason: 'missing-storage-prefix' };
  }

  if (!c.wifi || typeof c.wifi !== 'object') return { ok: false, reason: 'missing-wifi' };
  const wifi = c.wifi as Record<string, unknown>;
  if (
    typeof wifi.ssid !== 'string' ||
    typeof wifi.pass !== 'string' ||
    typeof wifi.type !== 'string'
  ) {
    return { ok: false, reason: 'missing-wifi' };
  }

  if (!c.strings || typeof c.strings !== 'object') {
    return { ok: false, reason: 'missing-strings' };
  }

  if (!Array.isArray(c.exportLibs)) return { ok: false, reason: 'invalid-export-libs' };

  return { ok: true, config: c as BookletRuntimeConfig };
}
