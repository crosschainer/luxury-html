function approveToken (contract, amount, spender) {
  return new Promise((resolve, reject) => {
    let current_approved_amount = 0
    getApproval(contract, address, spender)
      .then(approved_amount => {
        current_approved_amount = approved_amount
        if (approved_amount < amount) {
          let left_to_approve =  approved_amount - amount
          left_to_approve = left_to_approve.toFixed(8)
          console.log('Approving ' + left_to_approve + ' tokens')
          const detail = JSON.stringify({
            contractName: contract,
            methodName: 'approve',
            networkName: 'arko',
            networkType: 'mainnet',
            kwargs: {
              amount: Number(left_to_approve),
              to: spender
            },
            stampLimit: 100
          })
          document.dispatchEvent(new CustomEvent('lamdenWalletSendTx', { detail }))
          resolve(false) // Approval initiated, resolving with false
        } else {
          console.log('Already approved ' + approved_amount + ' tokens')
          resolve(true) // Already approved, resolving with true
        }
      })
      .catch(error => {
        console.error('An error occurred:', error)
        reject(error) // Rejecting with the error
      })
  })
}

async function createPool () {
  let token_list = [
    {
      contract: create_pool_token_1.dataset.contract,
      amount: Number(document.getElementById('create-pool-input-1').value)
    },
    {
      contract: create_pool_token_2.dataset.contract,
      amount: Number(document.getElementById('create-pool-input-2').value)
    }
  ]
  let fee = document.getElementById('create-pool-input-3').value
  if (fee < 0.1 || fee > 10) {
    Toastify({
      text: 'Fee Percentage must be between 0.1 and 10',
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
    return
  }
  let approved_token_1 = await approveToken(
    token_list[0]['contract'],
    token_list[0]['amount'],
    detail_decoded['contractName']
  )
  let approved_token_2 = await approveToken(
    token_list[1]['contract'],
    token_list[1]['amount'],
    detail_decoded['contractName']
  )
  console.log(approved_token_1, approved_token_2)
  if (approved_token_1 && approved_token_2) {
    const detail = JSON.stringify({
      contractName: detail_decoded['contractName'],
      methodName: 'create_pool',
      networkName: 'arko',
      networkType: 'mainnet',
      kwargs: {
        tokens: JSON.stringify(token_list),
        fee: Number(fee)
      },
      stampLimit: 500
    })
    document.dispatchEvent(new CustomEvent('lamdenWalletSendTx', { detail }))
  }
}

async function swap () {
  let approved_token_1 = await approveToken(
    from_token,
    input_amount.value,
    detail_decoded['contractName']
  )
  if (approved_token_1) {
    const detail = JSON.stringify({
      contractName: detail_decoded['contractName'],
      methodName: 'swap',
      networkName: 'arko',
      networkType: 'mainnet',
      kwargs: {
        token_from: from_token,
        token_to: to_token,
        amount: Number(input_amount.value),
        max_slippage: Number(slippage_tolerance)
      },
      stampLimit: 500
    })
    document.dispatchEvent(new CustomEvent('lamdenWalletSendTx', { detail }))
  }
}