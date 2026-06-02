import type { BookletRuntimeConfig } from '../types';
import { isLocalHost } from './env';

export function isExportEnabled(config: BookletRuntimeConfig, location: Location): boolean {
  if (config.exportEnabled !== undefined) return config.exportEnabled;
  return isLocalHost(location);
}
