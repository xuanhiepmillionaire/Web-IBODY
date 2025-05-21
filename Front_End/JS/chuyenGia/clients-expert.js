window.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.taiKhoanId || !user.roles.includes("chuyen_gia")) {
    alert("Bạn không có quyền truy cập trang này.");
    return (window.location.href = "../index.html");
  }
  loadClients();
});

async function loadClients() {
  const localUser = JSON.parse(localStorage.getItem("user"));
  const taiKhoanId = localUser.taiKhoanId;

  try {
    // Lấy chuyenGiaId từ taiKhoanId
    const infoRes = await fetch(`http://localhost:5221/api/chuyen-gia/thongTin/${taiKhoanId}`);
    if (!infoRes.ok) throw new Error("Không tìm thấy chuyên gia");

    const chuyenGia = await infoRes.json();
    const chuyenGiaId = chuyenGia.id;

    // Lấy danh sách khách hàng
    const res = await fetch(`http://localhost:5221/api/chuyen-gia/khach-hang-tu-van/${chuyenGiaId}`);
    if (!res.ok) throw new Error("Không thể lấy danh sách khách hàng");

    const list = await res.json();
    renderClients(list);

  } catch (err) {
    console.error("loadClients() failed:", err);
    document.getElementById("clientsList").innerHTML = `
      <tr><td colspan="4" style="color:red;">Lỗi: ${err.message}</td></tr>
    `;
  }
}

function renderClients(list) {
  const tbody = document.getElementById("clientsList");
  tbody.innerHTML = "";

  if (list.length === 0) {
    tbody.innerHTML = "<tr><td colspan='4'>Không có khách hàng nào.</td></tr>";
    return;
  }

  const clientMap = new Map();

  list.forEach(lh => {
    const key = lh.email;
    if (!clientMap.has(key)) {
      clientMap.set(key, {
        hoTen: lh.hoTenKhachHang,
        email: lh.email,
        soLan: 1,
        ganNhat: lh.gioBatDau
      });
    } else {
      const old = clientMap.get(key);
      old.soLan += 1;
      if (new Date(lh.gioBatDau) > new Date(old.ganNhat)) {
        old.ganNhat = lh.gioBatDau;
      }
    }
  });

  [...clientMap.values()].forEach(client => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${client.hoTen}</td>
      <td>${client.email}</td>
      <td>${client.soLan}</td>
      <td>${formatDate(client.ganNhat)}</td>
    `;
    tbody.appendChild(tr);
  });
}

function formatDate(raw) {
  const date = new Date(raw);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year} ${hour}:${minute}`;
}

// Tìm kiếm khách hàng theo tên (có thể mở rộng theo email)
function searchClients() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const rows = document.querySelectorAll("#clientsList tr");

  rows.forEach(row => {
    const nameCell = row.querySelector("td");
    if (nameCell) {
      const name = nameCell.textContent.toLowerCase();
      if (name.includes(keyword)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    }
  });
}

document.getElementById("searchInput").addEventListener("input", searchClients);

function logout() {
  localStorage.removeItem("user");
  alert("Đăng xuất thành công!");
  window.location.href = "../index.html";
}

document.getElementById("toggleSidebarBtn").onclick = () => {
      document.getElementById("sidebar").classList.toggle("collapsed");
      document.getElementById("sidebar").classList.toggle("expanded");
      document.getElementById("mainContent").classList.toggle("collapsed");
      document.getElementById("mainContent").classList.toggle("expanded");
    };

    document.getElementById("toggleThemeBtn").onclick = () => {
      document.body.classList.toggle("dark-mode");
      document.getElementById("toggleThemeBtn").textContent =
        document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
    };