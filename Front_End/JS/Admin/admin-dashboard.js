const user = JSON.parse(localStorage.getItem("user"));

if (!user || !Array.isArray(user.roles) || !user.roles.includes("quan_tri")) {
  window.location.href = "index.html";
}
document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:5221/api/admin/dashboard/thong-ke-tong-quan")
    .then(response => {
      if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu thống kê");
      return response.json();
    })
    .then(data => {
      // Hiển thị số liệu
      document.getElementById("statTaiKhoan").textContent = data.taiKhoan;
      document.getElementById("statChuyenGia").textContent = data.chuyenGia;
      document.getElementById("statYeuCau").textContent = data.yeuCauNangCap;
      document.getElementById("statLichHen").textContent = data.lichHen;
      document.getElementById("statBaoCao").textContent = data.baoCao;

      // Tạo biểu đồ sau khi có dữ liệu
      const ctx = document.getElementById('thongKeBieuDo').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Tài khoản', 'Chuyên gia', 'Nâng cấp', 'Lịch hẹn', 'Tố cáo'],
          datasets: [{
            label: 'Số lượng',
            data: [
              data.taiKhoan,
              data.chuyenGia,
              data.yeuCauNangCap,
              data.lichHen,
              data.baoCao
            ],
            backgroundColor: '#A993EC'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    })
    .catch(error => {
      console.error("Lỗi:", error);
      alert("Không thể tải dữ liệu thống kê.");
    });
});




document.getElementById("logoutLink")?.addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "../index.html";
});


