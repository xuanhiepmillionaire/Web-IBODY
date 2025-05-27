const user = JSON.parse(localStorage.getItem("user"));
const currentUserId = user?.taiKhoanId;
if (!user || !Array.isArray(user.roles) || !user.roles.includes("quan_tri")) {
  alert("Bạn không có quyền truy cập trang quản trị.");
  window.location.href = "index.html";
}

async function loadAccounts() {
  try {
    const res = await fetch("http://localhost:5221/api/admin/accounts");
    const data = await res.json();
    const accounts = data.data || [];

    const tbody = document.getElementById("userTableBody");
    tbody.innerHTML = "";

    accounts.forEach(account => {
    const isSelf = account.id === currentUserId;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${account.id}</td>
      <td>${account.email}</td>
      <td>${account.vaiTro}</td>
      <td>${account.trangThai}</td>
      <td>${account.fullName}</td>
      <td>
        ${isSelf ? '' : `<button onclick="khoaTaiKhoan(${account.id})">Khóa</button>`}
        ${isSelf ? '' : `<button onclick="moKhoaTaiKhoan(${account.id})">Mở</button>`}
        ${isSelf ? '' : `<button onclick="xoaTaiKhoan(${account.id})" style="color:red;">Xoá</button>`}
      </td>
    `;
    tbody.appendChild(tr);
  });
  } catch (err) {
    console.error("Lỗi tải tài khoản:", err);
  }
}


async function moKhoaTaiKhoan(id) {
  await fetch(`http://localhost:5221/api/admin/mo-khoa-tai-khoan/${id}`, { method: "POST" });
  loadAccounts();
}

document.addEventListener("DOMContentLoaded", loadAccounts);

async function xoaTaiKhoan(id) {
  if (id === currentUserId) return alert("Bạn không thể xoá tài khoản của chính mình.");
  if (confirm("Bạn có chắc muốn xoá tài khoản này?")) {
    await fetch(`http://localhost:5221/api/admin/account/${id}`, { method: "DELETE" });
    loadAccounts();
  }
}

async function khoaTaiKhoan(id) {
  if (id === currentUserId) return alert("Bạn không thể khóa tài khoản của chính mình.");
  await fetch(`http://localhost:5221/api/admin/khoa-tai-khoan/${id}`, { method: "POST" });
  loadAccounts();
}


document.getElementById("logoutLink")?.addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "../index.html";
});
