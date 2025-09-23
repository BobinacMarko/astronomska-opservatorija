// Glavni JS

// Toggle font size
document.getElementById('uiToggle')?.addEventListener('click', () => {
  document.body.classList.toggle('big-font');
  document.cookie = `bigFont=${document.body.classList.contains('big-font')}; path=/; max-age=31536000`;
});

// Toggle high contrast
document.getElementById('contrastToggle')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.body.classList.toggle('high-contrast');
  document.cookie = `highContrast=${document.body.classList.contains('high-contrast')}; path=/; max-age=31536000`;
});

// Restore from cookies
(function restorePrefs(){
  const cookies = Object.fromEntries(document.cookie.split('; ').map(c => c.split('=')));
  if (cookies.bigFont === 'true') document.body.classList.add('big-font');
  if (cookies.highContrast === 'true') document.body.classList.add('high-contrast');
})();
