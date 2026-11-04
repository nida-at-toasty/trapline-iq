// Page-wide GSAP animations: hero intro plus scroll-triggered reveals for each section.
(function () {
  if (!window.gsap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out', duration: 1 });

  // Hero intro (phone, checklist and store buttons keep their own CSS/JS animations)
  gsap.timeline()
    .from('.nav', { y: -40, opacity: 0, duration: 0.8 })
    .from('.hero-copy .pill', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
    .from('.hero h1', { y: 40, opacity: 0, filter: 'blur(8px)' }, '-=0.3')
    .from('.hero-copy p', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
    .from('.hero-wordmark', { scale: 0.85, opacity: 0, duration: 1.6, ease: 'power2.out' }, 0.2);

  // Watermark drifts as the hero scrolls away
  gsap.to('.hero-wordmark', {
    yPercent: 30, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });

  // Hero phone: sinks and fades as you scroll down, rises back into view as you scroll up.
  // Its CSS entrance animation holds the transform, so hand over to GSAP once it has finished.
  const heroPhone = document.querySelector('.hero-phone');
  if (heroPhone) {
    const linkToScroll = () => {
      heroPhone.style.animation = 'none';
      gsap.fromTo(heroPhone, { y: 0, opacity: 1 }, {
        y: 180, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: heroPhone, start: 'top 45%', end: 'bottom top', scrub: 0.4 },
      });
    };
    if (getComputedStyle(heroPhone).animationName === 'none') linkToScroll();
    else heroPhone.addEventListener('animationend', linkToScroll, { once: true });
  }

  const reveal =(targets, vars, trigger) =>
    gsap.from(targets, {
      y: 50, opacity: 0, stagger: 0.12, ...vars,
      scrollTrigger: { trigger: trigger || targets, start: 'top 85%' },
    });

  // Section headings
  document.querySelectorAll('.section, .trappers .inner, .more .inner').forEach((sec) => {
    const parts = sec.querySelectorAll(':scope > .pill, :scope > .split-head h2, :scope > .split-head > p, :scope > .split-head > div');
    if (parts.length) reveal(parts, {}, sec);
  });

  // Bento grid
  reveal('.bento', { y: 80, scale: 0.96, stagger: 0.1, duration: 1.1 }, '.feature-grid');

  // Journal card: notes pop out one by one, then settle exactly in place. (The phone cut-out under
  // them holds a copy of their edges, so any drift would show a ghost card behind.)
  const journal = document.querySelector('.bento.journal');
  if (journal) {
    const notes = journal.querySelectorAll('.float:not(.still)');
    gsap.timeline({ scrollTrigger: { trigger: journal, start: 'top 75%' } })
      .from(notes, { scale: 0.6, opacity: 0, y: 20, duration: 0.7, ease: 'back.out(1.8)', stagger: 0.18, clearProps: 'transform' });
  }

  // Trap card: like live navigation, the route draws from the trapper's avatar to the trap pin,
  // a dot leads the line, the pin pulses on arrival, then the trip fades and repeats.
  const route = document.querySelector('.trap-route-live');
  if (route) {
    const dot = document.querySelector('.trap-route-dot');
    const [avatarPulse, pinPulse] = document.querySelectorAll('.trap-pulse');
    const len = route.getTotalLength();
    const trip = { p: 0 };
    const place = () => {
      const pt = route.getPointAtLength(trip.p * len);
      dot.setAttribute('cx', pt.x);
      dot.setAttribute('cy', pt.y);
      route.style.strokeDashoffset = 1 - trip.p;
    };
    const ring = (el) => gsap.fromTo(el, { scale: 1, opacity: 0.9 }, { scale: 1.8, opacity: 0, duration: 1, ease: 'power2.out' });
    gsap.timeline({ repeat: -1, repeatDelay: 0.4, scrollTrigger: { trigger: route, start: 'top 90%' } })
      .add(() => ring(avatarPulse))
      .set(trip, { p: 0, onComplete: place })
      .to([dot, route], { opacity: 1, duration: 0.3 })
      .to(trip, { p: 1, duration: 1.8, ease: 'power1.inOut', onUpdate: place })
      .add(() => ring(pinPulse))
      .to(dot, { opacity: 0, duration: 0.3 }, '<')
      .to(route, { opacity: 0, duration: 0.5 }, '+=0.6');
  }

  // Planning card: the direction icon leaves its spot, rides the road behind the phone,
  // fades at the location pin (which pulses), then reappears at the start.
  const direction = document.querySelector('.pl-direction');
  if (direction && window.MotionPathPlugin) {
    gsap.registerPlugin(MotionPathPlugin);
    const route = document.querySelector('#pl-route');
    const pulse = document.querySelector('.pl-pulse');
    gsap.set(direction, { left: 0, top: 0 });
    const motion = { path: route, align: route, alignOrigin: [0.5, 0.4614] };
    gsap.set(direction, { motionPath: { ...motion, end: 0 } });
    gsap.timeline({ repeat: -1, repeatDelay: 0.25, delay: 0.6 })
      .to(direction, { motionPath: motion, duration: 2.2, ease: 'power1.inOut' })
      .fromTo(pulse, { scale: 1, opacity: 0.8 }, { scale: 1.9, opacity: 0, duration: 0.9, ease: 'power2.out' }, '-=0.2')
      .to(direction, { opacity: 0, scale: 0.6, duration: 0.5 }, '<')
      .set(direction, { motionPath: { ...motion, end: 0 }, scale: 0.6 })
      .to(direction, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' });
  }

  // Planning card: the photo thumbnail gives a small pop every few seconds
  const planningPhoto = document.querySelector('.planning-photo');
  if (planningPhoto) {
    gsap.timeline({ repeat: -1, repeatDelay: 1.2, delay: 0.8 })
      .to(planningPhoto, { scale: 1.18, rotation: -3, boxShadow: '0 14px 28px rgba(0,0,0,0.25)', duration: 0.35, ease: 'power2.out' })
      .to(planningPhoto, { scale: 1, rotation: 0, boxShadow: '0 4px 10px rgba(0,0,0,0.08)', duration: 0.6, ease: 'back.out(3)' });
  }

  // For trappers
  reveal('.perks > div', { stagger: 0.15 }, '.perks');
  gsap.timeline({ scrollTrigger: { trigger: '.trip-map', start: 'top 85%' } })
    .from('.trip-dither', { opacity: 0, duration: 1.4 })
    .from('.trip-pin', { scale: 0, duration: 0.6, ease: 'back.out(3)', stagger: 0.15, clearProps: 'transform' }, 0.3);

  // Step 1 card, same idea as the Trap card: like live navigation, a glowing line travels the road
  // from point 1 through 2 to 3 with a dot leading it; each point pings as the line reaches it,
  // then the trip fades and repeats.
  const s1 = document.querySelector('.step-card');
  if (s1) {
    const center = s1.querySelector('#s1-center');
    const live = s1.querySelector('.s1-live');
    const dot = s1.querySelector('.s1-dot');
    const points = [...s1.querySelectorAll('.s1-point')];
    const len = center.getTotalLength();
    const ctm = center.closest('svg').querySelector('.s1-live-group').getCTM();
    // Fraction along the road (0..1) closest to each point
    const at = points.map((pt) => {
      const px = pt.offsetLeft + 20;
      const py = pt.offsetTop + 20;
      let best = { d: Infinity, f: 0 };
      for (let i = 0; i <= 400; i++) {
        const p = center.getPointAtLength((i / 400) * len).matrixTransform(ctm);
        const d = Math.hypot(p.x - px, p.y - py);
        if (d < best.d) best = { d, f: i / 400 };
      }
      return best.f;
    });
    const from = at[0];
    const to = at[at.length - 1];
    const trip = { p: from };
    let next = 0;
    const ping = (pt) => { pt.classList.remove('ping'); void pt.offsetWidth; pt.classList.add('ping'); };
    const place = () => {
      const pt = center.getPointAtLength(trip.p * len);
      dot.setAttribute('cx', pt.x);
      dot.setAttribute('cy', pt.y);
      // Draw only the stretch between point 1 and the dot
      live.style.strokeDasharray = `0 ${from * len} ${(trip.p - from) * len} ${len}`;
      while (next < at.length && trip.p >= at[next] - 0.005) ping(points[next++]);
    };
    gsap.set(live, { strokeDashoffset: 0 });
    gsap.timeline({ repeat: -1, repeatDelay: 0.5, scrollTrigger: { trigger: s1, start: 'top 80%' } })
      .add(() => { next = 0; trip.p = from; place(); })
      .to([live, dot], { opacity: 1, duration: 0.3 })
      .to(trip, { p: to, duration: 3.6, ease: 'power1.inOut', onUpdate: place })
      .to(dot, { opacity: 0, duration: 0.3 })
      .to(live, { opacity: 0, duration: 0.5 }, '+=0.6');
  }

  // How it works: images slide in from their side, copy follows
  document.querySelectorAll('.step').forEach((step) => {
    const fromLeft = !step.classList.contains('reverse');
    const tl = gsap.timeline({ scrollTrigger: { trigger: step, start: 'top 80%' } });
    tl.from(step.querySelector(':scope > img, .step-card, .step-media'), { x: fromLeft ? -120 : 120, opacity: 0, duration: 1.2 })
      .from(step.querySelectorAll('.num, h3, p'), { y: 30, opacity: 0, stagger: 0.12, duration: 0.8 }, '-=0.8');
  });

  // Founder and gallery: soft zoom in
  ['.founder-photo'].forEach((sel) => {
    gsap.from(sel, {
      scale: 1.12, opacity: 0, duration: 1.6, ease: 'power2.out',
      scrollTrigger: { trigger: sel, start: 'top 85%' },
    });
  });

  // More ways cards: each card eases up, its curved line draws itself, and the phone glides in
  // (up from the bottom, or down from the top on the middle card), then keeps a slow, gentle float.
  document.querySelectorAll('.more-card').forEach((card, i) => {
    const line = card.querySelector('.mc-line path');
    const phone = card.querySelector('.mc-phone');
    const fromTop = phone.classList.contains('mc-down');
    const event = card.querySelector('.mc-event');
    const tl = gsap.timeline({
      delay: i * 0.18,
      scrollTrigger: { trigger: '.more-grid', start: 'top 80%' },
    });
    tl.from(card, { y: 60, opacity: 0, duration: 1.2, ease: 'power3.out' })
      .fromTo(line, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' }, 0.2)
      .from(phone, { y: fromTop ? -160 : 160, duration: 1.6, ease: 'expo.out' }, 0.35)
      .from(card.querySelectorAll('.mc-copy > *'), { y: 18, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, 0.5);
    if (event) tl.from(event, { y: -24, scale: 0.92, opacity: 0, duration: 0.9, ease: 'back.out(1.6)' }, 1.1);
    tl.add(() => {
      gsap.to(phone, { y: fromTop ? 6 : -6, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      if (event) gsap.to(event, { y: 5, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    });
  });

  // More ways cards: one waypoint cursor travels the faint road through all three cards in turn.
  // A single distance runs along the three roads back to back, so the pace is the same in every card;
  // the loop eases in and out at its ends. Each card clips the cursor, so it slides off one card's
  // edge and onto the next instead of jumping.
  const legs = [...document.querySelectorAll('.more-card')].map((card) => {
    const road = card.querySelector('.mc-line path');
    // Give the cursor its own layer (same viewBox, so the road math still fits), placed right after
    // the road so it travels behind the phone mockup
    const cursor = card.querySelector('.mc-cursor');
    const over = road.ownerSVGElement.cloneNode(false);
    over.classList.remove('mc-line');
    over.classList.add('mc-cursor-layer');
    over.appendChild(cursor);
    road.ownerSVGElement.after(over);
    const at = cursor.querySelector('.mc-cursor-at');
    const full = road.getTotalLength();
    // Only travel the stretch of road that is inside the card (plus a cursor-width margin), so the
    // cursor isn't hidden off-card for long between cards
    const m = road.getCTM();
    let from = null;
    let to = 0;
    for (let s = 0; s <= full; s += 4) {
      const p = road.getPointAtLength(s).matrixTransform(m);
      if (p.x > -20 && p.x < 433 && p.y > -20 && p.y < 572) {
        if (from === null) from = s;
        to = s;
      }
    }
    return { road, at, from: from || 0, len: to - (from || 0) };
  }).filter((l) => l.at);
  if (legs.length) {
    const total = legs.reduce((s, l) => s + l.len, 0);
    const place = (d) => {
      let rest = d;
      legs.forEach((l) => {
        const here = rest >= 0 && rest <= l.len;
        l.at.setAttribute('opacity', here ? 1 : 0);
        if (here) {
          const p = l.road.getPointAtLength(l.from + rest);
          const q = l.road.getPointAtLength(Math.min(l.from + rest + 2, l.from + l.len));
          const angle = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
          l.at.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${angle})`);
        }
        rest -= l.len;
      });
    };
    // Driven by scroll: once the three cards are well on screen (grid top at 65% of the viewport) the
    // cursor runs the whole route until the grid's bottom passes 35%, so it moves quickly as you scroll down and backs up as you scroll up (scrub adds a short smoothing)
    const trip = { d: 0 };
    place(0);
    gsap.to(trip, {
      d: total, ease: 'none', onUpdate: () => place(trip.d),
      scrollTrigger: { trigger: '.more-grid', start: 'top 65%', end: 'bottom 35%', scrub: 0.35 },
    });
  }

  // Inner pages: each [data-reveal] block rises in; grids of cards stagger one after another
  document.querySelectorAll('[data-reveal]').forEach((block) => {
    const kids = block.matches('ol, ul, .pg-records, .pg-people, .pg-quotes, .pg-stats, .pg-faq')
      ? block.children : [block];
    gsap.from(kids, {
      y: 50, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: block, start: 'top 85%' },
    });
  });
  // Stat numbers count up from zero when the band scrolls in
  document.querySelectorAll('[data-count]').forEach((el) => {
    const end = +el.dataset.count;
    const n = { v: 0 };
    gsap.to(n, {
      v: end, duration: 1.6, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
      onUpdate: () => { el.textContent = Math.round(n.v).toLocaleString('en-US'); },
    });
  });

  // CTA
  reveal('.cta-copy > *, .cta-stores', { stagger: 0.12 }, '.site-footer');

  // Footer
  reveal('.foot-brand, .foot-links, .foot-news', { stagger: 0.12 }, '.foot-brand');
  gsap.from('.foot-wordmark', {
    yPercent: 40, opacity: 0, duration: 1.4,
    scrollTrigger: { trigger: '.foot-legal', start: 'top 95%' },
  });

  // Re-measure once images have loaded and sizes are final
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();

// Offline card: Sept-Îles chips step forward from the back, one by one, forever
(function () {
  const chips = gsap.utils.toArray('.ochip');
  if (chips.length < 3 || !window.gsap) return;
  const slots = [
    { y: 0, scale: 1, opacity: 1, zIndex: 3 },          // front
    { y: 15, scale: 0.86, opacity: 0.9, zIndex: 2 },    // back
    { y: 28, scale: 0.72, opacity: 0, zIndex: 1 }       // hidden behind
  ];
  let order = chips.slice();
  order.forEach((c, i) => gsap.set(c, slots[i]));
  function step() {
    const [front, back, hidden] = order;
    const tl = gsap.timeline({ onComplete: () => { order = [back, hidden, front]; gsap.delayedCall(1.6, step); } });
    tl.to(front, { y: -26, opacity: 0, scale: 1.04, duration: 0.5, ease: 'power2.in' }, 0)
      .set(back, { zIndex: 3 }, 0)
      .to(back, { ...slots[0], duration: 0.6, ease: 'power3.out' }, 0.15)
      .to(hidden, { ...slots[1], duration: 0.6, ease: 'power3.out' }, 0.25)
      .set(front, slots[2]);
  }
  gsap.delayedCall(1.6, step);
})();

// For Trappers testimonials: the cards start as a neat stack and fan out as you scroll past
(function () {
  const fan = document.querySelector('.pg-fan');
  if (!fan || !window.gsap || !window.ScrollTrigger) return;
  const cards = gsap.utils.toArray('.fan-card', fan);
  const mid = (cards.length - 1) / 2;
  gsap.matchMedia().add({ desktop: '(min-width: 761px)', phone: '(max-width: 760px)' }, (ctx) => {
    if (ctx.conditions.desktop) {
      const spread = () => Math.min(fan.clientWidth * 0.19, 230);
      cards.forEach((c, i) => gsap.set(c, { zIndex: i + 1 }));
      gsap.timeline({ scrollTrigger: { trigger: fan, start: 'top 85%', end: 'center 45%', scrub: 0.8, invalidateOnRefresh: true } })
        .fromTo(cards, {
          x: (i) => (i - mid) * 8, y: (i) => 60 + i * -4, rotation: (i) => (i - mid) * 2.5, scale: 0.92,
        }, {
          x: (i) => (i - mid) * spread(), y: (i) => Math.abs(i - mid) * 22, rotation: (i) => (i - mid) * 5, scale: 1,
          ease: 'power2.out', stagger: 0.04,
        });
    } else {
      cards.forEach((c, i) => gsap.from(c, {
        y: 40, rotation: i % 2 ? 4 : -4, opacity: 0, duration: 0.8, ease: 'power3.out', delay: i * 0.08,
        scrollTrigger: { trigger: fan, start: 'top 85%' },
      }));
    }
  });
})();

// For Trappers photo deck: scrolling turns the photos like book pages. The card at `pos` lies flat
// in the middle; the others fold back on either side and stack tightly, like pages of an open book.
(function () {
  const stage = document.querySelector('.flip-stage');
  if (!stage || !window.gsap) return;
  const cards = gsap.utils.toArray('.flip-card', stage);
  const n = cards.length;
  const state = { pos: 0 };
  const render = () => {
    const cw = cards[0].offsetWidth;
    cards.forEach((c, i) => {
      const d = i - state.pos, a = Math.abs(d), s = Math.sign(d);
      const near = Math.min(a, 1); // 0 = flat in the middle, 1 = fully folded
      const x = s * (near * cw * 0.62 + Math.max(a - 1, 0) * cw * 0.085);
      gsap.set(c, {
        x, z: -near * 140 - Math.max(a - 1, 0) * 18, rotationY: -s * near * 68,
        zIndex: Math.round(1000 - a * 10), opacity: a > 7 ? 0 : 1,
      });
      c.style.setProperty('--shade', (near * 0.35).toFixed(2));
    });
  };
  render();
  const to = (p) => gsap.to(state, { pos: Math.max(0, Math.min(n - 1, p)), duration: 0.8, ease: 'power3.out', onUpdate: render });
  if (window.ScrollTrigger) {
    // Pinned while the pages turn; scrubbed so scrolling back turns them back
    ScrollTrigger.create({
      trigger: stage, start: 'center center', end: () => '+=' + n * 90, pin: stage.closest('section'), scrub: true,
      onUpdate: (st) => { gsap.to(state, { pos: st.progress * (n - 1), duration: 0.5, ease: 'power2.out', overwrite: true, onUpdate: render }); },
    });
  }
  cards.forEach((c, i) => c.addEventListener('click', () => to(i)));
  window.addEventListener('resize', render);
})();

// Season planner: the timeline fills left to right as you scroll, lighting each month's dot,
// while the month cards rise onto the line one after another
(function () {
  const list = document.querySelector('.pg-season');
  const fill = document.querySelector('.ss-fill');
  if (!list || !window.gsap || !window.ScrollTrigger) return;
  const items = gsap.utils.toArray('li', list);
  gsap.from(items, { y: 50, opacity: 0, rotation: (i) => (i % 2 ? 3 : -3), duration: 0.8, ease: 'back.out(1.6)', stagger: 0.09,
    scrollTrigger: { trigger: list, start: 'top 85%' } });
  if (fill) {
    gsap.to(fill, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 80%', end: 'bottom 45%', scrub: 0.6,
      onUpdate: (st) => items.forEach((li, i) => li.classList.toggle('ss-on', st.progress >= (i + 0.3) / items.length)) } });
  }
})();

// For Trappers hero: headline rises in, "trapper" gets a hand-drawn underline, the field photos
// drop in around it, then drift with the mouse and slide apart as you scroll away
(function () {
  const hero = document.querySelector('.hero-page');
  const title = hero && hero.querySelector('.ft-title');
  if (!title || !window.gsap) return;
  // (The headline itself fades in with the shared hero intro above)
  const tl = gsap.timeline({ delay: 1.1 });
  tl.to(title.querySelector('.ft-hl path'), { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' })
    .from(hero.querySelectorAll('.ft-cta, .ft-proof'), { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08 }, '-=0.5')
    .from(hero.querySelectorAll('.ft-ph, .ft-chip'), { scale: 0.6, opacity: 0, y: 40, duration: 0.9, ease: 'back.out(1.7)', stagger: 0.1 }, '-=0.8');
  const items = gsap.utils.toArray('.ft-ph, .ft-chip', hero);
  // Gentle idle float
  items.forEach((el, i) => gsap.to(el, { yPercent: i % 2 ? 6 : -6, duration: 3 + i * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.5 }));
  // Mouse parallax: nearer pieces move more
  const movers = items.map((el, i) => ({ x: gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3.out' }), y: gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3.out' }), k: 14 + (i % 3) * 10 }));
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5, dy = (e.clientY - r.top) / r.height - 0.5;
    movers.forEach((m) => { m.x(dx * m.k); m.y(dy * m.k); });
  });
  // Scroll: pieces spread outwards and fade
  if (window.ScrollTrigger) {
    gsap.to('.ft-photos', { opacity: 0, scale: 1.12, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }
})();

// Testimonial fan: hovering a card lifts it, straightens it and brings it to the front
(function () {
  const cards = document.querySelectorAll('.fan-card');
  if (!cards.length || !window.gsap) return;
  cards.forEach((c) => {
    c.addEventListener('mouseenter', () => {
      if (window.innerWidth <= 760) return;
      c.dataset.rot = gsap.getProperty(c, 'rotation');
      c.dataset.y = gsap.getProperty(c, 'y');
      gsap.to(c, { rotation: 0, y: -24, scale: 1.05, duration: 0.45, ease: 'power3.out' }); // no overwrite: keeps the scroll fan intact
    });
    c.addEventListener('mouseleave', () => {
      if (window.innerWidth <= 760 || c.dataset.rot === undefined) return;
      gsap.to(c, { rotation: +c.dataset.rot, y: +c.dataset.y, scale: 1, duration: 0.5, ease: 'power3.out' });
    });
  });
})();
