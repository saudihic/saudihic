// HIC — hic.js

// Header scroll
(function(){
  var hdr = document.getElementById('hdr');
  if(!hdr) return;
  var logos = document.querySelectorAll('.brand img, .hdr-logo img');
  var greenLogo = logos.length ? logos[0].src.replace(/hic-logo[^.]*\.png/, 'hic-logo-green.png') : '';
  var whiteLogo = logos.length ? logos[0].src.replace(/hic-logo[^.]*\.png/, 'hic-logo-white.png') : '';

  function onScroll(){
    var scrolled = window.scrollY > 40;
    hdr.classList.toggle('scrolled', scrolled);
    logos.forEach(function(img){
      img.src = scrolled ? whiteLogo : greenLogo;
    });
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
})();

// Reveal on scroll
(function(){
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
})();

// Smooth scroll
(function(){
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var id = a.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if(!target) return;
      e.preventDefault();
      var hdr = document.querySelector('.hdr');
      var offset = hdr ? hdr.getBoundingClientRect().height + 12 : 70;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - offset, behavior: 'smooth' });
    });
  });
})();

// CMS — apply content from KV
(function(){
  fetch('/api/content').then(function(r){ return r.json(); }).then(function(data){
    if(!data || !data.pages) return;
    var page = document.body.dataset.page;
    if(!page) return;
    var pageData = data.pages[page];
    if(!pageData) return;

    // Apply texts (language-specific — read from this page's own bucket)
    var texts = pageData.texts || {};
    Object.keys(texts).forEach(function(key){
      document.querySelectorAll('[data-hic-edit="'+key+'"]').forEach(function(el){
        el.textContent = texts[key];
      });
    });

    // Apply images — images are SHARED across AR/EN. The canonical bucket is the
    // English sibling (all image keys are named *_en_img_*). Merge the EN bucket
    // over this page's own bucket so AR and EN always resolve to the same image,
    // regardless of any stale independent value saved on the AR page previously.
    var SIBLING = { home_ar:'home_en', profile_ar:'profile_en', bs_ar:'bs_en' };
    var images = {};
    var own = pageData.images || {};
    Object.keys(own).forEach(function(k){ images[k] = own[k]; });
    var sib = SIBLING[page];
    if(sib && data.pages[sib] && data.pages[sib].images){
      var sibImgs = data.pages[sib].images;
      Object.keys(sibImgs).forEach(function(k){ images[k] = sibImgs[k]; });
    }
    Object.keys(images).forEach(function(key){
      var src = images[key];
      if(!src) return;
      document.querySelectorAll('[data-hic-img="'+key+'"]').forEach(function(el){
        el.src = src;
      });
      document.querySelectorAll('[data-hic-bg="'+key+'"]').forEach(function(el){
        el.style.backgroundImage = 'url("'+src+'")';
      });
    });
  }).catch(function(){});
})();
