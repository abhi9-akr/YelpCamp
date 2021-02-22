var express= require("express");
var router = express.Router();
var Campground= require("../models/campground");
var Comment= require("../models/comment");
//Comment Routes
router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err)
			console.log(err);
		else{
				res.render("comments/new", {campground: campground});
		}
	});
});

router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "Something went wrong..");
					console.log(err);
				}
				else{
				console.log(req.user._id);
				comment.author.id=req.user._id;
				comment.author.username=req.user.username;
				comment.save();
				campground.comments.push(comment);
				campground.save();
				console.log(comment);
				req.flash("success", "Successfully Comment Added..!!");
				res.redirect("/campgrounds/"+ campground._id);
			}
			});
		}
	});
});

router.get("/campgrounds/:id/comments/:comment_id/edit", checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		}else{
			res.render("comments/edit", {campground: req.params.id, comment: foundComment});
		}
	});
});
//Comment Update
router.put("/campgrounds/:id/comments/:comment_id", checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatecomment){
		if(err){
			res.redirect("back");
		}else{
			// console.log(updatecomment);
			req.flash("success", "Ur Comment Gets Updated..!!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//COMMENt DeSTROY
router.delete("/campgrounds/:id/comments/:comment_id", checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success", "Ur Comment gets Deleted..!!");
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
});


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You Should be Logged-In");
	res.redirect("/login");
}

function checkCommentOwnership(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("/campgrounds");
			}else{
				//Does User own the comment???
				if(foundComment.author.username == req.user.username){
					next();
				}else{
					req.flash("error", "Unauthorised permission Demand");
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error", "FirstLogin");
		res.redirect("back");
	}	
}

module.exports= router;