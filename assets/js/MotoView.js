class MotoView {
  constructor() {
    // Accordion contents
    this.filterContainers = {
      condicion: document.getElementById("condicionList"),
      tipo: document.getElementById("tipoList"),
      marca: document.getElementById("marcaList"),
      kilometraje: document.getElementById("kilometrajeList"),
      anio: document.getElementById("anioList"),
      transmision: document.getElementById("transmisionList"),
      combustible: document.getElementById("combustibleList"),
      cilindraje: document.getElementById("cilindrajeList")
    };
    
    this.precioRange = document.getElementById("precioRange");
    this.precioValor = document.getElementById("precioValor");
    this.searchInput = document.getElementById("searchInput");
    this.ordenSelect = document.getElementById("ordenSelect");
    
    this.grid = document.getElementById("grid");
    this.emptyState = document.getElementById("emptyState");
    this.resultsCount = document.getElementById("resultsCount");
    
    this.resetFilters = document.getElementById("resetFilters");
    this.dialCount = document.getElementById("dialCount");
    this.dialNeedle = document.getElementById("dialNeedle");
    this.dialTicks = document.getElementById("dialTicks");
    
    this.palette = ["#c92a3e", "#e35d6a", "#ffd23f", "#7ee787", "#ff8fb1", "#c792ea"];
  }

  motoSVG(index) {
    const color = this.palette[index % this.palette.length];
    return `
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="90" r="22" stroke="${color}" stroke-width="4"/>
      <circle cx="155" cy="90" r="22" stroke="${color}" stroke-width="4"/>
      <path d="M40 90 L80 55 L120 55 L155 90" stroke="#f3f1ea" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M80 55 L95 30 L120 30" stroke="#f3f1ea" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M120 55 L140 38" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
      <circle cx="40" cy="90" r="4" fill="${color}"/>
      <circle cx="155" cy="90" r="4" fill="${color}"/>
    </svg>`;
  }

  fmt(n) {
    return "$" + n.toLocaleString("es-CO");
  }

  escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  getImagePath(moto) {
    if (moto.imagen) return moto.imagen;
    if (Array.isArray(moto.imagenes) && moto.imagenes.length) return moto.imagenes[0];
    if (moto.img && /\.(avif|webp|jpe?g|jfif|png|gif|svg)$/i.test(moto.img)) return moto.img;
    return "";
  }

  mediaMarkup(moto, index) {
    const imagePath = this.getImagePath(moto);
    if (!imagePath) return this.motoSVG(index);

    const alt = `${moto.marca} ${moto.modelo}`;
    return `<img class="moto-photo" src="${this.escapeHTML(imagePath)}" alt="${this.escapeHTML(alt)}" loading="lazy">`;
  }

  buildTicks() {
    if (!this.dialTicks) return;
    let ticks = "";
    for (let i = 0; i < 40; i++){
      const angle = (i / 40) * 360;
      const rad = (angle * Math.PI) / 180;
      const x1 = 160 + 132 * Math.cos(rad);
      const y1 = 160 + 132 * Math.sin(rad);
      const x2 = 160 + (i % 5 === 0 ? 122 : 127) * Math.cos(rad);
      const y2 = 160 + (i % 5 === 0 ? 122 : 127) * Math.sin(rad);
      ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
    }
    this.dialTicks.innerHTML = ticks;
  }

  setupAccordion() {
    const items = document.querySelectorAll(".accordion-item");
    items.forEach(item => {
      const header = item.querySelector(".accordion-header");
      const arrow = header.querySelector(".arrow");
      header.addEventListener("click", () => {
        const isOpen = item.classList.toggle("open");
        arrow.textContent = isOpen ? "\u2303" : "\u2304";
      });
    });
  }

  openFilterGroup(type) {
    const item = document.querySelector(`.accordion-item[data-group="${type}"]`);
    if (!item) return;

    item.classList.add("open");
    const arrow = item.querySelector(".arrow");
    if (arrow) arrow.textContent = "\u2303";
  }

  setCheckboxValue(type, value, isChecked) {
    const container = this.filterContainers[type];
    if (!container) return false;

    const checkbox = Array.from(container.querySelectorAll('input[type="checkbox"]'))
      .find(cb => cb.dataset.value === value);

    if (!checkbox) return false;

    checkbox.checked = isChecked;
    return true;
  }

  setPrecioValue(value) {
    if (!this.precioRange || !this.precioValor) return;
    this.precioRange.value = value;
    this.precioValor.textContent = this.fmt(value);
  }

  setSearchValue(value) {
    if (this.searchInput) this.searchInput.value = value;
  }

  setOrdenValue(value) {
    if (this.ordenSelect) this.ordenSelect.value = value;
  }

  buildFilters(motos, onCheckboxChange) {
    this.setupAccordion();

    const condicionOptions = ["Nueva", "Usada"];
    this.generateCheckboxes(this.filterContainers.condicion, "condicion", condicionOptions, onCheckboxChange);

    const tipoOptions = ["deportiva", "enduro", "naked", "patineta", "urbana", "scooter", "touring"];
    this.generateCheckboxes(this.filterContainers.tipo, "tipo", tipoOptions, onCheckboxChange);

    const marcaOptions = [
      "AKT", "AKT-SYM", "BAJAJ", "BENELLI", "BMW", "CF MOTO", "EVOBIKE", 
      "HERO", "HONDA", "Husqvarna", "KAWASAKI", "KTM", "KYMCO", "MINCA", 
      "ROYAL ENFIELD", "STARKER", "SUZUKI", "TVS", "VICTORY", "Yamaha", "Otras"
    ];
    this.generateCheckboxes(this.filterContainers.marca, "marca", marcaOptions, onCheckboxChange);

    const kmOptions = ["Hasta 25.000", "Hasta 30.000", "Hasta 50.000", "Hasta 100.000"];
    this.generateCheckboxes(this.filterContainers.kilometraje, "kilometraje", kmOptions, onCheckboxChange);

    const anioOptions = ["2020 - 2026", "2010 - 2019", "2000 - 2009"];
    this.generateCheckboxes(this.filterContainers.anio, "anio", anioOptions, onCheckboxChange);

    const transmisionOptions = ["Manual", "Automática"];
    this.generateCheckboxes(this.filterContainers.transmision, "transmision", transmisionOptions, onCheckboxChange);

    const combustibleOptions = ["Gasolina", "Eléctrico"];
    this.generateCheckboxes(this.filterContainers.combustible, "combustible", combustibleOptions, onCheckboxChange);

    const cilOptions = ["Menores a 149cc", "150cc y 199cc", "200cc y 299cc", "Mayores a 300cc"];
    this.generateCheckboxes(this.filterContainers.cilindraje, "cilindraje", cilOptions, onCheckboxChange);
  }

  generateCheckboxes(container, type, options, onCheckboxChange) {
    if (!container) return false;
    container.innerHTML = options.map(opt => {
      const cleanValue = opt.replace(/"/g, '&quot;');
      const id = `${type}-${cleanValue.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      return `
        <label class="checkbox-item" for="${id}">
          <input type="checkbox" id="${id}" data-type="${type}" data-value="${cleanValue}">
          <span class="custom-checkbox"></span>
          <span class="checkbox-label">${opt}</span>
        </label>
      `;
    }).join("");

    container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener("change", () => {
        onCheckboxChange(cb.dataset.type, cb.dataset.value, cb.checked);
      });
    });
  }

  render(list, totalCount, allMotos) {
    this.resultsCount.textContent = `${list.length} resultado${list.length === 1 ? "" : "s"}`;

    if (!list.length){
      this.grid.innerHTML = "";
      this.emptyState.hidden = false;
    } else {
      this.emptyState.hidden = true;
      this.grid.innerHTML = list.map((m) => {
        const globalIdx = allMotos.indexOf(m);
        return `
          <a href="producto.html?id=${m.id}" class="card-link">
            <article class="card">
              <div class="card__media ${this.getImagePath(m) ? 'card__media--photo' : ''}">
                <span class="card__badge ${m.condicion === 'Usada' ? 'card__badge--usada' : ''}">${m.condicion}${m.condicion === 'Nueva' ? ' · 0KM' : ''}</span>
                ${this.mediaMarkup(m, globalIdx)}
              </div>
              <div class="card__body">
                <p class="card__marca">${m.marca}</p>
                <h3 class="card__modelo">${m.modelo}</h3>
                <div class="card__meta">
                  <span>${m.anio}</span>
                  <span>${m.condicion === 'Usada' ? m.km.toLocaleString('es-CO') + ' km' : '0 km'}</span>
                  <span>${m.cilindraje > 0 ? m.cilindraje + 'cc' : 'Electrica'}</span>
                </div>
                <div class="card__footer">
                  <div class="card__price-block">
                    <span class="card__renta">Precio publicado</span>
                    <span class="card__precio">${this.fmt(m.precio)}</span>
                  </div>
                  <span class="card__fav" aria-hidden="true">♡</span>
                </div>
              </div>
            </article>
          </a>
        `;
      }).join("");
    }

    this.updateDial(list.length, totalCount);
  }

  updateDial(n, max) {
    if (!this.dialCount || !this.dialNeedle) return;
    this.dialCount.textContent = n;
    const pct = max ? n / max : 0;
    const angle = -90 + pct * 270;
    this.dialNeedle.style.transform = `rotate(${angle}deg)`;
  }

  resetUI() {
    document.querySelectorAll('.checkbox-list input[type="checkbox"]').forEach(cb => {
      cb.checked = false;
    });
    this.precioRange.value = 40000000;
    this.precioValor.textContent = this.fmt(40000000);
    this.searchInput.value = "";
    if (this.ordenSelect) this.ordenSelect.value = "relevancia";
  }

  bindPrecioChange(handler) {
    this.precioRange.addEventListener("input", e => {
      const val = Number(e.target.value);
      this.precioValor.textContent = this.fmt(val);
      handler(val);
    });
  }

  bindOrdenChange(handler) {
    if (this.ordenSelect) {
      this.ordenSelect.addEventListener("change", e => handler(e.target.value));
    }
  }

  bindSearchInput(handler) {
    this.searchInput.addEventListener("input", e => {
      handler(e.target.value.trim());
    });
  }

  bindResetClick(handler) {
    this.resetFilters.addEventListener("click", () => {
      this.resetUI();
      handler();
    });
  }
}
