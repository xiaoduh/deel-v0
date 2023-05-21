module.exports.addCoin = (currentSolde, price) => {
  let newSolde = parseFloat(currentSolde) - parseFloat(price);
  return newSolde;
};

module.exports.substratCoin = (currentBalanceCoin, lead) => {
  let newBalanceCoin = parseFloat(currentBalanceCoin) - parseFloat(lead.price);
  return newBalanceCoin;
};

module.exports.isPositive = (currentBalanceCoin) => {
  if (parseFloat(currentBalanceCoin) > 0) return true;
  else return false;
};
