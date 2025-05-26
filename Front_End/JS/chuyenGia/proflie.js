document.addEventListener('DOMContentLoaded', () => {
  let chuyenGiaId = null;
  let scheduleData = [];

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("Bạn chưa đăng nhập.");
    window.location.href = "../index.html";
    return;
  }


    document.getElementById('editProfileBtn').addEventListener('click', () => {
    document.getElementById('edit-profile-modal').style.display = 'block';
  });
    // Đóng modal khi click ngoài modal (tuỳ chọn)
  window.addEventListener('click', e => {
    const modal = document.getElementById('edit-profile-modal');
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // === Modal xem ảnh chứng chỉ ===
  const certModal = document.getElementById('certModal');
  const certModalImg = document.getElementById('certModalImg');
  const viewCertBtn = document.getElementById('viewCertBtn');

  viewCertBtn.addEventListener('click', () => {
    fetch(`http://localhost:5221/api/chuyen-gia/thongTin/${user.taiKhoanId}`)
      .then(res => res.json())
      .then(data => {
        if (data.anhChungChi) {
          certModalImg.src = `http://localhost:5221${data.anhChungChi}`;
          certModal.style.display = 'flex';
        } else {
          alert("Chưa có ảnh chứng chỉ.");
        }
      });
  });

  certModal.addEventListener('click', e => {
    if (e.target === certModal || e.target === certModalImg) {
      certModal.style.display = 'none';
      certModalImg.src = '';
    }
  });

  // === Load lịch rảnh ===
function loadSchedule() {
  console.log("Bắt đầu load lịch...");
  if (!chuyenGiaId) {
    console.warn("Chưa có chuyenGiaId");
    return;
  }
  fetch(`http://localhost:5221/api/thoi-gian-ranh/chuyen-gia/${chuyenGiaId}`)
    .then(res => res.json())
    .then(data => {
      console.log("Dữ liệu lịch rảnh nhận được:", data);
      scheduleData = data;

      const tbody = document.querySelector("#scheduleTable tbody");
      console.log("tbody tìm được:", tbody);

      tbody.innerHTML = "";
      data.forEach(item => {
        console.log("Đang thêm dòng lịch:", item);
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${thuToText(item.thuTrongTuan)}</td>
          <td>${item.tu}</td>
          <td>${item.den}</td>
          <td>
            <button onclick="editSchedule(${item.id})">✏️</button>
            <button onclick="deleteSchedule(${item.id})">🗑️</button>
          </td>`;
        tbody.appendChild(row);
      });
    })
    .catch(err => console.error("Lỗi load lịch:", err));
}


  // === Lấy và hiển thị thông tin chuyên gia ===
  fetch(`http://localhost:5221/api/chuyen-gia/thongTin/${user.taiKhoanId}`)
    .then(res => res.json())
    .then(data => {
      chuyenGiaId = data.id;

      document.getElementById('currentAvatar').src = data.avatarUrl ? `http://localhost:5221${data.avatarUrl}` : "../images/user.png";
      document.getElementById('cgFullName').textContent = data.hoTen;
      document.getElementById('cgSpecialty').textContent = data.chuyenMon;
      document.getElementById('cgExperience').textContent = data.soNamKinhNghiem;
      document.getElementById('cgCertificates').textContent = data.soChungChi;
      document.getElementById('cgIntro').textContent = data.gioiThieu || "";
      document.getElementById('cgSoTaiKhoan').textContent = data.soTaiKhoan || "Chưa cập nhật";
      document.getElementById('cgTenNganHang').textContent = data.tenNganHang || "Chưa cập nhật";


      // Điền form chỉnh sửa
      document.getElementById('editFullName').value = data.hoTen || "";
      document.getElementById('editSpecialty').value = data.chuyenMon || "";
      document.getElementById('editExperience').value = data.soNamKinhNghiem || "";
      document.getElementById('editCertificates').value = data.soChungChi || "";
      document.getElementById('editIntro').value = data.gioiThieu || "";
      document.getElementById('editSoTaiKhoan').value = data.soTaiKhoan || "";
      document.getElementById('editTenNganHang').value = data.tenNganHang || "";

      // Load lịch rảnh sau khi có chuyenGiaId
      loadSchedule();
    });

  // === Form chỉnh sửa hồ sơ ===
  document.getElementById('editForm').addEventListener('submit', async e => {
  e.preventDefault();
  if (!chuyenGiaId) return alert("Không có ID chuyên gia.");

  // Xử lý upload ảnh đại diện nếu có
  const file = document.getElementById("avatarInput").files[0];
  if (file) {
    await uploadAvatar();
  }

  const payload = {
    hoTen: document.getElementById('editFullName').value,
    chuyenMon: document.getElementById('editSpecialty').value,
    soNamKinhNghiem: parseInt(document.getElementById('editExperience').value),
    gioiThieu: document.getElementById('editIntro').value,
    soChungChi: document.getElementById('editCertificates').value,
    soTaiKhoan: document.getElementById('editSoTaiKhoan').value || 'Chưa cập nhật',
    tenNganHang: document.getElementById('editTenNganHang').value || 'Chưa cập nhật',
    // Không gửi ảnh chứng chỉ nữa
    // anhChungChi: document.getElementById('editCertificates').value ? '' : undefined
  };

  console.log("Payload gửi đi:", payload);

  const res = await fetch(`http://localhost:5221/api/chuyen-gia/cap-nhat/${chuyenGiaId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const result = await res.json();
  if (res.ok) {
    alert("✅ Đã lưu thay đổi.");
    document.getElementById('cgFullName').textContent = payload.hoTen;
    document.getElementById('cgSpecialty').textContent = payload.chuyenMon;
    document.getElementById('cgExperience').textContent = payload.soNamKinhNghiem;
    document.getElementById('cgCertificates').textContent = payload.soChungChi;
    document.getElementById('cgIntro').textContent = payload.gioiThieu;
    document.getElementById('cgSoTaiKhoan').textContent = payload.soTaiKhoan;
    document.getElementById('cgTenNganHang').textContent = payload.tenNganHang;

    // Ẩn modal sau khi lưu
    document.getElementById('edit-profile-modal').style.display = 'none';
  } else {
    alert(`❌ Lỗi: ${result.message || "Không xác định"}`);
  }
});


  // === Hàm chỉnh sửa lịch (được gọi từ HTML) ===
  window.editSchedule = function (id) {
    const item = scheduleData.find(s => s.id === id);
    if (item) {
      document.getElementById('scheduleId').value = item.id;
      document.getElementById('thuTrongTuan').value = item.thuTrongTuan;
      document.getElementById('tu').value = item.tu;
      document.getElementById('den').value = item.den;
    }
  };

  // === Hàm xoá lịch (được gọi từ HTML) ===
  window.deleteSchedule = async function (id) {
    if (confirm("Xác nhận xoá?")) {
      await fetch(`http://localhost:5221/api/thoi-gian-ranh/${id}`, { method: 'DELETE' });
      loadSchedule();
      document.getElementById('scheduleForm').reset();
      document.getElementById('scheduleId').value = "";
    }
  };

  // === Form thêm/sửa lịch rảnh ===
  document.getElementById('scheduleForm').addEventListener('submit', async e => {
    e.preventDefault();

    const id = document.getElementById('scheduleId').value;
    const thu = parseInt(document.getElementById('thuTrongTuan').value);
    const tu = document.getElementById('tu').value;
    const den = document.getElementById('den').value;

    function isConflictWithSavedSchedule(thuMoi, tuMoi, denMoi, idDangSua = null) {
      return scheduleData.some(item => {
        if (idDangSua && item.id == idDangSua) return false;
        return item.thuTrongTuan == thuMoi && !(denMoi <= item.tu || tuMoi >= item.den);
      });
    }

    // Kiểm tra trùng lịch
    const isConflict = scheduleData.some(item => {
      if (id && item.id == id) return false;
      return item.thuTrongTuan == thu && !(den <= item.tu || tu >= item.den);
    });

    if (isConflict) {
      alert("Khung giờ bị trùng với lịch rảnh đã có.");
      return;
    }

    if (isConflictWithSavedSchedule(thu, tu, den, id)) {
      alert("⚠️ Khung giờ bị trùng với lịch đã lưu trước đó. Hãy chọn khung giờ khác.");
      return;
    }

    const payload = { chuyenGiaId, thuTrongTuan: thu, tu, den };
    const url = id
      ? `http://localhost:5221/api/thoi-gian-ranh/${id}`
      : `http://localhost:5221/api/thoi-gian-ranh`;
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const result = await res.json();
      alert(result.message || "Lỗi không xác định.");
      return;
    }

    document.getElementById('scheduleForm').reset();
    document.getElementById('scheduleId').value = "";
    loadSchedule();
  });

  // === Hàm tải ảnh đại diện ===
  async function uploadAvatar() {
    const user = JSON.parse(localStorage.getItem("user"));
    const file = document.getElementById("avatarInput").files[0];
    if (!file) {
      alert("Vui lòng chọn ảnh.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`http://localhost:5221/api/chuyen-gia/upload-avatar/${user.taiKhoanId}`, {
        method: "POST",
        body: formData
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Lỗi khi tải ảnh");
      alert("✅ Đã cập nhật ảnh đại diện!");
      document.getElementById("currentAvatar").src = `http://localhost:5221${result.avatarUrl}`;
    } catch (err) {
      alert("❌ " + err.message);
    }
  }

  // === Hàm chuyển thứ sang chữ ===
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

  // === Đăng xuất ===
  window.logout = function () {
    localStorage.removeItem("user");
    alert("Đăng xuất thành công!");
    window.location.href = "../index.html";
  };
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