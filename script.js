let items = [];

function addItem(name = "", qty = 1, price = 0) {
  const item = { name, qty, price };
  items.push(item);
  renderItems();
}

function renderItems() {
  const container = document.getElementById("items");
  container.innerHTML = "";

  items.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "item-row";

    row.innerHTML = `
      <input value="${item.name}" onchange="updateItem(${index}, 'name', this.value)">
      <input type="number" value="${item.qty}" onchange="updateItem(${index}, 'qty', this.value)">
      <input type="number" value="${item.price}" onchange="updateItem(${index}, 'price', this.value)">
      <button onclick="removeItem(${index})">X</button>
    `;

    container.appendChild(row);
  });

  calculate();
}

function updateItem(index, key, value) {
  items[index][key] = key === "name" ? value : Number(value);
  calculate();
}

function removeItem(index) {
  items.splice(index, 1);
  renderItems();
}

function calculate() {
  let subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
  let tax = subtotal * 0.1;
  let total = subtotal + tax;

  document.getElementById("subtotal").innerText = subtotal.toFixed(2);
  document.getElementById("tax").innerText = tax.toFixed(2);
  document.getElementById("total").innerText = total.toFixed(2);
}

function generateInvoiceNumber() {
  let last = localStorage.getItem("invoiceNumber") || 0;
  last++;
  localStorage.setItem("invoiceNumber", last);
  return `INV-2026-${String(last).padStart(4, '0')}`;
}

function saveInvoice() {
  const invoice = {
    id: generateInvoiceNumber(),
    client: document.getElementById("clientName").value,
    address: document.getElementById("clientAddress").value,
    date: document.getElementById("date").value,
    due: document.getElementById("dueDate").value,
    currency: document.getElementById("currency").value,
    items
  };

  let saved = JSON.parse(localStorage.getItem("invoices")) || [];
  saved.push(invoice);
  localStorage.setItem("invoices", JSON.stringify(saved));

  alert("Saved!");
}

function loadInvoices() {
  const list = document.getElementById("savedList");
  list.innerHTML = "";

  let saved = JSON.parse(localStorage.getItem("invoices")) || [];

  saved.forEach(inv => {
    const li = document.createElement("li");
    li.innerText = `${inv.id} - ${inv.client}`;
    li.onclick = () => loadInvoiceData(inv);
    list.appendChild(li);
  });
}

function loadInvoiceData(inv) {
  document.getElementById("clientName").value = inv.client;
  document.getElementById("clientAddress").value = inv.address;
  document.getElementById("date").value = inv.date;
  document.getElementById("dueDate").value = inv.due;
  document.getElementById("currency").value = inv.currency;

  items = inv.items;
  renderItems();
}

async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("INVOICE", 10, 10);

  doc.text("Client: " + document.getElementById("clientName").value, 10, 20);
  doc.text("Total: " + document.getElementById("total").innerText, 10, 30);

  doc.save("invoice.pdf");
}

// Init
addItem();
