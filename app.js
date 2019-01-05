//////////////////
//Import Modules//
//////////////////
const express = require("express");
const exphbs = require("express-handlebars");
const http = require("http");
const mongoose = require("mongoose");

require('dotenv').config();

const notesRoute = require("./routes/notes")
const websocket = require("./routes/websocket")

////////////////////
//Global Variables//
////////////////////
const port = process.env.PORT || 5000;
const mongodbUrl = process.env.MONGO_URL;

////////////////
//setup server//
////////////////
const app = express();
const server = http.createServer(app);

//////////////////////
//connect to mongodb//
//////////////////////
mongoose.connect(
	mongodbUrl,{
		useNewUrlParser: true
	}).then(
	console.log("MongoDB connected...")
	).catch(function(err){
		console.log(err);
});

//////////////
//Middleware//
//////////////
//handlebars middleware
app.engine("handlebars", exphbs({
	defaultLayout:"main"
}));
app.set("view engine", "handlebars");
//static files
app.use(express.static(__dirname + "/public"))

//////////
//Routes//
//////////
app.use("/", notesRoute)

//////////////////////////////////////////
//Start http server and websocket server//
//////////////////////////////////////////
websocket.run(server);
server.listen(port, function(){
	console.log(`Server running on port ${port}`)
});