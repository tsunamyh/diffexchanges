const {nobCoin} = require("../../symbols/symbols");

const axios = require("axios").default;

const nobBaseUrl = "https://api.nobitex.ir/v2/";

const nobInstance = axios.create({
  baseURL: nobBaseUrl,
});

async function httpGetNobOrderBooks(symbol) {
  // nobInstance.defaults.params = { symbol }
  const response = await nobInstance.get("/orderbook/" + symbol)
  // console.log("re",response.data);
  
  const orderBooks = sortOrderBooks(response.data)
  // console.log("nobOrderBooks:>", orderBooks);
  return orderBooks
}

function sortOrderBooks(data) {
  const ttrAsk = data["USDTIRT"].bids[0][0]
  const ttrBid = data["USDTIRT"].asks[0][0]
  const orderBooks = {}
  nobCoin.forEach(function (symbol) {

    if (!(data[symbol[0]]?.bids === undefined || data[symbol[0]]?.bids.length == 0)) {
      // console.log("data[symbol[0]].bids[0]",symbol[0],data[symbol[0]]?.bids[0]);
      // array exist or is not empty
      const ask = data[symbol[0]]?.bids[0];
      const bid = data[symbol[0]]?.asks[0]
      if (ask && bid) {
        // [feeRiali,hajm,feettri]
        if (symbol[0] == "SHIBIRT") {
          ask[0] = ask[0]/1000
          bid[0] = bid[0]/1000
        }
        orderBooks[symbol[0]] = {
          ask : [(ask[0]/ttrBid),...ask],
          bid : [(bid[0]/ttrAsk),...bid]
        }
      }
    }
  })

  return orderBooks
}
// httpGetNobOrderBooks("all")  //test
getAllOrderBooks();
// console.log("nobOrderBooks:",nobOrderBooks);
async function getAllOrderBooks() {

  const nobOrderBooksPromise = httpGetNobOrderBooks("all");

  const promisesArray = [nobOrderBooksPromise/*, ...ramzOrderBooksPromise */];
  // console.log(promisesArray);
  const allOrderBooks = await Promise.allSettled(promisesArray);
  console.log(allOrderBooks);
  return allOrderBooks;
}
module.exports = {
  httpGetNobOrderBooks
}