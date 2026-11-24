// ---------- 1. Data ----------
// Saare expenses is array me store honge
var expenses = [];
var nextId = 1; // har expense ko ek unique number dene ke liye

// Pehle se saved data ho to localStorage se nikalo (page refresh par data nahi jayega)
var saved = localStorage.getItem("expenses");
if (saved) {
  expenses = JSON.parse(saved);
  // nextId ko sabse bade id se aage rakho
  for (var i = 0; i < expenses.length; i++) {
    if (expenses[i].id >= nextId) {
      nextId = expenses[i].id + 1;
    }
  }
}

// ---------- 2. HTML elements pakadna ----------
var nameInput = document.getElementById("name");
var amountInput = document.getElementById("amount");
var categoryInput = document.getElementById("category");
var dateInput = document.getElementById("date");
var searchInput = document.getElementById("search");
var filterSelect = document.getElementById("filter");
var sortSelect = document.getElementById("sort");
var list = document.getElementById("expenseList");
var emptyState = document.getElementById("emptyState");
var totalEl = document.getElementById("total");
var countEl = document.getElementById("count");
var highestEl = document.getElementById("highest");
var errorEl = document.getElementById("error");

// Date box me aaj ki date pehle se daal do
dateInput.value = new Date().toISOString().slice(0, 10);

// ---------- 3. Add expense ----------
document.getElementById("addBtn").onclick = function () {
  var name = nameInput.value.trim();
  var amount = Number(amountInput.value);
  var category = categoryInput.value;
  var date = dateInput.value;

  // Validation
  if (name === "" || amountInput.value === "") {
    errorEl.innerText = "Please fill all fields";
    return;
  }
  if (amount <= 0) {
    errorEl.innerText = "Amount must be greater than 0";
    return;
  }
  if (date === "") {
    errorEl.innerText = "Please select a date";
    return;
  }

  errorEl.innerText = "";

  // Naya expense array me daalo
  expenses.push({
    id: nextId,
    name: name,
    amount: amount,
    category: category,
    date: date
  });
  nextId = nextId + 1;

  // Input boxes khali karo
  nameInput.value = "";
  amountInput.value = "";

  saveAndShow();
};

// ---------- 4. Delete expense ----------
function deleteExpense(id) {
  // us id wale expense ko dhundo aur hata do
  for (var i = 0; i < expenses.length; i++) {
    if (expenses[i].id === id) {
      expenses.splice(i, 1);
      break;
    }
  }
  saveAndShow();
}

// ---------- 5. Clear all ----------
document.getElementById("clearBtn").onclick = function () {
  if (expenses.length === 0) {
    return;
  }
  if (confirm("Delete all expenses?")) {
    expenses = [];
    saveAndShow();
  }
};

// ---------- 6. Dark / Light mode ----------
var themeBtn = document.getElementById("themeBtn");
themeBtn.onclick = function () {
  document.body.classList.toggle("light");
  if (document.body.classList.contains("light")) {
    themeBtn.innerText = "🌙";
  } else {
    themeBtn.innerText = "☀️";
  }
};

// ---------- 7. Search, filter, sort badalne par list dobara dikhao ----------
searchInput.oninput = showExpenses;
filterSelect.onchange = showExpenses;
sortSelect.onchange = showExpenses;

// ---------- 8. Data save karke list dikhana ----------
function saveAndShow() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
  showExpenses();
}

// ---------- 9. Main function: list, total, count, highest dikhana ----------
function showExpenses() {
  var selected = filterSelect.value;
  var searchText = searchInput.value.toLowerCase();
  var sortType = sortSelect.value;

  // Step 1: filter + search ke hisaab se expenses chuno
  var visible = [];
  for (var i = 0; i < expenses.length; i++) {
    var e = expenses[i];
    var categoryMatch = (selected === "All" || selected === e.category);
    var nameMatch = (e.name.toLowerCase().indexOf(searchText) !== -1);

    if (categoryMatch && nameMatch) {
      visible.push(e);
    }
  }

  // Step 2: sort karo
  visible.sort(function (a, b) {
    if (sortType === "high") {
      return b.amount - a.amount;
    }
    if (sortType === "low") {
      return a.amount - b.amount;
    }
    if (sortType === "oldest") {
      return a.id - b.id;
    }
    return b.id - a.id; // newest first
  });

  // Step 3: list ka HTML banao + total aur highest nikalo
  var html = "";
  var total = 0;
  var highest = 0;

  for (var j = 0; j < visible.length; j++) {
    var item = visible[j];
    total = total + item.amount;
    if (item.amount > highest) {
      highest = item.amount;
    }

    html += "<li class='" + item.category + "'>";
    html += "<div class='info'>";
    html += "<span class='item-name'>" + item.name + "</span>";
    html += "<span class='item-meta'><span class='badge " + item.category + "'>" + item.category + "</span>" + item.date + "</span>";
    html += "</div>";
    html += "<div class='right'>";
    html += "<span class='item-amount'>₹" + item.amount + "</span>";
    html += "<button onclick='deleteExpense(" + item.id + ")'>Delete</button>";
    html += "</div>";
    html += "</li>";
  }

  list.innerHTML = html;

  // Step 4: numbers screen par dikhao
  totalEl.innerText = total;
  countEl.innerText = visible.length;
  highestEl.innerText = highest;

  // Step 5: agar list khali hai to empty message dikhao
  if (visible.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }
}

// Page khulte hi list dikhao
showExpenses();