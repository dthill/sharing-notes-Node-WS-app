const mongoose = require("mongoose");

//create Schema
const NoteSchema = mongoose.Schema({
	title:{
		type: String,
		required: false
	}, 
	body:{
		type: String,
		required: false
	},
	date: {
		type: Date,
		default: Date.now
	},
	_id: String
});


mongoose.model("Note", NoteSchema);

module.exports = mongoose.model("Note");