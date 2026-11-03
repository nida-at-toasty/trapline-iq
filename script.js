// Bento cards: each card is laid out on a Figma-size stage. Scale every stage to its card's width.
(function () {
  document.querySelectorAll('.bento .stage, .step-card .stage, .founder .stage, .more-card .stage, .site-footer .stage').forEach((stage) => {
    const card = stage.closest('.bento, .step-card, .founder, .more-card, .site-footer');
    const W = +stage.dataset.w;
    stage.style.width = W + 'px';
    stage.style.height = stage.dataset.h + 'px';
    new ResizeObserver(() => {
      stage.style.transform = `scale(${card.clientWidth / W})`;
    }).observe(card);
  });
})();

// Bento cards: cut the phones and UI pieces out of the card's flat export (data-src) and place them
// on the stage. Spec per box: "x,y,w,h,radius[,s]" in stage px; "s" keeps the piece still.
(function () {
  document.querySelectorAll('.bento[data-floats]').forEach((card, c) => {
    const stage = card.querySelector('.stage');
    const W = stage.dataset.w;
    card.dataset.floats.split(';').forEach((spec, i) => {
      const [x, y, w, h, radius, flag] = spec.split(',');
      const box = document.createElement('div');
      box.className = flag === 's' ? 'float still' : 'float';
      Object.assign(box.style, {
        left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px',
        borderRadius: radius,
        animationDelay: -(c * 0.7 + i * 1.3) + 's',
      });
      const img = document.createElement('img');
      img.src = card.dataset.src;
      img.alt = '';
      Object.assign(img.style, { width: W + 'px', left: -x + 'px', top: -y + 'px' });
      box.appendChild(img);
      stage.appendChild(box);
    });
  });
})();

// Trip map: scale the 1280px stage. Hovering (or tapping) a pin morphs the outing card out of that pin,
// beside it on the map, with a dashed link back to the pin.
(function () {
  const map = document.querySelector('.trip-map');
  if (!map) return;
  const STAGE_W = 1280;
  const STAGE_H = 1080;
  const stage = map.querySelector('.trip-stage');
  new ResizeObserver(() => {
    stage.style.transform = `scale(${map.clientWidth / STAGE_W})`;
  }).observe(map);

  const TRIPS = [
    {
      title: 'Kootenay backcountry', photo: 'assets/planning/photo2.png',
      distance: '6.1 km', transport: 'On foot', speed: '3.2 km/h', duration: '1h 54m',
      startTime: '8:05 AM', stop1: '01 · Marten box', stop1Note: 'After 1.4 mi · 10m stop',
      stop2: '02 · Ridge set', stop2Note: 'After 2.2 mi · 16 min stop', endTime: '9:59 AM', total: '3.8 mi total',
    },
    {
      title: 'Great Slave Lake line', photo: 'assets/cards/visit-b.jpg',
      distance: '21.4 km', transport: 'Snowmobile', speed: '11.6 km/h', duration: '1h 51m',
      startTime: '9:10 AM', stop1: '01 · Lynx set', stop1Note: 'After 5.0 mi · 14m stop',
      stop2: '02 · Shore cabin', stop2Note: 'After 6.8 mi · 30 min stop', endTime: '11:01 AM', total: '13.3 mi total',
    },
    {
      title: 'Churchill River run', photo: 'assets/trappers/trip-snow.jpg',
      distance: '15.2 km', transport: 'Snowmobile', speed: '9.4 km/h', duration: '1h 37m',
      startTime: '7:30 AM', stop1: '01 · Beaver lodge', stop1Note: 'After 3.9 mi · 18m stop',
      stop2: '02 · Portage trail', stop2Note: 'After 4.1 mi · 9 min stop', endTime: '9:07 AM', total: '9.4 mi total',
    },
    {
      title: 'North Creek field day', photo: 'assets/trappers/trip-snow.jpg',
      distance: '12.8 km', transport: 'ATV', speed: '5.7 km/h', duration: '2h 14m',
      startTime: '7:42 AM', stop1: '01 · Stop', stop1Note: 'After 4.2 mi · 12m stop',
      stop2: '02 · Creek crossing', stop2Note: 'After 3.7 mi · 24 min stop', endTime: '11:18 AM', total: '14.6 mi total',
    },
    {
      title: 'Sept-Îles centre', photo: 'assets/planning/photo2.png',
      distance: '9.6 km', transport: '4x4 (ATV)', speed: '6.2 km/h', duration: '1h 33m',
      startTime: '6:48 AM', stop1: '01 · Trap 18', stop1Note: 'After 2.6 mi · 11m stop',
      stop2: '02 · Rivière Moisie', stop2Note: 'After 3.3 mi · 20 min stop', endTime: '8:21 AM', total: '6.0 mi total',
    },
  ];
  TRIPS.forEach((t) => { new Image().src = t.photo; });

  const pop = map.querySelector('.trip-pop');
  const card = pop.querySelector('.trip-card');
  const photo = card.querySelector('.trip-photo-img');
  const fields = card.querySelectorAll('[data-k]');
  const link = map.querySelector('.trip-link line');
  const pins = [...map.querySelectorAll('.trip-pin')];
  const POP_W = 531.4; // card at 72%
  const POP_H = 348.5;
  const GAP = 48;
  let active = null;
  let tl = null;

  const center = (pin) => ({ x: pin.offsetLeft + 12, y: pin.offsetTop + 12 });
  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

  // Try spots all around the pin (sides, above, below, diagonals). Keep the ones on the stage that
  // don't cover the pin itself, then pick the one covering the fewest other pins, closest to the pin.
  function placeFor(pin) {
    const c = center(pin);
    const others = pins.filter((p) => p !== pin).map(center);
    const xs = [c.x + GAP, c.x - GAP - POP_W, c.x - POP_W / 2, c.x - 60, c.x - POP_W + 60];
    const ys = [c.y - POP_H / 2, c.y - GAP - POP_H, c.y + GAP, c.y + 16, c.y - POP_H + 60, c.y - 60];
    const covers = (s, p, m = 30) => p.x > s.x - m && p.x < s.x + POP_W + m && p.y > s.y - m && p.y < s.y + POP_H + m;
    let best = null;
    xs.forEach((sx) => ys.forEach((sy) => {
      const s = { x: clamp(sx, 0, STAGE_W - POP_W), y: clamp(sy, 0, STAGE_H - POP_H) };
      if (covers(s, c, 40)) return; // keep clear space around the active pin and its label
      const hits = others.filter((p) => covers(s, p)).length;
      const dist = Math.hypot(s.x + POP_W / 2 - c.x, s.y + POP_H / 2 - c.y);
      // Pins sit behind the open card, so covering a neighbour is allowed but mildly penalised;
      // staying close to the active pin matters most
      const score = hits * 120 + dist;
      if (!best || score < best.score) best = { ...s, score };
    }));
    return { x: best.x, y: best.y, c };
  }
  function fill(trip) {
    photo.src = trip.photo;
    fields.forEach((el) => { el.textContent = trip[el.dataset.k]; });
  }

  function open(pin) {
    if (pin === active) return;
    active = pin;
    pins.forEach((p) => p.classList.toggle('is-active', p === pin));
    const { x, y, c } = placeFor(pin);
    const ox = c.x - x; // pin position inside the popover, for the morph origin
    const oy = c.y - y;
    const edge = { x: clamp(c.x, x, x + POP_W), y: clamp(c.y, y + 24, y + POP_H - 24) };
    // Circle radius that reaches the card corner farthest from the pin, so the reveal never clips
    const reach = Math.max(Math.hypot(ox, oy), Math.hypot(POP_W - ox, oy), Math.hypot(ox, POP_H - oy), Math.hypot(POP_W - ox, POP_H - oy)) + 20;

    if (!window.gsap) {
      fill(TRIPS[pin.dataset.trip]);
      Object.assign(pop.style, { left: x + 'px', top: y + 'px', visibility: 'visible' });
      link.setAttribute('x1', c.x); link.setAttribute('y1', c.y);
      link.setAttribute('x2', edge.x); link.setAttribute('y2', edge.y);
      return;
    }

    if (tl) tl.kill();
    const wasOpen = pop.style.visibility === 'visible';
    tl = gsap.timeline();
    if (wasOpen) {
      // Shrink the open card back into its own pin first
      tl.to(pop, { clipPath: pop.dataset.closed, scale: 0.85, duration: 0.28, ease: 'power2.in' })
        .to(link, { opacity: 0, duration: 0.15 }, 0);
    }
    tl.add(() => {
      fill(TRIPS[pin.dataset.trip]);
      pop.dataset.closed = `circle(0px at ${ox}px ${oy}px)`;
      gsap.set(pop, {
        left: x, top: y, visibility: 'visible', transformOrigin: `${ox}px ${oy}px`,
        clipPath: pop.dataset.closed, scale: 0.85,
      });
      gsap.set(link, { attr: { x1: c.x, y1: c.y, x2: c.x, y2: c.y }, opacity: 1 });
    })
      // Line shoots out from the pin, then the card blooms open from it
      .to(link, { attr: { x2: edge.x, y2: edge.y }, duration: 0.3, ease: 'power2.out' })
      .to(pop, { clipPath: `circle(${reach}px at ${ox}px ${oy}px)`, scale: 1, duration: 0.7, ease: 'power3.out' }, '-=0.1')
      .from(card.querySelectorAll('.trip-photo, .trip-title, .trip-stats > div, .trip-waypoints > *'), {
        y: 16, opacity: 0, duration: 0.45, stagger: 0.04, ease: 'power2.out',
      }, '-=0.5');
  }

  pins.forEach((pin) => {
    pin.addEventListener('mouseenter', () => open(pin));
    pin.addEventListener('focus', () => open(pin));
    pin.addEventListener('click', () => open(pin));
  });

  // Start with one outing open once the map scrolls into view
  const start = pins[3];
  if (window.IntersectionObserver) {
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { open(start); io.disconnect(); }
    }, { threshold: 0.35 });
    io.observe(map);
  } else {
    open(start);
  }
})();

// Hero checklist: lines come forward one at a time, earlier lines fade back, then the cycle repeats.
(function () {
  const items = Array.from(document.querySelectorAll('.checks li'));
  if (!items.length) return;

  const DIM = [1, 0.75, 0.55, 0.4]; // opacity by distance from the newest line
  const STEP = 1100;  // ms between lines
  const HOLD = 2600;  // ms the full list stays visible
  const OUT = 900;    // ms for the list to fade out before restarting

  function show(active) {
    items.forEach((li, i) => {
      const visible = i <= active;
      li.classList.toggle('in', visible);
      li.style.opacity = visible ? DIM[Math.min(active - i, DIM.length - 1)] : 0;
    });
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    show(items.length - 1);
    return;
  }

  function cycle() {
    items.forEach((_, i) => setTimeout(() => show(i), 300 + i * STEP));
    const end = 300 + (items.length - 1) * STEP + HOLD;
    setTimeout(() => show(-1), end);
    setTimeout(cycle, end + OUT);
  }
  cycle();
})();

// Step 2 & 3 cards: numbers and dates as real text that roll into place digit by digit, like an
// odometer, when the card scrolls into view (and again on hover). Boxes are measured from the
// 630x491 Figma export: [x, y, w, h] of the original text, plus font size, weight, colours.
(function () {
  const ROLLS = {
    step2: [
      { box: [78.3, 440.3, 60.7, 16], text: '8.4km', fs: 21, fw: 400, color: '#211f1b', bg: '#fdfcf8' },
      { box: [181, 439.3, 64.7, 14], text: '1<i>hr</i> 25<i>m</i>', fs: 20, fw: 500, color: '#211f1b', bg: '#fdfcf8' },
      { box: [281.7, 439.3, 18.3, 14], text: '12', fs: 20, fw: 500, color: '#211f1b', bg: '#fdfcf8' },
      { box: [376, 439.3, 10, 14.3], text: '0', fs: 20, fw: 500, color: '#211f1b', bg: '#fdfcf8' },
    ],
    step3: [
      { box: [112, 73.3, 23, 16.3], text: '12', fs: 22, fw: 700, color: '#211f1b', bg: '#f1f0eb' },
      { box: [333.3, 73, 74, 17], text: '4.2 km', fs: 22, fw: 700, color: '#211f1b', bg: '#f1f0eb' },
      { box: [112, 185.7, 27.7, 16.7], text: '34', fs: 22, fw: 700, color: '#211f1b', bg: '#f1f0eb' },
      { box: [333.3, 185.7, 13, 16.7], text: '6', fs: 22, fw: 700, color: '#211f1b', bg: '#f1f0eb' },
      { box: [83.7, 422.7, 40.3, 14], text: '14°C', fs: 18, fw: 400, color: '#65645f', bg: '#ffffff' },
      { box: [164, 422.3, 53.3, 16], text: '4km/h', fs: 18, fw: 400, color: '#65645f', bg: '#ffffff' },
      { box: [257.3, 422.3, 80.7, 16], text: '08/03/26', fs: 18, fw: 400, color: '#65645f', bg: '#ffffff' },
    ],
  };
  const W = 630;
  const H = 491;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.step-media[data-rolls]').forEach((media) => {
    const strips = [];
    ROLLS[media.dataset.rolls].forEach(({ box: [x, y, w, h], text, fs, fw, color, bg }) => {
      const el = document.createElement('span');
      el.className = 'roll';
      el.setAttribute('aria-hidden', 'true');
      // Cover box: the original text plus a margin, filled with the local background colour
      Object.assign(el.style, {
        left: ((x - 4) / W) * 100 + '%',
        top: ((y - 6) / H) * 100 + '%',
        minWidth: ((w + 12) / W) * 100 + '%',
        height: ((h + 12) / H) * 100 + '%',
        color, background: bg, fontWeight: fw,
      });
      el.style.setProperty('--fs', fs);
      el.innerHTML = text;
      // Swap every digit for a vertical 0-9 strip
      const walk = (node) => {
        [...node.childNodes].forEach((n) => {
          if (n.nodeType === 3) {
            const frag = document.createDocumentFragment();
            [...n.textContent].forEach((ch) => {
              if (/\d/.test(ch)) {
                const d = document.createElement('span');
                d.className = 'digit';
                const s = document.createElement('span');
                s.className = 'strip';
                s.innerHTML = '0123456789'.split('').map((v) => `<span>${v}</span>`).join('');
                d.appendChild(s);
                frag.appendChild(d);
                strips.push({ s, n: +ch });
              } else {
                frag.appendChild(document.createTextNode(ch === ' ' ? '\u00a0' : ch)); // flex drops plain spaces
              }
            });
            n.replaceWith(frag);
          } else if (n.nodeType === 1 && n.tagName !== 'I') {
            walk(n);
          }
        });
      };
      walk(el);
      media.appendChild(el);
      // Size each digit slot to its own glyph (Inter digits are proportional), so the text keeps
      // the original spacing instead of the widest-digit width of the 0-9 strip
      const probe = document.createElement('span');
      probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre';
      el.appendChild(probe);
      const em = parseFloat(getComputedStyle(el).fontSize);
      el.querySelectorAll('.digit').forEach((d) => {
        probe.textContent = strips.find((t) => t.s.parentNode === d).n;
        d.style.width = probe.getBoundingClientRect().width / em + 'em';
      });
      probe.remove();
    });

    const set = (s, n, ms, delay) => {
      s.style.transition = ms ? `transform ${ms}ms cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}ms` : 'none';
      s.style.transform = `translateY(${-n * 1.2}em)`;
    };
    const play = () => {
      if (reduce) return strips.forEach(({ s, n }) => set(s, n, 0, 0));
      // Start each digit a few numbers away, then spin to its value, staggered left to right
      strips.forEach(({ s, n }) => set(s, (n + 7) % 10, 0, 0));
      void media.offsetWidth;
      strips.forEach(({ s, n }, i) => set(s, n, 1100, i * 70));
    };
    strips.forEach(({ s, n }) => set(s, n, 0, 0));

    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { play(); io.disconnect(); }
    }, { threshold: 0.5 });
    io.observe(media);
    let last = 0;
    media.addEventListener('mouseenter', () => {
      if (Date.now() - last > 1500) { last = Date.now(); play(); }
    });
  });
})();

// Gallery: the 13 Figma photo circles, shown at 60% of their Figma size. Their right-to-left motion
// is driven by page scroll: scrolling down slides them left, scrolling up slides them back, with
// smooth easing. A slow drift keeps them alive when the page is still. The set is drawn twice so
// the loop is seamless. You can also drag / swipe them (with momentum), hovering magnifies the
// circle under the cursor (neighbours less), and every circle bobs gently.
(function () {
  const section = document.querySelector('.gallery');
  if (!section) return;
  const stage = section.querySelector('.gallery-stage');
  const track = section.querySelector('.gallery-track');
  const K = 0.6; // circle scale relative to Figma
  const SET_W = 2106 * K; // width of one set of circles in the 1440px design
  const TOP = 70; // breathing room above the circles (matches the band height in styles.css)
  // [x, y, size] from Figma
  const CIRCLES = [
    [1383, 174, 546], [831, 0, 325], [1137, 180, 260], [1178, 454, 137], [950, 343, 97],
    [1103, 406, 75], [841, 450, 350], [390, 163, 492], [-177, 39, 290], [114, 185, 269],
    [50, 416, 122], [-70, 527, 212], [189, 459, 222],
  ];
  const items = [];
  // Enough copies to cover the 1440px width at this smaller size, plus one for the wrap
  const copies = Math.ceil(1440 / SET_W) + 1;
  for (let c = 0; c < copies; c++) {
    CIRCLES.forEach(([x, y, s], i) => {
      const el = document.createElement('div');
      el.className = 'g-circle';
      const left = (x + 177) * K + c * SET_W;
      const top = y * K + TOP;
      const size = s * K;
      Object.assign(el.style, { left: left + 'px', top: top + 'px', width: size + 'px', height: size + 'px' });
      const img = document.createElement('img');
      img.src = `assets/gallery/c${i + 1}.jpg`;
      img.alt = c ? '' : 'Trapper in the field';
      img.draggable = false;
      el.appendChild(img);
      track.appendChild(el);
      items.push({ el, cx: left + size / 2, cy: top + size / 2, r: size / 2, phase: i * 1.7, scale: 1 });
    });
  }
  track.style.width = copies * SET_W + 'px';

  let scale = 1;
  new ResizeObserver(() => { scale = stage.clientWidth / 1440; }).observe(stage);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const DRIFT = reduce ? 0 : 18; // design px per second while the page is still
  const SCROLL = reduce ? 0 : 0.9; // design px of slide per px of page scroll
  let drift = 0; // accumulated slow drift
  let manual = 0; // offset from dragging
  let fling = 0; // momentum after a drag, decays to 0
  let scrolled = window.scrollY * SCROLL; // smoothed scroll-driven offset
  let mouse = null; // pointer position in design px, or null
  let drag = null;
  let last = performance.now();

  const toDesign = (e) => {
    const r = stage.getBoundingClientRect();
    return { x: (e.clientX - r.left) / scale, y: (e.clientY - r.top) / scale };
  };
  stage.addEventListener('pointermove', (e) => {
    mouse = toDesign(e);
    if (drag) {
      const dx = mouse.x - drag.x;
      manual -= dx;
      drag.v = -dx / Math.max((e.timeStamp - drag.t) / 1000, 0.001);
      drag.x = mouse.x;
      drag.t = e.timeStamp;
    }
  });
  stage.addEventListener('pointerleave', () => { mouse = null; });
  stage.addEventListener('pointerdown', (e) => {
    const p = toDesign(e);
    drag = { x: p.x, t: e.timeStamp, v: 0 };
    stage.classList.add('dragging');
    stage.setPointerCapture(e.pointerId);
  });
  const endDrag = () => {
    if (!drag) return;
    fling = Math.max(-2500, Math.min(2500, drag.v));
    drag = null;
    stage.classList.remove('dragging');
  };
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);

  const tick = (now) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const t = now / 1000;
    // Ease toward the scroll position so fast scrolls glide instead of jumping
    scrolled += (window.scrollY * SCROLL - scrolled) * Math.min(dt * 5, 1);
    if (!drag) {
      drift += DRIFT * (mouse ? 0.3 : 1) * dt;
      manual += fling * dt;
      fling *= Math.pow(0.05, dt);
    }
    const raw = drift + manual + scrolled;
    const x = ((raw % SET_W) + SET_W) % SET_W;
    track.style.transform = `scale(${scale}) translateX(${-x}px)`;

    items.forEach((it) => {
      // Lens: grow by distance from the pointer (in design px), neighbours less, far ones ease back
      let target = 1;
      if (mouse && !drag) {
        const d = Math.hypot(mouse.x + x - it.cx, mouse.y - it.cy) - it.r;
        target = d < 0 ? 1.15 : 1 + 0.12 * Math.max(0, 1 - d / 220) - 0.04;
      }
      it.scale += (target - it.scale) * Math.min(dt * 8, 1);
      const bob = reduce ? 0 : Math.sin(t * 0.9 + it.phase) * 6;
      it.el.style.transform = `translateY(${bob}px) scale(${it.scale})`;
      it.el.style.zIndex = it.scale > 1.08 ? 2 : '';
      it.el.style.boxShadow = it.scale > 1.08 ? '0 18px 44px rgba(0,0,0,.25)' : '';
    });
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();

// Line wordmark (inspired by isidor.ai): the big "Trapline IQ" in the hero and footer is drawn by
// hundreds of thin vertical lines that sway like flowing water. Where a line crosses a letter it
// turns thicker and brighter, so the word emerges from the lines; the lines also bend away from
// the cursor. Each wordmark keeps its text (hidden) for layout, and gets a canvas on top.
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // el: the area the lines fill; text: the element whose word the lines spell out
  const marks = [
    { el: document.querySelector('.foot-lines'), text: document.querySelector('.foot-wordmark'), thin: 'rgba(255,255,255,0.07)', thick: 'rgba(255,255,255,0.34)' },
  ].filter((m) => m.el);
  const pointer = { x: -1e4, y: -1e4 };
  window.addEventListener('pointermove', (e) => { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });

  marks.forEach((m) => {
    const el = m.el;
    const canvas = document.createElement('canvas');
    canvas.className = 'lw-canvas';
    el.appendChild(canvas);
    m.text.classList.add('lw-on');
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dpr = 1, mask = null, visible = true;

    // Draw the word into an offscreen canvas with the element's own font, and keep its alpha as a mask
    const build = () => {
      // Layout size before transforms (the footer stage and GSAP scale the element)
      w = el.offsetWidth; h = el.offsetHeight;
      if (!w || !h) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr; canvas.height = h * dpr;
      const t = m.text;
      const cs = getComputedStyle(t);
      // Text box position inside the line area (both sit on the same stage)
      const ox = t.offsetLeft - el.offsetLeft;
      const oy = t.offsetTop - el.offsetTop;
      const tw = t.offsetWidth;
      const th = t.offsetHeight;
      const off = document.createElement('canvas');
      off.width = w; off.height = h;
      const o = off.getContext('2d');
      o.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      o.textBaseline = 'middle';
      o.textAlign = cs.textAlign === 'right' ? 'right' : cs.textAlign === 'center' ? 'center' : 'left';
      const tx = ox + (o.textAlign === 'right' ? tw : o.textAlign === 'center' ? tw / 2 : 0);
      o.fillStyle = '#fff';
      o.fillText(t.textContent.trim(), tx, oy + th / 2 + parseFloat(cs.fontSize) * 0.04);
      mask = o.getImageData(0, 0, w, h).data;
    };
    const inside = (x, y) => {
      const xi = x | 0, yi = y | 0;
      if (xi < 0 || yi < 0 || xi >= w || yi >= h) return 0;
      return mask[(yi * w + xi) * 4 + 3] / 255;
    };

    const GAP = 7; // px between lines
    const STEP = 4; // px between samples along a line
    const draw = (t) => {
      if (!mask) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      // Pointer in the element's local (unscaled) coordinates
      const r = el.getBoundingClientRect();
      const sx = r.width / w || 1;
      const px = (pointer.x - r.left) / sx;
      const py = (pointer.y - r.top) / sx;
      const thin = new Path2D();
      const thick = new Path2D();
      for (let x0 = GAP / 2; x0 < w; x0 += GAP) {
        let prev = null;
        let prevIn = false;
        for (let y = -STEP; y <= h + STEP; y += STEP) {
          // Two layered sine waves give the slow, liquid sway
          let dx = Math.sin(y * 0.011 + t * 0.7 + x0 * 0.006) * 6 + Math.sin(y * 0.027 - t * 1.1 + x0 * 0.013) * 3;
          // Lines lean away from the pointer, strongest close to it
          const ddx = x0 - px;
          const ddy = y - py;
          const d2 = ddx * ddx + ddy * ddy;
          if (d2 < 40000) dx += (ddx / (Math.sqrt(d2) + 1)) * 26 * (1 - d2 / 40000);
          const x = x0 + dx;
          const isIn = inside(x0, y) > 0.5;
          if (prev) {
            thin.moveTo(prev[0], prev[1]); thin.lineTo(x, y);
            if (isIn && prevIn) { thick.moveTo(prev[0], prev[1]); thick.lineTo(x, y); }
          }
          prev = [x, y];
          prevIn = isIn;
        }
      }
      ctx.lineCap = 'round';
      ctx.strokeStyle = m.thin; ctx.lineWidth = 1; ctx.stroke(thin);
      ctx.strokeStyle = m.thick; ctx.lineWidth = 3.2; ctx.stroke(thick);
    };

    const start = () => {
      build();
      if (reduce) return draw(0);
      const loop = (now) => {
        if (visible) draw(now / 1000);
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    };
    new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(el);
    new ResizeObserver(() => build()).observe(el);
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(start);
  });
})();
