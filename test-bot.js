var HackChat = require("hack-chat");
var chat = new HackChat(); // Client group for multiple channels
var programmingSession = chat.join("programming_", "mozbot", "ldcod");

chat.on("onlineSet", function(session, users) {
    // Each event from a group contains a session argument as first argument
    console.log("Users online in ?" + session.channel + ": " + users.join(", "));
});

// read start
var stdin = process.openStdin();
stdin.addListener("data", function(d) {
    var message = d.toString().trim();
    programmingSession.sendMessage(message);
});
//read end

chat.on("invitation", function(session, nick, channel) {
    var invitedSession = chat.join(channel, "mozbot", "ldcod");
    chat.on("onlineSet", function(session, users) {
        console.log("Joined ?" + session.channel + " by " + nick);
    })
    chat.on("onlineAdd", function(session, nick, channel) {
        console.log(nick + " has joined the private channel ?" + session.channel);
        invitedSession.sendMessage("[mozbot by moz is now available in ?" + session.channel + "]")
    })
})

chat.on("chat", function(session, nick, text) {
    console.log(nick + "@" + session.channel + ": " + text);
    if (text.indexOf("-m") == 0) {
        var command = text.split("-m")[1].trim().split(" ")[0].toLowerCase();
        var args = text.split("-m")[1].trim().split(" ").slice(1).join(" ").toLowerCase() || "";
        switch (command) {

            case 'weather':
                var weather = require('./commands/weather.js');
                weather.getWeather(args, programmingSession);
                break;

            default:
                break;
        }
    }
});

chat.on("ratelimit", function(time) {
    console.log("BOT BEING RATE-LIMITED");
})
