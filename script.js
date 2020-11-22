var apiKey = "3c68c7cd73a72f5d17105adff05e1f92";

function populate(queryUrl, cityName) {
    // make ajax call to  open weather api current weather
    // display the current information in the main card
    $.ajax({ url: queryUrl, method: "GET" }).then(function (response) {
        // console.log(response);
        // get lat and lon for the city for uv api
        var lat = response.city.coord.lat;
        var lon = response.city.coord.lon;
        // add temp, humidity, wind info to dom
        $("#city-name").text(response.city.name + " (" + dayjs().format("MM/DD/YYYY)" ));
        $("#current-temp").text("Temperature: " + response.list[0].main.temp);
        $("#current-hum").text("Humidity: " + response.list[0].main.humidity);
        $("#current-wind").text("Wind: " + response.list[0].wind.speed);
        // ajax for uv index data
        var uvUrl = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
        $.ajax({ url: uvUrl, method: "GET" }).then(function (response) {
            // console.log(response);
            // add uv info to dom
            $("#current-uv").text("UV Index:" + response.value);
        });

        // display 5-day forcast
        var forecastUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=" + apiKey;
        $.ajax({ url: forecastUrl, method: "GET" }).then(function (response) {
            console.log(response)
            // $("#five-day-forecast").remove($("<li>"));
            // create and fill info cards for the five day forecast
            var counter = 0;
            for (var i = 0; i < response.list.length; i++) {
                var date = response.list[i].dt_txt;
                if (date.includes("12:00")) {
                    var cardId = "#day-" + counter;
                    console.log(cardId);
                    var cardEl = $(cardId);
                    console.log(cardEl);
                    cardEl.children(".temp").html("Temperature: "+response.list[i].main.temp + " ºF");
                    cardEl.children(".humidity").html("Humidity: "+ response.list[i].main.humidity + "%");
                    cardEl.children("h3").html(dayjs(date).format("MM/DD/YYYY"));
                    counter++;
                    // var card = $("<li>");
                    // card.attr("class", "day-card");
                    // var dateEl = $("<h3>");
                    // dateEl.html(date);
                    // card.append(dateEl);
                    // var humidityEl = $("<p>");
                    // humidityEl.html("humidity:  " + response.list[i].main.humidity);
                    // var tempEl = $("<p>");
                    // tempEl.html("temperature: " + response.list[i].main.temp + "degF");
                    // card.append(tempEl);
                    // card.append(humidityEl);
                    // $("#five-day-forecast").append(card);
                }
            }
        });
    });
}


$("document").ready(function () {
    // get a city input for city entered in input box
    $("#search-button").click(function (event) {
        var city = $("input").val();
        var query = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey;
        populate(query, city);
    });

    // populate info for city clicked
    $(".city-element").click(function (event) {
        var city = $(this).attr("data-city");
        var query = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey;
        populate(query, city);
    });
});

