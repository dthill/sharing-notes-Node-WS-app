const mongoose = require("mongoose");

//create Schema
const CounterSchema = mongoose.Schema({
	prefix:{
		type: Number,
		required: true
	}, 
	counter:{
		type: Number,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});


mongoose.model("Counter", CounterSchema);

module.exports = mongoose.model("Counter");