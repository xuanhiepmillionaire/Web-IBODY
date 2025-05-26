const user = JSON.parse(localStorage.getItem("user"));

if (!user || !Array.isArray(user.roles) || !user.roles.includes("quan_tri")) {
  alert("Bạn không có quyền truy cập trang quản trị.");
  window.location.href = "index.html";
}

async function loadExpertRequests() {
  try {
    const res = await fetch("http://localhost:5221/api/admin/expert-requests");
    const data = await res.json();
    const list = data.data || data; // fallback nếu không có `data` field

    const tbody = document.getElementById("expertRequestTableBody");
    tbody.innerHTML = "";

    list.forEach(expert => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${expert.id}</td>
        <td>${expert.hoTen}</td>
        <td>${expert.chuyenMon}</td>
        <td>${expert.soNamKinhNghiem}</td>
        <td>${expert.soChungChi}</td>
        
          <img src="http://localhost:5221${expert.anhChungChi || '/images/no-image.png'}" 
          alt="chứng chỉ" style="max-width: 200px; margin-top:5px; border:1px solid #ccc;">
        </td>
        <td>${expert.gioiThieu}</td>
        <td>
          <button onclick="duyetChuyenGia(${expert.id})">Duyệt</button>
          <button onclick="tuChoiChuyenGia(${expert.id})" style="color:red;">Từ chối</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Lỗi tải danh sách chuyên gia:", err);
  }
}

async function duyetChuyenGia(id) {
  const confirmed = confirm("Xác nhận duyệt chuyên gia này?");
  if (confirmed) {
    await fetch(`http://localhost:5221/api/admin/expert-approve/${id}`, { method: "POST" });
    loadExpertRequests();
  }
}

async function tuChoiChuyenGia(id) {
  const confirmed = confirm("Bạn có chắc muốn từ chối chuyên gia này?");
  if (confirmed) {
    await fetch(`http://localhost:5221/api/admin/expert-reject/${id}`, { method: "POST" });
    loadExpertRequests();
  }
}

document.addEventListener("DOMContentLoaded", loadExpertRequests);

document.getElementById("logoutLink")?.addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "../index.html";
});
