const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true}, 
  todoList: [{ type: Schema.Types.ObjectId, ref: "Todo"} ] // recordar que si queréis más información aparte del iD del to-do tendreis que hacer el .populate("todoList")
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;