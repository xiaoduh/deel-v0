module.exports.addCoin = (currentBalanceCoin) => {
  let newBalanceCoin = +currentBalanceCoin + 1;
  return newBalanceCoin;
};

module.exports.substratCoin = (currentBalanceCoin, lead) => {
  let newBalanceCoin = parseFloat(currentBalanceCoin) - parseFloat(lead.price);
  return newBalanceCoin;
};

module.exports.isPositive = (currentBalanceCoin) => {
  if (parseFloat(currentBalanceCoin) > 0) return true;
  else return false;
};
