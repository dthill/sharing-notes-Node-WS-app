const noteTitleDiv = document.getElementsByClassName("note-title")[0];
const noteBodyDiv = document.getElementsByClassName("note-body")[0];
let intervalId = false;

noteBodyDiv.addEventListener("keydown", function(){resize(noteBodyDiv)});
noteBodyDiv.addEventListener("change", function(){resize(noteBodyDiv)});
noteBodyDiv.addEventListener("cut", function(){resize(noteBodyDiv)});
noteBodyDiv.addEventListener("paste", function(){resize(noteBodyDiv)});
noteBodyDiv.addEventListener("drop", function(){resize(noteBodyDiv)});

function resize(target) {
	setTimeout(function(){
		target.style.height = 'auto';
		target.style.height = noteBodyDiv.scrollHeight+'px';
	}, 10, target)
}

(function start(){
	

	const ws = new WebSocket(wsURL);

	function debounce (func, wait){
		var timeoutID
		return function () {
			clearTimeout(timeoutID)
			timeoutID = setTimeout(func, wait)
		}
	}

	function sendWsData(){
		ws.send(JSON.stringify({
			title: noteTitleDiv.value,
			body: noteBodyDiv.value,
			wsId: wsId
		}));
	}
	
	


	ws.addEventListener("open", function(event){
		if(intervalId){
			clearInterval(intervalId);
			intervalId = false;
		}
		ws.send(JSON.stringify({
			init: true,
			wsId: wsId
		}));
	});

	noteTitleDiv.onkeyup = debounce(sendWsData, 100);
	noteBodyDiv.onkeyup = debounce(sendWsData, 100);


	ws.addEventListener("message", function(event){
		let data = JSON.parse(event.data);
		noteTitleDiv.value = data.noteTitle;
		noteBodyDiv.value = data.noteBody;
		resize(noteBodyDiv);
	});

	ws.addEventListener("close", function(){
		if(!intervalId){
			intervalId = setInterval(function(){
				start();
			},2000)
		}
	});
})();




