// HORIZON INTEGRATION — site.js

// Reveal on scroll
(function(){
  var els = document.querySelectorAll('.reveal');
  if(!els.length) return;
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  els.forEach(function(el){ io.observe(el); });
})();

// Smooth scroll for hash links
(function(){
  document.querySelectorAll('a[href^="#"]').forEach(function(link){
    link.addEventListener('click', function(e){
      var id = link.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if(!target) return;
      e.preventDefault();
      var header = document.querySelector('header');
      var offset = header ? header.getBoundingClientRect().height + 16 : 80;
      var y = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
})();

// Header scroll state
(function(){
  var header = document.querySelector('.site-header, header.nav, header');
  if(!header) return;
  window.addEventListener('scroll', function(){
    if(window.scrollY > 20){
      header.style.background = 'rgba(14,14,14,0.98)';
    } else {
      header.style.background = '';
    }
  }, { passive: true });
})();
