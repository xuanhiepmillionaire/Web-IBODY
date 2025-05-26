document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const billId = urlParams.get("id");

  if (!billId) {
    alert("Thiếu mã giao dịch lương.");
    return;
  }

  try {
    const res = await fetch(`http://localhost:5221/api/chuyen-gia/chi-tiet-luong/${billId}`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Không thể tải hóa đơn.");

    document.getElementById("soCa").innerText = data.soCa;
    document.getElementById("donGia").innerText = `${data.donGia.toLocaleString()}₫`;
    document.getElementById("tongTien").innerText = `${data.soTien.toLocaleString()}₫`;
    document.getElementById("ngayTao").innerText = new Date(data.ngayTao).toLocaleDateString();
    document.getElementById("trangThai").innerText = data.trangThai;
  } catch (err) {
    alert("❌ Lỗi: " + err.message);
  }
});
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

function logout() {
  localStorage.removeItem("user");
  alert("Đăng xuất thành công!");
  window.location.href = "../index.html";
}