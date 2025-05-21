document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const goiId = urlParams.get("id");

  if (!goiId) {
    alert("Thiếu thông tin gói đăng ký.");
    return;
  }

  try {
    const res = await fetch(`http://localhost:5221/api/user/goi-dang-ky/${goiId}`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Không tìm thấy thông tin.");

    document.getElementById("goiTen").innerText = data.tenGoi;
    document.getElementById("gia").innerText = `${data.gia.toLocaleString()}₫`;
    document.getElementById("ngay").innerText = `${new Date(data.ngayBatDau).toLocaleDateString()} - ${new Date(data.ngayKetThuc).toLocaleDateString()}`;
    document.getElementById("soLuot").innerText = data.soLuot;
    document.getElementById("conLai").innerText = data.soLuotConLai;
    document.getElementById("trangThai").innerText = data.trangThai === "con_hieu_luc" ? "Đang hoạt động" : "Hết hiệu lực";
    document.getElementById("emailNguoiDung").innerText = data.nguoiDung.email;

  } catch (err) {
    alert("❌ Lỗi tải thông tin: " + err.message);
  }
});
