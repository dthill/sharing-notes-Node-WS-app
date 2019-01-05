//import modules and db models
const WebSocket = require("ws");
const mongoose = require("mongoose");
const Note = require("../models/Note");

exports.run = function(server){
	//start websocket server
	const wss = new WebSocket.Server({ server });
	//websocket logic
	wss.on("connection", function(ws){
		ws.on("message", function(msg){
			//check and parse incoming message to JSON object
			try{
				msg = JSON.parse(msg);
			}
			catch(err){
				console.log(
					"Incorrect format message received on websocket. ID: " 
					+ req.params.id + " Message received: " + msg
					);
				return false;
			}
			if(msg.wsId){
				//find note in mongodb
				Note.findById(msg.wsId)
				.then(function(note){
					//first websocket message from client sends back the db entry but does not save in db
					if(note && msg.init){
						ws.send(JSON.stringify({
							noteTitle: note.title,
							noteBody: note.body,
							wsId: msg.wsId
						}));
						ws.wsId = msg.wsId;
					}
					//normal websocket message from client saves note in the db and broadcasts note to every websocket with the same id
					if(note && !msg.init){
						note.title = msg.title;
						note.body = msg.body;
						note.save();
						ws.wsId = msg.wsId;
						//broadcats incoming note to other clients with the same id
						wss.clients.forEach(function each(client) {
							if (client !== ws 
								&& client.readyState === WebSocket.OPEN
								&& client.wsId === msg.wsId){
								client.send(
									JSON.stringify({
										noteTitle: msg.title,
										noteBody: msg.body,
										wsId: msg.wsId
								}));
							}	
						});
					}
					//if no note is found with this id send back note is deleted
					if(!note & !msg.init){
						ws.send(JSON.stringify({
							noteTitle: "This note has been deleted",
							noteBody: "",
							wsId: ""
						}));
					}
				}).catch(function(err){
					console.log(err)
				});
			}
		});
	});
}
