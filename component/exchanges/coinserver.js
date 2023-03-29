const axios = require("axios").default;
const HttpsAgent = require("https-proxy-agent");
const {coin} = require("../../symbols/symbols");

const agent = new HttpsAgent("http://192.168.1.11:8081");

const coinBaseUrl = "https://api.coinex.com/v1";

const coinInstance = axios.create({
  baseURL: coinBaseUrl,
  httpsAgent: agent,
  // httpAgent: agent,
});
httpGetCoinOrderBooks()
async function httpGetCoinOrderBooks() {

  const response = await coinInstance.get("/market/ticker/all");
  let coinOrderBook = sortOrderBooks(response.data.data.ticker);
  console.log(coinOrderBook);
  return coinOrderBook;
}

function sortOrderBooks(data) {
  const orderBooks = {};
  coin.forEach(function (symbol) {
    if (data.hasOwnProperty(symbol)) {
      orderBooks[symbol] = {
        bid: [data[symbol].buy,data[symbol].buy_amount],
        ask: [data[symbol].sell,data[symbol].sell_amount]
      }
    }
  })
  return orderBooks
}

module.exports = {
  httpGetCoinOrderBooks,
};
