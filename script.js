// ═══════════════════════════════════════════
//   SOL DE JANEIRO — SCRIPT.JS
// ═══════════════════════════════════════════

const products = [
  {
    id: 1,
    name: "Oud Impérial",
    category: "Oud Royal",
    price: 450,
    oldPrice: null,
    badge: "Bestseller",
    badgeType: "",
    image: "https://images.pexels.com/photos/1961792/pexels-photo-1961792.jpeg?auto=compress&cs=tinysrgb&w=600",
    isNew: false,
    description: "Un voyage olfactif envoûtant au cœur de l'Orient.",
    notes: "Oud, Ambre, Bois de Santal"
  },
  {
    id: 2,
    name: "Rose de Damas",
    category: "Fleurs d'Orient",
    price: 380,
    oldPrice: 475,
    badge: "-20%",
    badgeType: "promo",
    image: "https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=600",
    isNew: false,
    description: "La quintessence de la rose marocaine en flacon.",
    notes: "Rose, Jasmin, Musc blanc"
  },
  {
    id: 3,
    name: "Ambre Soleil",
    category: "Ambre Solaire",
    price: 420,
    oldPrice: null,
    badge: "Nouveau",
    badgeType: "new",
    image: "https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=600",
    isNew: true,
    description: "La chaleur dorée du soleil marocain capturée en essence.",
    notes: "Ambre, Vanille, Cèdre"
  },
  {
    id: 4,
    name: "Santal Sacré",
    category: "Bois Précieux",
    price: 395,
    oldPrice: null,
    badge: null,
    badgeType: "",
    image: "https://images.pexels.com/photos/755992/pexels-photo-755992.jpeg?auto=compress&cs=tinysrgb&w=600",
    isNew: false,
    description: "La sérénité des forêts orientales en une respiration.",
    notes: "Santal, Vétiver, Patchouli"
  },
  {
    id: 5,
    name: "Musc Blanc",
    category: "Collection Nuit",
    price: 360,
    oldPrice: null,
    badge: "Nouveau",
    badgeType: "new",
    image: "https://images.pexels.com/photos/26838653/pexels-photo-26838653.jpeg?auto=compress&cs=tinysrgb&w=600",
    isNew: true,
    description: "Une pureté enveloppante pour les âmes romantiques.",
    notes: "Musc, Fleur d'Oranger, Bergamote"
  },
  {
    id: 6,
    name: "Nuit d'Orient",
    category: "Collection Nuit",
    price: 480,
    oldPrice: 600,
    badge: "-20%",
    badgeType: "promo",
    image: "https://images.pexels.com/photos/32630378/pexels-photo-32630378.jpeg?auto=compress&cs=tinysrgb&w=600",
    isNew: false,
    description: "Le mystère et la profondeur de la nuit marocaine.",
    notes: "Oud noir, Encens, Ambre gris"
  },
  {
    id: 7,
    name: "Jasmin Impérial",
    category: "Fleurs d'Orient",
    price: 410,
    oldPrice: null,
    badge: "Nouveau",
    badgeType: "new",
    image: "https://images.pexels.com/photos/32630379/pexels-photo-32630379.jpeg?auto=compress&cs=tinysrgb&w=600",
    isNew: true,
    description: "L'ivresse du jasmin en fleur sous la lune d'été.",
    notes: "Jasmin, Tubéreuse, Ylang-ylang"
  },
  {
    id: 8,
    name: "Cèdre Atlas",
    category: "Bois Précieux",
    price: 440,
    oldPrice: null,
    badge: null,
    badgeType: "",
    image: "https://images.pexels.com/photos/26924214/pexels-photo-26924214.jpeg?auto=compress&cs=tinysrgb&w=600",
    isNew: false,
    description: "L'âme majestueuse du Cèdre de l'Atlas marocain.",
    notes: "Cèdre, Cyprès, Vétiver fumé"
  }
];

// ─── CART STATE ───────────────────────────
let cart = JSON.parse(localStorage.getItem('sdj_cart')) || [];

function saveCart() {
  localStorage.setItem('sdj_cart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const existing = cart.find(item => item.id === productId);
  if (existing) { existing.qty++; }
  else { cart.push({ ...product, qty: 1 }); }
  saveCart();
  showToast(`${product.name} ajouté au panier ✓`);
  openCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
}

function updateQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(productId);
  else saveCart();
}

function updateCartUI() {
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  const countEl = document.getElementById('cartCount');
  if (countEl) {
    countEl.textContent = total;
    countEl.classList.toggle('visible', total > 0);
  }
  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');
  const totalEl = document.getElementById('cartTotal');
  if (!itemsEl) return;
  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <i class="fas fa-shopping-bag"></i>
        <p>Votre panier est vide</p>
      </div>`;
    if (footerEl) footerEl.style.display = 'none';
  } else {
    itemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}"/>
        <div class="cart-item-info">
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-price">${item.price} DH</p>
          <div class="cart-item-qty">
            <button onclick="updateQty(${item.id}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="updateQty(${item.id}, +1)">+</button>
          </div>
        </div>
        <button onclick="removeFromCart(${item.id})"
          style="color:#888;font-size:12px;align-self:flex-start">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `).join('');
    const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    if (totalEl) totalEl.textContent = totalPrice + ' DH';
    if (footerEl) footerEl.style.display = 'block';
  }
}

function openCart() {
  document.getElementById('cartDrawer')?.classList.add('open');
  document.getElementById('cartOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartDrawer')?.classList.remove('open');
  document.getElementById('cartOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

function closeSearch() {
  document.getElementById('searchBar')?.classList.remove('open');
}

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function submitNewsletter(e) {
  e.preventDefault();
  showToast('Merci ! Vous êtes maintenant abonné(e) ✓');
  e.target.reset();
}

function renderProductCard(product) {
  return `
    <div class="product-card reveal">
      <div class="product-img-wrap">
        ${product.badge
          ? `<span class="product-badge ${product.badgeType}">${product.badge}</span>`
          : ''}
        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
          onerror="this.src='https://images.pexels.com/photos/1961792/pexels-photo-1961792.jpeg?auto=compress&cs=tinysrgb&w=600'"
        />
        <div class="product-actions">
          <button onclick="addToCart(${product.id})">Ajouter au panier</button>
          <button class="wish-btn"
            onclick="showToast('Ajouté aux favoris ♥')">
            <i class="fas fa-heart"></i>
          </button>
        </div>
      </div>
      <div class="product-info">
        <span class="product-cat">${product.category}</span>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-price">
          <span class="price-current">${product.price} DH</span>
          ${product.oldPrice
            ? `<span class="price-old">${product.oldPrice} DH</span>`
            : ''}
        </div>
      </div>
    </div>
  `;
}

function initGrids() {
  const featuredGrid = document.getElementById('featuredGrid');
  if (featuredGrid) {
    featuredGrid.innerHTML = products.slice(0, 4).map(renderProductCard).join('');
  }
  const newGrid = document.getElementById('newGrid');
  if (newGrid) {
    newGrid.innerHTML = products.filter(p => p.isNew).map(renderProductCard).join('');
  }
  const allGrid = document.getElementById('allProductsGrid');
  if (allGrid) {
    allGrid.innerHTML = products.map(renderProductCard).join('');
  }
}

function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
  });
}

function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    links.classList.toggle('mobile-open');
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('mobile-open'));
  });
}

function initSearch() {
  const btn = document.getElementById('searchToggle');
  const bar = document.getElementById('searchBar');
  if (!btn || !bar) return;
  btn.addEventListener('click', () => {
    bar.classList.toggle('open');
    if (bar.classList.contains('open')) {
      setTimeout(() => document.getElementById('searchInput')?.focus(), 300);
    }
  });
}

function initCart() {
  document.getElementById('cartToggle')?.addEventListener('click', openCart);
  document.getElementById('cartOverlay')?.addEventListener('click', closeCart);
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function filterProducts(category) {
  const grid = document.getElementById('allProductsGrid');
  if (!grid) return;
  const filtered = category === 'Tous'
    ? products
    : products.filter(p => p.category === category);
  grid.innerHTML = filtered.map(renderProductCard).join('');
  setTimeout(initReveal, 50);
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === category);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initSearch();
  initCart();
  initGrids();
  updateCartUI();
  setTimeout(initReveal, 100);
});