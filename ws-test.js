const ws = require("ws")
const wss = new ws("wss://hack.chat/chat-ws");
wss.on('open', function open() {
	try {
    	wss.sendRaw({cmd: "join", nick: "mozFromWebSocket", channel: "?programming" });
	} catch (e) {
		console.log(e);
	}
});
