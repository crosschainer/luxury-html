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