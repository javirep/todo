const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const todoSchema = new Schema({
    title: {type: String},
    message: {type: String},
    done: {type: Boolean, default: false},
    createdAt: {type: Date, default: new Date()}
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;