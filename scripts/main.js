const currentLocation = window.location.pathname;

// Add event listener to all add to cart buttons
document.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', (e) => {
        const gameId = e.target.dataset.gameid;
        addToCart(parseInt(gameId));
    });
});

// Add event listener to all add to wishlist buttons
document.querySelectorAll('.add-to-wishlist').forEach((button) => {
    button.addEventListener('click', (e) => {
        const gameId = e.target.dataset.gameid;
        addToWhishlist(parseInt(gameId));
    });
});

// Add event listener to all cart quantity inputs

function renderCartItems() {
    // Logic for rendering cart content
    let cartContent = JSON.parse(sessionStorage.getItem('cart'));
    const cart = document.querySelector('#cart-body');
    let cartItems = '';
    let cartTotal = 0;
    if (!cartContent || cartContent.length === 0) {
        cartItems = ` 
        <tr id="empty-cart">
          <td style="width: 100%; margin-block: 5rem">The cart is empty!</td>
        </tr>`;
        cart.innerHTML = cartItems;
        document.querySelector('#cart-total').innerText = cartTotal + 'kr';
        return;
    }
    console.log(cartContent);
    cartContent.forEach((item) => {
        const product = PRODUCTS.find((p) => p.id === item.id);
        cartTotal += product.price * item.quantity;
        cartItems += `
        <tr>
          <td>
              <img
              class="product-image"
              src="${product?.image}"
              alt="Cover"
              height="150"
              />
          </td>
          <td>
              <h2 class="title">${product?.title}</h2>
          </td>
          <td>
              <input 
                id="qty-${item?.id}" 
                class="cart-qty"
                type="number" 
                name="qty" 
                min="0" 
                value="${item?.quantity}" 
                data-gameid="${item?.id}"
              />
          </td>
          <td>${product?.price} kr</td>
          <td>${product?.price * item?.quantity} kr</td>
        </tr>
        `;
        cart.innerHTML = cartItems;
    });
    document.querySelector('#cart-total').innerText = cartTotal + 'kr';
    document.querySelectorAll('.cart-qty').forEach((input) => {
        input.addEventListener('input', (e) => {
            handleUpdateCartQty(e);
        });
    });
}

function handleUpdateCartQty(e) {
    updateCartQty(+e.target.attributes['data-gameid'].value, +e.target.value);
}

// function showToast(message) {
//     const toast = document.querySelector('#toast');
//     toast.innerText = message;
//     toast.classList.add('active');
//     setTimeout(() => {
//         toast.classList.remove('active');
//     }, 3000);
// }

function updateCartBadge() {
    const indicator = document.getElementById('basket-indicator');
    let itemsInCart = 0;
    let cartContent = JSON.parse(sessionStorage.getItem('cart'));
    cartContent.forEach((item) => {
        itemsInCart = itemsInCart + item.quantity;
    });
    if (!itemsInCart) {
        indicator.classList.add('hidden');
        return;
    }
    indicator.innerText = itemsInCart;
    indicator.classList.remove('hidden');
}

function addToCart(gameId) {
    let cartContent = sessionStorage.getItem('cart');
    if (cartContent) {
        cartContent = JSON.parse(cartContent);
        let obj = cartContent.find((o) => o.id === gameId);
        if (obj) {
            obj.quantity++;
        } else {
            cartContent.push({ id: parseInt(gameId), quantity: 1 });
        }
    } else {
        cartContent = [];
        cartContent.push({ id: parseInt(gameId), quantity: 1 });
    }
    let itemsInCart = 0;
    cartContent.forEach((item) => {
        itemsInCart + item.quantity;
    });
    sessionStorage.setItem('cart', JSON.stringify(cartContent));
    updateCartBadge();
}

function updateCartQty(gameId, qty) {
    let cartContent = JSON.parse(sessionStorage.getItem('cart'));
    if (!cartContent) return;
    if (qty === 0) {
        removeFromCart(gameId);
        renderCartItems();
        return;
    }
    const obj = cartContent.find((o) => o.id === gameId);
    obj.quantity = qty;
    sessionStorage.setItem('cart', JSON.stringify(cartContent));
    renderCartItems();
    updateCartBadge();
}

function removeFromCart(gameId) {
    let cartContent = JSON.parse(sessionStorage.getItem('cart'));
    if (!cartContent || cartContent.length === 0) return;
    const i = cartContent.findIndex((o) => o.id === gameId);
    if (i < 0) return;
    cartContent.splice(i, 1);
    sessionStorage.setItem('cart', JSON.stringify(cartContent));
    renderCartItems();
    updateCartBadge();
}

function addToWhishlist(id) {
    console.log(id);
}

// Hamburger meny
function openMenu() {
    const mobileMenu = document.querySelector('#mobile-menu');
    mobileMenu.classList.add('active');
}

function closeMenu() {
    const mobileMenu = document.querySelector('#mobile-menu');
    mobileMenu.classList.remove('active');
}

// On Load render cart content if on cart page
window.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    if (currentLocation === '/basket.html') {
        renderCartItems();
    }
});
