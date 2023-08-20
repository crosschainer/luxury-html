function approveToken (contract, amount, spender) {
  let current_approved_amount = 0
  getApproval(contract, address, spender).then(approved_amount => {
    current_approved_amount = approved_amount;
    if (approved_amount < amount) {
      let left_to_approve = amount - approved_amount
      left_to_approve = left_to_approve.toFixed(8)
      let tx = JSON.stringify({
        contractName: contract,
        methodName: 'approve',
        networkName: 'arko',
        networkType: 'mainnet',
        kwargs: {
          amount: Number(left_to_approve),
          to: spender
        },
        stampLimit: 100
      });
      document.dispatchEvent(new CustomEvent('lamdenWalletSendTx', { tx }))
      return false
    } else {
      return true
    }
  }).catch(error => {
    console.error('An error occurred:', error)
  })
}

function createPool () {
  let token_list = [
    {
      contract: create_pool_token_1.dataset.contract,
      amount: document.getElementById('create-pool-input-1').value
    },
    {
      contract: create_pool_token_2.dataset.contract,
      amount: document.getElementById('create-pool-input-2').value
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
  approveToken(token_list[0]['contract'], token_list[0]['amount'], detail_decoded['contractName'])
  .then(approved_token_1 => {
    return approveToken(token_list[1]['contract'], token_list[1]['amount'], detail_decoded['contractName']);
  })
  .then(approved_token_2 => {
    if (approved_token_1 && approved_token_2) {
      const tx = JSON.stringify({
        contractName: detail_decoded['contractName'],
        methodName: 'create_pool',
        networkName: 'arko',
        networkType: 'mainnet',
        kwargs: {
          tokens: token_list,
          fee: Number(fee)
        },
        stampLimit: 500,
      });
      document.dispatchEvent(new CustomEvent('lamdenWalletSendTx', { tx }));
    }
  })
  .catch(error => {
    console.error('An error occurred:', error);
  });


  return
}
