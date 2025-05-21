const user = JSON.parse(localStorage.getItem("user"));

document.addEventListener("DOMContentLoaded", async () => {
  if (!user || !user.taiKhoanId || !user.roles.includes("chuyen_gia")) {
    alert("Bạn không có quyền truy cập trang này.");
    return (window.location.href = "../index.html");
  }

  const summaryBox = document.getElementById("summaryBox");
  const tableBody = document.getElementById("lichSuTable");
  const tongCaSpan = document.getElementById("tongCa");
  const donGiaSpan = document.getElementById("donGia");
  const tongTienSpan = document.getElementById("tongTien");
  const guiYeuCauBtn = document.getElementById("guiYeuCauBtn");
  const thongBaoYeuCau = document.getElementById("thongBaoYeuCau");

  try {
    const res = await fetch(`http://localhost:5221/api/chuyen-gia/nhan-luong/${user.taiKhoanId}`);
    const data = await res.json();

    tongCaSpan.innerText = data.tongCa;
    donGiaSpan.innerText = data.donGia.toLocaleString();
    tongTienSpan.innerText = data.tongTien.toLocaleString();

    // Gửi yêu cầu lương
    if (data.tongCa > 0) {
      guiYeuCauBtn.disabled = false;
      guiYeuCauBtn.onclick = async () => {
        try {
          const res2 = await fetch(`http://localhost:5221/api/chuyen-gia/gui-yeu-cau-nhan-luong`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ taiKhoanId: user.taiKhoanId })
          });
          const resData = await res2.json();

          if (!res2.ok) throw new Error(resData.message || "Gửi yêu cầu thất bại.");

          thongBaoYeuCau.innerText = "✅ Đã gửi yêu cầu nhận lương. Vui lòng chờ admin duyệt.";
          guiYeuCauBtn.disabled = true;
        } catch (err) {
          thongBaoYeuCau.innerText = "❌ " + err.message;
          thongBaoYeuCau.style.color = "red";
        }
      };
    } else {
      guiYeuCauBtn.disabled = true;
    }

    // Hiển thị lịch sử yêu cầu lương
    tableBody.innerHTML = "";
    if (data.lichSuNhanLuong.length === 0) {
      tableBody.innerHTML = "<tr><td colspan='4'>Chưa có yêu cầu nào.</td></tr>";
    } else {
      data.lichSuNhanLuong.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><a href="salary-details.html?id=${item.id}">${new Date(item.ngayTao).toLocaleDateString()}</a></td>
          <td>${item.soCa}</td>
          <td>${item.soTien.toLocaleString()}₫</td>
          <td>${item.trangThai}</td>
        `;
        tableBody.appendChild(tr);
      });
    }
  } catch (err) {
    alert("Không thể tải dữ liệu: " + err.message);
  }
});

function logout() {
  localStorage.removeItem("user");
  alert("Đăng xuất thành công!");
  window.location.href = "../index.html";
}