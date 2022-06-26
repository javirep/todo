var express = require('express');
var router = express.Router();

const User = require("../models/User.js")
const Todo = require("../models/Todo.js")


//Estas dos líneas le dicen a router que por favor utilice el middelware userIsLoggedIn
const userIsLoggedIn = require("../middlewares/auth-mid").userIsLoggedIn
router.use((req, res, next)=> userIsLoggedIn(req, res, next));

router.get("/", async (req, res, next) => {

    const myId = req.session.currentUser._id

    // Necesito hacer el populate para que se vean la información del todoList. 

    const myUser = await User.findOne({"_id": myId}).populate("todoList")

    res.render("priv.hbs", myUser)
})

router.get("/create-todo", (req, res, next) =>{
    //el get solo tiene que renderizar la vista
    res.render("create-todo.hbs")
})

router.post("/create-todo", async (req, res, next)=>{
    const {title, message} = req.body

    const newTodo = await Todo.create({title, message})

    const userId = req.session.currentUser._id

    await User.updateOne({_id: userId}, { $push: {todoList: newTodo._id} })
    
    res.render("create-todo.hbs", {message:"created successfully"})

})

router.get("/completed-todo/:_id", async (req, res, next)=>{
    const {_id} = req.params

    await Todo.updateOne({_id}, {done: true})

    res.redirect("/priv/")
})

router.get("/delete-todo/:_id", async (req, res, next)=>{
    const {_id} = req.params
    const userId = req.session.currentUser._id

    await Todo.findOneAndDelete({_id})
    await User.updateOne({_id: userId}, { $pull: {todoList: _id }})

    res.redirect("/priv/")
    
})

router.post("/logout", (req, res, next)=>{
    delete req.session.currentUser
    res.redirect("/")
})

module.exports = router;
