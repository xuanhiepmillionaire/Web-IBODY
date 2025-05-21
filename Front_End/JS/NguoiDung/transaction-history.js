const transactionList = document.getElementById("transactionList");
const addTransactionForm = document.getElementById("addTransactionForm");
const transactionForm = document.getElementById("transactionForm");

// Mảng chứa dữ liệu giao dịch (có thể thay bằng API thực tế sau)
let transactions = [
    { title: "Mua Khóa Học Tư Vấn", description: "Tư vấn tâm lý học đường", amount: 1000000, date: "2025-05-01" },
    { title: "Thêm Sản Phẩm Mới", description: "Mua sắm các sản phẩm văn phòng", amount: 500000, date: "2025-05-03" },
];

// Hàm hiển thị danh sách giao dịch
function displayTransactions() {
    transactionList.innerHTML = ""; // Làm mới danh sách giao dịch

    transactions.forEach((transaction, index) => {
        const transactionItem = document.createElement("div");
        transactionItem.classList.add("transaction-item");

        transactionItem.innerHTML = `
            <h4>${transaction.title}</h4>
            <p><strong>Mô tả:</strong> ${transaction.description}</p>
            <p><strong>Số tiền:</strong> ${transaction.amount} VNĐ</p>
            <p><strong>Ngày:</strong> ${transaction.date}</p>
        `;
        transactionList.appendChild(transactionItem);
    });
}

// Hiển thị form thêm giao dịch
function showTransactionForm() {
    addTransactionForm.style.display = "flex";
}

// Đóng form thêm giao dịch
function closeTransactionForm() {
    addTransactionForm.style.display = "none";
}

// Xử lý sự kiện thêm giao dịch
transactionForm.onsubmit = function (event) {
    event.preventDefault();

    const title = document.getElementById("transactionTitle").value;
    const description = document.getElementById("transactionDescription").value;
    const amount = document.getElementById("transactionAmount").value;
    const date = document.getElementById("transactionDate").value;

    // Thêm giao dịch vào danh sách
    transactions.push({ title, description, amount, date });

    // Hiển thị lại danh sách giao dịch và đóng form
    displayTransactions();
    closeTransactionForm();
};

// Hiển thị giao dịch khi trang tải
window.onload = function () {
    displayTransactions();
};
