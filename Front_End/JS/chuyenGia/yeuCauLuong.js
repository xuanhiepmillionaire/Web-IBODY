const BASE_API = "http://localhost:5221";
const user = JSON.parse(localStorage.getItem("user"));

document.addEventListener("DOMContentLoaded", async () => {
  if (!user?.taiKhoanId) return alert("Chưa đăng nhập.");

  const res = await fetch(`${BASE_API}/api/chuyen-gia/nhan-luong/${user.taiKhoanId}`);
  const data = await res.json();

  document.getElementById("expertName").textContent = data.hoTen || "Không rõ";
  document.getElementById("expertEmail").textContent = user.email;
  document.getElementById("bankAccount").textContent = data.soTaiKhoan || "Chưa cập nhật";
  document.getElementById("bankName").textContent = data.tenNganHang || "Chưa cập nhật";

  document.getElementById("totalCa").textContent = data.tongCa;
  document.getElementById("donGia").textContent = data.donGia.toLocaleString();
  document.getElementById("tongTien").textContent = data.tongTien.toLocaleString();

  const list = document.getElementById("listChiTietCa");

  // ✅ Tìm thời điểm nhận lương gần nhất
  let lastPaidDate = null;
  const lastApproved = data.lichSuNhanLuong.find(x => x.trangThai === "da_duyet");
  if (lastApproved) lastPaidDate = new Date(lastApproved.ngayTao);

  // ✅ Lọc các ca chưa được tính lương dựa theo ca.NgayTao
  const unpaidSessions = data.chiTietCa.filter(ca => {
    if (!ca.ngayTao) return true;
    const caThoiGianKetThuc = new Date(ca.thoiGianKetThuc);
    return !lastPaidDate || caThoiGianKetThuc > lastPaidDate;

  });

  unpaidSessions.forEach(ca => {
    const li = document.createElement("li");
    li.textContent = `${new Date(ca.thoiGianBatDau).toLocaleString()} → ${new Date(ca.thoiGianKetThuc).toLocaleTimeString()} | ${ca.tomTat}`;
    list.appendChild(li);
  });

  const historyBody = document.getElementById("lichSuLuongBody");
  data.lichSuNhanLuong.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${new Date(item.ngayTao).toLocaleDateString()}</td>
      <td>${item.soCa}</td>
      <td>${item.soTien.toLocaleString()} VNĐ</td>
      <td>${item.trangThai}</td>
    `;
    historyBody.appendChild(row);
  });

  // ✅ Gửi yêu cầu
  document.getElementById("guiYeuCauBtn").addEventListener("click", async () => {
    if (unpaidSessions.length === 0) {
      return alert("Không có ca tư vấn nào chưa được thanh toán.");
    }

    const confirmSend = confirm("Xác nhận gửi yêu cầu nhận lương?");
    if (!confirmSend) return;

    try {
      const res = await fetch(`${BASE_API}/api/chuyen-gia/gui-yeu-cau-nhan-luong`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user.taiKhoanId)
      });

      const text = await res.text();

      if (!res.ok) {
        alert(`Lỗi: ${text}`);
        return;
      }

      const result = JSON.parse(text);
      alert(result.message || "Gửi yêu cầu thành công.");
      location.reload();
    } catch (err) {
      console.error("Lỗi gửi yêu cầu:", err);
      alert("Có lỗi xảy ra khi gửi yêu cầu.");
    }
  });
});

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
