async function loadCMS() {

  try {

    const r = await fetch('/api/content', {
      cache: 'no-store'
    });

    const data = await r.json();

    if (!data.pages) return;

    const body = document.body;

    let pageKey = '';

    if (body.classList.contains('ar')) {
      pageKey = location.pathname.includes('/profile/')
        ? 'profile_ar'
        : 'home_ar';
    } else {
      pageKey = location.pathname.includes('/profile/')
        ? 'profile_en'
        : 'home_en';
    }

    const page = data.pages[pageKey];

    if (!page) return;

    const texts = page.texts || {};
    const images = page.images || {};

    document
      .querySelectorAll('[data-hic-edit]')
      .forEach(el => {

        const key =
          el.getAttribute('data-hic-edit');

        if (texts[key]) {
          el.textContent = texts[key];
        }

      });

    document
      .querySelectorAll('[data-hic-img]')
      .forEach(el => {

        const key =
          el.getAttribute('data-hic-img');

        const img = images[key];

        if (!img) return;

        if (img.src) {
          el.src = img.src;
        }

        if (img.alt) {
          el.alt = img.alt;
        }

      });

  } catch (e) {
    console.error('CMS load failed', e);
  }

}

loadCMS();

const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting)
      entry.target.classList.add('is-visible')
  })
},{threshold:.14});

document
  .querySelectorAll('.reveal')
  .forEach(el=>observer.observe(el));
