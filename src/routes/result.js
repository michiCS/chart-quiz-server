const router = require("express").Router();
const { Result } = require("../models/result");

router.get("/personal-highscores", async(req,res) => {
    const {username, rounds} = req.query; 

    const highscores = await Result.aggregate([
        { "$match": {
            username: username,
            rounds: parseInt(rounds)
        }},
        { "$project": {
            "dateString": {
                "$dateToString": {
                    "format": "%Y-%m-%d",
                    "date": "$date"
                }
            },
            "score": 1
        }},
        { "$sort": {score: -1, date: 1}},
        { "$limit": 5}
    ])

    res.send({highscores});
})

router.get("/global-highscores", async(req,res) => {
    const {rounds} = req.query; 

    const highscores = await Result.aggregate([
        { "$match": {
            rounds: parseInt(rounds)
        }},
        { "$project": {
            "dateString": {
                "$dateToString": {
                    "format": "%Y-%m-%d",
                    "date": "$date"
                }
            },
            "username": 1,
            "score": 1
        }},
        { "$sort": {score: -1, date: 1}},
        { "$limit": 5}
    ]);

    res.send({highscores});
})

router.post("/new-score", async(req, res) => {
    const {username, score, rounds} = req.body;
    console.log(username, score, rounds);
    const result = new Result({username, score, rounds, date: new Date()});
    result.save();
    res.send({message:"Score saved", id: result._id});
})

module.exports = router;