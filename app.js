const products = [
  {id:1,name:"Cappuccino",category:"coffee",price:3.50,image:"https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?auto=format&fit=crop&w=700&q=80",desc:"Espresso, steamed milk and rich foam."},
  {id:2,name:"Espresso",category:"coffee",price:2.50,image:"https://images.unsplash.com/photo-1510707577719-ae7c14805e32?auto=format&fit=crop&w=700&q=80",desc:"Strong, smooth and freshly brewed."},
  {id:3,name:"Iced Latte",category:"cold",price:4.00,image:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=80",desc:"Cold espresso with milk and ice."},
  {id:4,name:"Classic Burger",category:"food",price:6.50,image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80",desc:"Beef patty, cheese, lettuce and house sauce."},
  {id:5,name:"Chicken Sandwich",category:"food",price:5.75,image:"https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=700&q=80",desc:"Grilled chicken with fresh vegetables."},
  {id:6,name:"Chocolate Cake",category:"dessert",price:4.25,image:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80",desc:"Moist chocolate cake with creamy topping."},
  {id:7,name:"Cheesecake",category:"dessert",price:4.50,image:"https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=700&q=80",desc:"Creamy cheesecake with berry topping."},
  {id:8,name:"Fresh Lemonade",category:"cold",price:3.00,image:"https://images.unsplash.com/photo-1523677011781-c91d1bbe2f3f?auto=format&fit=crop&w=700&q=80",desc:"Fresh lemon, water and a little sweetness."},
  {id:9,name:"French Fries",category:"food",price:3.25,image:"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80",desc:"Crispy golden fries with house seasoning."}
];

let cart = JSON.parse(localStorage.getItem("cafeCart") || "[]");

const $ = s => document.querySelector(s);
const productsEl = $("#products");

function renderProducts(){
  const search = $("#searchInput").value.toLowerCase().trim();
  const category = $("#categoryFilter").value;
  const filtered = products.filter(p =>
    (category === "all" || p.category === category) &&
    (p.name.toLowerCase().includes(search) || p.desc.toLowerCase().includes(search))
  );
  productsEl.innerHTML = filtered.map(p => `
    <article class="card overflow-hidden">
      <img class="product-img" src="${p.image}" alt="${p.name}">
      <div class="p-5">
        <div class="flex justify-between gap-3">
          <h3 class="text-xl font-bold">${p.name}</h3>
          <span class="font-black text-coffee-700">$${p.price.toFixed(2)}</span>
        </div>
        <p class="text-stone-500 mt-2 text-sm">${p.desc}</p>
        <button class="btn-primary w-full mt-4 add-btn" data-id="${p.id}">Add to Cart</button>
      </div>
    </article>`).join("");
  $("#emptyProducts").classList.toggle("hidden", filtered.length !== 0);
}

function saveCart(){ localStorage.setItem("cafeCart", JSON.stringify(cart)); renderCart(); }

function addToCart(id){
  const item = cart.find(x => x.id === id);
  if(item) item.qty++;
  else cart.push({id,qty:1});
  saveCart(); showToast("Added to cart ✓");
}

function changeQty(id, delta){
  const item = cart.find(x => x.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) cart = cart.filter(x => x.id !== id);
  saveCart();
}

function renderCart(){
  const detailed = cart.map(c => ({...c, ...products.find(p => p.id === c.id)}));
  $("#cartItems").innerHTML = detailed.length ? detailed.map(i => `
    <div class="flex gap-3 items-center">
      <img src="${i.image}" class="w-16 h-16 rounded-xl object-cover">
      <div class="flex-1">
        <b>${i.name}</b><div class="text-sm text-stone-500">$${i.price.toFixed(2)} each</div>
        <div class="flex items-center gap-2 mt-2">
          <button class="px-2 border rounded" onclick="changeQty(${i.id},-1)">−</button>
          <span>${i.qty}</span>
          <button class="px-2 border rounded" onclick="changeQty(${i.id},1)">+</button>
        </div>
      </div>
      <b>$${(i.price*i.qty).toFixed(2)}</b>
    </div>`).join("") : '<p class="text-center text-stone-500 py-10">Your cart is empty.</p>';
  const total = detailed.reduce((s,i)=>s+i.price*i.qty,0);
  $("#cartTotal").textContent = total.toFixed(2);
  $("#cartCount").textContent = cart.reduce((s,i)=>s+i.qty,0);
}

function showToast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function openCart(){ $("#cartPanel").classList.remove("translate-x-full"); $("#overlay").classList.remove("hidden"); }
function closeCart(){ $("#cartPanel").classList.add("translate-x-full"); $("#overlay").classList.add("hidden"); }

productsEl.addEventListener("click", e => {
  const btn=e.target.closest(".add-btn");
  if(btn) addToCart(Number(btn.dataset.id));
});
$("#searchInput").addEventListener("input", renderProducts);
$("#categoryFilter").addEventListener("change", renderProducts);
$("#cartBtn").onclick=openCart; $("#closeCart").onclick=closeCart; $("#overlay").onclick=closeCart;
$("#clearCart").onclick=()=>{cart=[];saveCart();showToast("Cart cleared");};
$("#checkoutBtn").onclick=()=>{
  if(!cart.length) return showToast("Your cart is empty");
  alert("Demo checkout: thank you for your order!");
};
$("#mobileBtn").onclick=()=>$("#mobileNav").classList.toggle("hidden");
document.querySelectorAll("#mobileNav a").forEach(a=>a.onclick=()=>$("#mobileNav").classList.add("hidden"));

$("#themeBtn").onclick=()=>{
  document.documentElement.classList.toggle("dark");
  localStorage.setItem("cafeTheme", document.documentElement.classList.contains("dark") ? "dark":"light");
};
if(localStorage.getItem("cafeTheme")==="dark") document.documentElement.classList.add("dark");

$("#contactForm").addEventListener("submit", e=>{
  e.preventDefault();
  showToast("Message sent successfully ✓");
  e.target.reset();
});

$("#year").textContent = new Date().getFullYear();
renderProducts(); renderCart();
