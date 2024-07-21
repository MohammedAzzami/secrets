//jshint esversion:6
require('dotenv').config();
const express = require("express");
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const findOrCreate = require("mongoose-findorcreate");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.CONNECT_TO_MONGOATLAS);

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    facebookId: String,
    secretPost: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model('User', userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user.id);
    });
  });

  passport.deserializeUser(async function(id, cb) {
    try {
        const user = await User.findById(id).exec();
        return cb(null, user);
    } catch (err) {
        return cb(err);
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/", function(req, res) {
    res.render('home');
});

app.get("/auth/google",
    passport.authenticate("google", { scope: ["profile"] }));

app.get("/auth/google/secrets", 
    passport.authenticate("google", { failureRedirect: "/login" }),
    function(req, res) {
        res.redirect("/secrets");
});

app.get("/auth/facebook",
    passport.authenticate("facebook"));
  
  app.get("/auth/facebook/secrets",
    passport.authenticate("facebook", { failureRedirect: "/login" }),
    function(req, res) {
      // Successful authentication, redirect secrets page.
      res.redirect('/secrets');
    });

app.get("/login", function(req, res) {
    res.render('login');
});

app.get("/register", function(req, res) {
    res.render('register');
});

app.get("/secrets", function(req, res) {
    async function findSecrets() {
        try {
            const foundSecrets = await User.find({secretPost: {$ne: null} });
            if (foundSecrets) {
                res.render("secrets", {usersWithSecrets: foundSecrets});
            }
        } catch (error) {
            console.error("Error, couldn't find secrets.");
        }
    }
    findSecrets();
});

app.get("/submit", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("submit");
    } else {
        res.redirect("/login");
    }
});

app.get("/logout", function(req, res) {
    req.logOut(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/");
        }
    })
});

app.post("/submit", function(req, res) {
    const submittedSecret = req.body.secret;
    async function submitSecret() {
        try {
            const foundUser = await User.findById(req.user._id);
            if (foundUser) {
                foundUser.secretPost = submittedSecret;
                foundUser.save();
                res.redirect("/secrets");
            }
        } catch (error) {
            console.error("Error, couldn't submit the secret.");
        }
    }
    submitSecret();
});

app.post("/register", function(req, res) {
    
    User.register({username:req.body.username}, req.body.password, function(err, user) {
        if (err) { 
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate('local')(req, res, function() {
                res.redirect("/secrets");
            });
        }
});
});

app.post("/login", function(req, res) {
  const user = new User ({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err) {
    if (err) {
        console.log(err);
    } else {
        passport.authenticate("local", {failureRedirect: "/login"})(req, res, function() {
            res.redirect("/secrets");
        })
    }
  })
});



app.listen(port, function() {
    console.log("Server started on port 3000");
})