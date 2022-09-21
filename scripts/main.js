// Add event listener to all add to cart buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', e => {
      console.log(e)
      //TODO: Add to cart logic
    })
  });

// Add event listener to all add to cart buttons
document.querySelectorAll('.add-to-wishlist').forEach(button => {
    button.addEventListener('click', e => {
    let id = e.target.getAttribute('class');
        addToCart(id)
    })
  });

  function addToCart(id) {
      console.log(id)
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
