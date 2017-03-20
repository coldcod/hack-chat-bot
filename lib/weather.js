const weather = require('weather-js');

module.exports = {
  getWeather: function(programmingSession, location, degree) {
    weather.find({search: location, degreeType: degree}, function(err, result) {
      try {
        if(err) console.log(err);
        result = result[0];
        programmingSession.sendMessage("Currently " + result.current.skytext + ", " + result.current.temperature + "°" + degree + " in " + result.location.name);
      } catch (e) {
        programmingSession.sendMessage("error");
        console.log(e);
        console.log(location);
      };
    });
  }
}
