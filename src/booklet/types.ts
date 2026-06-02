export interface BookletMark {
  prefix: string;
  emphasis: string;
}

export interface BookletWifiStrings {
  connect: string;
  joinNetwork: string;
  copyPassword: string;
  passwordCopied: string;
  networkCopied: string;
  legacyCopyFallback: string;
  androidHint: string;
  iosHint: string;
  defaultHint: string;
}

export interface BookletMeta {
  slug: string;
  title: string;
  lang: string;
  theme: string;
  themeColor: string;
  appleMobileWebAppTitle: string;
  toolbar: { prefix: string; emphasis: string; suffix: string };
  mark: BookletMark;
  storagePrefix: string;
  wifi: { ssid: string; pass: string; type: string };
  wifiSvg: string;
  strings: BookletWifiStrings;
}

export interface CoverFeature {
  icon: string;
  html: string;
}

export interface FactItem {
  icon: string;
  label: string;
  value: string;
  detail?: string;
}

export interface RowItem {
  icon: string;
  title: string;
  body: string;
  hours?: string;
}

export interface TimelineStep {
  title: string;
  body: string;
}

export interface GalleryCell {
  src: string;
  caption: string;
}

export interface PhotoStyle {
  titleSize?: string;
  lineHeight?: string;
  subtitleSize?: string;
  subtitleMargin?: string;
}

export type Slide =
  | { type: 'cover'; slug: string; kicker: string; title: string; bg: string; features: CoverFeature[] }
  | { type: 'welcome'; slug: string; kicker: string; title: string; photo: string; photoAlt: string; intro: string; aside: string; hostsLabel: string }
  | { type: 'facts'; slug: string; kicker: string; title: string; facts: FactItem[] }
  | { type: 'access'; slug: string; kicker: string; title: string; photo: string; photoAlt: string; photoCaption: string; steps: TimelineStep[]; tipIcon: string; tip: string }
  | { type: 'wifi'; slug: string; kicker: string; title: string; note: string; connectLabel: string; connectSecondary: string; scanLabel: string; ssidLabel: string; passLabel: string }
  | { type: 'gallery'; slug: string; kicker: string; title: string; compact?: boolean; cells: GalleryCell[] }
  | { type: 'photo'; slug: string; kicker: string; title: string; subtitle: string; bg: string; style?: PhotoStyle; footer?: string }
  | { type: 'rows'; slug: string; kicker: string; title: string; rows: RowItem[] }
  | { type: 'spacer'; slug: string };

export interface BookletData {
  meta: BookletMeta;
  slides: Slide[];
}

export interface BookletRuntimeConfig {
  storagePrefix: string;
  wifi: { ssid: string; pass: string; type: string };
  strings: BookletWifiStrings;
  exportLibs: string[];
  /** When omitted, export is enabled on local/private hosts only. */
  exportEnabled?: boolean;
}
