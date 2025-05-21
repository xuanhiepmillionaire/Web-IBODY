// Định nghĩa API endpoint
const BASE_API = "http://localhost:5221/api/admin/chat";

// Hàm fetch lịch sử tin nhắn
async function fetchChatHistory(userId1, userId2) {
  try {
    const response = await fetch(`${BASE_API}/lich-su?taiKhoan1=${userId1}&taiKhoan2=${userId2}`);
    const data = await response.json();

    if (data.length > 0) {
      const chatHistory = document.getElementById("chatHistory");
      chatHistory.innerHTML = "";  // Clear the current chat

      data.forEach(message => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");
        messageDiv.innerHTML = `
          <p><strong>Người gửi:</strong> ${message.NguoiGuiId}</p>
          <p><strong>Người nhận:</strong> ${message.NguoiNhanId}</p>
          <p><strong>Nội dung:</strong> ${message.NoiDung}</p>
          <p><strong>Thời gian:</strong> ${new Date(message.ThoiGian).toLocaleString()}</p>
          <button onclick="deleteMessage(${message.Id})">Xóa</button>
        `;
        chatHistory.appendChild(messageDiv);
      });
    } else {
      alert("Không có tin nhắn nào.");
    }
  } catch (error) {
    console.error("Lỗi khi tải tin nhắn:", error);
  }
}

// Hàm xóa tin nhắn
async function deleteMessage(messageId) {
  try {
    const response = await fetch(`${BASE_API}/xoa1TinNhan/${messageId}`, { method: "DELETE" });

    if (response.ok) {
      alert("Tin nhắn đã được xóa.");
      fetchChatHistory(); // Tải lại lịch sử tin nhắn sau khi xóa
    } else {
      alert("Không thể xóa tin nhắn.");
    }
  } catch (error) {
    console.error("Lỗi khi xóa tin nhắn:", error);
  }
}

// Hàm xóa toàn bộ đoạn chat giữa 2 tài khoản
async function deleteChatHistory(userId1, userId2) {
  if (confirm("Bạn có chắc chắn muốn xóa toàn bộ đoạn chat?")) {
    try {
      const response = await fetch(`${BASE_API}/xoaToanBo?taiKhoan1=${userId1}&taiKhoan2=${userId2}`, { method: "DELETE" });

      if (response.ok) {
        alert("Đã xóa toàn bộ đoạn chat.");
        fetchChatHistory(); // Tải lại lịch sử tin nhắn sau khi xóa
      } else {
        alert("Không thể xóa toàn bộ đoạn chat.");
      }
    } catch (error) {
      console.error("Lỗi khi xóa toàn bộ đoạn chat:", error);
    }
  }
}

// Hàm gọi API khi người dùng nhấn vào một nút để tải lịch sử tin nhắn
document.getElementById("loadChatButton").addEventListener("click", () => {
  const userId1 = document.getElementById("userId1").value;
  const userId2 = document.getElementById("userId2").value;

  fetchChatHistory(userId1, userId2);
});

// Hàm để xóa toàn bộ đoạn chat
document.getElementById("deleteAllChatButton").addEventListener("click", () => {
  const userId1 = document.getElementById("userId1").value;
  const userId2 = document.getElementById("userId2").value;

  deleteChatHistory(userId1, userId2);
});
