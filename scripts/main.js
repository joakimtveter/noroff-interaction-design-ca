import { showToast } from './toast.js';

const currentLocation = window.location.pathname;

function enableAddToCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach((button) => {
        button.addEventListener('click', (e) => {
            addToCart(parseInt(e.target.dataset.gameid));
        });
    });
}
enableAddToCartButtons();

// Add event listener to all add to wishlist buttons
document.querySelectorAll('.wishlist-btn').forEach((button) => {
    button.addEventListener('click', (e) => {
        toggleWhishlist(parseInt(e.target.dataset.gameid));
    });
});

// RENDER PAGE CONTENT
function renderCartItems() {
    let cartContent = JSON.parse(sessionStorage.getItem('cart'));
    const cart = document.getElementById('cart-body');
    const checkOutBtn = document.getElementById('check-out-btn');
    let cartItems = '';
    let cartTotal = 0;
    if (!cartContent || cartContent.length === 0) {
        cartItems = ` 
        <tr id="empty-cart">
          <td style="width: 100%; margin-block: 5rem; padding-left: 1rem;">The cart is empty!</td>
        </tr>`;
        cart.innerHTML = cartItems;
        document.querySelector('#cart-total').innerText = cartTotal + 'kr';
        checkOutBtn.classList.add('disabled');
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

function renderWishlistItems() {
    const wishlistContainer = document.getElementById('wishlist-container');
    let wishlist = JSON.parse(localStorage.getItem('wishlist'));
    let wishlistItems = '';
    if (!wishlist || wishlist.length === 0) {
        wishlistContainer.innerHTML = `
          <p style="width: 100%; margin-block: 5rem">The wishlist is empty!</p>
        `;
        return;
    }
    wishlist.forEach((item) => {
        const product = PRODUCTS.find((p) => p.id === item);
        wishlistItems += `
        <li>
            <div class="card-large">
                <img
                    class="product-image"
                    src="${product.image}"
                    alt="${product.title} Cover"
                />
                <div class="card-body">
                    <div class="flex flex-center">
                        <a href="/game.html?gameid=${product.id}"><h2 class="title">${product.title}</h2></a>
                    </div>
                    <div class="reviews">
                        <div class="review-container">
                            <div
                                class="rating-stars"
                                style="--rating: ${product.rating}"
                                aria-label="${product.title} has a rating of ${product.rating} out of 5."
                            ></div>
                            <div class="rating">${product.rating}</div>
                        </div>
                        <a href="/review.html?gameid=${product.id}">Write a review</a>
                    </div>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque unde expedita
                        accusantium aliquam ducimus, quasi velit officiis. Illum dolor ea enim mollitia
                        delectus expedita explicabo.
                    </p>
                </div>
                <div class="buy-product">
                    <div class="price-stock">
                        <p class="price">${product.price} kr</p>
                        <p class="stock"><i class="fas fa-box stock-indicator"></i> ${product.stock} in stock</p>
                    </div>
                    <button class="btn primary add-to-cart" data-gameid="${product.id}">Add to cart</button>
                    <button class="link remove-from-wishlist-btn" data-gameid="${product.id}">Remove from wishlist</button>
                </div>
            </div>
        </li>
        `;
    });
    updateWishlistBadge();
    wishlistContainer.innerHTML = wishlistItems;
    document.querySelectorAll('.remove-from-wishlist-btn').forEach((button) => {
        button.addEventListener('click', (e) => {
            console.log('click');
            toggleWhishlist(parseInt(e.target.dataset.gameid));
        });
    });
    enableAddToCartButtons();
}

function handleUpdateCartQty(e) {
    updateCartQty(+e.target.attributes['data-gameid'].value, +e.target.value);
}

function updateCartBadge() {
    const indicator = document.getElementById('basket-indicator');
    let itemsInCart = 0;
    let cartContent = JSON.parse(sessionStorage.getItem('cart'));
    indicator.classList.add('hidden');
    if (!cartContent) return;
    cartContent.forEach((item) => {
        if (item.id) {
            itemsInCart += item.quantity;
        }
    });
    if (itemsInCart > 0) {
        indicator.innerText = itemsInCart;
        indicator.classList.remove('hidden');
    }
}

function addToCart(gameId) {
    if (!gameId) return;
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
    showToast('Game added to cart!', 'info');
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
    showToast('Game removed from cart!', 'error');
}

function updateWishlistBadge() {
    let wishlist = JSON.parse(localStorage.getItem('wishlist'));
    if (!wishlist) return;
    document.querySelectorAll('.wishlist-btn').forEach((button) => {
        if (wishlist.includes(parseInt(button.dataset.gameid))) {
            button.dataset.active = 'true';
        } else {
            button.dataset.active = 'false';
        }
    });
}

function toggleWhishlist(id) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist'));
    if (!wishlist) {
        wishlist = [];
    }
    const i = wishlist.indexOf(+id);
    if (i > -1) {
        wishlist.splice(i, 1);
        showToast('Game removed from wishlist!', 'error');
    } else {
        wishlist.push(+id);
        showToast('Game added to wishlist!', 'success');
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistBadge();
    if (currentLocation === '/wishlist.html') {
        renderWishlistItems();
    }
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
    updateWishlistBadge();
    if (currentLocation === '/basket.html') {
        renderCartItems();
    }
    if (currentLocation === '/wishlist.html') {
        renderWishlistItems();
    }
});
