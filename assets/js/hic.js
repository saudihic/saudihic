// HIC — hic.js

// Header scroll
(function(){
  var hdr = document.getElementById('hdr');
  if(!hdr) return;
  function onScroll(){ hdr.classList.toggle('scrolled', window.scrollY > 40); }
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

    // Apply texts
    var texts = pageData.texts || {};
    Object.keys(texts).forEach(function(key){
      document.querySelectorAll('[data-hic-edit="'+key+'"]').forEach(function(el){
        el.textContent = texts[key];
      });
    });

    // Apply images
    var images = pageData.images || {};
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
