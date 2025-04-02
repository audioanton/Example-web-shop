if (!localStorage.getItem("products")) fetchProducts();
else {
  drawProducts(JSON.parse(localStorage.getItem("products")));
}

if (localStorage.getItem("cart")) {
  renderCart(JSON.parse(localStorage.getItem("products")));
}

function drawProducts(products) {
  const row = document.getElementById("main-row");
  products.forEach((product) => {
    row.appendChild(getProductCard(product));
  });
}

function fetchProducts() {
  fetch("https://fakestoreapi.com/products")
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem("products", JSON.stringify(data));
      drawProducts(data);
    });
}

function getCartProduct(product, amountInCart) {
  
  const rowId = `product_${product.id}`;
  const row = document.createElement("row");
  row.classList.add("row", "mb-3");
  row.setAttribute("id", rowId);

  const imgCol = document.createElement("div");
  imgCol.classList.add("col-md-3");

  const img = document.createElement("img");
  img.setAttribute("src", product.image);
  img.setAttribute("alt", product.title);
  img.setAttribute("style", "width: 120px; height: auto;");
  img.classList.add("rounded");
  imgCol.append(img);

  const heading = document.createElement("h5");
  heading.classList.add("card-title", "col-md-4", "word-break");
  heading.textContent = product.title;

  const amountDiv = document.createElement("div");
  amountDiv.classList.add("col-md-2");

  const inputDiv = document.createElement("div");
  inputDiv.classList.add("input-group");

  const amount = document.createElement("input");
  amount.setAttribute("style", "max-width: 100px");
  amount.setAttribute("type", "text");
  amount.setAttribute("name", "input");
  amount.classList.add(
    "form-control",
    "form-control-sm",
    "text-center",
    "quantity-input"
  );
  amount.setAttribute("value", amountInCart);

  const priceDiv = document.createElement("div");
  priceDiv.classList.add("col-md-3", "text-center");

  const price = document.createElement("p");
  price.classList.add("fw-bold");
  updatePrice(price, amount.value, product.price);

  const minusButton = document.createElement("button");
  minusButton.setAttribute("type", "button");
  minusButton.classList.add("btn", "btn-outline-secondary", "btn-sm");
  minusButton.textContent = "-";
  minusButton.addEventListener("click", function () {
      if (amount.value - 1 >= 0) {
        decrementProduct(product.id, amount);
        updatePrice(price, amount.value, product.price);
      }
  });

  const plusButton = document.createElement("button");
  plusButton.setAttribute("type", "button");
  plusButton.classList.add("btn", "btn-outline-secondary", "btn-sm");
  plusButton.textContent = "+";
  plusButton.addEventListener("click", function () {
    incrementProduct(product, amount, price);
  });

  inputDiv.append(minusButton, amount, plusButton);
  amountDiv.append(inputDiv);

  

  const removeButton = document.createElement("button");
  removeButton.classList.add("btn", "btn-outline-danger", "btn-sm");
  removeButton.textContent = "Remove";
  removeButton.addEventListener("click", function () {
    removeProduct(product.id);
    row.remove();
    updateTotalPrice();
  });

  priceDiv.append(price, removeButton);
  row.append(imgCol, heading, amountDiv, priceDiv);

  return row;
}

function getProductCard(product) {
  const column = document.createElement("div");
  column.classList.add("col");

  const card = document.createElement("div");
  card.classList.add("card", "m-3");
  card.setAttribute("style", "width: 18rem;");

  const img = document.createElement("img");
  img.setAttribute("src", product.image);
  img.classList.add("card-img-top");
  img.setAttribute("alt", shortenTitle(product.title)[0]);

  const cardBody = document.createElement("div");
  cardBody.classList.add(
    "card-body",
    "d-flex",
    "align-items-center",
    "flex-column"
  );

  const cardHeading = document.createElement("h5");
  cardHeading.classList.add("card-title");
  cardHeading.textContent = shortenTitle(product.title)[0];

  const price = document.createElement("h5");
  price.classList.add("text-primary");
  price.textContent = `Price: $${product.price}`;

  const cardFooter = document.createElement("div");
  cardFooter.classList.add("card-footer", "my-3");

  const about = document.createElement("a");
  about.classList.add("btn", "btn-secondary", "col-12", "mb-2");
  about.textContent = "About";

  const description = document.createElement("div");
  description.textContent = product.description;
  description.classList.add("panel", "text-secondary");

  const addToCartBtn = document.createElement("a");
  addToCartBtn.classList.add("btn", "btn-secondary", "col-12");
  addToCartBtn.setAttribute("data-bs-toggle", "button");
  addToCartBtn.textContent = "Add To Cart";
  addToCartBtn.addEventListener("click", () => {
    addToCart(product);
    appendAlert('Added to cart', 'primary');
  });

  about.addEventListener("click", function () {
    if (description.style.maxHeight) {
      description.style.maxHeight = null;
      description.style.margin = "0px";
    } else {
      description.style.maxHeight = description.scrollHeight + "px";
      description.style.margin = "10px";
    }
  });

  cardBody.append(cardHeading, price);
  cardFooter.append(about, description, addToCartBtn);
  card.append(img, cardBody, cardFooter);
  column.append(card);

  card.addEventListener("mouseover", function () {
    cardHeading.textContent = product.title;
  });
  card.addEventListener("mouseout", function () {
    cardHeading.textContent = shortenTitle(product.title)[0];
  });

  return card;
}

function shortenTitle(title) {
  const shortened = title.length > 25 ? title.substring(0, 22) + "..." : title;
  return [shortened, title];
}

function isProductInCart(product, cart) {
  return Object.keys(cart).includes(String(product.id));
}


function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem("cart"));

  if (cart) {
    if (!isProductInCart(product, cart)) {
      cart[product.id] = 1;
      localStorage.setItem("cart", JSON.stringify(cart));
      const cartProduct = getCartProduct(product, 0);
      document.getElementById("cart-container").append(cartProduct);
    }
  } 
  else {
      const newCart = {
        [`${product.id}`]: 1
      };
      localStorage.setItem("cart", JSON.stringify(newCart));
      const cartProduct = getCartProduct(product, 0);
      document.getElementById("cart-container").append(cartProduct);
  }
  const amountElement = document.getElementById(`product_${product.id}`).querySelector("input");
  const priceElement = document.getElementById(`product_${product.id}`).querySelector("p");
  incrementProduct(product, amountElement, priceElement);
}

function incrementProduct(product, amountElement, priceElement) {
  console.log("here");
  amountElement.value = Number(amountElement.value) + 1;


  const cart = JSON.parse(localStorage.getItem("cart"));
  cart[product.id] = amountElement.value;
  localStorage.setItem("cart", JSON.stringify(cart));

  updatePrice(priceElement, amountElement.value, product.price);
}

function decrementProduct(product_id, amountElement) {
  amountElement.value -= 1;

  const cart = JSON.parse(localStorage.getItem("cart"));
  cart[product_id] = amountElement.value;
  localStorage.setItem("cart", JSON.stringify(cart));
}

function removeProduct(product_id) {
  const cart = JSON.parse(localStorage.getItem("cart"));
  delete cart[product_id];
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updatePrice(priceElement, amount, priceNumber) {
  const price = (priceNumber * Number(amount)).toFixed(2);
  priceElement.textContent = `$${price}`;
  updateTotalPrice();
}

function updateTotalPrice() {
  const customerCart = document.getElementById("cart-container");
  let sum = 0;
  for (const product of customerCart.children) {
    const currentPrice = product.querySelector("p").textContent.substring(1);
    sum += Number(currentPrice);
  }
  const formatted = sum.toFixed(2);
  document.getElementById("total").textContent = `Total: $${formatted}`;
}

function renderCart(products) {
  const jsonCart = JSON.parse(localStorage.getItem("cart"));

  if (jsonCart) {
    Object.entries(jsonCart).forEach((entry) => {
      const product = products.find(({ id }) => id === Number(entry[0]));
      document
        .getElementById("cart-container")
        .append(getCartProduct(product, entry[1]));
    });
    updateTotalPrice();
  }
}

function clearCart() {
  localStorage.removeItem("cart");
  document.getElementById("cart-container").replaceChildren();
  updateTotalPrice();
}

const alertDiv = document.getElementById('alertDiv')

const appendAlert = (message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')
  alertDiv.replaceChildren(wrapper);
}

const purchaseButton = document.getElementById('cartPurchaseButton')
if (purchaseButton) {
  purchaseButton.addEventListener('click', () => {
    appendAlert('Thank you for your purchase!', 'success')
  })
}

