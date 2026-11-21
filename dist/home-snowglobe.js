export const SNOWGLOBE_IMAGE_KEY = 'snowglobe:2026:custom-photo:v1';
export const SNOWGLOBE_IMAGE_EVENT = 'snowglobe-image-updated';

export async function compressSnowglobeImage(src) {
  const image = new Image();
  image.src = src;
  await image.decode();
  const scale = Math.min(1, 720 / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext('2d');
  context.fillStyle = '#eaf1f2';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', .9);
}

export function setupHomeSnowglobe(svg) {
  const ns = 'http://www.w3.org/2000/svg';
  const defs = document.createElementNS(ns, 'defs');
  defs.innerHTML = `
    <clipPath id="home-snowglobe-photo-clip"><circle cx="0" cy="-47" r="35"/></clipPath>
    <linearGradient id="home-snowglobe-base-shade" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stop-color="#62696a"/><stop offset=".25" stop-color="#17191a"/><stop offset=".78" stop-color="#050607"/><stop offset="1" stop-color="#2c3031"/>
    </linearGradient>
    <radialGradient id="home-snowglobe-glass" cx=".36" cy=".28" r=".85">
      <stop offset="0" stop-color="#f5ffff" stop-opacity=".17"/><stop offset=".68" stop-color="#d9e9ef" stop-opacity=".06"/><stop offset="1" stop-color="#091719" stop-opacity=".3"/>
    </radialGradient>
    <radialGradient id="home-snowglobe-warm" cx=".5" cy=".76" r=".7">
      <stop offset="0" stop-color="#ffca69" stop-opacity=".82"/><stop offset=".48" stop-color="#f7a83e" stop-opacity=".4"/><stop offset="1" stop-color="#e58b27" stop-opacity="0"/>
    </radialGradient>`;
  svg.prepend(defs);

  const globe = document.createElementNS(ns, 'g');
  globe.setAttribute('class', 'home-snowglobe');
  globe.setAttribute('transform', 'translate(267 824) rotate(5)');
  globe.setAttribute('role', 'button');
  globe.setAttribute('tabindex', '0');
  globe.setAttribute('aria-label', 'Your custom snowglobe');
  globe.setAttribute('aria-pressed', 'false');
  globe.setAttribute('visibility', 'hidden');
  globe.innerHTML = `
    <ellipse cx="0" cy="-1" rx="42" ry="6" fill="#17201d" opacity=".25"/>
    <circle cx="0" cy="-47" r="37" fill="#d6e2e5" stroke="#819191" stroke-width="2"/>
    <image class="home-snowglobe-photo" x="-35" y="-82" width="70" height="70" preserveAspectRatio="xMidYMid slice" clip-path="url(#home-snowglobe-photo-clip)"/>
    <circle class="home-snowglobe-warm" cx="0" cy="-47" r="35" fill="url(#home-snowglobe-warm)" clip-path="url(#home-snowglobe-photo-clip)" opacity="0" pointer-events="none"/>
    <circle cx="0" cy="-47" r="37" fill="url(#home-snowglobe-glass)" stroke="#eff8f5" stroke-opacity=".72" stroke-width="2.2"/>
    <path d="M-25 -71Q-31 -59 -27 -44" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M23 -65Q32 -54 28 -43" fill="none" stroke="#fff" stroke-opacity=".34" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M-32 -12Q0 -18 32 -12L36 -5Q38 2 30 3H-30Q-38 2 -36 -5Z" fill="url(#home-snowglobe-base-shade)" stroke="#3b4243" stroke-width="1.5"/>
    <path d="M-34 -12Q0 -18 34 -12" fill="none" stroke="#aeb9b8" stroke-opacity=".75" stroke-width="2"/>
    <path d="M-23 -2Q0 1 23 -2" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="1.3"/>
    <path d="M-36 -5Q-27 -9 -17 -6Q-7 -3 0 -6Q12 -10 22 -6Q31 -3 36 -5L35 1Q22 5 9 3Q-4 2 -15 4Q-28 5 -36 1Z" fill="#f5fbfc" stroke="#cbd8dc" stroke-width="1"/>`;
  svg.append(globe);

  const photo = globe.querySelector('.home-snowglobe-photo');
  const warmLight = globe.querySelector('.home-snowglobe-warm');
  function toggleLight() {
    const isOn = globe.getAttribute('aria-pressed') !== 'true';
    globe.setAttribute('aria-pressed', String(isOn));
    warmLight.setAttribute('opacity', isOn ? '1' : '0');
    globe.setAttribute('aria-label', `Your custom snowglobe light ${isOn ? 'on' : 'off'}`);
  }
  globe.addEventListener('click', event => { event.stopPropagation(); toggleLight(); });
  globe.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); toggleLight(); }
  });
  function update(src) {
    if (!src) return;
    photo.setAttribute('href', src);
    photo.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', src);
    globe.setAttribute('visibility', 'visible');
  }
  window.addEventListener(SNOWGLOBE_IMAGE_EVENT, event => update(event.detail?.src));
  try { update(localStorage.getItem(SNOWGLOBE_IMAGE_KEY)); } catch {}
}
