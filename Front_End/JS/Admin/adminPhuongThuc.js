const API_BASE = "http://localhost:5221/api/admin";

async function loadPhuongThuc() {
    const res = await fetch(`${API_BASE}/he-thong-phuong-thuc`);
    const list = await res.json(); // ✅ không cần .data
  
    const tbody = document.getElementById("ptttBody");
    tbody.innerHTML = "";
  
    list.forEach(item => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.id}</td>
        <td><input value="${item.ten}" onchange="capNhat(${item.id}, this.value, 'ten')"></td>
        <td><input value="${item.moTa || ''}" onchange="capNhat(${item.id}, this.value, 'moTa')"></td>
        <td>
          <select onchange="capNhat(${item.id}, this.value, 'trangThai')">
            <option value="hien" ${item.trangThai === 'hien' ? 'selected' : ''}>Hiện</option>
            <option value="an" ${item.trangThai === 'an' ? 'selected' : ''}>Ẩn</option>
          </select>
        </td>
        <td><button onclick="xoa(${item.id})" style="color:red;">Xoá</button></td>
      `;
      tbody.appendChild(tr);
    });
  }
  

async function capNhat(id, value, field) {
  const row = [...document.querySelectorAll(`#ptttBody tr`)]
    .find(tr => tr.querySelector(`td`).textContent == id);

  const payload = {
    ten: row.children[1].querySelector("input").value,
    moTa: row.children[2].querySelector("input").value,
    trangThai: row.children[3].querySelector("select").value
  };

  await fetch(`${API_BASE}/capNhatPhuongThucThanhToan/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

async function xoa(id) {
  if (confirm("Xoá phương thức này?")) {
    await fetch(`${API_BASE}/xoaPhuongThucThanhToan/${id}`, { method: "DELETE" });
    loadPhuongThuc();
  }
}

document.getElementById("addForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const ten = document.getElementById("ten").value;
  const moTa = document.getElementById("moTa").value;
  const trangThai = document.getElementById("trangThai").value;

  await fetch(`${API_BASE}/themThanhToan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ten, moTa, trangThai })
  });

  e.target.reset();
  loadPhuongThuc();
});

document.addEventListener("DOMContentLoaded", loadPhuongThuc);


document.getElementById("logoutLink")?.addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "../index.html";
});