document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("Bạn cần đăng nhập.");
    window.location.href = "index.html";
    return;
  }

  // ====== 1. Hiển thị tên người dùng ======
  const loginLink = document.getElementById("loginLink");
  const userMenu = document.getElementById("userMenu");
  const usernameDisplay = document.getElementById("usernameDisplay");

  if (loginLink && userMenu && usernameDisplay) {
    loginLink.style.display = "none";
    userMenu.style.display = "inline-block";
    usernameDisplay.innerText = user.fullName || user.username;
  }

  // ====== 2. Tải thông tin cá nhân ======
  async function loadThongTinCaNhan() {
    try {
      const res = await fetch(`http://localhost:5221/api/user/profile/${user.taiKhoanId}`);
      const data = await res.json();

      if (res.ok) {
        console.log("avatarUrl từ API:", data.avatarUrl);

        document.getElementById("infoHoTen").innerText = data.hoTen || "N/A";
        document.getElementById("infoEmail").innerText = data.email || "N/A";
        document.getElementById("infoGioiTinh").innerText = data.gioiTinh || "N/A";
        document.getElementById("infoNgaySinh").innerText = data.ngaySinh
          ? new Date(data.ngaySinh).toLocaleDateString()
          : "N/A";
        document.getElementById("infoMucTieu").innerText = data.mucTieuTamLy || "N/A";

        // ✅ Hiển thị avatar trong thông tin
        document.getElementById("currentAvatar").src = data.avatarUrl
          ? `http://localhost:5221${data.avatarUrl}`
          : "../img/default-avatar.png";

        // ✅ Cập nhật avatar ở menu nếu có
        const avatarMenu = document.querySelector(".user-button img");
        if (avatarMenu && data.avatarUrl) {
          avatarMenu.src = `http://localhost:5221${data.avatarUrl}`;
        }
      } else {
        alert(data.message || "Không tải được thông tin.");
      }
    } catch (err) {
      console.error(err);
      // alert("Lỗi kết nối đến máy chủ.");
    }
  }

  loadThongTinCaNhan();

  // ====== 3. Cập nhật thông tin người dùng ======
  const updateForm = document.getElementById("updateInfoForm");
  if (updateForm) {
    updateForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const dto = {
        hoTen: document.getElementById("hoTen").value,
        ngaySinh: document.getElementById("ngaySinh").value || null,
        gioiTinh: document.getElementById("gioiTinh").value,
        mucTieuTamLy: document.getElementById("mucTieuTamLy").value,
      };

      try {
        const res = await fetch(`http://localhost:5221/api/user/profile/${user.taiKhoanId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dto),
        });

        const result = await res.json();
        if (res.ok) {
          alert("Cập nhật thông tin thành công!");
        } else {
          alert(result.message || "Cập nhật thất bại.");
        }
      } catch (err) {
        console.error(err);
        alert("Lỗi máy chủ khi cập nhật.");
      }
    });
  }

  // ====== 4. Upload avatar (form riêng) ======
  const avatarForm = document.getElementById("avatarUploadForm");
  if (avatarForm) {
    avatarForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const fileInput = document.getElementById("avatarFile");
      if (!fileInput || !fileInput.files.length) return;

      const formData = new FormData();
      formData.append("file", fileInput.files[0]);

      try {
        const res = await fetch(`http://localhost:5221/api/user/upload-avatar/${user.taiKhoanId}`, {
          method: "POST",
          body: formData
        });

        const result = await res.json();
        if (res.ok) {
          alert("Tải lên avatar thành công!");
          document.getElementById("currentAvatar").src = `http://localhost:5221${result.avatarUrl}`;
          user.avatarUrl = result.avatarUrl;
          localStorage.setItem("user", JSON.stringify(user));
          await loadThongTinCaNhan();
        } else {
          alert(result.message || "Tải lên thất bại.");
        }
      } catch (err) {
        console.error(err);
        alert("Lỗi kết nối khi tải lên avatar.");
      }
    });
  }

  // ====== 5. Lịch sử tư vấn ======
async function loadLichSuTuVan() {
  const container = document.getElementById("lichSuTuVanList");
  if (!container) return;

  container.innerHTML = "<p>Đang tải dữ liệu...</p>";

  try {
    const res = await fetch(`http://localhost:5221/api/user/lichSuTuVan/${user.taiKhoanId}`);
    const data = await res.json();

    if (res.ok && data.length > 0) {
      container.innerHTML = data
        .map(
          (item) => `
          <div class="lich-tu-van-item">
            <h4>👨‍⚕️ Chuyên gia: ${item.chuyenGia}</h4>
            <p>📅 Ngày: ${new Date(item.thoiGianBatDau).toLocaleDateString()}</p>
            <p>🕓 Giờ: ${new Date(item.thoiGianBatDau).toLocaleTimeString()} → ${new Date(item.thoiGianKetThuc).toLocaleTimeString()}</p>
            <p>💬 Tóm tắt: ${item.tomTat || "Không có"}</p>
            <p>📞 Hình thức: ${item.ten}</p>
          </div>
        `
        )
        .join("");
    } else {
      container.innerHTML = "<p>Chưa có lịch sử tư vấn nào.</p>";
    }
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Lỗi khi tải lịch sử tư vấn.</p>";
  }
}


  loadLichSuTuVan();

  // ====== 6. Chuyển tab ======
  const tabs = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      contents.forEach((c) => c.classList.add("hidden"));

      tab.classList.add("active");
      const target = document.getElementById(`${tab.dataset.tab}-tab`);
      if (target) target.classList.remove("hidden");
    });
  });

  // ====== 7. Đăng xuất & dropdown menu ======
  window.logout = function () {
    localStorage.removeItem("user");
    alert("Đăng xuất thành công!");
    window.location.href = "index.html";
  };

  window.toggleUserDropdown = function () {
    const dropdown = document.getElementById("userDropdown");
    if (dropdown) dropdown.classList.toggle("show");
  };

  document.addEventListener("click", function (e) {
    const menu = document.getElementById("userMenu");
    const dropdown = document.getElementById("userDropdown");
    if (menu && dropdown && !menu.contains(e.target)) {
      dropdown.classList.remove("show");
    }
  });
});
