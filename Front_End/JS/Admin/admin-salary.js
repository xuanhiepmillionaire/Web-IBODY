const BASE_API = "http://localhost:5221";

document.addEventListener("DOMContentLoaded", () => {
  fetch(`${BASE_API}/api/admin/yeu-cau-nhan-luong`)
    .then(async res => {
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch {
        throw new Error("Phản hồi không hợp lệ từ server: " + text);
      }
    })
    .then(data => renderTable(data))
    .catch(err => console.error("Lỗi load dữ liệu:", err));
});

function renderTable(list) {
  const tbody = document.querySelector("#salaryTable tbody");
  tbody.innerHTML = "";

  list.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.hoTen}</td>
      <td>${item.email}</td>
      <td>${item.soCa}</td>
      <td>${item.soTien.toLocaleString()} VNĐ</td>
      <td>${new Date(item.ngayTao).toLocaleString()}</td>
      <td>${item.trangThai}</td>
      <td>${item.soTaiKhoan || "Chưa cập nhật"}</td>
      <td>${item.tenNganHang || "Chưa cập nhật"}</td>
      <td>
        ${item.trangThai === "dang_cho" ? `
          <button onclick="duyet(${item.id})">✅ Duyệt</button>
          <button onclick="tuChoi(${item.id})">❌ Từ chối</button>
        ` : "-"}
      </td>
    `;
    tbody.appendChild(row);
  });
}

function duyet(id) {
  if (!confirm("Bạn có chắc chắn muốn duyệt yêu cầu này?")) return;
  fetch(`${BASE_API}/api/admin/duyet-yeu-cau-luong/${id}`, { method: "POST" })
    .then(res => res.json())
    .then(data => {
      alert(data.message || "Đã duyệt thành công");
      location.reload();
    });
}

function tuChoi(id) {
  if (!confirm("Bạn có chắc chắn muốn từ chối yêu cầu này?")) return;
  fetch(`${BASE_API}/api/admin/tu-choi-yeu-cau-luong/${id}`, { method: "POST" })
    .then(res => res.json())
    .then(data => {
      alert(data.message || "Đã từ chối yêu cầu");
      location.reload();
    });
}
document.getElementById("logoutLink")?.addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "../index.html";
});