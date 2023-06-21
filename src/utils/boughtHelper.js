exports.boughtGame = (boughtBy, userId) => {
  const gameBuyers = boughtBy.map((x) => x.toString());
  return gameBuyers.includes(userId);
};
