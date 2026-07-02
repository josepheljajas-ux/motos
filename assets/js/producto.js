// ---------- producto.js ----------
// Reads ?id= from URL, finds the moto in MOTOS array, and renders the detail page.
// Structured so MOTOS can be replaced by a fetch() call later.

const PALETTE = ["#c92a3e", "#e35d6a", "#ffd23f", "#7ee787", "#ff8fb1", "#c792ea"];

function fmt(n) {
  return "$" + n.toLocaleString("es-CO");
}

function whatsappCompraUrl(m) {
  const cilindraje = m.cilindraje > 0 ? `${m.cilindraje}cc` : "Electrica";
  const kilometraje = Number.isFinite(Number(m.km))
    ? Number(m.km).toLocaleString("es-CO") + " km"
    : "No indicado";
  const mensaje = [
    "Hola! Estoy interesado(a) en comprar esta moto en Motos con Jhonny. Estos son los datos del veh\u00edculo:",
    "",
    "Datos de la moto:",
    `- Marca: ${m.marca}`,
    `- Modelo: ${m.modelo}`,
    `- A\u00f1o: ${m.anio}`,
    `- Cilindraje: ${cilindraje}`,
    `- Condici\u00f3n: ${m.condicion}`,
    `- Kilometraje: ${kilometraje}`,
    `- Referencia: ${m.referencia}`,
    `- Precio publicado: ${fmt(m.precio)}`,
    `- Sede: ${m.sede}`,
    "",
    "Quedo atento(a) para confirmar disponibilidad y continuar con la compra. Gracias."
  ].join("\n");

  return `https://wa.me/573238017635?text=${encodeURIComponent(mensaje)}`;
}
function motoSVG(index) {
  const color = PALETTE[index % PALETTE.length];
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

/**
 * Fetch a single moto by ID.
 * Currently reads from the global MOTOS array (data.js).
 * Replace this function body with a fetch() call when migrating to a real API.
 */
function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getImagePath(moto) {
  if (moto.imagen) return moto.imagen;
  if (Array.isArray(moto.imagenes) && moto.imagenes.length) return moto.imagenes[0];
  if (moto.img && /\.(avif|webp|jpe?g|jfif|png|gif|svg)$/i.test(moto.img)) return moto.img;
  return "";
}

function mediaMarkup(moto, index) {
  const imagePath = getImagePath(moto);
  if (!imagePath) return motoSVG(index);

  const alt = `${moto.marca} ${moto.modelo}`;
  return `<img class="moto-photo" src="${escapeHTML(imagePath)}" alt="${escapeHTML(alt)}">`;
}

function getMotoById(id) {
  // Future: return fetch(`/api/motos/${id}`).then(r => r.json());
  const moto = MOTOS.find(m => m.id === id);
  return moto || null;
}

function showError() {
  document.getElementById("productoPage").hidden = true;
  document.getElementById("productoError").hidden = false;
}

function renderProducto(m) {
  document.getElementById("productoPage").hidden = false;
  document.getElementById("productoError").hidden = true;
  const globalIdx = MOTOS.indexOf(m);
  const page = document.getElementById("productoPage");

  document.title = `${m.marca} ${m.modelo} — Motos con Jhonny`;

  page.innerHTML = `
    <div class="producto">

      <div class="producto__breadcrumb">
        <a href="catalogo.html">← Volver al catálogo</a>
      </div>

      <div class="producto__layout">

        <div class="producto__media ${getImagePath(m) ? 'producto__media--photo' : ''}">
          <span class="card__badge ${m.condicion === 'Usada' ? 'card__badge--usada' : ''}">${m.condicion}${m.condicion === 'Nueva' ? ' · 0KM' : ''}</span>
          ${mediaMarkup(m, globalIdx)}
        </div>

        <div class="producto__info">
          <p class="producto__marca">${m.marca}</p>
          <h1 class="producto__modelo">${m.modelo}</h1>
          <p class="producto__sub">${m.anio} · ${m.cilindraje > 0 ? m.cilindraje + 'cc' : 'Eléctrica'} · Ref: ${m.referencia}</p>

          <div class="producto__price-box">
            <p class="producto__price-label">Precio de venta</p>
            <p class="producto__price">${fmt(m.precio)}</p>
          </div>

          <div class="producto__actions">
            <a class="btn btn--primary" href="${whatsappCompraUrl(m)}" target="_blank" rel="noopener">Comprar ahora</a>
            <button class="btn btn--ghost">Cotizar financiamiento</button>
          </div>
        </div>

      </div>

      <div class="producto__details">
        <h2 class="producto__section-title">Especificaciones</h2>
        <div class="producto__specs">
          <div class="spec-card">
            <p class="spec__label">Condición</p>
            <p class="spec__value">${m.condicion}</p>
          </div>
          <div class="spec-card">
            <p class="spec__label">Modelo</p>
            <p class="spec__value">${m.modelo}</p>
          </div>
          <div class="spec-card">
            <p class="spec__label">Año</p>
            <p class="spec__value">${m.anio}</p>
          </div>
          <div class="spec-card">
            <p class="spec__label">Color</p>
            <p class="spec__value">${m.color}</p>
          </div>
          <div class="spec-card">
            <p class="spec__label">Kilómetros</p>
            <p class="spec__value">${m.km.toLocaleString('es-CO')} km</p>
          </div>
          <div class="spec-card">
            <p class="spec__label">Cilindraje</p>
            <p class="spec__value">${m.cilindraje > 0 ? m.cilindraje + 'cc' : 'Eléctrica'}</p>
          </div>
          <div class="spec-card">
            <p class="spec__label">Tipo</p>
            <p class="spec__value" style="text-transform: capitalize;">${m.tipo}</p>
          </div>
          <div class="spec-card">
            <p class="spec__label">Transmisión</p>
            <p class="spec__value">${m.transmision}</p>
          </div>
          <div class="spec-card">
            <p class="spec__label">Combustible</p>
            <p class="spec__value">${m.combustible}</p>
          </div>
          <div class="spec-card">
            <p class="spec__label">Sede</p>
            <p class="spec__value">${m.sede}</p>
          </div>
        </div>
      </div>

      ${m.historial ? `
      <div class="producto__historial">
        <h2 class="producto__section-title">Historial de la moto</h2>
        <div class="historial__grid">
          ${m.historial.soat ? `
          <div class="historial__card">
            <div class="historial__card-left">
              <div class="historial__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div class="historial__text">
                <p class="historial__title">SOAT</p>
                <p class="historial__sub">Se entrega con SOAT nuevo</p>
              </div>
            </div>
            <span class="historial__check">✓</span>
          </div>` : ""}
          ${m.historial.tecnomecanica ? `
          <div class="historial__card">
            <div class="historial__card-left">
              <div class="historial__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
              </div>
              <div class="historial__text">
                <p class="historial__title">Revisión Tecnomecánica</p>
                <p class="historial__sub">Se entrega con Tecnomecánica nueva</p>
              </div>
            </div>
            <span class="historial__check">✓</span>
          </div>` : ""}
          ${m.historial.dominio ? `
          <div class="historial__card">
            <div class="historial__card-left">
              <div class="historial__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m14 13-5 5M4 16l4-4 4 4-4 4-4-4Zm13-9-4 4 4 4 4-4-4-4Zm-2-2-4 4M21 3l-3 3"/>
                </svg>
              </div>
              <div class="historial__text">
                <p class="historial__title">Limitaciones al dominio</p>
                <p class="historial__sub">Dominio libre y sin restricciones</p>
              </div>
            </div>
            <span class="historial__check">✓</span>
          </div>` : ""}
          ${m.historial.accidentalidad ? `
          <div class="historial__card">
            <div class="historial__card-left">
              <div class="historial__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m5 21 14 0M10 3h4l3 15H7L10 3zM8 12h8M9 8h6"/>
                </svg>
              </div>
              <div class="historial__text">
                <p class="historial__title">Accidentalidad</p>
                <p class="historial__sub">Vehículo sin historial de accidentes</p>
              </div>
            </div>
            <span class="historial__check">✓</span>
          </div>` : ""}
          ${m.historial.impuestos ? `
          <div class="historial__card">
            <div class="historial__card-left">
              <div class="historial__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
              <div class="historial__text">
                <p class="historial__title">Impuestos</p>
                <p class="historial__sub">Información tributaria verificada</p>
              </div>
            </div>
            <span class="historial__check">✓</span>
          </div>` : ""}
          ${m.historial.multas ? `
          <div class="historial__card">
            <div class="historial__card-left">
              <div class="historial__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z"/>
                  <path d="M12 8v8M9 10h5a2 2 0 0 0 0-4h-3a2 2 0 0 0 0 4h3a2 2 0 0 1 0 4H9a2 2 0 0 1 0-4"/>
                </svg>
              </div>
              <div class="historial__text">
                <p class="historial__title">Multas</p>
                <p class="historial__sub">Sin multas pendientes</p>
              </div>
            </div>
            <span class="historial__check">✓</span>
          </div>` : ""}
        </div>
      </div>
      ` : ""}

      <div class="producto__description">
        <h2 class="producto__section-title">Descripción</h2>
        <p>${m.descripcion}</p>
      </div>

    </div>
  `;
}

// ---------- INIT ----------
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    showError();
    return;
  }

  const moto = getMotoById(id);

  if (!moto) {
    showError();
    return;
  }

  renderProducto(moto);
});
