const WHATSAPP_NUMBER = "59899583953";

const productsGrid = document.getElementById("productsGrid");
const featuredGrid = document.getElementById("featuredGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const emptyState = document.getElementById("emptyState");

const productos = (window.PRODUCTOS || [])
  .filter((item) => item.activo !== false)
  .sort((a, b) => (a.orden || 9999) - (b.orden || 9999));

function normalizarTexto(valor = "") {
  return valor
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function obtenerEmoji(categoria = "") {
  const cat = normalizarTexto(categoria);

  if (cat.includes("moto")) return "🏍️";
  if (cat.includes("bici")) return "🚲";
  if (cat.includes("neumatic")) return "🛞";
  if (cat.includes("fitness")) return "💪";
  if (cat.includes("accesor")) return "🪖";

  return "📦";
}

function precioVisible(precio = "") {
  const limpio = precio.toString().trim();
  return limpio ? limpio : "Consultar precio";
}

function crearWhatsappLink(producto) {
  const texto =
    producto.whatsappTexto ||
    `Hola, quiero consultar por ${producto.nombre}.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
}

function crearCard(producto) {
  const article = document.createElement("article");
  article.className = "product-card";

  if (producto.imagen && producto.imagen.trim()) {
    const img = document.createElement("img");
    img.className = "product-image";
    img.src = producto.imagen.trim();
    img.alt = producto.nombre;
    img.loading = "lazy";
    article.appendChild(img);
  } else {
    const placeholder = document.createElement("div");
    placeholder.className = "product-placeholder";
    placeholder.textContent = obtenerEmoji(producto.categoria);
    article.appendChild(placeholder);
  }

  const body = document.createElement("div");
  body.className = "product-body";

  const badge = document.createElement("span");
  badge.className = "product-category";
  badge.textContent = producto.categoria || "Sin categoría";

  const title = document.createElement("h3");
  title.className = "product-title";
  title.textContent = producto.nombre || "Sin nombre";

  const price = document.createElement("div");
  price.className = "product-price";
  price.textContent = precioVisible(producto.precio);

  const description = document.createElement("div");
  description.className = "product-description";
  description.textContent =
    producto.descripcion || "Consultá por este artículo.";

  const actions = document.createElement("div");
  actions.className = "product-actions";

  const wpp = document.createElement("a");
  wpp.className = "wpp";
  wpp.href = crearWhatsappLink(producto);
  wpp.target = "_blank";
  wpp.rel = "noreferrer";
  wpp.textContent = "Consultar por WhatsApp";

  const secondary = document.createElement("a");
  secondary.className = "secondary";
  secondary.href = "#contacto";
  secondary.textContent = "Ver contacto";

  actions.appendChild(wpp);
  actions.appendChild(secondary);

  body.appendChild(badge);
  body.appendChild(title);
  body.appendChild(price);
  body.appendChild(description);
  body.appendChild(actions);

  article.appendChild(body);

  return article;
}

function renderDestacados() {
  featuredGrid.innerHTML = "";

  const destacados = productos.filter((item) => item.destacado === true);

  if (!destacados.length) {
    featuredGrid.innerHTML = "<p>No hay destacados cargados.</p>";
    return;
  }

  destacados.forEach((producto) => {
    featuredGrid.appendChild(crearCard(producto));
  });
}

function poblarCategorias() {
  const categorias = [
    ...new Set(
      productos
        .map((item) => item.categoria)
        .filter(Boolean)
    )
  ];

  categorias.forEach((categoria) => {
    const option = document.createElement("option");
    option.value = categoria;
    option.textContent = categoria;
    categoryFilter.appendChild(option);
  });
}

function renderCatalogo() {
  const texto = normalizarTexto(searchInput.value);
  const categoria = categoryFilter.value;

  const filtrados = productos.filter((item) => {
    const coincideTexto =
      !texto ||
      normalizarTexto(item.nombre).includes(texto) ||
      normalizarTexto(item.descripcion).includes(texto);

    const coincideCategoria =
      categoria === "todos" || item.categoria === categoria;

    return coincideTexto && coincideCategoria;
  });

  productsGrid.innerHTML = "";

  if (!filtrados.length) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  filtrados.forEach((producto) => {
    productsGrid.appendChild(crearCard(producto));
  });
}

searchInput.addEventListener("input", renderCatalogo);
categoryFilter.addEventListener("change", renderCatalogo);

poblarCategorias();
renderDestacados();
renderCatalogo();