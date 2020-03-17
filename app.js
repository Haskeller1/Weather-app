const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get("/", function (req, res) {
  var city = req.query.city;
  const errorMessage = "There was a problem fetching the weather data for your query. Please ensure that your query is valid.";
  if (city !== undefined && city !== "") {
    const url = "https://api.openweathermap.org/data/2.5/weather?appid=423a989a14030add3cd170d44245bae1&q=" + city + "&units=metric"
    https.get(url, function (response) {
      if (response.statusCode === 200) {
        response.on('data', function (chunk) {
          const weatherData = JSON.parse(chunk);
          const city = weatherData.name;
          const temperature = weatherData.main.temp;
          const windspeed = weatherData.wind.speed;
          const description = weatherData.weather[0].description
          const iconID = weatherData.weather[0].icon;
          const iconURL = "http://openweathermap.org/img/wn/" + iconID + "@2x.png";

          const renderDesc = "In " + city + " there are " + description
          const renderTemp = "The temperature is " + temperature + " degrees celsius."
          const renderWind = "The windspeed is: " + windspeed + " m/s";
          res.render("index", { description: renderDesc, temperature: renderTemp, windspeed: renderWind, imageURL: iconURL });
        });
      }
      else {
        res.render("index", { description: errorMessage, temperature: "", windspeed: "", imageURL: "https://wi-images.condecdn.net/image/doEYpG6Xd87/crop/405/f/weather.jpg" });
      }
    });
  }
  else res.render("index", { description: errorMessage, temperature: "", windspeed: "", imageURL: "https://wi-images.condecdn.net/image/doEYpG6Xd87/crop/405/f/weather.jpg" });
});

app.post("/", function (req, res) {
  const city = req.body.city;
  res.redirect("/?city=" + city);
})

app.listen(3000, () => {
  console.log("Listening to requests on port 3000.");
});