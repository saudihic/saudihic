async function loadCMS() {
  try {
    const r = await fetch('/api/content', { cache: 'no-store' });
    const data = await r.json();

    if (!data.pages) return;

    const body = document.body;
    const path = location.pathname;

    let pageKey = '';

    if (body.classList.contains('ar') || path.includes('/ar/')) {
      pageKey = path.includes('/profile/')
        ? 'profile_ar'
        : 'home_ar';
    } else {
      pageKey = path.includes('/profile/')
        ? 'profile_en'
        : 'home_en';
    }

    const page = data.pages[pageKey];
    if (!page) return;

    const texts = page.texts || {};
    const images = page.images || {};

    document.querySelectorAll('[data-hic-edit]').forEach(el => {
      const key = el.getAttribute('data-hic-edit');
      if (texts[key]) el.textContent = texts[key];
    });

    document.querySelectorAll('[data-hic-img]').forEach(el => {
      const key = el.getAttribute('data-hic-img');
      const img = images[key];

      if (!img) return;

      if (img.src) el.setAttribute('src', img.src);
      if (img.alt) el.setAttribute('alt', img.alt);
    });

    const heroMap = {
      home_ar: 'home_ar_hero_bg',
      profile_ar: 'profile_ar_hero_bg',
      home_en: 'home_en_hero_bg',
      profile_en: 'profile_en_hero_bg'
    };

    const heroKey = heroMap[pageKey];
    const heroImg = heroKey ? images[heroKey] : null;
    const hero = document.querySelector('.hero');

    if (hero && heroImg && heroImg.src) {
      const direction = pageKey.includes('_ar') ? '270deg' : '90deg';

      hero.style.background =
        `linear-gradient(${direction},rgba(0,0,0,.18),rgba(0,0,0,.58),rgba(0,0,0,.96)), url('${heroImg.src}') center center / cover no-repeat`;
    }

  } catch (e) {
    console.error('CMS load failed', e);
  }
}

loadCMS();

const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add('is-visible')
  })
},{threshold:.14});

document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
