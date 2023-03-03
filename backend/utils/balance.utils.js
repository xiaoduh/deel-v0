module.exports.addCoin = (currentBalanceCoin) => {
  let newBalanceCoin = +currentBalanceCoin + 1;
  return newBalanceCoin;
};

module.exports.substratCoin = (currentBalanceCoin) => {
  let newBalanceCoin = +currentBalanceCoin - 1;
  return newBalanceCoin;
};

module.exports.isPositive = (currentBalanceCoin) => {
  if (currentBalanceCoin > 0) return true;
  else return false;
};
