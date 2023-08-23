async function pullBalance(contract, address) {
    try {
      const response = await fetch(
        'https://arko-bs-1.lamden.io/current/all/' +
        contract +
        '/balances/' +
        address
      );
  
      const res = await response.json();
  
      let balance = 0;
      try {
        if (res[contract]['balances'][address]['__hash_self__']['__fixed__'] != undefined)
          balance = res[contract]['balances'][address]['__hash_self__']['__fixed__'];
        else if (res[contract]['balances'][address]['__fixed__'] != undefined)
          balance = res[contract]['balances'][address]['__fixed__'];
        else
          balance = res[contract]['balances'][address];
      } catch {
            balance = 0;
      }
  
      return Number(balance).toFixed(8);
    } catch (error) {
      console.error("Error fetching balance:", error);
      return "Error fetching balance";
    }
  }

  async function pullAvailableTokens(){
    try {
      const response = await fetch(
        'https://www.tauhq.com/api/v0/tokens'
      );
  
      const res = await response.json();
      // add 'currency' to the list of tokens
      res.push({
        "ID": 0,
        "TokenContract": "currency",
        "TokenName": "TAU",
        "TokenSymbol": "TAU"

      });

  
      return res;
    } catch (error) {
      console.error("Error fetching tokens:", error);
      return "Error fetching tokens";
    }
  }

  async function getApproval(contract, address, spender) {
    try {
      const response = await fetch(
        'https://arko-bs-1.lamden.io/current/all/' +
        contract +
        '/balances/' +
        address
      );
  
      const res = await response.json();
      
      let balance = 0;
      try {
        if (res[contract]['balances'][address][spender]['__fixed__'] != undefined){
          balance = res[contract]['balances'][address][spender]['__fixed__'];
        }
        else{
          balance = res[contract]['balances'][address][spender];
        }
      } catch {
       
        balance = 0;
        
      }
      return Number(balance).toFixed(8);
    } catch (error) {
      console.error("Error fetching approval:", error);
      return "Error fetching approval";
    }
  }

  function getTokenImage(contract) {
    try {
      if(contract == 'currency'){
        return 'assets/img/lamden.svg';
      }
      else{
        return 'https://static.tauhq.com/file/wwwtauhqcom/img/token_logo/' + contract + '.jpg';
      }
    } catch (error) {
      console.error("Error fetching image:", error);
      return "Error fetching image";
    }
  }

  async function pullPools(){
    try {
      const response = await fetch(
        'https://arko-bs-1.lamden.io/current/all/con_test_swap2/pools'
      );
      const response2 = await fetch(
        'https://arko-bs-1.lamden.io/current/all/con_test_swap2/lp_points'
      );
      const response3 = await fetch(
        'https://arko-bs-1.lamden.io/current/all/con_test_swap2/fee_rewards'
      );
  
  
      let res_pools = await response.json();
      let res_lp_points = await response2.json();
      let res_fee_rewards = await response3.json();
      res_pools = res_pools['con_test_swap2']['pools'];
      res_lp_points = res_lp_points['con_test_swap2']['lp_points'];
      res_fee_rewards = res_fee_rewards['con_test_swap2']['fee_rewards'];
      // build the pool list
      // add lp points of address to the pools
      // add fee rewards of address to the pools
      let res = [];
      for (let i = 0; i < res_pools.length; i++) {
        let pool = res_pools[i];
        let lp_points = res_lp_points[i][address] ? res_lp_points[i][address] : 0;
        let fee_rewards = res_fee_rewards[i][address] ? res_fee_rewards[i][address] : 0;
        pool['lp_points'] = lp_points;
        pool['fee_rewards'] = fee_rewards;
        res.push(pool);
      }
      return res;
    } catch (error) {
      console.error("Error fetching pools:", error);
      return "Error fetching pools";
    }
  }