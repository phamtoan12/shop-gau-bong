function toggleForm(id) {
  document.getElementById(id).classList.toggle('hidden');
}

// Sản phẩm
let products = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [
  { id: 1, name: "Gấu Teddy Nâu", price: 250000, desc: "Mềm mại, cao 40cm", img: "https://loremflickr.com/300/300/teddybear?random=1" },
  { id: 2, name: "Gấu Hồng", price: 300000, desc: "Dễ thương với trái tim", img: "https://loremflickr.com/300/300/teddybear?random=2" },
  { id: 3, name: "Gấu Khổng Lồ", price: 500000, desc: "Cao 1m, ôm thích", img: "https://loremflickr.com/300/300/teddybear?random=3" }
];
localStorage.setItem("products", JSON.stringify(products));

// Hiển thị sản phẩm
function showProducts() {
  const container = document.getElementById("product-list");
  if (!container) return;
  container.innerHTML = "";
  products.forEach(p => {
    container.innerHTML += `
      <div class="product">
        <img src="${p.img}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>${p.price.toLocaleString()} VND</p>
        <button onclick="viewDetail(${p.id})">Chi tiết</button>
      </div>
    `;
  });
}

// Chi tiết sản phẩm
function viewDetail(id) {
  const p = products.find(x => x.id === id);
  if (p) alert(`Tên: ${p.name}\nGiá: ${p.price.toLocaleString()} VND\nMô tả: ${p.desc}`);
}

// Đăng ký
function register() {
  const username = document.getElementById("reg-username").value;
  const password = document.getElementById("reg-password").value;
  if (!username || !password) return alert("Nhập đầy đủ!");
  let users = JSON.parse(localStorage.getItem("users") || "[]");
  if (users.find(u => u.username === username)) return alert("Tài khoản tồn tại!");
  users.push({ username, password, role: "user" });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Đăng ký thành công!");
  toggleForm('register-form');
}

// Đăng nhập
function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;
  let users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return alert("Sai thông tin!");
  localStorage.setItem("currentUser", JSON.stringify(user));
  alert("Đăng nhập thành công!");
  toggleForm('login-form');
  location.reload();
}

// Kiểm tra đăng nhập
function checkLogin() {
  const user = localStorage.getItem("currentUser");
  if (user) {
    document.getElementById("user-info").innerText = "Xin chào: " + JSON.parse(user).username;
    document.getElementById("logout-btn").classList.remove("hidden");
  }
}

// Đăng xuất
function logout() {
  localStorage.removeItem("currentUser");
  alert("Đăng xuất!");
  location.reload();
}

// Quên mật khẩu
function forgotPassword() {
  const username = prompt("Tên đăng nhập:");
  let users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(u => u.username === username);
  if (user) {
    const newPass = prompt("Mật khẩu mới:");
    user.password = newPass;
    localStorage.setItem("users", JSON.stringify(users));
    alert("Reset thành công!");
  } else {
    alert("Không tìm thấy!");
  }
}

// Load admin
function loadAdmin() {
  const user = localStorage.getItem("currentUser");
  if (!user || JSON.parse(user).role !== "admin") {
    alert("Bạn không phải admin!");
    location.href = "index.html";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users") || "[]");
  if (!users.find(u => u.username === "admin")) {
    users.push({ username: "admin", password: "123", role: "admin" });
    localStorage.setItem("users", JSON.stringify(users));
  }

  showAdminProducts();
  showCustomers();
}

// Hiển thị sản phẩm admin
function showAdminProducts() {
  const container = document.getElementById("admin-products");
  if (!container) return;
  container.innerHTML = "";
  products.forEach(p => {
    container.innerHTML += `
      <div class="product">
        <img src="${p.img}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>${p.price.toLocaleString()} VND</p>
        <button onclick="editProduct(${p.id})">Sửa</button>
        <button onclick="deleteProduct(${p.id})">Xóa</button>
      </div>
    `;
  });
}

// Thêm sản phẩm
function addProduct() {
  const name = document.getElementById("p-name").value;
  const price = parseInt(document.getElementById("p-price").value);
  const desc = document.getElementById("p-desc").value;
  const img = document.getElementById("p-img").value || "https://loremflickr.com/300/300/teddybear";
  if (!name || !price) return alert("Nhập tên và giá!");
  products.push({ id: Date.now(), name, price, desc, img });
  localStorage.setItem("products", JSON.stringify(products));
  alert("Thêm thành công!");
  showAdminProducts();
  if (typeof showProducts === "function") showProducts();
}

// Sửa sản phẩm
function editProduct(id) {
  const p = products.find(x => x.id === id);
  if (p) {
    const newName = prompt("Tên mới:", p.name);
    const newPrice = prompt("Giá mới:", p.price);
    const newDesc = prompt("Mô tả mới:", p.desc);
    const newImg = prompt("Hình mới:", p.img);
    if (newName) p.name = newName;
    if (newPrice) p.price = parseInt(newPrice);
    if (newDesc) p.desc = newDesc;
    if (newImg) p.img = newImg;
    localStorage.setItem("products", JSON.stringify(products));
    alert("Sửa thành công!");
    showAdminProducts();
    if (typeof showProducts === "function") showProducts();
  }
}

// Xóa sản phẩm
function deleteProduct(id) {
  if (confirm("Xóa?")) {
    products = products.filter(p => p.id !== id);
    localStorage.setItem("products", JSON.stringify(products));
    showAdminProducts();
    if (typeof showProducts === "function") showProducts();
  }
}

// Danh sách khách hàng
function showCustomers() {
  const container = document.getElementById("customer-list");
  if (!container) return;
  const users = JSON.parse(localStorage.getItem("users") || "[]").filter(u => u.role === "user");
  container.innerHTML = "";
  if (users.length === 0) container.innerHTML = "<p>Chưa có khách hàng</p>";
  users.forEach(u => {
    container.innerHTML += `
      <div class="customer">
        <p>Tên: ${u.username}</p>
        <p>Mật khẩu (ẩn): ****</p>
      </div>
    `;
  });
}