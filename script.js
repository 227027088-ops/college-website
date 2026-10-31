const products = [
  {id:1,name:"Golden Retriever",category:"dogs",price:12000,image:"https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80"},
  {id:2,name:"Cute Puppy",category:"dogs",price:8500,image:"https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80"},
  {id:3,name:"Persian Cat",category:"cats",price:9500,image:"https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80"},
  {id:4,name:"Cute Kitten",category:"cats",price:6500,image:"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80"},
  {id:5,name:"Colorful Parrot",category:"birds",price:1800,image:"https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80"},
  {id:6,name:"Pet Budgie",category:"birds",price:700,image:"https://images.unsplash.com/photo-1522858547137-f1dcec554f55?auto=format&fit=crop&w=600&q=80"},
  {id:7,name:"Premium Dog Food",category:"food",price:1000,image:"https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80"},
  {id:8,name:"Cat Food Pack",category:"food",price:650,image:"https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80"},
  {id:9,name:"Pet Toy Set",category:"accessories",price:450,image:"https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=600&q=80"},
  {id:10,name:"Pet Collar",category:"accessories",price:300,image:"https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80"}
];

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch {
    return {};
  }
}

function getCart() {
  const cart = read("petCart");
  return Array.isArray(cart) ? cart : [];
}

function saveCart(cart) {
  localStorage.setItem("petCart", JSON.stringify(cart));
}

function money(amount) {
  return "₹" + amount.toLocaleString("en-IN", {
    maximumFractionDigits: 2
  });
}

function addToCart(id) {
  const cart = getCart();
  const item = cart.find(p => p.id === id);

  if (item) {
    item.qty++;
  } else {
    cart.push({id:id, qty:1});
  }

  saveCart(cart);
  alert("Product added to cart successfully!");
}

function changeQty(id, amount) {
  const cart = getCart();
  const item = cart.find(p => p.id === id);

  if (item) item.qty += amount;

  saveCart(cart.filter(p => p.qty > 0));
  renderCart();
}

function removeItem(id) {
  saveCart(getCart().filter(p => p.id !== id));
  renderCart();
}

function getTotals() {
  const subtotal = getCart().reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);

  const discount = subtotal >= 1000 ? subtotal * 0.10 : 0;
  const tax = (subtotal - discount) * 0.05;
  const total = subtotal - discount + tax;

  return {subtotal, discount, tax, total};
}

function renderProducts(category) {
  const container = document.getElementById("products");
  if (!container) return;

  const list = category === "all"
    ? products
    : products.filter(p => p.category === category);

  container.innerHTML = list.map(p => `
    <div class="product">
      <img src="${p.image}" alt="${p.name}" loading="lazy"
        onerror="this.src='https://placehold.co/400x250?text=Pet+Product'">
      <h3>${p.name}</h3>
      <p>${p.category.toUpperCase()}</p>
      <p class="price">${money(p.price)}</p>
      <button class="btn" onclick="addToCart(${p.id})">
        Add to Cart
      </button>
    </div>
  `).join("");
}

function billSummary(t) {
  return `
    <div class="bill-row"><span>Subtotal</span><b>${money(t.subtotal)}</b></div>
    <div class="bill-row"><span>Discount (10%)</span><b>- ${money(t.discount)}</b></div>
    <div class="bill-row"><span>Tax (5%)</span><b>${money(t.tax)}</b></div>
    <div class="bill-row total"><span>Final Total</span><span>${money(t.total)}</span></div>`;
}

function renderCart() {
  const container = document.getElementById("cart-content");
  if (!container) return;

  const cart = getCart();

  if (!cart.length) {
    container.innerHTML = `
      <div class="empty">
        <h2>Your cart is empty 🛒</h2>
        <a class="btn" href="index.html">Shop Now</a>
      </div>`;
    return;
  }

  container.innerHTML = `
    <table>
      <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Amount</th><th>Remove</th></tr></thead>
      <tbody>${cart.map(item => {
        const p = products.find(x => x.id === item.id);
        if (!p) return "";
        return `<tr>
          <td>${p.name}</td>
          <td>${money(p.price)}</td>
          <td><button class="qty-btn" onclick="changeQty(${p.id},-1)">−</button>
          ${item.qty}
          <button class="qty-btn" onclick="changeQty(${p.id},1)">+</button></td>
          <td>${money(p.price * item.qty)}</td>
          <td><button class="qty-btn" onclick="removeItem(${p.id})">✖</button></td>
        </tr>`;
      }).join("")}</tbody>
    </table>
    ${billSummary(getTotals())}
    <a class="btn" href="billing.html">Proceed to Billing</a>
    <a class="btn orange" href="index.html">Continue Shopping</a>`;
}

function renderBilling() {
  const el = document.getElementById("billing-content");
  if (!el) return;

  if (!getCart().length) {
    el.innerHTML = `<p>Your cart is empty.</p><a class="btn" href="index.html">Shop Now</a>`;
    return;
  }

  el.innerHTML = `
    <h2>Order Bill 🧾</h2>
    ${billSummary(getTotals())}
    <p class="notice">10% discount for orders of ₹1,000 or more. Tax is an illustrative 5%.</p>
    <a class="btn" href="checkout.html">Continue to Checkout</a>
    <a class="btn orange" href="cart.html">Back to Cart</a>`;
}

function checkout() {
  const form = document.getElementById("checkout-form");
  if (!form) return;

  form.addEventListener("submit", function(event) {
    event.preventDefault();

    if (!getCart().length) {
      alert("Your cart is empty!");
      location.href = "index.html";
      return;
    }

    const customer = {
      name: document.getElementById("customer-name").value.trim(),
      phone: document.getElementById("customer-phone").value.trim(),
      address: document.getElementById("customer-address").value.trim(),
      total: getTotals().total,
      orderId: "PP" + Date.now().toString().slice(-8)
    };

    localStorage.setItem("petCustomer", JSON.stringify(customer));
    saveCart([]);
    location.href = "welcome.html";
  });
}

function renderWelcome() {
  const el = document.getElementById("welcome-content");
  if (!el) return;

  const customer = read("petCustomer");

  if (!customer.name) {
    el.innerHTML = `
      <h1>Welcome to Pet Paradise! 🐾</h1>
      <p>Thank you for visiting our pet shop.</p>
      <a class="btn" href="index.html">Start Shopping</a>`;
    return;
  }

  el.innerHTML = `
    <div style="font-size:60px">🎉🐾</div>
    <h1>Thank You, ${customer.name}!</h1>
    <h2>Your order has been placed successfully!</h2>
    <div class="notice">
      <p>Order ID: ${customer.orderId}</p>
      <p>Customer: ${customer.name}</p>
      <p>Delivery Address: ${customer.address}</p>
      <h2>Final Bill: ${money(customer.total)}</h2>
    </div>
    <p>Thank you for shopping with Pet Paradise ❤️</p>
    <a class="btn" href="index.html">Back to Home</a>`;
}

document.addEventListener("DOMContentLoaded", function() {
  const page = document.body.dataset.page;

  if (["all","dogs","cats","birds","food","accessories"].includes(page)) {
    renderProducts(page);
  }

  renderCart();
  renderBilling();
  checkout();
  renderWelcome();
});