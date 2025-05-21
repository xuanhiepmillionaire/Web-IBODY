const user = JSON.parse(localStorage.getItem("user"));

document.addEventListener("DOMContentLoaded", () => {
  // Xử lý giao diện user login/logout
  const loginLink = document.getElementById("loginLink");
  const userMenu = document.getElementById("userMenu");
  const usernameDisplay = document.getElementById("usernameDisplay");
  const avatarImg = document.querySelector(".user-button img");

  if (user && loginLink && userMenu && usernameDisplay) {
    loginLink.style.display = "none";
    userMenu.style.display = "inline-block";
    usernameDisplay.innerText = user.fullName || user.username;

    if (avatarImg) {
      avatarImg.src = user.avatarUrl
        ? `http://localhost:5221${user.avatarUrl}`
        : "../../img/default-avatar.png";
    }
  } else {
    if (userMenu) userMenu.style.display = "none";
  }

  // Xử lý form gửi yêu cầu nâng cấp
  const form = document.getElementById("upgradeForm");
  const responseDiv = document.getElementById("responseMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      taiKhoanId: user.taiKhoanId,
      hoTen: document.getElementById("fullName").value,
      soNamKinhNghiem: parseInt(document.getElementById("experienceYears").value),
      soChungChi: document.getElementById("certificates").value,
      chuyenMon: document.getElementById("specialty").value,
      gioiThieu: document.getElementById("introduction").value
    };

    try {
      const res = await fetch("http://localhost:5221/api/profile/request-upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Gửi yêu cầu thất bại.");

      responseDiv.innerText = data.message;
      responseDiv.style.color = "green";
      form.reset();
    } catch (err) {
      responseDiv.innerText = err.message;
      responseDiv.style.color = "red";
    }
  });
});
