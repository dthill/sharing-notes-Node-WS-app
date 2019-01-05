//import modules
const express = require("express");
const router = express.Router();
const Hashids = require("hashids");
const mongoose = require("mongoose");

//Database Models
const Note = require("../models/Note");
const Counter = require("../models/Counter");

//this is used to create unique note ids that are short (+-5 letters)
let counterPrefix = 0;
let sessionCounter = 0;
const hashids = new Hashids(
	"This is the $alt",
	5,
	"abcdefghjklmnopqrstvwxyz123456789-_"
	);

////////////////////////////////////
//Create Counter for this session//
////////////////////////////////////
Counter.find({}).sort({
	prefix: -1
}).then(function(counter){
	if(counter[0]){
		counterPrefix = counter[0].prefix + 1;
	}
}).catch(function(err){
	console.log(err);
});

//////////
//Routes//
//////////

router.get("/", function(req,res){
	res.render("index");
});

router.get("/:msg", function(req,res, next){
	if(req.params.msg === "deleted"){
		res.render("index", {
			error_msg: "Note deleted"
		});
	} else {
		return next();
	}
});

router.get("/notes/:id", function(req,res, next){
	Note.findById(req.params.id)
	.then(function(note){
		if(note){
			res.render("notes", {
				host: req.get("host"),
				note: true,
				id: req.params.id
			});
		} else {
			return next();
		}
	}).catch(function(err){
		console.log(err)
		return next();
	});
});

router.get("/delete/:id", function(req, res, next){
	Note.findByIdAndDelete(req.params.id)
	.then(function(note){
		if(note){
			res.redirect("/deleted");
		} else {
			return next();
		}
	}).catch(function(err){
		console.log(err)
	});
});

router.post("/notes", function(req,res){
	//check req comes from same origin
	Counter.create({
		prefix: counterPrefix,
		counter: sessionCounter++
	}).then(function(counter){
		Note.create({
			title: "",
			body: "",
			_id: hashids.encode(counterPrefix.toString() + sessionCounter.toString())
		}).then(function(note){
			res.redirect("/notes/" + note._id);
		}).catch(function(err){
			console.log(err);
		});
	}).catch(function(err){
		console.log(err);
	});
});

router.get("*", function(req, res){
	res.render("index", {
		error_msg: "This note cannot be found"
	});
});

module.exports = router;