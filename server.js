// const { initialize } = require('passport');
const { connectMongoose, User } = require('./database.js');
const express = require('express')
const passport = require('passport');
const {initializePassport,isAuthenticated} = require('./passportConfig.js');
// const initialize = require('passport');
const expressSession = require('express-session');
const app = express()


connectMongoose();

initializePassport(passport);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine','ejs');
app.use(expressSession({
  secret:'secret',
  saveUninitialized:false,
  resave:false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/login", (req, res) => {
  res.render("login");
});



app.post("/register", async (req, res) => {

  const user = await User.findOne({ username: req.body.username });
  if (user) {
    return res.status(400).send("User already exists");
  }
  const newUser = await User.create(req.body);
  return res.status(201).send(newUser);

})

app.post('/login',passport.authenticate("local",{
  successRedirect:"/profile",failureRedirect:"/register"}));

app.get("/profile",isAuthenticated,(req,res)=>{
  res.render("profile", {user : req.user});
});

app.listen(3000, () => {
  console.log("Server started at port : 3000");
})
