var HackChat = require("hack-chat");
var fs = require('fs');
var chat = new HackChat(); // Client group for multiple channels
var programmingSession = chat.join("programming", "crf", "ldcod");
var ws = require("ws")
var wss = new ws("wss://hack.chat/chat-ws");

setInterval(function () {
    programmingSession.ping();
}, 45000);

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
try {
  chat.on("invitation", function(session, nick, channel) {
      var invitedSession = chat.join(channel, "mozbot", "ldcod");
      chat.on("onlineSet", function(session, users) {
          console.log("Joined ?" + session.channel + " by " + nick);
      })
      setInterval(function () {
          invitedSession.ping();
      }, 45000);
      chat.on("onlineAdd", function(session, nick, channel) {
          console.log(nick + " has joined the private channel ?" + session.channel);
          invitedSession.sendMessage("[mozbot by moz is now available in ?" + session.channel + "]")
      })
  })
} catch (e) {
    console.log(e);
}

chat.on("onlineAdd", function(session, nick, channel) {
    var joinedNotification = nick + " joined ?" + session.channel + '\n';
    console.log(joinedNotification);
    fs.appendFileSync('log.txt', joinedNotification, "UTF-8", {'flags': 'a'});
});

chat.on("onlineRemove", function(session, nick, channel) {
    var leftNotification = nick + " joined ?" + session.channel + '\n';
    console.log(leftNotification);
    fs.appendFileSync('log.txt', leftNotification, "UTF-8", {'flags': 'a'});
});

var textToLog, date, currentDate, time, currentTime;
chat.on("chat", function(session, nick, text) {
     date = new Date();
     function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + '.' + date.getSeconds() + ' ' + ampm;
        return strTime;
     }
    currentTime = formatAMPM(date);
    currentDate = date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear();
    time = currentTime + ' on ' + currentDate;
    textToLog = "[" + time + "] " + nick + "@" + session.channel + ": " + text + '\n';
    fs.appendFileSync('log.txt', textToLog, "UTF-8", {'flags': 'a'});
    console.log(textToLog);
    if (text.indexOf("-m") == 0) {
        var command = text.split("-m")[1].trim().split(" ")[0].toLowerCase();
        var args = text.split("-m")[1].trim().split(" ").slice(1).join(" ").toLowerCase() || "";
        switch (command) {

            case 'weather':
                var weather = require('./commands/weather.js');
                weather.getWeather(args, session);
                break;

            default:
                break;

        }
    }
});

chat.on("ratelimit", function(time) {
    console.log("BOT BEING RATE-LIMITED");
})
