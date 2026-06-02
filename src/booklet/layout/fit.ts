const SLIDE_SIZE = 1080;

function applyScale(wraps: HTMLElement[], avail: number, root: ParentNode): void {
  const scale = avail / SLIDE_SIZE;
  const disp = Math.round(SLIDE_SIZE * scale);
  wraps.forEach((w) => w.style.setProperty('--disp', disp + 'px'));
  root.querySelectorAll('.slide').forEach((s) => {
    (s as HTMLElement).style.setProperty('--scale', String(scale));
  });
}

export function fitDesktop(
  wraps: HTMLElement[],
  viewport: { width: number; height: number },
  root: ParentNode
): void {
  let avail = Math.min(viewport.width - 120, viewport.height - 96 - 120 - 16);
  avail = Math.max(300, Math.min(avail, 760));
  applyScale(wraps, avail, root);
}

export function fitGrid(wraps: HTMLElement[], viewportWidth: number, root: ParentNode): void {
  const twoUp = viewportWidth >= 1180;
  let avail: number;
  if (twoUp) {
    const container = Math.min(viewportWidth - 48, 1220);
    avail = Math.min((container - 48) / 2, 540);
  } else {
    avail = Math.min(viewportWidth - 48, 640);
  }
  applyScale(wraps, avail, root);
}
