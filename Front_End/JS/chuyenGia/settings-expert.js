// Base URL API server
const API_BASE_URL = "http://localhost:5221/api"; // bạn sửa lại đúng server nếu cần
const user = JSON.parse(localStorage.getItem("user")); // lấy user từ localStorage

// Cập nhật Email
const updateEmailForm = document.getElementById("updateEmailForm");
updateEmailForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const newEmail = document.getElementById("newEmail").value.trim();

  if (!newEmail) {
    alert("Vui lòng nhập email mới.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/user/profile/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newEmail })
    });

    const result = await response.json();
    if (response.ok) {
      alert("Cập nhật Email thành công!");
    } else {
      alert(result.message || "Cập nhật Email thất bại.");
    }
  } catch (error) {
    console.error("Lỗi cập nhật email:", error);
    alert("Không thể kết nối server.");
  }
});

// Đổi mật khẩu
const changePasswordForm = document.getElementById("changePasswordForm");
changePasswordForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;

  if (newPassword.length < 6) {
    alert("Mật khẩu mới phải có ít nhất 6 ký tự.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/chuyen-gia/doi-mat-khau/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matKhauCu: currentPassword, matKhauMoi: newPassword })
    });

    const result = await response.json();
    if (response.ok) {
      alert("Đổi mật khẩu thành công!");
      changePasswordForm.reset();
    } else {
      alert(result.message || "Đổi mật khẩu thất bại.");
    }
  } catch (error) {
    console.error("Lỗi đổi mật khẩu:", error);
    alert("Không thể kết nối server.");
  }
});

// Preview và upload ảnh đại diện
const avatarInput = document.getElementById("avatarInput");
const avatarPreview = document.getElementById("avatarPreview");

avatarInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      avatarPreview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Lưu ảnh đại diện (tạm thời chưa có API upload thật nên chỉ preview)
document.getElementById("saveAvatarBtn").addEventListener("click", function () {
  alert("Tính năng lưu ảnh đại diện cần thêm API riêng.");
});

// Yêu cầu xóa tài khoản
const deleteAccountBtn = document.getElementById("deleteAccountBtn");
deleteAccountBtn.addEventListener("click", async function () {
  if (!confirm("Bạn chắc chắn muốn yêu cầu xóa tài khoản?")) return;

  try {
    const response = await fetch(`${API_BASE_URL}/profile/request-upgrade`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taiKhoanId: user.id, hoTen: user.fullName, soNamKinhNghiem: 0, soChungChi: "", chuyenMon: "", gioiThieu: "Yêu cầu xóa tài khoản" })
    });

    const result = await response.json();
    if (response.ok) {
      alert("Yêu cầu xóa tài khoản đã được gửi!");
    } else {
      alert(result.message || "Gửi yêu cầu thất bại.");
    }
  } catch (error) {
    console.error("Lỗi yêu cầu xóa tài khoản:", error);
    alert("Không thể kết nối server.");
  }
});

function logout() {
  localStorage.removeItem("user");
  alert("Đăng xuất thành công!");
  window.location.href = "../index.html";
}