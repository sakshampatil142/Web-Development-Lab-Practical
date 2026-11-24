// Saare expenses is array me store honge
var expenses = [];

// HTML elements ko pakadna
var nameInput = document.getElementById("name");
var amountInput = document.getElementById("amount");
var categoryInput = document.getElementById("category");
var filterSelect = document.getElementById("filter");
var list = document.getElementById("expenseList");
var totalEl = document.getElementById("total");
var errorEl = document.getElementById("error");

// Add Expense button dabane par
document.getElementById("addBtn").onclick = function () {
  var name = nameInput.value;
  var amount = Number(amountInput.value);
  var category = categoryInput.value;

  // Validation
  if (name === "" || amountInput.value === "") {
    errorEl.innerText = "Please fill all fields";
    return;
  }
  if (amount <= 0) {
    errorEl.innerText = "Amount must be greater than 0";
    return;
  }

  errorEl.innerText = "";

  // Naya expense array me daalo
  expenses.push({ name: name, amount: amount, category: category });

  // Input box khali karo
  nameInput.value = "";
  amountInput.value = "";

  showExpenses();
};

// Delete button dabane par
function deleteExpense(index) {
  expenses.splice(index, 1); // us index ka expense hata do
  showExpenses();
}

// Filter badalne par list dobara dikhao
filterSelect.onchange = showExpenses;

// List aur total screen par dikhana
function showExpenses() {
  var html = "";
  var total = 0;
  var selected = filterSelect.value;

  for (var i = 0; i < expenses.length; i++) {
    var e = expenses[i];

    // Agar "All" hai ya category match karti hai tabhi dikhao
    if (selected === "All" || selected === e.category) {
      html += "<li>";
      html += "<span>" + e.name + " - ₹" + e.amount + " (" + e.category + ")</span>";
      html += "<button onclick='deleteExpense(" + i + ")'>Delete</button>";
      html += "</li>";
      total = total + e.amount;
    }
  }

  list.innerHTML = html;
  totalEl.innerText = total;
}