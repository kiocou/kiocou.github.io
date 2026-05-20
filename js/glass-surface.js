(function() {
  const GLASS_SELECTOR = '.home-post-item, .post-content-container, .archives-container, .category-page-container, .category-archive-container, .tag-page-container, .tag-archive-container, .page-template-container, .pc-post-toc, .comment-container, .header-wrapper .header-content';
  
  // Guard flag: prevents MutationObserver from re-triggering scan while we are
  // mutating the DOM ourselves (adding .glass-shine spans). Without this, inserting
  // a child triggers the observer → scan → insert → observer → infinite loop, and
  // the partially-rendered span flashes as a blank ghost card.
  let _isMutating = false;
  let _observer = null;
  
  function applyGlassSurface(el) {
    if (!el || el.dataset.glassSurfaceApplied) return;
    el.dataset.glassSurfaceApplied = 'true';
    
    // Pause observer before touching the DOM so the inserted span does not
    // re-trigger the observer and cause a ghost flash.
    if (_observer) _observer.disconnect();
    _isMutating = true;
    
    let shine = el.querySelector('.glass-shine');
    if (!shine) {
      shine = document.createElement('span');
      shine.className = 'glass-shine';
      el.appendChild(shine);
    }
    
    _isMutating = false;
    // Re-connect observer after DOM mutation is complete
    if (_observer) {
      _observer.observe(document.documentElement, { childList: true, subtree: true });
    }
    
    let frameId = null;
    
    el.addEventListener('mousemove', (e) => {
      if (frameId) cancelAnimationFrame(frameId);
      
      frameId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const normX = (x / rect.width) * 2 - 1;
        const normY = (y / rect.height) * 2 - 1;
        
        const rotateX = (-normY * 3.5).toFixed(2);
        const rotateY = (normX * 3.5).toFixed(2);
        
        el.style.setProperty('--mouse-x', `${x}px`);
        el.style.setProperty('--mouse-y', `${y}px`);
        el.style.setProperty('--tilt-rx', `${rotateX}deg`);
        el.style.setProperty('--tilt-ry', `${rotateY}deg`);
        el.style.setProperty('--glass-shine-opacity', '0.22');
      });
    });
    
    el.addEventListener('mouseleave', () => {
      if (frameId) cancelAnimationFrame(frameId);
      el.style.setProperty('--tilt-rx', '0deg');
      el.style.setProperty('--tilt-ry', '0deg');
      el.style.setProperty('--glass-shine-opacity', '0.08');
      el.style.setProperty('--mouse-x', '50%');
      el.style.setProperty('--mouse-y', '50%');
    });
  }
  
  function scan() {
    // Skip if we are currently mutating the DOM to avoid re-entrance
    if (_isMutating) return;
    document.querySelectorAll(GLASS_SELECTOR).forEach(applyGlassSurface);
  }
  
  function boot() {
    scan();
    _observer = new MutationObserver(scan);
    _observer.observe(document.documentElement, { childList: true, subtree: true });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
  document.addEventListener('pjax:complete', scan);
  window.addEventListener('load', scan, { once: true });
})();
