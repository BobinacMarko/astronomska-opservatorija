// ================================
// Toggle veliki font
// ================================
document.getElementById('fontToggle')?.addEventListener('click', () => {
  document.body.classList.toggle('big-font');
  document.cookie = `bigFont=${document.body.classList.contains('big-font')}; path=/; max-age=31536000`;
});

// ================================
// Toggle visoki kontrast
// ================================
document.getElementById('contrastToggle')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.body.classList.toggle('high-contrast');
  document.cookie = `highContrast=${document.body.classList.contains('high-contrast')}; path=/; max-age=31536000`;
});

// ================================
// Restore preferences iz cookies
// ================================
(function restorePrefs() {
  if (!document.cookie) return;
  const cookies = Object.fromEntries(document.cookie.split('; ').map(c => c.split('=')));
  if (cookies.bigFont === 'true') document.body.classList.add('big-font');
  if (cookies.highContrast === 'true') document.body.classList.add('high-contrast');
})();

// ================================
// Kontakt forma validacija
// ================================
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

// ================================
// Galerija dinamičko učitavanje + Lightbox sa paginacijom
// ================================
document.addEventListener("DOMContentLoaded", () => {
  const galleryContainer = document.getElementById("gallery");
  const galleryLoader = document.getElementById("galleryLoader");
  const loadMoreBtn = document.getElementById("loadMore");
  const lightboxModal = document.getElementById("lightboxModal")
    ? new bootstrap.Modal(document.getElementById("lightboxModal"))
    : null;
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const prevBtn = document.getElementById("prevImage");
  const nextBtn = document.getElementById("nextImage");

  let images = [];
  let currentIndex = 0;
  let currentPage = 0;
  const pageSize = 8;

  if (galleryContainer) {
    if (galleryLoader) galleryLoader.style.display = "block";

    fetch("../data/galerija.json")
      .then(response => response.json())
      .then(data => {
        images = data;
        renderPage();

        if (images.length > pageSize && loadMoreBtn) {
          loadMoreBtn.style.display = "inline-block";
        }
      })
      .catch(err => console.error("Greška pri učitavanju galerije:", err))
      .finally(() => {
        if (galleryLoader) galleryLoader.style.display = "none";
      });
  }

  function renderPage() {
    const start = currentPage * pageSize;
    const end = start + pageSize;
    const pageItems = images.slice(start, end);

    pageItems.forEach((img, index) => {
      const col = document.createElement("div");
      col.className = "col-sm-6 col-md-4 col-lg-3";
      col.innerHTML = `
        <img src="../assets/img/${img.src}" 
             alt="${img.alt}" 
             data-caption="${img.caption || ''}"
             data-aos="zoom-in"
             data-aos-delay="${(start + index) * 100}"
             class="img-fluid rounded shadow gallery-img" style="cursor:pointer;">
      `;
      const imageElement = col.querySelector("img");
      imageElement.addEventListener("click", () => {
        currentIndex = start + index;
        showImage();
        lightboxModal?.show();
      });
      galleryContainer.appendChild(col);
    });

    currentPage++;
    if (currentPage * pageSize >= images.length && loadMoreBtn) {
      loadMoreBtn.style.display = "none";
    }
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", renderPage);
  }

  function showImage() {
    if (!images[currentIndex]) return;
    lightboxImg.src = `../assets/img/${images[currentIndex].src}`;
    lightboxImg.alt = images[currentIndex].alt;
    lightboxCaption.textContent = images[currentIndex].caption || "";
  }

  prevBtn?.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage();
  });

  nextBtn?.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % images.length;
    showImage();
  });
});

// ================================
// Dinamičko učitavanje događaja
// ================================
document.addEventListener("DOMContentLoaded", () => {
  const eventsContainer = document.getElementById("events");
  const eventsLoader = document.getElementById("eventsLoader");

  if (eventsContainer) {
    if (eventsLoader) eventsLoader.style.display = "block"; // prikaži spinner

    fetch("../data/dogadjaji.json")
      .then(response => response.json())
      .then(events => {
        events.forEach((event, i) => {
          const col = document.createElement("div");
          col.className = "col-md-6 col-lg-4";
          col.innerHTML = `
            <div class="card h-100 shadow-sm" data-aos="zoom-in-up" data-aos-delay="${i * 150}">
              <img src="../assets/img/${event.slika}" class="card-img-top" alt="${event.naslov}">
              <div class="card-body">
                <h5 class="card-title">${event.naslov}</h5>
                <p class="card-text">${event.opis}</p>
              </div>
              <div class="card-footer">
                <small class="text-muted">📅 ${event.datum}</small>
              </div>
            </div>
          `;
          eventsContainer.appendChild(col);
        });
      })
      .catch(err => console.error("Greška pri učitavanju događaja:", err))
      .finally(() => {
        if (eventsLoader) eventsLoader.style.display = "none"; // sakrij spinner
      });
  }
});

// ================================
// Back to Top dugme
// ================================
document.addEventListener("DOMContentLoaded", () => {
  const backToTop = document.getElementById("backToTop");

  if (backToTop) {
    // Prikaz/skrivanje dugmeta
    window.addEventListener("scroll", () => {
      if (window.scrollY > 200) {
        backToTop.style.display = "block";
      } else {
        backToTop.style.display = "none";
      }
    });

    // Scroll na vrh
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
