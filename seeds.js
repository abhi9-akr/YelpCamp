var mongoose=require("mongoose");
var Campground=require("./models/campground");
var Comment = require("./models/comment");

data=[
	{
		name: "Cloud's Rest",
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS76PJNSjDYs5TBatmOrotEcH0Jlswd10vIVNZ6QYJVfp5mpwsO",
		description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
	},
	{
		name: "Canyon Floor",
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQI8JbKiBdQmXKsOBwjdntN95AE-nnW_UIjv92zdB7TGRA_sI0V",
		description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
	},
	{
		name: "Desert Mesa",
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT4fEULFPc1C9jfaYMcQOb3f2-jm2G4uTfMAFM_U7x2-v8i-Let",
		description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
	}
]

function seedDB(){
	Campground.remove({},function(err){
		if(err)
			console.log(err);
		else
		{
			console.log("Campgrounds Removed");

		 	data.forEach(function(seed){
				Campground.create(seed, function(err, campground){
					if(err){
						console.log(err);
					}
					else{
						console.log("Added a Campground");
						Comment.create({
							text: "Beautiful Place...internet is required",
							author: "Housie"
						}, function(err, comment){
							if(err)
								console.log(err);
							else
							{
								campground.comments.push(comment);
								campground.save();
								console.log("Created Comment");
							}
						});
					}
				});
			});
		}	 
	});

}

module.exports=seedDB;