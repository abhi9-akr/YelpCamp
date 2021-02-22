var express= require("express");
var router = express.Router();
var Campground = require("../models/campground");

//Index- show all campgrounds
router.get("/campgrounds",function(req, res){
	
	Campground.find({},function(err,allcampgrounds){
		if(err)
		{
			console.log("Error has arrived...");
		}
		else
		{
			res.render("campgrounds.ejs",{campgrounds: allcampgrounds, currentUser: req.user});
		}
	})

});

router.post("/campgrounds", isLoggedIn, function(req, res){
	var name=req.body.name;
	var price=req.body.price;
	var image=req.body.image;
	var desc=req.body.description;
	var author= {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground= {name: name, price: price, image: image, description: desc, author: author};
	Campground.create(newCampground,function(err, newly){
		if(err){
			console.log("Try Again");
		}
		else{
			console.log(newly);
			res.redirect("/campgrounds");
		}
	})
});

router.get("/campgrounds/new", isLoggedIn, function(req, res){
	res.render("new.ejs");
});

router.get("/campgrounds/:id",function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, found){
		if(err)
			console.log(err);
		else
		{
			//console.log(found);
			res.render("show",{campground: found});
		}
	});
});

//Edit Csmpground Route
router.get("/campgrounds/:id/edit", checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("edit", {campground: foundCampground});
	});
});

//UpDate Campground
router.put("/campgrounds/:id", checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updateCampgroud){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
});

//Destroy Route
router.delete("/campgrounds/:id", checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds");
		}
	})
});

//middleWare
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You Should be Logged-In");
	res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				req.flash("error", "Campground not found");
				res.redirect("/campgrounds");
			}else{
				//Does User own the campground???
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error", "You don't have permission to do that!!");
					res.redirect("back");
				}
			}
		});
	}else{
		res.redirect("back");
	}	
}



module.exports = router;