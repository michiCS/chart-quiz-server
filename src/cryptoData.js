const axios = require("axios");
const schedule = require('node-schedule');
const { Cryptocurrency } = require("./models/cryptocurrency");

let tickers = [];

const storeCryptoData = async () => {
    for (const ticker of tickers) {
        const priceData = await queryCryptoPriceData(ticker);
        const newCryptocurrency = new Cryptocurrency({ ticker, priceData });
        await newCryptocurrency.save();
    }
}

const queryCryptoTickers = async () => {
    tickers = [];
    await axios.get("https://apewisdom.io/api/v1.0/filter/all-crypto/page/1")
        .then(response => {
            for (let i = 0; i < 50; i++) {
                tickers.push(response.data.results[i].ticker.split(".")[0]);
            }
            console.log(tickers);
        })
        .catch(error => {
            console.log("Something went wrong with ApeWisdomAPI!");
        });
}

const queryCryptoPriceData = async (ticker) => {
    const today = new Date();
    const start = new Date();
    start.setDate(today.getDate() - 100);

    return axios.get(`https://rest.coinapi.io/v1/exchangerate/${ticker}/USD/history?period_id=1DAY&time_start=${start.toISOString()}&time_end=${today.toISOString()}`
        , { headers: { "X-CoinAPI-Key": process.env.COINAPI_KEY } })
        .then((response) => {
            const priceData = [];
            for (let item of response.data) {
                priceData.push([Date.parse(item.time_period_start), parseFloat(item.rate_close)])
            }
            return priceData;
        })
        .catch((error) => {
            if (error.response.status === 429) {
                console.log("Too many requests for today!");
            } else {
                console.log("Something went wrong with CoinAPI!");
            }
        })
}

const job = schedule.scheduleJob("0 */24 * * *", async () => {
    console.log("Updating Data!");
    await Cryptocurrency.remove({});
    await queryCryptoTickers();
    await storeCryptoData();
});
