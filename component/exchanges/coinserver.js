const axios = require("axios").default;
const HttpsAgent = require("https-proxy-agent");
const { coin } = require("../../symbols/symbols");

const agent = new HttpsAgent("http://127.0.0.1:10809");

const coinBaseUrl = "https://api.coinex.com/v2";

const coinInstance = axios.create({
  baseURL: coinBaseUrl,
  httpsAgent: agent,
  // httpAgent: agent,
});
// httpGetCoinOrderBooks()
async function httpGetCoinOrderBooks() {

  const response = await coinInstance.get("/spot/ticker");
  let coinOrderBook = sortOrderBooks(response.data.data/* .ticker */);
  // console.log(coinOrderBook);
  return coinOrderBook;
}

function sortOrderBooks(data) {
  const orderBooks = {};
  coin.forEach(function (symbol,index) {
    if (data.hasOwnProperty(symbol)) {
      const ask = data[symbol].sell
      const bid = data[symbol].buy
      if (ask && bid) {

        orderBooks[symbol] = {
          ask: [ask, data[symbol].sell_amount],
          bid: [bid, data[symbol].buy_amount]
        }
      }
    }
  })
  return orderBooks
}

module.exports = {
  httpGetCoinOrderBooks,
};
