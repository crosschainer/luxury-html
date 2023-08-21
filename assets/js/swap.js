// Lamden dApp
const detail = JSON.stringify({
  appName: 'Luxuro',
  version: '1.0.0',
  logo: 'logo.svg',
  contractName: 'con_test_swap1',
  networkType: 'mainnet',
  networkName: 'arko'
})
const detail_decoded = JSON.parse(detail);

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
const input_amount = document.getElementById('input-amount')
const output_amount = document.getElementById('output-amount')

// Pools page
const add_liquidity_buttons = document.querySelectorAll('.add-liquidity')
const remove_liquidity_buttons = document.querySelectorAll('.remove-liquidity')
const claim_rewards_buttons = document.querySelectorAll('.claim-rewards')
const create_pool_button = document.getElementById('create-pool-button')
const create_pool_token_1 = document.getElementById('create-pool-token-1')
const create_pool_token_2 = document.getElementById('create-pool-token-2')
const create_pool_input_1 = document.getElementById('create-pool-input-1')
const create_pool_input_2 = document.getElementById('create-pool-input-2')
const create_pool = document.getElementById('create-pool')

// Custom Token Selector
const tokenSelect = document.querySelector('.custom-select')
const searchInput = tokenSelect.querySelector('.search-input')
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

function updateCreatePoolBalances () {
  pullBalance(create_pool_token_1.dataset.contract, address).then(balance => {
    document.getElementById('create-pool-balance-1').innerHTML = balance
  })
  pullBalance(create_pool_token_2.dataset.contract, address).then(balance => {
    document.getElementById('create-pool-balance-2').innerHTML = balance
  })
}

async function checkApprovalsCreatePool() {
  try {
    const approval_1 = await getApproval(
      create_pool_token_1.dataset.contract,
      address,
      detail_decoded.contractName
    );
    
    const approval_2 = await getApproval(
      create_pool_token_2.dataset.contract,
      address,
      detail_decoded.contractName
    );

    if (approval_1 < create_pool_input_1.value || approval_2 < create_pool_input_2.value) {
      create_pool.innerHTML =
        "Approve Tokens";
    }
    
    
    if (
      approval_1 >= create_pool_input_1.value &&
      approval_2 >= create_pool_input_2.value
    ) {
      create_pool.innerHTML = "Create Pool";
    }
    return true;
  } catch (error) {
    console.error('An error occurred:', error);
    // Handle the error if needed
    return false;
  }
}

async function checkApprovalSwap() {
  try {
    const approval_1 = await getApproval(
      from_token,
      address,
      detail_decoded.contractName
    );
    
    
    if (approval_1 < input_amount.value) {
      swap_button.innerHTML = "Approve Tokens";
    }
    
    if (
      approval_1 >= input_amount.value
    ) {
      swap_button.innerHTML = "Swap";
    }
    return true;
  } catch (error) {
    console.error('An error occurred:', error);
    // Handle the error if needed
    return false;
  }
}

function handleTokenOptionClick (event) {
  event.stopPropagation()
  const option = event.currentTarget
  const tokenName = option.dataset.token
  const tokenIcon = option.querySelector('img').src
  const tokenContract = option.dataset.contract

  selectedToken.dataset.contract = tokenContract
  selectedToken.innerHTML = `
    <img src="${tokenIcon}" alt="${tokenName}" class="token-image" />
    <span>${tokenName}</span>
  `

  tokenSelect.classList.remove('open')
}

function attachEventListenersToTokenOptions () {
  const tokenOptions = document.querySelectorAll('.token-option')
  tokenOptions.forEach(option => {
    option.addEventListener('click', handleTokenOptionClick)
  })
}

function ImgError (source) {
  source.src = 'assets/img/no-icon.svg'
  source.onerror = ''
  return true
}

async function updateTokenList () {
  pullAvailableTokens().then(tokens => {
    tokenList.innerHTML = ''
    tokens.forEach(token => {
      if (token.TokenContract == 'currency') {
        tokenList.innerHTML += `
        <li class="token-option" data-token="${token.TokenName}" data-contract="${token.TokenContract}">
          <img src="assets/img/lamden.svg" alt="${token.TokenName}" class="token-image" />
          <span>${token.TokenName}</span>
        </li>
      `
      } else {
        tokenList.innerHTML += `
        <li class="token-option" data-token="${token.TokenName}" data-contract="${token.TokenContract}">
          <img src="https://static.tauhq.com/file/wwwtauhqcom/img/token_logo/${token.TokenContract}.jpg" onerror="ImgError(this)" alt="${token.TokenName}" class="token-image" />
          <span>${token.TokenName}</span>
        </li>
      `
      }
    })
    // After updating the HTML, reattach event listeners
    attachEventListenersToTokenOptions()
  })
}

function checkWalletConnection () {
  if (installed == false) {
    Toastify({
      text: 'Please install Lamden Vault first.',
      duration: 3000,
      gravity: 'bottom', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      stopOnFocus: false, // Prevents dismissing of toast on hover
      style: {
        background: '#FF2400',
        color: '#fff'
      },
      onClick: function () {} // Callback after click
    }).showToast()
    return false
  } else if (locked == true) {
    Toastify({
      text: 'Please unlock your Lamden Vault first.',
      duration: 3000,
      gravity: 'bottom', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      stopOnFocus: false, // Prevents dismissing of toast on hover
      style: {
        background: '#FF2400',
        color: '#fff'
      },
      onClick: function () {} // Callback after click
    }).showToast()
    return false
  } else if (installed == true && locked == false && address == null) {
    document.dispatchEvent(new CustomEvent('lamdenWalletConnect', { detail }))
    return false
  } else if (installed == true && locked == false && address != null) {
    return true
  }
}

function updateAddLiquidityModal (tokens) {
  pullBalance(tokens[0], address).then(balance => {
    document.getElementById('add-liquidity-balance-1').innerHTML = balance
  })
  pullBalance(tokens[1], address).then(balance => {
    document.getElementById('add-liquidity-balance-2').innerHTML = balance
  })
}

numericInputs.forEach(input => {
  input.addEventListener('input', event => {
    sanitizeInput(event.target)
    if (event.target.id == 'create-pool-input-1' || event.target.id == 'create-pool-input-2') {
      checkApprovalsCreatePool()
    }
    if (event.target.id == 'input-amount') {
      checkApprovalSwap()
    }
  })
  input.addEventListener('paste', event => {
    // Delay the sanitization process to handle pasted content
    setTimeout(function () {
      sanitizeInput(event.target)
      if (event.target.id == 'create-pool-input-1' || event.target.id == 'create-pool-input-2') {
        checkApprovalsCreatePool()
      }
      if (event.target.id == 'input-amount') {
        checkApprovalSwap()
      }
    }, 0)
  })
})

document.addEventListener('readystatechange', () => {
  if (document.readyState == 'complete') {
    document.dispatchEvent(new CustomEvent('lamdenWalletGetInfo'))
    updateTokenList()
    setTimeout(function () {
      connect_button.addEventListener('click', event => {
        event.preventDefault()
        checkWalletConnection()
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
      swap_button.innerText = 'Swap'
      updateSwapBalances()
    }
  } else if (response.detail.errors[0] == 'Lamden Vault is Locked') {
    locked = true
  }
})

document.addEventListener('lamdenWalletTxStatus', response => {
  console.log(response.detail);
  if (response.detail.data.resultInfo.title == 'Transaction Pending') {
    Toastify({
      text: 'The transaction is pending.',
      duration: 3000,
      gravity: 'bottom', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      stopOnFocus: false, // Prevents dismissing of toast on hover
      style: {
        background: '#FFE300',
        color: '#000'
      },
      onClick: function () {} // Callback after click
    }).showToast()
  }

  if (response.detail.data.resultInfo.title == 'Transaction Successful') {
    Toastify({
      text: 'The transaction was successful.',
      duration: 3000,
      gravity: 'bottom', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      stopOnFocus: false, // Prevents dismissing of toast on hover
      style: {
        background: '#1A8917',
        color: '#fff'
      },
      onClick: function () {} // Callback after click
    }).showToast()
  }
  if (response.detail.data.resultInfo.title == 'Transaction Failed') {
    Toastify({
      text: 'The transaction failed.',
      duration: 3000,
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
  if (response.detail.data.resultInfo.title == 'Transaction Cancelled') {
    Toastify({
      text: 'The transaction was cancelled.',
      duration: 3000,
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
  checkApprovalsCreatePool();
  checkApprovalSwap();
  document.dispatchEvent(new CustomEvent('lamdenWalletGetInfo'))
})

swap_button.addEventListener('click', event => {
  event.preventDefault()
  connection = checkWalletConnection()
  if (connection) {
    swap()
  }
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
    checkApprovalSwap()
})

document.getElementById('to-balance').addEventListener('click', event => {
  event.preventDefault()
  document.getElementById('output-amount').value =
    document.getElementById('to-balance').innerHTML
    checkApprovalSwap()
})

document
  .getElementById('add-liquidity-balance-1')
  .addEventListener('click', event => {
    event.preventDefault()
    document.getElementById('add-liquidity-input-1').value =
      document.getElementById('add-liquidity-balance-1').innerHTML
  })

document
  .getElementById('add-liquidity-balance-2')
  .addEventListener('click', event => {
    event.preventDefault()
    document.getElementById('add-liquidity-input-2').value =
      document.getElementById('add-liquidity-balance-2').innerHTML
  })

document
  .getElementById('remove-liquidity-balance')
  .addEventListener('click', event => {
    event.preventDefault()
    document.getElementById('remove-liquidity-input').value =
      document.getElementById('remove-liquidity-balance').innerHTML
  })

document
  .getElementById('create-pool-balance-1')
  .addEventListener('click', event => {
    event.preventDefault()
    document.getElementById('create-pool-input-1').value =
      document.getElementById('create-pool-balance-1').innerHTML
    checkApprovalsCreatePool();
  })

document
  .getElementById('create-pool-balance-2')
  .addEventListener('click', event => {
    event.preventDefault()
    document.getElementById('create-pool-input-2').value =
      document.getElementById('create-pool-balance-2').innerHTML
    checkApprovalsCreatePool();
  })

document
  .getElementById('create-pool-token-1')
  .addEventListener('click', event => {
    event.preventDefault()
    MicroModal.show('token-select-modal')
    opened_modal = 'create-pool-token-1'
  })

document
  .getElementById('create-pool-token-2')
  .addEventListener('click', event => {
    event.preventDefault()
    MicroModal.show('token-select-modal')
    opened_modal = 'create-pool-token-2'
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

create_pool_button.addEventListener('click', event => {
  event.preventDefault()
  connection = checkWalletConnection()
  if (connection) {
    updateCreatePoolBalances()
    
      MicroModal.show('create-pool-modal')
      opened_modal = 'create-pool'
    
  }
})

create_pool.addEventListener('click', event => {
  event.preventDefault()
  connection = checkWalletConnection()
  if (connection) {
    createPool()
  }
})

add_liquidity_buttons.forEach(button => {
  button.addEventListener('click', event => {
    event.preventDefault()
    connection = checkWalletConnection()
    if (connection) {
      tokens = event.target.dataset.tokens.split(';')
      updateAddLiquidityModal(tokens)
      MicroModal.show('add-liquidity-modal')
      opened_modal = 'add-liquidity'
    }
  })
})

remove_liquidity_buttons.forEach(button => {
  button.addEventListener('click', event => {
    event.preventDefault()
    connection = checkWalletConnection()
    if (connection) {
      MicroModal.show('remove-liquidity-modal')
      opened_modal = 'remove-liquidity'
    }
  })
})

claim_rewards_buttons.forEach(button => {
  button.addEventListener('click', event => {
    event.preventDefault()
    connection = checkWalletConnection()
    if (connection) {
      Toastify({
        text: 'Not implemented!',
        duration: 3000,
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
  let tokenOptions = tokenList.querySelectorAll('.token-option')

  tokenOptions.forEach(option => {
    const tokenName = option.dataset.token.toLowerCase()
    option.style.display = tokenName.includes(searchTerm) ? 'flex' : 'none'
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
    updateSwapBalances()
  }

  if (opened_modal == 'output') {
    const selectedContract = selectedToken.dataset.contract

    // Check if the selected token is the same as the 'from_token'
    if (selectedContract === from_token) {
      // Display an error message or handle the case as needed
      Toastify({
        text: 'Cannot select the same token for both sides.',
        duration: 3000,
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
    updateSwapBalances()
  }

  if (opened_modal == 'create-pool-token-1') {
    const selectedContract = selectedToken.dataset.contract

    // Check if the selected token is the same as the 'to_token'
    if (selectedContract === create_pool_token_2.dataset.contract) {
      // Display an error message or handle the case as needed
      Toastify({
        text: 'Cannot select the same token for both sides.',
        duration: 3000,
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

    create_pool_token_1.dataset.contract = selectedContract
    create_pool_token_1.src = selectedToken.querySelector('img').src
    create_pool_token_1.alt = selectedToken.querySelector('span').innerHTML

    updateCreatePoolBalances()
    checkApprovalsCreatePool()
    MicroModal.close('token-select-modal')
  }

  if (opened_modal == 'create-pool-token-2') {
    const selectedContract = selectedToken.dataset.contract

    // Check if the selected token is the same as the 'to_token'
    if (selectedContract === create_pool_token_1.dataset.contract) {
      // Display an error message or handle the case as needed
      Toastify({
        text: 'Cannot select the same token for both sides.',
        duration: 3000,
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

    create_pool_token_2.dataset.contract = selectedContract
    create_pool_token_2.src = selectedToken.querySelector('img').src
    create_pool_token_2.alt = selectedToken.querySelector('span').innerHTML
    updateCreatePoolBalances()
    checkApprovalsCreatePool()
    MicroModal.close('token-select-modal')
  }
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

// temp fix for close create pool modal bcz when token select was open on top of it, it was not closing anymore
const closeCreatePoolModal = document.querySelector(
  '#create-pool-modal .modal__close'
)
const closeBtn = document.querySelector('#create-pool-modal .modal__btn-close')
closeCreatePoolModal.addEventListener('click', () => {
  MicroModal.close('create-pool-modal')
})
closeBtn.addEventListener('click', () => {
  MicroModal.close('create-pool-modal')
})
