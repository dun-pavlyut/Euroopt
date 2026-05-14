const sampleCatalog = {
  "481015300021": { name: "Sparkling drink • Raspberry Lime", price: 1.55, weight: 0.5, ageCheck: false },
  "460123400404": { name: "Sweet bun with sugar (210g)", price: 1.20, weight: 0.21, ageCheck: false },
  "482002311778": { name: "Children pasta shells", price: 2.82, weight: 0.4, ageCheck: false },
  "460404040099": { name: "Dijon mustard 370g", price: 3.01, weight: 0.37, ageCheck: false },
  "460111999888": { name: "Yogurt Apple 180g", price: 0.80, weight: 0.18, ageCheck: false },
  "AGE001": { name: "Beer 0.5L", price: 2.55, weight: 0.5, ageCheck: true }
};

const pluCatalog = {
  "4011": { name: "Bananas", price: 0.80, weight: 1.0, ageCheck: false },
  "94011": { name: "Bananas organic", price: 1.20, weight: 1.0, ageCheck: false },
  "3107": { name: "Gala apples", price: 1.35, weight: 1.0, ageCheck: false },
  "4372": { name: "Navel oranges", price: 1.10, weight: 1.0, ageCheck: false }
};

const items = [];
let selectedIndex = null;
let weight = 0;

const itemsEl = document.getElementById("items");
const emptyEl = document.getElementById("empty");
const subtotalEl = document.getElementById("subtotal");
const discountsEl = document.getElementById("discounts");
const totalEl = document.getElementById("total");
const weightEl = document.getElementById("weight");
const itemCountEl = document.getElementById("itemCount");

function format(value) {
  return value.toFixed(2);
}

function render() {
  itemsEl.innerHTML = "";
  emptyEl.style.display = items.length ? "none" : "block";

  items.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "item" + (index === selectedIndex ? " selected" : "");
    li.innerHTML = `
      <div>
        <div class="name">${item.name}</div>
        <div class="meta">Qty: ${item.qty} • ${format(item.unitPrice)} each</div>
      </div>
      <div class="price">${format(item.qty * item.unitPrice)}</div>
    `;
    li.addEventListener("click", () => {
      selectedIndex = index;
      document.getElementById("removeBtn").disabled = false;
      render();
    });
    itemsEl.appendChild(li);
  });

  const subtotal = items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0);
  const discounts = 0;
  subtotalEl.textContent = format(subtotal);
  discountsEl.textContent = format(discounts);
  totalEl.textContent = format(subtotal - discounts);
  itemCountEl.textContent = items.reduce((sum, i) => sum + i.qty, 0);
  weightEl.textContent = weight.toFixed(2);
}

function addItem(entry) {
  const existing = items.find(i => i.name === entry.name);
  if (existing) {
    existing.qty += 1;
  } else {
    items.push({ name: entry.name, unitPrice: entry.price, qty: 1 });
  }
  weight += entry.weight;
  if (entry.ageCheck) showModal("ageModal");
  render();
}

function scan(code) {
  if (!code) return;
  if (sampleCatalog[code]) return addItem(sampleCatalog[code]);
  if (pluCatalog[code]) return addItem(pluCatalog[code]);
  alert("Item not found. Try a different code.");
}

function showModal(id) {
  document.getElementById(id).classList.add("show");
}

function closeModal(id) {
  document.getElementById(id).classList.remove("show");
}

// Bindings

document.getElementById("scanBtn").addEventListener("click", () => {
  const input = document.getElementById("barcodeInput");
  scan(input.value.trim());
  input.value = "";
});

document.getElementById("barcodeInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    scan(e.target.value.trim());
    e.target.value = "";
  }
});

document.querySelectorAll(".chip").forEach(btn => {
  btn.addEventListener("click", () => scan(btn.dataset.plu));
});

document.getElementById("removeBtn").addEventListener("click", () => {
  if (selectedIndex === null) return;
  const removed = items.splice(selectedIndex, 1)[0];
  if (removed) weight -= removed.qty; // approximate
  selectedIndex = null;
  document.getElementById("removeBtn").disabled = true;
  render();
});

// Footer actions

document.getElementById("helpBtn").addEventListener("click", () => showModal("helpModal"));

document.getElementById("payBtn").addEventListener("click", () => showModal("payModal"));

document.getElementById("loyaltyBtn").addEventListener("click", () => showModal("loyaltyModal"));

document.getElementById("voidBtn").addEventListener("click", () => showModal("voidModal"));

// Modal close handlers

document.querySelectorAll("[data-close]").forEach(btn => {
  btn.addEventListener("click", () => closeModal(btn.dataset.close));
});

document.getElementById("confirmVoid").addEventListener("click", () => {
  items.length = 0;
  weight = 0;
  selectedIndex = null;
  closeModal("voidModal");
  render();
});

// Initial seed items to feel real
addItem(sampleCatalog["481015300021"]);
addItem(sampleCatalog["460123400404"]);
addItem(sampleCatalog["482002311778"]);
addItem(sampleCatalog["460404040099"]);
addItem(sampleCatalog["460111999888"]);

render();
