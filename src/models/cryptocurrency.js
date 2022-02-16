const mongoose = require("mongoose");

const cryptocurrencySchema = mongoose.Schema({
    ticker: String,
    priceData: Array
});
const Cryptocurrency = mongoose.model("Cryptocurrency", cryptocurrencySchema, "cryptocurrencies");

module.exports = {
    Cryptocurrency
};