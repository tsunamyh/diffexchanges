"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpGetNobOrderBooks = httpGetNobOrderBooks;
var axios_1 = require("axios");
var symbols_1 = require("../../symbols/symbols");
var nobCoin = symbols_1.default.nobCoin;
var nobBaseUrl = "https://api.nobitex.ir/v2/";
var nobInstance = axios_1.default.create({
    baseURL: nobBaseUrl,
});
function httpGetNobOrderBooks(symbol) {
    return __awaiter(this, void 0, void 0, function () {
        var response, orderBooks;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, nobInstance.get("/orderbook/".concat(symbol))];
                case 1:
                    response = _a.sent();
                    orderBooks = sortOrderBooks(response.data);
                    // console.log("nobOrderBooks:>", orderBooks);
                    return [2 /*return*/, orderBooks];
            }
        });
    });
}
function sortOrderBooks(data) {
    var ttrAsk = data["USDTIRT"].bids[0][0];
    var ttrBid = data["USDTIRT"].asks[0][0];
    var orderBooks = {};
    nobCoin.forEach(function (symbol) {
        var _a, _b, _c, _d;
        if (!(((_a = data[symbol[0]]) === null || _a === void 0 ? void 0 : _a.bids) === undefined || ((_b = data[symbol[0]]) === null || _b === void 0 ? void 0 : _b.bids.length) === 0)) {
            // console.log("data[symbol[0]].bids[0]",symbol[0],data[symbol[0]]?.bids[0]);
            // array exist or is not empty
            var ask = (_c = data[symbol[0]]) === null || _c === void 0 ? void 0 : _c.bids[0];
            var bid = (_d = data[symbol[0]]) === null || _d === void 0 ? void 0 : _d.asks[0];
            if (ask && bid) {
                // [feeRiali,hajm,feettri]
                if (symbol[0] === "SHIBIRT") {
                    ask[0] = ask[0] / 1000;
                    bid[0] = bid[0] / 1000;
                }
                orderBooks[symbol[0]] = {
                    ask: __spreadArray([(ask[0] / ttrBid)], ask, true),
                    bid: __spreadArray([(bid[0] / ttrAsk)], bid, true)
                };
            }
        }
    });
    return orderBooks;
}
// httpGetNobOrderBooks("all")  //test
getAllOrderBooks();
// console.log("nobOrderBooks:",nobOrderBooks);
function getAllOrderBooks() {
    return __awaiter(this, void 0, void 0, function () {
        var nobOrderBooksPromise, promisesArray, allOrderBooks;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nobOrderBooksPromise = httpGetNobOrderBooks("all");
                    promisesArray = [nobOrderBooksPromise /*, ...ramzOrderBooksPromise */];
                    return [4 /*yield*/, Promise.allSettled(promisesArray)];
                case 1:
                    allOrderBooks = _a.sent();
                    if (allOrderBooks[0].status === 'fulfilled') {
                        console.log(allOrderBooks[0].value);
                    }
                    else {
                        console.error('Failed to fetch order books:', allOrderBooks[0].reason);
                    }
                    return [2 /*return*/, allOrderBooks];
            }
        });
    });
}
