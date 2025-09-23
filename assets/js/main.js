// Glavni JS

// ===== Pristupačnost =====

// Toggle veliki font
document.getElementById('fontToggle')?.addEventListener('click', () => {
  document.body.classList.toggle('big-font');
  document.cookie = `bigFont=${document.body.classList.contains('big-font')}; path=/; max-age=31536000`;
});

// Toggle visoki kontrast
document.getElementById('contrastToggle')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.body.classList.toggle('high-contrast');
  document.cookie = `highContrast=${document.body.classList.contains('high-contrast')}; path=/; max-age=31536000`;
});

// Restore preferences iz cookies
(function restorePrefs() {
  if (!document.cookie) return;
  const cookies = Object.fromEntries(document.cookie.split('; ').map(c => c.split('=')));
  if (cookies.bigFont === 'true') document.body.classList.add('big-font');
  if (cookies.highContrast === 'true') document.body.classList.add('high-contrast');
})();

// ===== Kontakt forma validacija =====
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  if (!form) return; // ako forma ne postoji na stranici

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let valid = true;

    // Ime
    const name = document.getElementById("name");
    if (!name.value.trim()) {
      name.classList.add("is-invalid");
      valid = false;
    } else {
      name.classList.remove("is-invalid");
    }

    // Email
    const email = document.getElementById("email");
    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      email.classList.add("is-invalid");
      valid = false;
    } else {
      email.classList.remove("is-invalid");
    }

    // Poruka
    const message = document.getElementById("message");
    if (!message.value.trim()) {
      message.classList.add("is-invalid");
      valid = false;
    } else {
      message.classList.remove("is-invalid");
    }

    // Rezultat
    if (valid) {
      formMessage.innerHTML = `<p class="text-success">Poruka je uspešno poslata!</p>`;
      form.reset();
    } else {
      formMessage.innerHTML = `<p class="text-danger">Molimo ispravite greške u formi.</p>`;
    }
  });
});
