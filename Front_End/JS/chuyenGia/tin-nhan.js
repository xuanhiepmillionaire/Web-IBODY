// tin-nhan.js - Kết hợp logic đúng + UI đẹp chuyên gia (có auto-refresh)

let selectedUserId = null;
let currentUserId = null;
let refreshInterval = null;

window.addEventListener("DOMContentLoaded", async () => {
  const localUser = JSON.parse(localStorage.getItem("user"));
  currentUserId = localUser.taiKhoanId;
  await loadClients();
  if (!window.name || window.name !== "receiverWindow") {
  window.open("../video-receiver.html", "_blank", "width=1,height=1,left=-1000,top=-1000");
}

  document.getElementById("message-input").addEventListener("input", () => {
    const typingText = document.getElementById("typing-text");
    typingText.style.visibility = event.target.value.trim() ? "visible" : "hidden";
  });

  document.getElementById("message-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });

  document.getElementById("sendButton").addEventListener("click", () => {
  sendMessage();
});

});

async function loadClients() {
  try {
    const infoRes = await fetch(`http://localhost:5221/api/chuyen-gia/thongTin/${currentUserId}`);
    if (!infoRes.ok) throw new Error("Không tìm thấy chuyên gia");
    const expert = await infoRes.json();
    const chuyenGiaId = expert.id;

    const res = await fetch(`http://localhost:5221/api/chuyen-gia/khach-hang-tu-van/${chuyenGiaId}`);
    const list = await res.json();

    const chatList = document.getElementById("chatList");
    chatList.innerHTML = "";

    // Lọc danh sách trùng email
    const uniqueClients = [];
    const seenEmails = new Set();

    list.forEach(user => {
      if (!seenEmails.has(user.email)) {
        seenEmails.add(user.email);
        uniqueClients.push(user);
      }
    });

    uniqueClients.forEach((user, index) => {
      const li = document.createElement("li");
      li.classList.add("chat-item");
      li.innerHTML = `
        <img src="${user.avatarUrl ? `http://localhost:5221${user.avatarUrl}` : '../images/user.png'}" alt="user">
        <div>
          <h3>${user.hoTenKhachHang}</h3>
          <p>${user.email}</p>
        </div>
      `;
      li.addEventListener("click", () => selectReceiver(user.taiKhoanIdNguoiDung, li));
      chatList.appendChild(li);

      if (index === 0) selectReceiver(user.taiKhoanIdNguoiDung, li);
    });

  } catch (err) {
    console.error("loadClients() failed:", err);
  }
}

function selectReceiver(id, element) {
  selectedUserId = id;
  const callBtn = document.getElementById("callButton");
callBtn.style.display = "inline-block";
callBtn.onclick = () => {
  window.open(`../video-caller.html?to=${id}`, "_blank");
};


  document.querySelectorAll(".chat-item").forEach(item => item.classList.remove("active"));
  element.classList.add("active");
  loadMessages(currentUserId, selectedUserId);

  if (refreshInterval) clearInterval(refreshInterval);
  refreshInterval = setInterval(() => {
    loadMessages(currentUserId, selectedUserId);
  }, 3000);
}

async function loadMessages(senderId, receiverId) {
  try {
    const res = await fetch(`http://localhost:5221/api/chuyen-gia/lichSuTinNhan?taiKhoan1=${senderId}&taiKhoan2=${receiverId}`);
    const list = await res.json();

    const container = document.getElementById("message-list");
    container.innerHTML = "";

    list.forEach(msg => {
      const li = document.createElement("li");
      // li.className = msg.nguoiGuiId === senderId ? "message-item me" : "message-item friend";
      // li.innerHTML = `
      //   <p>${msg.noiDung}</p>
      //   <span>${formatDate(msg.thoiGian)}</span>
      // `;
      li.className = msg.fromUserId === senderId ? "message-item me" : "message-item friend";
      li.innerHTML = `
        <p>${msg.content}</p>
        <span>${formatDate(msg.timestamp)}</span>
      `;

      container.appendChild(li);
    });

    container.scrollTop = container.scrollHeight;
  } catch (err) {
    console.error("loadMessages() failed:", err);
  }
}

async function sendMessage() {
  const input = document.getElementById("message-input");
  const noiDung = input.value.trim();
  if (!noiDung || !selectedUserId) return;

  try {
    const res = await fetch("http://localhost:5221/api/chuyen-gia/guiTinNhan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nguoiGuiId: currentUserId,
        nguoiNhanId: selectedUserId,
        noiDung
      })
    });

    if (!res.ok) throw new Error("Không gửi được tin nhắn");

    input.value = "";
    document.getElementById("typing-text").style.visibility = "hidden";
    loadMessages(currentUserId, selectedUserId);
  } catch (err) {
    alert("Lỗi khi gửi tin nhắn.");
    console.error(err);
  }
}

function formatDate(raw) {
  const d = new Date(raw);
  const date = d.toLocaleDateString("vi-VN");
  const time = d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  return `${date} ${time}`;
}
function logout() {
  localStorage.removeItem("user");
  alert("Đăng xuất thành công!");
  window.location.href = "../index.html";
}


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

    document.getElementById("searchInput").addEventListener("input", function () {
  const keyword = this.value.toLowerCase();
  const chatItems = document.querySelectorAll(".chat-item");
  chatItems.forEach(item => {
    const name = item.querySelector("h3").textContent.toLowerCase();
    item.style.display = name.includes(keyword) ? "flex" : "none";
  });
});