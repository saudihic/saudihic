
(function(){
  function normalizeSrc(src){
    src = String(src || '').trim();
    if(src && !src.startsWith('/') && !src.startsWith('http') && src.startsWith('api/')){
      src = '/' + src;
    }
    return src;
  }

  function getPageKey(){
    var p = location.pathname;
    if(p.includes('/ar/profile')) return 'profile_ar';
    if(p.includes('/ar')) return 'home_ar';
    if(p.includes('/profile')) return 'profile_en';
    return 'home_en';
  }

  function ensureHeroDynamicStyle(){
    if(document.getElementById('hic-hero-dynamic-global-style')) return;

    var style = document.createElement('style');
    style.id = 'hic-hero-dynamic-global-style';
    style.textContent = `
      .hero,
      .hero::before,
      .hero:before,
      .hero::after,
      .hero:after,
      .hero-inner,
      .home-hero,
      .home-hero::before,
      .home-hero:before,
      .profile-hero,
      .profile-hero::before,
      .profile-hero:before{
        background-image:
          linear-gradient(var(--hic-hero-gradient-direction,270deg),rgba(0,0,0,.18),rgba(0,0,0,.58),rgba(0,0,0,.96)),
          var(--hic-hero-bg) !important;
        background-position:center center !important;
        background-size:cover !important;
        background-repeat:no-repeat !important;
      }
    `;
    document.head.appendChild(style);
  }

  function applyHeroBackground(pageKey, images){
    var heroMap = {
      home_ar: 'home_ar_hero_bg',
      profile_ar: 'profile_ar_hero_bg',
      home_en: 'home_en_hero_bg',
      profile_en: 'profile_en_hero_bg'
    };

    var fallbackMap = {
      home_ar: 'home_ar_image_007',
      profile_ar: 'profile_ar_image_003',
      home_en: 'home_en_image_007',
      profile_en: 'profile_en_image_003'
    };

    var heroKey = heroMap[pageKey];
    var fallbackKey = fallbackMap[pageKey];

    var heroImg = heroKey ? images[heroKey] : null;

    if((!heroImg || !heroImg.src) && fallbackKey){
      heroImg = images[fallbackKey];
    }

    if(!heroImg || !heroImg.src) return;

    var src = normalizeSrc(heroImg.src);
    var direction = pageKey.indexOf('_ar') > -1 ? '270deg' : '90deg';

    ensureHeroDynamicStyle();

    document.documentElement.style.setProperty('--hic-hero-bg', "url('" + src + "')");
    document.documentElement.style.setProperty('--hic-hero-gradient-direction', direction);
    document.body.style.setProperty('--hic-hero-bg', "url('" + src + "')");
    document.body.style.setProperty('--hic-hero-gradient-direction', direction);

    var heroTargets = document.querySelectorAll('.hero, .home-hero, .profile-hero, .hero-inner');

    heroTargets.forEach(function(hero){
      hero.style.setProperty('--hic-hero-bg', "url('" + src + "')");
      hero.style.setProperty('--hic-hero-gradient-direction', direction);
      hero.style.setProperty(
        'background-image',
        "linear-gradient(" + direction + ",rgba(0,0,0,.18),rgba(0,0,0,.58),rgba(0,0,0,.96)), url('" + src + "')",
        'important'
      );
      hero.style.setProperty('background-position', 'center center', 'important');
      hero.style.setProperty('background-size', 'cover', 'important');
      hero.style.setProperty('background-repeat', 'no-repeat', 'important');
    });
  }

  function applyContent(data){
    var pageKey = getPageKey();
    var page = data && data.pages ? data.pages[pageKey] : null;
    if(!page) return;

    var texts = page.texts || {};
    Object.keys(texts).forEach(function(id){
      document.querySelectorAll('[data-hic-edit="'+id+'"]').forEach(function(el){
        el.textContent = texts[id];
      });
    });

    var images = page.images || {};
    Object.keys(images).forEach(function(id){
      document.querySelectorAll('[data-hic-img="'+id+'"]').forEach(function(img){
        if(images[id] && images[id].src) img.setAttribute('src', normalizeSrc(images[id].src));
        if(images[id] && typeof images[id].alt === 'string') img.setAttribute('alt', images[id].alt);
      });
    });

    applyHeroBackground(pageKey, images);
  }

  fetch('/api/content', { cache: 'no-store' })
    .then(function(r){ return r.json(); })
    .then(applyContent)
    .catch(function(err){
      console.warn('HIC CMS content load failed', err);
    });
})();


const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add('is-visible')
  })
},{threshold:.14});

document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
