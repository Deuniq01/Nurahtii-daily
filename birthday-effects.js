(() => {
  const page = document.getElementById('pg-birthday');
  if (!page) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const root = document.documentElement;
  root.classList.toggle('birthday-snap-active', page.classList.contains('active'));

  const loader = document.getElementById('birthday-loader');
  if (loader && !reduceMotion.matches) {
    const startedAt = performance.now();
    const skipButton = loader.querySelector('.birthday-loader-skip');
    let dismissed = false;
    let readyTimer = null;
    const fallbackTimer = window.setTimeout(dismissLoader, 1800);

    loader.hidden = false;
    loader.setAttribute('aria-hidden', 'false');
    page.setAttribute('aria-busy', 'true');
    loader.classList.add('is-active');
    root.classList.add('birthday-loader-active');

    function dismissLoader() {
      if (dismissed) return;
      dismissed = true;
      window.clearTimeout(fallbackTimer);
      window.clearTimeout(readyTimer);
      loader.classList.add('is-leaving');
      loader.setAttribute('aria-hidden', 'true');
      page.removeAttribute('aria-busy');
      root.classList.remove('birthday-loader-active');
      window.setTimeout(() => loader.remove(), 600);
    }

    window.addEventListener('load', () => {
      readyTimer = window.setTimeout(
        dismissLoader,
        Math.max(0, 750 - (performance.now() - startedAt))
      );
    }, { once: true });
    skipButton.addEventListener('click', dismissLoader);
  } else {
    loader?.remove();
  }

  const cursor = document.getElementById('birthday-cursor');
  const customCursorEnabled = finePointer.matches && !reduceMotion.matches;
  if (cursor && customCursorEnabled) {
    page.classList.add('has-custom-cursor');

    page.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse') return;
      cursor.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`;
      page.style.setProperty('--pointer-x', `${event.clientX}px`);
      page.style.setProperty('--pointer-y', `${event.clientY - page.getBoundingClientRect().top}px`);
      cursor.classList.add('is-visible');
      page.classList.add('has-pointer');
    }, { passive: true });

    page.addEventListener('pointerover', event => {
      const target = event.target instanceof Element
        ? event.target.closest('a,button,[role="button"],.birthday-photo,.birthday-card')
        : null;
      cursor.classList.toggle('is-interactive', Boolean(target));
    });
    page.addEventListener('pointerdown', () => cursor.classList.add('is-pressed'));
    window.addEventListener('pointerup', () => cursor.classList.remove('is-pressed'));
    page.addEventListener('pointerleave', () => {
      cursor.classList.remove('is-visible', 'is-interactive', 'is-pressed');
      page.classList.remove('has-pointer');
    });

    page.querySelectorAll('.birthday-photo,.birthday-card').forEach(card => {
      card.addEventListener('pointermove', event => {
        if (event.pointerType !== 'mouse') return;
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width * 2 - 1;
        const y = (event.clientY - bounds.top) / bounds.height * 2 - 1;
        card.style.setProperty('--tilt-x', `${(-y * 3).toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${(x * 4).toFixed(2)}deg`);
      }, { passive: true });
      card.addEventListener('pointerleave', () => {
        card.style.removeProperty('--tilt-x');
        card.style.removeProperty('--tilt-y');
      });
    });
  } else {
    cursor?.remove();
  }

  const stackProfiles = {
    gallery: { x: 58, y: 28, z: -130, rotateX: 0, rotateY: 11, rotateZ: 2 },
    stories: { x: -34, y: 66, z: -115, rotateX: -10, rotateY: 0, rotateZ: -3 },
    wishes: { x: 0, y: 78, z: -145, rotateX: 0, rotateY: 0, rotateZ: 8 },
    promises: { x: 48, y: -46, z: -120, rotateX: 8, rotateY: -9, rotateZ: -4 },
    hero: { x: 0, y: 0, z: 0, rotateX: 0, rotateY: 0, rotateZ: 0 },
    ending: { x: 0, y: 0, z: 0, rotateX: 0, rotateY: 0, rotateZ: 0 }
  };
  const stacks = [...page.querySelectorAll('.birthday-stack')].map(section => {
    const stack = {
      section,
      stage: section.querySelector('.birthday-stack-stage'),
      cards: [...section.querySelectorAll('[data-stack-card]')],
      profile: stackProfiles[section.dataset.stackEffect] || stackProfiles.gallery
    };
    stack.cards.forEach((card, index) => {
      const current = index === 0;
      card.classList.toggle('is-current', current);
      card.classList.toggle('is-neighbor', index === 1);
      card.setAttribute('aria-hidden', String(!current));
      card.inert = !current;
    });
    return stack;
  });

  function sizeStacks() {
    stacks.forEach(stack => {
      const stageHeight = stack.stage.getBoundingClientRect().height || window.innerHeight;
      stack.section.style.setProperty('--stack-height', `${stageHeight * stack.cards.length}px`);
    });
  }

  sizeStacks();
  const progress = page.querySelector('#birthday-progress span');
  const ambient = page.querySelector('.birthday-ambient');
  const orbs = ambient.querySelectorAll('.birthday-orb');
  let scrollFrame = null;

  function updateScrollEffects() {
    scrollFrame = null;
    if (!page.classList.contains('active')) {
      progress.style.transform = 'scaleX(0)';
      return;
    }

    const scrollableHeight = Math.max(0, page.offsetHeight - window.innerHeight);
    const distance = Math.min(scrollableHeight, Math.max(0, -page.getBoundingClientRect().top));
    const amount = scrollableHeight ? distance / scrollableHeight : 0;
    progress.style.transform = `scaleX(${amount})`;

    orbs.forEach((orb, index) => {
      const drift = reduceMotion.matches ? 0 : Math.round(amount * (index + 1) * 24);
      orb.style.setProperty('--scroll-drift', `${drift}px`);
    });

    stacks.forEach(stack => {
      const stageHeight = stack.stage.getBoundingClientRect().height || window.innerHeight;
      const maxStep = Math.max(0, stack.cards.length - 1);
      const stackProgress = Math.min(maxStep, Math.max(0, -stack.section.getBoundingClientRect().top / stageHeight));
      const currentIndex = Math.min(maxStep, Math.round(stackProgress));
      const profile = stack.profile;

      stack.cards.forEach((card, index) => {
        const relative = index - stackProgress;
        const distanceFromFront = Math.min(3, Math.abs(relative));
        const direction = Math.sign(relative);
        const travel = reduceMotion.matches ? 0 : Math.min(1, Math.abs(relative));
        const current = index === currentIndex;
        const depthOpacity = distanceFromFront > 2.4
          ? 0
          : Math.max(0.35, 1 - Math.max(0, distanceFromFront - 1) * 0.45);

        card.classList.toggle('is-neighbor', distanceFromFront <= 1.25 && !current);
        card.style.setProperty('--stack-x', `${direction * profile.x * travel}px`);
        card.style.setProperty('--stack-y', `${direction * profile.y * travel}px`);
        card.style.setProperty('--stack-z', `${profile.z * distanceFromFront}px`);
        card.style.setProperty('--stack-scale', String(1 - distanceFromFront * 0.045));
        card.style.setProperty('--stack-rotate-x', `${direction * profile.rotateX * travel}deg`);
        card.style.setProperty('--stack-rotate-y', `${direction * profile.rotateY * travel}deg`);
        card.style.setProperty('--stack-rotate-z', `${direction * profile.rotateZ * travel}deg`);
        card.style.setProperty('--stack-opacity', reduceMotion.matches ? (current ? '1' : '0') : String(depthOpacity));
        card.style.zIndex = String(100 - Math.round(distanceFromFront * 10) + (current ? 1000 : 0));

        if (card.classList.contains('is-current') !== current) {
          card.classList.toggle('is-current', current);
          card.setAttribute('aria-hidden', String(!current));
          card.inert = !current;
        }
      });
    });
  }

  function scheduleScrollEffects() {
    if (scrollFrame !== null) return;
    scrollFrame = window.requestAnimationFrame(updateScrollEffects);
  }

  window.addEventListener('scroll', scheduleScrollEffects, { passive: true });
  window.addEventListener('resize', () => {
    sizeStacks();
    scheduleScrollEffects();
  }, { passive: true });
  if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', scheduleScrollEffects);
  new MutationObserver(scheduleScrollEffects).observe(page, {
    attributes: true,
    attributeFilter: ['class']
  });
  scheduleScrollEffects();

  const sparkleButton = document.getElementById('birthday-sparkle');
  const magicDialog = document.getElementById('birthday-magic');
  const magicConfetti = magicDialog.querySelector('.birthday-magic-confetti');
  const magicCloseButton = magicDialog.querySelector('.birthday-magic-close');
  const confettiColors = ['#f2c4ce', '#f0d080', '#b8d9ee', '#ffffff', '#c9748a'];

  function finishBirthdayMagic() {
    magicConfetti.replaceChildren();
    sparkleButton.focus();
  }

  function closeBirthdayMagic() {
    if (typeof magicDialog.close === 'function' && magicDialog.open) {
      magicDialog.close();
    } else {
      magicDialog.removeAttribute('open');
      magicDialog.classList.remove('is-fallback-open');
      finishBirthdayMagic();
    }
  }

  function openBirthdayMagic() {
    if (magicDialog.open) return;
    if (typeof magicDialog.showModal === 'function') {
      magicDialog.showModal();
    } else {
      magicDialog.setAttribute('open', '');
      magicDialog.classList.add('is-fallback-open');
    }

    if (!reduceMotion.matches) {
      const particles = document.createDocumentFragment();
      for (let index = 0; index < 64; index++) {
        const particle = document.createElement('span');
        const color = confettiColors[index % confettiColors.length];
        particle.style.setProperty('--particle-x', `${Math.random() * 100}%`);
        particle.style.setProperty('--particle-size', `${3 + Math.random() * 6}px`);
        particle.style.setProperty('--particle-color', color);
        particle.style.setProperty('--particle-duration', `${5 + Math.random() * 5}s`);
        particle.style.setProperty('--particle-delay', `${Math.random() * 2}s`);
        particle.style.setProperty('--particle-drift', `${Math.round((Math.random() - 0.5) * 180)}px`);
        particle.setAttribute('aria-hidden', 'true');
        particles.append(particle);
      }
      magicConfetti.append(particles);
    }
    magicCloseButton.focus();
  }

  sparkleButton.addEventListener('click', openBirthdayMagic);
  magicCloseButton.addEventListener('click', closeBirthdayMagic);
  magicDialog.addEventListener('close', finishBirthdayMagic);
  magicDialog.addEventListener('click', event => {
    if (event.target === magicDialog) closeBirthdayMagic();
  });
  if (typeof magicDialog.showModal !== 'function') {
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && magicDialog.hasAttribute('open')) closeBirthdayMagic();
    });
  }

  const lightbox = document.getElementById('birthday-lightbox');
  const lightboxImage = lightbox.querySelector('img');
  const lightboxCaption = lightbox.querySelector('.birthday-lightbox-caption');
  const closeButton = lightbox.querySelector('.birthday-lightbox-close');
  let lastPhotoButton = null;

  function closeLightbox() {
    if (typeof lightbox.close === 'function' && lightbox.open) {
      lightbox.close();
    } else {
      lightbox.removeAttribute('open');
      lightbox.classList.remove('is-fallback-open');
    }
    lastPhotoButton?.focus();
  }

  page.addEventListener('click', event => {
    const photoButton = event.target.closest('.birthday-photo-button');
    if (!photoButton) return;

    const photo = photoButton.querySelector('img');
    lastPhotoButton = photoButton;
    lightboxImage.src = photo.currentSrc || photo.src;
    lightboxImage.alt = photo.alt;
    lightboxCaption.textContent = photoButton.closest('figure').querySelector('figcaption').textContent;

    if (typeof lightbox.showModal === 'function') {
      lightbox.showModal();
    } else {
      lightbox.setAttribute('open', '');
      lightbox.classList.add('is-fallback-open');
    }
  });

  closeButton.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) closeLightbox();
  });
  lightbox.addEventListener('close', () => lastPhotoButton?.focus());
  lightbox.addEventListener('cancel', () => lastPhotoButton?.focus());

  if (typeof lightbox.showModal !== 'function') {
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && lightbox.hasAttribute('open')) closeLightbox();
    });
  }
})();
