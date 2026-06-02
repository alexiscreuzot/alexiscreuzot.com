export function renumberSlides(root: ParentNode, doc: Document): void {
  const slides = root.querySelectorAll('.slide');
  slides.forEach((s, i) => {
    const pad = (i + 1 < 10 ? '0' : '') + (i + 1);
    const slug = (s.getAttribute('data-name') || 'slide').replace(/^\d+-/, '');
    s.setAttribute('data-name', pad + '-' + slug);
    const foot = s.querySelector('.pagefoot span:last-child');
    if (foot) foot.textContent = pad;
    const wrap = s.closest('.slidewrap');
    if (wrap) {
      let plate = wrap.querySelector('.plate');
      if (!plate) {
        plate = doc.createElement('div');
        plate.className = 'plate';
        wrap.appendChild(plate);
      }
      plate.textContent = 'Page ' + pad;
    }
  });
}
