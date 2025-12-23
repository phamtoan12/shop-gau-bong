function toggleForm(id) {
  document.getElementById(id).classList.toggle('hidden');
}

// Sản phẩm
let products = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [
  { 
    id: 1, 
    name: "Gấu Teddy Nâu Giá Rẻ", 
    price: 199000, 
    desc: "Gấu nâu dễ thương với price tag, quà tặng giá tốt.", 
    img: "https://m.media-amazon.com/images/I/41ICC+MoswL.jpg"  // Amazon 3-pack teddy
  },
  { 
    id: 2, 
    name: "Gấu Với Price Tag Trắng", 
    price: 250000, 
    desc: "Gấu trắng kèm price tag và hộp quà, đẹp lung linh.", 
    img: "https://media.istockphoto.com/id/667920490/photo/cute-teddy-bear-with-price-tag-and-beautiful-gift-on-the-wonderful-white-background.jpg?s=1024x1024&w=is&k=20&c=-JEjRAZXGV4hryBgoEp1MpXWSbySn3rDfEyNuO9KfAU="  // iStock price tag
  },
  { 
    id: 3, 
    name: "Gấu Khổng Lồ Nâu", 
    price: 450000, 
    desc: "Gấu lớn 59 inch với price tag rõ ràng.", 
    img: "https://i.ebayimg.com/images/g/BC4AAOSwhL1mgi2k/s-l400.jpg"  // eBay giant teddy
  },
  { 
    id: 4, 
    name: "Gấu Cặp Đôi Dễ Thương", 
    price: 350000, 
    desc: "Cặp gấu ôm nhau, kèm price tag.", 
    img: "https://i.ebayimg.com/00/s/MTEwN1gxNTk5/z/cTgAAOSwkv5jgOjb/$_3.JPG"  // eBay couple teddy
  },
  { 
    id: 5, 
    name: "Gấu Trắng Với Price Tag", 
    price: 299000, 
    desc: "Gấu trắng mềm mại kèm price tag nổi bật.", 
    img: "https://live.staticflickr.com/5058/5442006498_79109136be.jpg"  // Clearance teddy with tag
  }
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
// Giỏ hàng đơn giản
function addToCart(id) {
  if (!localStorage.getItem("currentUser")) return alert("Vui lòng đăng nhập để mua hàng!");
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Đã thêm vào giỏ hàng!");
}

// Sửa hàm showProducts để thêm nút "Mua hàng"
function showProducts() {
  const container = document.getElementById("product-list");
  if (!container) return;
  container.innerHTML = "";
  products.forEach(p => {
    container.innerHTML += `
      <div class="product">
        <img src="${p.img}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p><strong>${p.price.toLocaleString()} VND</strong></p>
        <button onclick="viewDetail(${p.id})">Chi tiết</button>
        <button onclick="addToCart(${p.id})">Thêm vào giỏ</button>
      </div>
    `;
  });
}// Thêm trường stock (số lượng tồn kho) cho sản phẩm
// Nếu chưa có stock, mặc định 50 con mỗi loại
products.forEach(p => {
  if (p.stock === undefined) p.stock = 50 + Math.floor(Math.random() * 50); // 50-100 con
});
localStorage.setItem("products", JSON.stringify(products));

// Load trang tồn kho (chỉ admin)
function loadInventory() {
  const user = localStorage.getItem("currentUser");
  if (!user || JSON.parse(user).role !== "admin") {
    alert("Bạn không có quyền xem trang này!");
    location.href = "index.html";
    return;
  }

  const container = document.getElementById("inventory-list");
  container.innerHTML = "";
  products.forEach(p => {
    container.innerHTML += `
      <div class="product">
        <img src="${p.img}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>Giá: ${p.price.toLocaleString()} VND</p>
        <p><strong>Tồn kho: ${p.stock} con</strong></p>
        <button onclick="updateStock(${p.id}, 10)">+10 con</button>
        <button onclick="updateStock(${p.id}, -10)">-10 con</button>
      </div>
    `;
  });
}

// Cập nhật số lượng tồn kho
function updateStock(id, change) {
  const p = products.find(x => x.id === id);
  if (p) {
    p.stock += change;
    if (p.stock < 0) p.stock = 0;
    localStorage.setItem("products", JSON.stringify(products));
    alert(`Cập nhật tồn kho ${p.name}: ${p.stock} con`);
    loadInventory();
    if (typeof showProducts === "function") showProducts(); // Cập nhật trang chủ nếu cần
  }
}