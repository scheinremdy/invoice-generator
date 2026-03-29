const itemsContainer = document.getElementById("itemsContainer");
const addItemBtn = document.getElementById("addItem");

const subtotalEl = document.getElementById("subtotal");
const vatAmountEl = document.getElementById("vatAmount");
const totalEl = document.getElementById("total");

const vatSelect = document.getElementById("vat");
const currencySelect = document.getElementById("currency");

// ADD ITEM
function addItem(description = "", qty = 1, price = 0) {
  const div = document.createElement("div");
  div.classList.add("item");

  div.innerHTML = `
    <input type="text" placeholder="Item" value="${description}" />
    <input type="number" min="1" value="${qty}" />
    <input type="number" min="0" value="${price}" />
    <button class="remove">X</button>
  `;

  div.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", calculateTotal);
  });

  div.querySelector(".remove").addEventListener("click", () => {
    div.remove();
    calculateTotal();
  });

  itemsContainer.appendChild(div);
}

// CALCULATE TOTAL
function calculateTotal() {
  let subtotal = 0;

  const items = document.querySelectorAll(".item");

  items.forEach(item => {
    const inputs = item.querySelectorAll("input");

    const qty = parseFloat(inputs[1].value) || 0;
    const price = parseFloat(inputs[2].value) || 0;

    subtotal += qty * price;
  });

  const vatRate = parseFloat(vatSelect.value);
  const vatAmount = subtotal * vatRate;
  const total = subtotal + vatAmount;

  const currency = currencySelect.value;

  subtotalEl.textContent = currency + subtotal.toFixed(2);
  vatAmountEl.textContent = currency + vatAmount.toFixed(2);
  totalEl.textContent = currency + total.toFixed(2);
}

// EVENTS
addItemBtn.addEventListener("click", () => addItem());
vatSelect.addEventListener("change", calculateTotal);
currencySelect.addEventListener("change", calculateTotal);

// INIT
addItem();
