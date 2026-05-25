const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{ if(entry.isIntersecting) entry.target.classList.add('is-visible') })
},{threshold:.14});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
