
const BASE_API = "http://localhost:5221";
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch(`${BASE_API}/api/admin/yeu-cau-chuyen-khoan`);
    const list = await res.json();
    renderTable(list);

    // Lấy lịch sử chuyển khoản
    const resLichSu = await fetch(`${BASE_API}/api/admin/lich-su-chuyen-khoan`);
    const lichSuList = await resLichSu.json();
    renderLichSuTable(lichSuList);
  } catch (err) {
    console.error("Lỗi tải yêu cầu:", err);
  }
});

function renderTable(list) {
  const tbody = document.getElementById("yeuCauTableBody");

  tbody.innerHTML = "";

  if (list.length === 0) {
    tbody.innerHTML = "<tr><td colspan='6'>Không có yêu cầu nào đang chờ xử lý.</td></tr>";
    return;
  }

  list.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.hoTen}</td>
      <td>${item.email}</td>
      <td>${item.tenGoi}</td>
      <td><code>${item.noiDungChuyenKhoan}</code></td>
      <td>${new Date(item.ngayTao).toLocaleString()}</td>
      <td>
        <button onclick="duyet(${item.id})">✅ Duyệt</button>
        <button onclick="tuChoi(${item.id})">❌ Từ chối</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function renderLichSuTable(lichSuList) {
  const tbodyLichSu = document.getElementById("lichSuTableBody");

  tbodyLichSu.innerHTML = "";

  if (lichSuList.length === 0) {
    tbodyLichSu.innerHTML = "<tr><td colspan='5'>Không có lịch sử chuyển khoản nào.</td></tr>";
    return;
  }

  lichSuList.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.hoTen}</td>
      <td>${item.email}</td>
      <td>${item.tenGoi}</td>
      <td><code>${item.noiDungChuyenKhoan}</code></td>
      <td>${new Date(item.ngayTao).toLocaleString()}</td>
    `;
    tbodyLichSu.appendChild(row);
  });
}

function duyet(id) {
  if (!confirm("Bạn chắc chắn muốn duyệt yêu cầu này?")) return;
  fetch(`${BASE_API}/api/admin/duyet-chuyen-khoan/${id}`, {
    method: "POST"
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || "Đã duyệt thành công.");
      location.reload();
    })
    .catch(err => alert("Lỗi duyệt: " + err));
}

function tuChoi(id) {
  if (!confirm("Bạn chắc chắn muốn từ chối yêu cầu này?")) return;
  fetch(`${BASE_API}/api/admin/tu-choi-chuyen-khoan/${id}`, {
    method: "POST"
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || "Đã từ chối yêu cầu.");
      location.reload();
    })
    .catch(err => alert("Lỗi từ chối: " + err));
}

document.getElementById("logoutLink")?.addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "../index.html";
});
