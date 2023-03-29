const {nobCoin} = require("../../symbols/symbols");

const axios = require("axios").default;

const nobBaseUrl = "https://api.nobitex.ir/v2/";

const nobInstance = axios.create({
  baseURL: nobBaseUrl,
});

async function httpGetNobOrderBooks(symbol) {
  // nobInstance.defaults.params = { symbol }
  const response = await nobInstance.get("/orderbook/" + symbol)

  const orderBooks = sortOrderBooks(response.data)
  console.log("nobOrderBooks:>", orderBooks);
  return orderBooks
}

function sortOrderBooks(data) {
  const ttrAsk = data["USDTIRT"].bids[0][0]
  const ttrBid = data["USDTIRT"].asks[0][0]
  const orderBooks = {}
  nobCoin.forEach(function (symbol) {
    const ask = data[symbol[0]].bids[0];
    const bid = data[symbol[0]].asks[0]
    if (ask && bid) {
      // [feeRiali,hajm,feettri]
      orderBooks[symbol[0]] = {
        ask : [(ask[0]/ttrBid),...ask],
        bid : [(bid[0]/ttrAsk),...bid]
      }
    }
  })

  return orderBooks
}

module.exports = {
  httpGetNobOrderBooks
}