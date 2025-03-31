// localStorage.clear();

if (!localStorage.getItem("products")) fetchProducts();

const parsedProducts = JSON.parse(localStorage.getItem("products"));
drawProducts(parsedProducts);

if (localStorage.getItem("cart")) {
  renderCart(parsedProducts);
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

  const minusButton = document.createElement("button");
  minusButton.setAttribute("type", "button");
  minusButton.classList.add("btn", "btn-outline-secondary", "btn-sm");
  minusButton.textContent = "-";
  minusButton.addEventListener("click", function () {
    // decrementProduct(product);
    if (amount.value > 0) {
      amount.value -= 1;
      updatePrice(row);
    }
  });

  const plusButton = document.createElement("button");
  plusButton.setAttribute("type", "button");
  plusButton.classList.add("btn", "btn-outline-secondary", "btn-sm");
  plusButton.textContent = "+";
  plusButton.addEventListener("click", function () {
    incrementProduct(product, amount);
    // amount.value = Number(amount.value) + 1;
    updatePrice(row);
  });

  inputDiv.append(minusButton, amount, plusButton);
  amountDiv.append(inputDiv);

  const priceDiv = document.createElement("div");
  priceDiv.classList.add("col-md-3", "text-center");

  const price = document.createElement("p");
  price.classList.add("fw-bold");
  price.textContent = `$${product.price}`;

  const removeButton = document.createElement("button");
  removeButton.classList.add("btn", "btn-outline-danger", "btn-sm");
  removeButton.textContent = "Remove";
  removeButton.addEventListener("click", function () {
    // removeProduct(product);
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
  card.classList.add("card", "m-3", "h-100");
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
  if (isProductInCart(product, cart)) {
      const amountElement = document.getElementById(`product_${product.id}`).querySelector("input");
      incrementProduct(product.id, amountElement);
  } else {
      if (cart) {
        cart[product.id] = 1;
        localStorage.setItem("cart", JSON.stringify(cart));  
      } else {
        const newCart = {
        [`${product.id}`]: 1,
        };
        localStorage.setItem("cart", JSON.stringify(newCart));
      }
      const cartProduct = getCartProduct(product, 1);
      document.getElementById("cart-container").append(cartProduct);
  }   
}

function incrementProduct(product_id, amountElement) {
  amountElement.value = Number(amountElement.value) +1;


  // const cart = localStorage.getItem("cart");
  // if (cart) {
  //   const json = JSON.parse(cart);
  //   if (json[`${product.id}`]) json[`${product.id}`] += 1;
  //   else json[`${product.id}`] = 1;
  //   localStorage.setItem("cart", JSON.stringify(json));
  // } else {
    
  // }
}

function decrementProduct(product_id) {
  // only for localStorage
}

function removeProduct(product_id) {
  // only for localStorage
}

function updatePrice(row) {
  // update gui for row in modal price * amount
  updateTotalPrice();
}

function updateTotalPrice() {
  // get modal by Id, sum totals, update total
}

function renderCart(products) {
  const jsonCart = JSON.parse(localStorage.getItem("cart"));

  Object.entries(jsonCart).forEach((entry) => {
    const product = products.find(({ id }) => id === Number(entry[0]));
    document
      .getElementById("cart-container")
      .append(getCartProduct(product, entry[1]));
  });
}
