// Set theme before first paint to avoid a flash of the wrong theme.
(function(){
  var t;
  try{ t = localStorage.getItem('theme'); }catch(e){}
  if(!t){ t = (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark'; }
  document.documentElement.setAttribute('data-theme', t);
})();
