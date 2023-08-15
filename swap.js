// Global
const connect_button = document.getElementById("connect-wallet");

// Swap page
const swap_button = document.getElementById("swap-button");
const input_button = document.getElementById("input-image");
const output_button = document.getElementById("output-image");
const switch_button = document.getElementById("switch-button");
const slippage_button = document.getElementById("slippage-button");

// Pools page
const add_liquidity_buttons = document.querySelectorAll(".add-liquidity");
const remove_liquidity_buttons = document.querySelectorAll(".remove-liquidity");
const claim_rewards_buttons = document.querySelectorAll(".claim-rewards");

// Custom Token Selector
const tokenSelect = document.querySelector(".custom-select");
const searchInput = tokenSelect.querySelector(".search-input");
const tokenOptions = tokenSelect.querySelectorAll(".token-option");

MicroModal.init();

swap_button.addEventListener("click", (event) => {
    event.preventDefault();
    Toastify({
        text: "Not implemented!",
        duration: 3000,
        avatar: "x-icon.svg",
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: false, // Prevents dismissing of toast on hover
        style: {
          background: "#FF2400",
          color: "#fff",
        },
        onClick: function(){} // Callback after click
      }).showToast();
});

input_button.addEventListener("click", (event) => {
    event.preventDefault();
    MicroModal.show('token-select-modal'); 
});

output_button.addEventListener("click", (event) => {
    event.preventDefault();
    MicroModal.show('token-select-modal'); 
});

switch_button.addEventListener("click", (event) => {
    event.preventDefault();
    Toastify({
        text: "Not implemented!",
        duration: 3000,
        avatar: "x-icon.svg",
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: false, // Prevents dismissing of toast on hover
        style: {
          background: "#FF2400",
          color: "#fff",
        },
        onClick: function(){} // Callback after click
      }).showToast();
});

slippage_button.addEventListener("click", (event) => {
    event.preventDefault();
    MicroModal.show("slippage-settings-modal"); 
});

add_liquidity_buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        Toastify({
            text: "Not implemented!",
            duration: 3000,
            avatar: "x-icon.svg",
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: false, // Prevents dismissing of toast on hover
            style: {
              background: "#FF2400",
              color: "#fff",
            },
            onClick: function(){} // Callback after click
          }).showToast();
    });
});

remove_liquidity_buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        Toastify({
            text: "Not implemented!",
            duration: 3000,
            avatar: "x-icon.svg",
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: false, // Prevents dismissing of toast on hover
            style: {
              background: "#FF2400",
              color: "#fff",
            },
            onClick: function(){} // Callback after click
          }).showToast();
    });
});

claim_rewards_buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        Toastify({
            text: "Not implemented!",
            duration: 3000,
            avatar: "x-icon.svg",
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: false, // Prevents dismissing of toast on hover
            style: {
              background: "#FF2400",
              color: "#fff",
            },
            onClick: function(){} // Callback after click
          }).showToast();
    });
});

connect_button.addEventListener("click", (event) => {
    event.preventDefault();
    Toastify({
        text: "Not implemented!",
        duration: 3000,
        avatar: "x-icon.svg",
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: false, // Prevents dismissing of toast on hover
        style: {
          background: "#FF2400",
          color: "#fff",
        },
        onClick: function(){} // Callback after click
      }).showToast();
});

tokenSelect.addEventListener("click", () => {
  tokenSelect.classList.toggle("open");
});

searchInput.addEventListener("click", (event) => {
  event.stopPropagation();
});

searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  
  tokenOptions.forEach(option => {
    const tokenName = option.dataset.token.toLowerCase();
    option.style.display = tokenName.includes(searchTerm) ? 'block' : 'none';
  });
});
