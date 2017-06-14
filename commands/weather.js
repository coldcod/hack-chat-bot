try {
    var weather = require("../lib/weather.js");

    module.exports = {
        getWeather: function(args, programmingSession) {
            var place = args;
            var degree = "C";
            if (args.split(" ")[args.split(" ").length - 1] == "f" || args.split(" ")[args.split(" ").length - 1] == "c"){
              degree = args.split(" ")[args.split(" ").length - 1].toUpperCase();
              place = args.split(" ").slice(0, args.split(" ").length - 1).join(" ");
            }
            weather.getWeather(programmingSession, place, degree);
        }
    }

} catch (e) {
    console.log("Error in commands/weather.js:\n" + e);
};
