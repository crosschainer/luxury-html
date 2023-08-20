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
        balance =
          res[contract]['balances'][address]['__hash_self__']['__fixed__'];
      } catch {
        try {
          balance = res[contract]['balances'][address]['__fixed__'];
        } catch {
          balance = 0;
        }
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