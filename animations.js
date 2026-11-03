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

  const reveal = (targets, vars, trigger) =>
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

  // Journal card: notes pop out one by one, then keep drifting on their own rhythm
  const journal = document.querySelector('.bento.journal');
  if (journal) {
    const notes = journal.querySelectorAll('.float:not(.still)');
    gsap.timeline({ scrollTrigger: { trigger: journal, start: 'top 75%' } })
      .from(notes, { scale: 0.6, opacity: 0, y: 20, duration: 0.7, ease: 'back.out(1.8)', stagger: 0.18 })
      .add(() => {
        notes.forEach((el, i) => {
          gsap.to(el, {
            y: i % 2 ? 6 : -6, rotation: i % 2 ? -1 : 1,
            duration: 2.4 + i * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1,
          });
        });
      });
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
      .to(trip, { p: 1, duration: 3.2, ease: 'power1.inOut', onUpdate: place })
      .add(() => ring(pinPulse))
      .to(dot, { opacity: 0, duration: 0.3 }, '<')
      .to(route, { opacity: 0, duration: 0.8 }, '+=1.2');
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
      .to(live, { opacity: 0, duration: 0.8 }, '+=1.2');
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
    const SPEED = 140; // card px per second
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
    const trip = { d: 0 };
    gsap.timeline({ repeat: -1, repeatDelay: 0.6, scrollTrigger: { trigger: '.more-grid', start: 'top 70%' }, delay: 1.8 })
      .fromTo(trip, { d: 0 }, { d: total, duration: total / SPEED, ease: 'power1.inOut', onUpdate: () => place(trip.d) });
  }

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
