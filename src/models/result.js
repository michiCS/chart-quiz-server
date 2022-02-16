const mongoose = require("mongoose");

const resultSchema = mongoose.Schema({
    username: String,
    score: Number,
    rounds: Number,
    date: Date
});
const Result = mongoose.model("Result", resultSchema, "results");

module.exports = {
    Result
};