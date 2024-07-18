//jshint esversion:6
require('dotenv').config();
const express = require("express");
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const send = require("send");
const app = express();


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
    email: String,
    password: String 
});

userSchema.plugin(encrypt, {secret: process.env.SECRET_KEY, encryptedFields:["password"]});

const User = new mongoose.model('User', userSchema);


app.get("/", function(req, res) {
    res.render('home');
});

app.get("/login", function(req, res) {
    res.render('login');
});

app.get("/register", function(req, res) {
    res.render('register');
});

app.post("/register", async function(req, res) {
    const newUser = new User ({
        email: req.body.username,
        password: req.body.password
    });
    try {
        await newUser.save();
        res.render("secrets");
    } catch (error) {
        res.send(error);
    }
});

app.post("/login", function(req, res) {
    const email = req.body.username;
    const password = req.body.password;

    async function findUser() {
        try {
            const foundUser = await User.findOne({email: email});
            if (foundUser) {
                console.log(foundUser);
               if (foundUser.password === password) {
                res.render("secrets");
               } else {
                console.log("Error, Please check your password.");
               }
            } else {
                console.log("Error, Please check your eamil.");
            }
        } catch (error) {
            res.send(error);
        }
    }
    findUser();
});











app.listen(port, function() {
    console.log("Server started on port 3000");
})