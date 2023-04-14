const axios = require("axios").default;

const ramzBaseUrl = "https://publicapi.ramzinex.com/exchange/api/v1.0/";

const ramzInstance = axios.create({
  baseURL: ramzBaseUrl,
});

async function httpGetRamzOrderBooks(symbol) {
  // nobInstance.defaults.params = { symbol }
  const response = await ramzInstance.get(
    "/exchange/orderbooks/" + symbol[0] + "/buys_sells"
  );
  // console.log("ramzOrderBooks:>", symbol[1], orderBooks);
  symbol[1].replace("USDT","IRT")
  return sortOrderBooks(response.data.data, symbol[1]);

}

function sortOrderBooks(data, symbol) {
  // data.buys.sort(function (a, b) { //zyazi be sort nist
  //   return b[0] - a[0];
  // });
  data.sells.sort(function (a, b) {
    return a[0] - b[0];
  });

  const ask = data.sells[0].slice(0, 2);
  const bid = data.buys[0].slice(0, 2);
  console.log({
    [symbol]: { ask,bid },
  });
  return {
    [symbol]: { ask,bid },
  };
}

module.exports = {
  httpGetRamzOrderBooks,
};
