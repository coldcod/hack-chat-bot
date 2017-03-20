const ws = require("ws")
const wss = new ws("wss://hack.chat/chat-ws");
wss.on('open', function() {
		wss.send(JSON.stringify({cmd: "join", nick: "mozFromWebSocket#ldcod", channel: "programming" }));
		var stdin = process.openStdin();
		stdin.addListener("data", function(d) {
		    var message = d.toString().trim();
		    wss.send(JSON.stringify({cmd: "chat", text: message}));
		});
});
