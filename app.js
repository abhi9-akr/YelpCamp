var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var flash= require("connect-flash");
var passport= require("passport");
var methodOverride= require("method-override");
var LocalStrategy= require("passport-local");
var Campground = require("./models/campground");
var Comment =require("./models/comment");
var User= require("./models/user");
var	seedDB	= require("./seeds");


var commentRoutes = require("./Routes/comments"),
	campgroundRoutes = require("./Routes/campgrounds"),
	indexRoutes = require("./Routes/index")

// seed the database
// seedDB();
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(flash());

// PASSPORT COM=NFIGURATION
app.use(require("express-session")({
	secret: "Once more I have my own Way",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});
app.use(campgroundRoutes);
app.use(indexRoutes);
app.use(commentRoutes);


app.listen("3000",function(){
	console.log("Yelpcamp Page has Started at 3000 port");
});