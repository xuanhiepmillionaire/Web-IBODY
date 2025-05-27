const user = JSON.parse(localStorage.getItem("user"));

if (!user || !Array.isArray(user.roles) || !user.roles.includes("quan_tri")) {
  alert("Bạn không có quyền truy cập trang quản trị.");
  window.location.href = "index.html";
}

async function loadReports() {
  try {
    const res = await fetch("http://localhost:5221/api/admin/bao-cao-chuyen-gia"); // ✅ API mới
    const data = await res.json();
    const reports = data.data || data;

    const tbody = document.getElementById("reportTableBody");
    tbody.innerHTML = "";

    reports.forEach(report => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${report.id}</td>
        <td>${report.emailNguoiBaoCao}</td>
        <td>${report.emailNguoiBiBaoCao}</td>
        <td>${report.lyDo}</td>
        <td>${new Date(report.thoiGian).toLocaleString()}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Lỗi tải tố cáo:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadReports);

document.getElementById("logoutLink")?.addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "../index.html";
});
