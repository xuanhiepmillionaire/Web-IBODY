function thuToText(thu) {
  const mapping = {
    0: "Chủ nhật",
    1: "Thứ 2",
    2: "Thứ 3",
    3: "Thứ 4",
    4: "Thứ 5",
    5: "Thứ 6",
    6: "Thứ 7"
  };
  return mapping[thu] || `Thứ ${thu}`;
}


const BASE_API = "http://localhost:5221";
document.addEventListener("DOMContentLoaded", async () => {
   const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.taiKhoanId || !user.roles.includes("chuyen_gia")) {
    alert("Bạn cần đăng nhập với tài khoản chuyên gia.");
    return (window.location.href = "../index.html");
  }

  const taiKhoanId = user.taiKhoanId;
  let chuyenGiaId = null;

    const toggleBtn = document.getElementById("toggleSidebarBtn");
    const sidebar = document.getElementById("sidebar");
    const content = document.getElementById("mainContent");

    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
      sidebar.classList.toggle("expanded");
      content.classList.toggle("collapsed");
      content.classList.toggle("expanded");
    });

  // 1. Lấy thông tin chuyên gia
  async function loadThongTinChuyenGia() {
    try {
      const res = await fetch(`${BASE_API}/api/chuyen-gia/thongTin/${taiKhoanId}`);
      const data = await res.json();
      document.getElementById('expertAvatar').src =data.avatarUrl ? `http://localhost:5221${data.avatarUrl}` : "../images/user.png";
      document.getElementById("expertName").textContent = data.hoTen;
      document.getElementById("expertSpecialty").textContent = data.chuyenMon;
      document.getElementById("expertIntro").textContent = data.gioiThieu;
      chuyenGiaId = data.id;
    } catch (err) {
      console.error("Lỗi tải thông tin chuyên gia:", err);
    }
  }

  // 2. Thu nhập & lịch sử rút lương
  async function loadThuNhap() {
    try {
      const res = await fetch(`${BASE_API}/api/chuyen-gia/nhan-luong/${taiKhoanId}`);
      const data = await res.json();
      document.getElementById("totalCa").textContent = data.tongCa;
      document.getElementById("donGia").textContent = `${data.donGia.toLocaleString()}đ`;
      document.getElementById("totalIncome").textContent = `${data.tongTien.toLocaleString()}đ`;

      const salaryList = document.getElementById("salaryHistory");
      salaryList.innerHTML = "";
      if (data.lichSuNhanLuong.length === 0) {
        salaryList.innerHTML = "<li>Chưa có yêu cầu rút lương nào.</li>";
      } else {
        data.lichSuNhanLuong.forEach(item => {
          const li = document.createElement("li");
          li.textContent = `#${item.id} - ${item.soCa} ca - ${item.soTien.toLocaleString()}đ - ${new Date(item.ngayTao).toLocaleDateString()} (${item.trangThai})`;
          salaryList.appendChild(li);
        });
      }
    } catch (err) {
      console.error("Lỗi tải thu nhập:", err);
    }
  }

  document.getElementById("withdrawRequestBtn").addEventListener("click", async () => {
    try {
      const res = await fetch(`${BASE_API}/api/chuyen-gia/gui-yeu-cau-nhan-luong`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taiKhoanId)
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        loadThuNhap();
      } else {
        alert(data.message || "Lỗi gửi yêu cầu.");
      }
    } catch (err) {
      console.error("Lỗi gửi yêu cầu nhận lương:", err);
    }
  });

  // 3. Lịch tư vấn sắp tới
  async function loadLichHenSắpTới() {
    try {
      const res = await fetch(`${BASE_API}/api/lich-hen/chuyen-gia/${chuyenGiaId}?taiKhoanId=${taiKhoanId}&trangThai=da_dien_ra`);
      const data = await res.json();
      const container = document.getElementById("upcomingSchedule");
      container.innerHTML = "";

      if (data.length === 0) {
        container.innerHTML = "<p>Không có lịch tư vấn nào sắp tới.</p>";
      } else {
        data.forEach(lh => {
          const div = document.createElement("div");
          div.innerHTML = `🕒 ${new Date(lh.thoiGianBatDau).toLocaleString()} - ${lh.hinhThuc} - Người đặt: ${lh.nguoiDatLich.hoTen}`;
          container.appendChild(div);
        });
      }
    } catch (err) {
      console.error("Lỗi tải lịch hẹn:", err);
    }
  }

  // 4. Đánh giá từ khách hàng
  async function loadDanhGia() {
    try {
      const res = await fetch(`${BASE_API}/api/chuyen-gia/danhGia/${taiKhoanId}`);
      const data = await res.json();
      const reviewList = document.getElementById("reviewList");
      reviewList.innerHTML = "";

      if (data.length === 0) {
        reviewList.innerHTML = "<p>Chưa có đánh giá nào.</p>";
        document.getElementById("avgRating").textContent = "0 / 5";
      } else {
        let total = 0;
        data.forEach(dg => {
          total += dg.diemSo;
          const p = document.createElement("p");
          p.innerHTML = `⭐ ${dg.diemSo} - "${dg.nhanXet}"<br>👤 ${dg.hoTenNguoiDung} (${new Date(dg.thoiGianTuvan).toLocaleDateString()})`;
          reviewList.appendChild(p);
        });
        document.getElementById("avgRating").textContent = `${(total / data.length).toFixed(1)} / 5`;
      }
    } catch (err) {
      console.error("Lỗi tải đánh giá:", err);
    }
  }

  // 5. Khách hàng đã tư vấn
  async function loadKhachHangTungTuVan() {
    try {
      const res = await fetch(`${BASE_API}/api/chuyen-gia/khach-hang-tu-van/${chuyenGiaId}`);
      const data = await res.json();
      const list = document.getElementById("clientList");
      list.innerHTML = "";

      if (data.length === 0) {
        list.innerHTML = "<li>Chưa có khách hàng nào đã tư vấn.</li>";
      } else {
        data.forEach(kh => {
          const li = document.createElement("li");
          li.innerHTML = `👤 ${kh.hoTenKhachHang} (${new Date(kh.gioBatDau).toLocaleString()}) - ${kh.hinhThuc}`;
          list.appendChild(li);
        });
      }
    } catch (err) {
      console.error("Lỗi tải khách hàng:", err);
    }
  }

  // 6. Thời gian rảnh
  async function loadThoiGianRanh() {
    try {
      const res = await fetch(`${BASE_API}/api/thoi-gian-ranh/chuyen-gia/${chuyenGiaId}`);
      const data = await res.json();
      const list = document.getElementById("freeTimeList");
      list.innerHTML = "";

      if (data.length === 0) {
        list.innerHTML = "<li>Chưa khai báo thời gian rảnh.</li>";
      } else {
        data.forEach(slot => {
          const li = document.createElement("li");
          li.textContent = `${thuToText(slot.thuTrongTuan)}: ${slot.tu} - ${slot.den}`;
          list.appendChild(li);
        });
      }
    } catch (err) {
      console.error("Lỗi tải thời gian rảnh:", err);
    }
  }

  // Gọi toàn bộ khi trang tải
  await loadThongTinChuyenGia();
  await loadThuNhap();
  await loadLichHenSắpTới();
  await loadDanhGia();
  await loadKhachHangTungTuVan();
  await loadThoiGianRanh();
});


// Toggle dark/light mode
const themeBtn = document.getElementById("toggleThemeBtn");
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  // Đổi icon
  if (document.body.classList.contains("dark-mode")) {
    themeBtn.textContent = "☀️";
  } else {
    themeBtn.textContent = "🌙";
  }
});


function logout() {
  localStorage.removeItem("user");
  alert("Đăng xuất thành công!");
  window.location.href = "../index.html";
}
