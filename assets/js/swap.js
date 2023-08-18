// Lamden dApp
const detail = JSON.stringify({
  appName: 'Luxuro',
  version: '1.0.0',
  logo: 'logo.svg',
  contractName: 'currency',
  networkType: 'mainnet',
  networkName: 'arko'
})

var installed = false
var address = null
var locked = false

// Global
const connect_button = document.getElementById('connect-wallet')

// Swap page
const swap_button = document.getElementById('swap-button')
const input_button = document.getElementById('input-image')
const output_button = document.getElementById('output-image')
const switch_button = document.getElementById('switch-button')
const slippage_button = document.getElementById('slippage-button')

// Pools page
const add_liquidity_buttons = document.querySelectorAll('.add-liquidity')
const remove_liquidity_buttons = document.querySelectorAll('.remove-liquidity')
const claim_rewards_buttons = document.querySelectorAll('.claim-rewards')

// Custom Token Selector
const tokenSelect = document.querySelector('.custom-select')
const searchInput = tokenSelect.querySelector('.search-input')
const tokenOptions = tokenSelect.querySelectorAll('.token-option')
const tokenList = tokenSelect.querySelector('.token-list')
const selectedToken = tokenSelect.querySelector('.selected-item')
const selectButton = document.getElementById('select-button')

// Slippage Save
const slippageSave = document.getElementById('slippage-save')

// Storage
const storage = window.localStorage

// Helper storage
var opened_modal = null
var from_token = 'currency'
var to_token = 'con_luxuro'

// Numeric Inputs sanitization
const numericInputs = document.querySelectorAll('.numeric-input')

// Default values
var slippage_tolerance = storage.getItem('slippage_tolerance') || 1.0
document.getElementById('slippage-tolerance').innerHTML = slippage_tolerance
document.getElementById('slippage-input').value = slippage_tolerance

MicroModal.init()

function sanitizeInput (inputElement) {
  let sanitizedValue = inputElement.value.replace(/,/g, '.')

  // Remove non-numeric and non-dot characters
  sanitizedValue = sanitizedValue.replace(/[^0-9.]/g, '')

  // Remove extra dots
  sanitizedValue = sanitizedValue.replace(/\.{2,}/g, '.')

  inputElement.value = sanitizedValue
}

function updateSwapBalances () {
  pullBalance(from_token, address).then(balance => {
    document.getElementById('from-balance').innerHTML = balance
  })
  pullBalance(to_token, address).then(balance => {
    document.getElementById('to-balance').innerHTML = balance
  })
}

function executeSwap(){
  if (installed == false) {
    Toastify({
      text: 'Please install Lamden Vault first.',
      duration: 3000,
      avatar: 'assets/img/x-icon.svg',
      gravity: 'bottom', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      stopOnFocus: false, // Prevents dismissing of toast on hover
      style: {
        background: '#FF2400',
        color: '#fff'
      },
      onClick: function () {} // Callback after click
    }).showToast()
    return
  }
  else if (locked == true) {
    Toastify({
      text: 'Please unlock your Lamden Vault first.',
      duration: 3000,
      avatar: 'assets/img/x-icon.svg',
      gravity: 'bottom', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      stopOnFocus: false, // Prevents dismissing of toast on hover
      style: {
        background: '#FF2400',
        color: '#fff'
      },
      onClick: function () {} // Callback after click
    }).showToast()
    return
  }
  else if (installed == true && locked == false && address == null) {
    document.dispatchEvent(
      new CustomEvent('lamdenWalletConnect', { detail })
    )
  }
  else if (installed == true && locked == false && address != null) {
    Toastify({
      text: 'Not implemented!',
      duration: 3000,
      avatar: 'assets/img/x-icon.svg',
      gravity: 'bottom', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      stopOnFocus: false, // Prevents dismissing of toast on hover
      style: {
        background: '#FF2400',
        color: '#fff'
      },
      onClick: function () {} // Callback after click
    }).showToast()
  }
}


function updateAddLiquidityBalances () {
  /*pullBalance('con_luxuro', address).then(balance => {
    document.getElementById('add-liquidity-balance-1').innerHTML = balance
  })
  pullBalance('con_lamden_token', address).then(balance => {
    document.getElementById('add-liquidity-balance-1').innerHTML = balance
  })*/
}

numericInputs.forEach(input => {
  input.addEventListener('input', event => {
    sanitizeInput(event.target)
  })
  input.addEventListener('paste', event => {
    // Delay the sanitization process to handle pasted content
    setTimeout(function () {
      sanitizeInput(event.target)
    }, 0)
  })
})

document.addEventListener('readystatechange', () => {
  if (document.readyState == 'complete') {
    document.dispatchEvent(new CustomEvent('lamdenWalletGetInfo'))

    setTimeout(function () {
      connect_button.addEventListener('click', event => {
        event.preventDefault()
        document.dispatchEvent(new CustomEvent('lamdenWalletGetInfo'))
        if (installed == false) {
          Toastify({
            text: 'Please install Lamden Vault first.',
            duration: 3000,
            avatar: 'assets/img/x-icon.svg',
            gravity: 'bottom', // `top` or `bottom`
            position: 'right', // `left`, `center` or `right`
            stopOnFocus: false, // Prevents dismissing of toast on hover
            style: {
              background: '#FF2400',
              color: '#fff'
            },
            onClick: function () {} // Callback after click
          }).showToast()
          return
        }
        if (locked == true) {
          Toastify({
            text: 'Please unlock your Lamden Vault first.',
            duration: 3000,
            avatar: 'assets/img/x-icon.svg',
            gravity: 'bottom', // `top` or `bottom`
            position: 'right', // `left`, `center` or `right`
            stopOnFocus: false, // Prevents dismissing of toast on hover
            style: {
              background: '#FF2400',
              color: '#fff'
            },
            onClick: function () {} // Callback after click
          }).showToast()
          return
        }
        if (installed == true) {
          document.dispatchEvent(
            new CustomEvent('lamdenWalletConnect', { detail })
          )
        }
      })
    }, 1000)
  }
})

document.addEventListener('lamdenWalletInfo', response => {
  installed = true
  if (response.detail.errors === undefined) {
    address = response.detail.wallets[0]
    if (response.detail.locked == false) {
      locked = false
      connect_button.innerText = address.slice(0, 5) + '...'
      connect_button.classList.add('connected-border')
      swap_button.innerText = 'Swap';
      updateSwapBalances()
    }
  } else if (response.detail.errors[0] == 'Lamden Vault is Locked') {
    locked = true
  }
})

swap_button.addEventListener('click', event => {
  event.preventDefault()
  executeSwap()
})

input_button.addEventListener('click', event => {
  event.preventDefault()
  MicroModal.show('token-select-modal')
  opened_modal = 'input'
})

document.getElementById('from-balance').addEventListener('click', event => {
  event.preventDefault()
  document.getElementById('input-amount').value =
    document.getElementById('from-balance').innerHTML
})

document.getElementById('to-balance').addEventListener('click', event => {
  event.preventDefault()
  document.getElementById('output-amount').value =
    document.getElementById('to-balance').innerHTML
})

output_button.addEventListener('click', event => {
  event.preventDefault()
  MicroModal.show('token-select-modal')
  opened_modal = 'output'
})

slippage_button.addEventListener('click', event => {
  event.preventDefault()
  MicroModal.show('slippage-settings-modal')
  opened_modal = 'slippage'
})

add_liquidity_buttons.forEach(button => {
  button.addEventListener('click', event => {
    event.preventDefault()
    updateAddLiquidityBalances();
    MicroModal.show('add-liquidity-modal')
    opened_modal = 'add-liquidity'
  })
})

remove_liquidity_buttons.forEach(button => {
  button.addEventListener('click', event => {
    event.preventDefault()
    MicroModal.show('remove-liquidity-modal')
    opened_modal = 'remove-liquidity'
  })
})

claim_rewards_buttons.forEach(button => {
  button.addEventListener('click', event => {
    event.preventDefault()
    Toastify({
      text: 'Not implemented!',
      duration: 3000,
      avatar: 'assets/img/x-icon.svg',
      gravity: 'bottom', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      stopOnFocus: false, // Prevents dismissing of toast on hover
      style: {
        background: '#FF2400',
        color: '#fff'
      },
      onClick: function () {} // Callback after click
    }).showToast()
  })
})

tokenSelect.addEventListener('click', () => {
  tokenSelect.classList.toggle('open')
})

searchInput.addEventListener('click', event => {
  event.stopPropagation()
})

searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.trim().toLowerCase()

  tokenOptions.forEach(option => {
    const tokenName = option.dataset.token.toLowerCase()
    option.style.display = tokenName.includes(searchTerm) ? 'block' : 'none'
  })
})

tokenOptions.forEach(option => {
  option.addEventListener('click', () => {
    event.stopPropagation()
    const tokenName = option.dataset.token
    const tokenIcon = option.querySelector('img').src
    const tokenContract = option.dataset.contract

    selectedToken.dataset.contract = tokenContract
    selectedToken.innerHTML = `
      <img src="${tokenIcon}" alt="${tokenName}" class="token-image" />
      <span>${tokenName}</span>
    `

    tokenSelect.classList.remove('open')
  })
})

slippageSave.addEventListener('click', event => {
  event.preventDefault()
  slippage_tolerance = document.getElementById('slippage-input').value
  // If slippage tolerance is not a number, set it to 1.0
  if (isNaN(slippage_tolerance)) {
    slippage_tolerance = 1.0
  }
  // If slippage tolerance is less than 0.1, set it to 0.1
  if (slippage_tolerance < 0.1) {
    slippage_tolerance = 0.1
  }
  // If slippage tolerance is greater than 49.9, set it to 49.9
  if (slippage_tolerance > 49.9) {
    slippage_tolerance = 49.9
  }
  // Max 1 decimal
  slippage_tolerance = Math.round(slippage_tolerance * 10) / 10
  document.getElementById('slippage-input').value = slippage_tolerance
  document.getElementById('slippage-tolerance').innerHTML = slippage_tolerance
  storage.setItem('slippage_tolerance', slippage_tolerance)
  MicroModal.close('slippage-settings-modal')
})

selectButton.addEventListener('click', event => {
  if (opened_modal == 'input') {
    const selectedContract = selectedToken.dataset.contract

    // Check if the selected token is the same as the 'to_token'
    if (selectedContract === to_token) {
      // Display an error message or handle the case as needed
      Toastify({
        text: 'Cannot select the same token for both sides.',
        duration: 3000,
        avatar: 'assets/img/x-icon.svg',
        gravity: 'bottom', // `top` or `bottom`
        position: 'right', // `left`, `center` or `right`
        stopOnFocus: false, // Prevents dismissing of toast on hover
        style: {
          background: '#FF2400',
          color: '#fff'
        },
        onClick: function () {} // Callback after click
      }).showToast()
      return // Exit the function to prevent further actions
    }

    from_token = selectedContract
    document.getElementById('input-image').src =
      selectedToken.querySelector('img').src
    document.getElementById('from-token-name').innerHTML =
      selectedToken.querySelector('span').innerHTML
    MicroModal.close('token-select-modal')
  }

  if (opened_modal == 'output') {
    const selectedContract = selectedToken.dataset.contract

    // Check if the selected token is the same as the 'from_token'
    if (selectedContract === from_token) {
      // Display an error message or handle the case as needed
      Toastify({
        text: 'Cannot select the same token for both sides.',
        duration: 3000,
        avatar: 'assets/img/x-icon.svg',
        gravity: 'bottom', // `top` or `bottom`
        position: 'right', // `left`, `center` or `right`
        stopOnFocus: false, // Prevents dismissing of toast on hover
        style: {
          background: '#FF2400',
          color: '#fff'
        },
        onClick: function () {} // Callback after click
      }).showToast()
      return // Exit the function to prevent further actions
    }

    to_token = selectedContract
    document.getElementById('output-image').src =
      selectedToken.querySelector('img').src
    document.getElementById('to-token-name').innerHTML =
      selectedToken.querySelector('span').innerHTML
    MicroModal.close('token-select-modal')
  }

  updateSwapBalances()
})

switch_button.addEventListener('click', event => {
  event.preventDefault()
  let temp_token = from_token
  let temp_token_name = document.getElementById('to-token-name').innerHTML
  let temp_image = document.getElementById('output-image').src
  let temp_amount = document.getElementById('output-amount').value
  document.getElementById('output-image').src =
    document.getElementById('input-image').src
  document.getElementById('output-amount').value = ''
  document.getElementById('to-token-name').innerHTML =
    document.getElementById('from-token-name').innerHTML
  document.getElementById('input-image').src = temp_image
  document.getElementById('input-amount').value = temp_amount
  document.getElementById('from-token-name').innerHTML = temp_token_name
  from_token = to_token
  to_token = temp_token
  updateSwapBalances()
})
