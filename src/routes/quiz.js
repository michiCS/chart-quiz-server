const { Cryptocurrency } = require("../models/cryptocurrency");
const router = require("express").Router();

const shuffleArray = arr => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

router.get("/quiz-round", async (req, res) => {
    Cryptocurrency.countDocuments().exec(async (err, count) => {
        if (count === 0) res.send({ correctOption: {}, options: [] });

        let random, correctOption;
        do {
            random = Math.floor(Math.random() * count);
            correctOption = await Cryptocurrency.findOne().skip(random);
        } while (correctOption.priceData < 10);

        let options = [];
        while (options.length < 3) {
            random = Math.floor(Math.random() * count);
            const option = await Cryptocurrency.findOne().skip(random);
            if (options.indexOf(option.ticker) !== -1 || option.ticker === correctOption.ticker) continue;
            options.push(option.ticker);
        }
        
        options.push(correctOption.ticker);
        console.log(correctOption.ticker, options);
        res.send({ correctOption, options: shuffleArray(options) });
    })
})

module.exports = router;