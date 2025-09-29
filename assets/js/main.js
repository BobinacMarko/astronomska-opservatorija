// Preklop velikog fonta
document.getElementById('preklopFonta')?.addEventListener('click', () => {
  document.body.classList.toggle('veliki-font');
  document.cookie = `velikiFont=${document.body.classList.contains('veliki-font')}; path=/; max-age=31536000`;
});

// Preklop visokog kontrasta
document.getElementById('preklopKontrasta')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.body.classList.toggle('visok-kontrast');
  document.cookie = `visokKontrast=${document.body.classList.contains('visok-kontrast')}; path=/; max-age=31536000`;
});

// Vraćanje podešavanja iz kolačića
(function restorePrefs() {
  if (!document.cookie) return;
  const cookies = Object.fromEntries(document.cookie.split('; ').map(c => c.split('=')));
  if (cookies.velikiFont === 'true') document.body.classList.add('veliki-font');
  if (cookies.visokKontrast === 'true') document.body.classList.add('visok-kontrast');
})();

// Validacija kontakt forme
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("kontaktForma");
  const formMessage = document.getElementById("porukaForme");

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let valid = true;

    // Ime
    const ime = document.getElementById("ime");
    if (!ime.value.trim()) {
      ime.classList.add("is-invalid");
      valid = false;
    } else {
      ime.classList.remove("is-invalid");
    }

    // Email
    const eposta = document.getElementById("eposta");
    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
    if (!emailRegex.test(eposta.value.trim())) {
      eposta.classList.add("is-invalid");
      valid = false;
    } else {
      eposta.classList.remove("is-invalid");
    }

    // Poruka
    const poruka = document.getElementById("poruka");
    if (!poruka.value.trim()) {
      poruka.classList.add("is-invalid");
      valid = false;
    } else {
      poruka.classList.remove("is-invalid");
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

// Galerija sa lightbox-om i paginacijom
document.addEventListener("DOMContentLoaded", () => {
  const galleryContainer = document.getElementById("galerija");
  const galleryLoader = document.getElementById("ucitavacGalerije");
  const loadMoreBtn = document.getElementById("ucitajJos");
  const lightboxModal = document.getElementById("pregledSlikeModal")
    ? new bootstrap.Modal(document.getElementById("pregledSlikeModal"))
    : null;
  const lightboxImg = document.getElementById("pregledSlikeImg");
  const lightboxCaption = document.getElementById("pregledSlikeNatpis");
  const prevBtn = document.getElementById("prethodnaSlika");
  const nextBtn = document.getElementById("sledecaSlika");

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
             class="img-fluid rounded shadow slika-galerije" style="cursor:pointer;">
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

// Dinamičko učitavanje događaja
document.addEventListener("DOMContentLoaded", () => {
  const eventsContainer = document.getElementById("dogadjaji");
  const eventsLoader = document.getElementById("ucitavacDogadjaja");

  if (eventsContainer) {
    if (eventsLoader) eventsLoader.style.display = "block";

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
        if (eventsLoader) eventsLoader.style.display = "none";
      });
  }
});

// Dugme za povratak na vrh
document.addEventListener("DOMContentLoaded", () => {
  const backToTop = document.getElementById("nazadNaVrh");

  if (backToTop) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 200) {
        backToTop.style.display = "block";
      } else {
        backToTop.style.display = "none";
      }
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
