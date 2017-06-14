var HackChat = require("hack-chat");
var fs = require('fs');
var chat = new HackChat(); // Client group for multiple channels
var botNick = 'crf', botPswd = 'xch';
var programmingSession = chat.join("programming", botNick, botPswd);

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
      var invitedSession = chat.join(channel, botNick, botPswd);
      var invitedChannel = channel;
      var invitedNick = nick;
      chat.on("onlineSet", function(session, users) {
          console.log("Joined ?" + session.channel + " by " + nick);
      })
      try {
          setInterval(function () {
              programmingSession.ping();
          }, 45000);
      } catch (e) {
          console.log();
      };
      chat.on("onlineAdd", function(session, nick, channel) {
          if (session.channel == invitedChannel) {
              console.log("User " + nick + " has joined the private channel ?" + session.channel);
              invitedSession.sendMessage("[crf by X33_C is now available in ?" + session.channel + "]");
          }
      })
      chat.on("onlineRemove", function (session, nick, channel) {
          if (session.channel == invitedChannel && nick == invitedNick) { invitedSession.leave(); };
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
    var leftNotification = nick + " left ?" + session.channel + '\n';
    console.log(leftNotification);
    fs.appendFileSync('log.txt', leftNotification, "UTF-8", {'flags': 'a'});
});

try {
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
} catch (e) {
    console.log("Error happened on('chat')\n" + e);
}

chat.on("ratelimit", function(time) {
    console.log("BOT BEING RATE-LIMITED");
})
