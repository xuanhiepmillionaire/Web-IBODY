const user = JSON.parse(localStorage.getItem("user"));

if (!user || !Array.isArray(user.roles) || !user.roles.includes("quan_tri")) {
  alert("Bạn không có quyền truy cập trang quản trị.");
  window.location.href = "index.html";
}

async function loadDanhGia() {
  try {
    const res = await fetch("http://localhost:5221/api/admin/danhGiaCuaChuyenGia");
    const data = await res.json();
    const list = data.data || data;

    const tbody = document.getElementById("danhGiaTableBody");
    tbody.innerHTML = "";

    list.forEach(item => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.id}</td>
        <td>${item.nguoiDanhGia}</td>
        <td>${item.emailNguoiDung}</td>
        <td>${item.chuyenGia}</td>
        <td>${item.emailChuyenGia}</td>
        <td>${item.diemSo}</td>
        <td>${item.nhanXet}</td>
        <td><button onclick="xoaDanhGia(${item.id})" style="color: red;">Xoá</button></td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Lỗi tải đánh giá:", err);
  }
}

async function xoaDanhGia(id) {
  if (confirm("Bạn có chắc muốn xoá đánh giá này?")) {
    await fetch(`http://localhost:5221/api/admin/xoaDanhGia/${id}`, {
      method: "DELETE",
    });
    loadDanhGia();
  }
}

document.addEventListener("DOMContentLoaded", loadDanhGia);

document.getElementById("logoutLink")?.addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "../index.html";
});
