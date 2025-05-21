const user = JSON.parse(localStorage.getItem("user"));

if (!user || !Array.isArray(user.roles) || !user.roles.includes("quan_tri")) {
  window.location.href = "index.html";
}
async function loadDashboardStats() {
  try {
    const [resUsers, resExperts, resAppointments, resReviews, resReports, resUpgrades] = await Promise.all([
      fetch("http://localhost:5221/api/admin/accounts", {
        method: "GET",
        credentials: "include"
      }),
      fetch("http://localhost:5221/api/admin/demSoLuongChuyenGia", {
        method: "GET",
        credentials: "include"
      }),
      fetch("http://localhost:5221/api/admin/lich-hen", {
        method: "GET",
        credentials: "include"
      }),
      fetch("http://localhost:5221/api/admin/danhGiaCuaChuyenGia", {
        method: "GET",
        credentials: "include"
      }),
      fetch("http://localhost:5221/api/admin/bao-cao", {
        method: "GET",
        credentials: "include"
      }),
      fetch("http://localhost:5221/api/admin/expert-requests", {
        method: "GET",
        credentials: "include"
      }),
    ]);

    const users = await resUsers.json();
    const experts = await resExperts.json();
    const appointments = await resAppointments.json();
    const reviews = await resReviews.json();
    const reports = await resReports.json();
    const upgradeRequests = await resUpgrades.json();

    document.getElementById("countUsers").innerText = users.count || 0;
    document.getElementById("countExperts").innerText = experts.count || 0;
    document.getElementById("countAppointments").innerText = appointments.count || 0;
    document.getElementById("countReviews").innerText = reviews.count || 0;
    document.getElementById("countReports").innerText = reports.count || 0;
    document.getElementById("countUpgrade").innerText = upgradeRequests.count || 0;
  } catch (err) {
    console.error("Lỗi tải thống kê:", err);
  }
}


document.addEventListener("DOMContentLoaded", loadDashboardStats);

document.getElementById("logoutLink")?.addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "../index.html";
});




// động giao diện
document.addEventListener("DOMContentLoaded", function () {
  // Giả lập dữ liệu mẫu
  const stats = {
    countUsers: 128,
    countExperts: 42,
    countUpgrade: 5,
    countAppointments: 66,
    countReports: 12
  };

  // Cập nhật DOM
  for (let key in stats) {
    const el = document.getElementById(key);
    if (el) el.textContent = stats[key];
  }

  // Hiệu ứng nạp động (ví dụ, có thể dùng spinner thực tế nếu gọi API)
  const loadingSections = document.querySelectorAll(".section p");
  loadingSections.forEach(p => {
    setTimeout(() => {
      p.textContent = "Dữ liệu đã được tải.";
    }, 1500);
  });
});
