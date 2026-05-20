(function () {
  function injectFluidBackground() {
    const target = document.querySelector('.page-container') || document.body;
    if (!target) return;
    
    // Avoid double injection
    if (document.querySelector('.ios26-fluid-background')) return;
    
    const bg = document.createElement('div');
    bg.className = 'ios26-fluid-background';
    
    for (let i = 1; i <= 4; i++) {
      const orb = document.createElement('div');
      orb.className = `ios26-orb ios26-orb-${i}`;
      bg.appendChild(orb);
    }
    
    // Insert at the beginning of the target container to sit in the background
    target.insertBefore(bg, target.firstChild);
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFluidBackground, { once: true });
  } else {
    injectFluidBackground();
  }
  
  // Re-inject if PJAX navigation replaces the container element
  document.addEventListener('pjax:complete', injectFluidBackground);
  window.addEventListener('load', injectFluidBackground, { once: true });
})();
