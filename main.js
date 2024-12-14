document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "ea5f02ca763d41b89ab113534241212";
    const forecastTable = document.getElementById("forecast-table");
    const searchInput = document.getElementById("search");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }

    function showPosition(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeatherByCoords(lat, lon);
    }

    function showError(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                alert("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred.");
                break;
        }
    }

    function getWeatherByCoords(lat, lon) {
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=3`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                displayWeather(data);
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
            });
    }

    function getWeatherByCity(city) {
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                displayWeather(data);
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
            });
    }

    function displayWeather(data) {
        const locationName = data.location.name;
        const forecast = data.forecast.forecastday;
        let output = '<div class="container my-4"><div class="row">';

        forecast.forEach((day, index) => {
            console.log(day);
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            const dayMonth = date.getDate() + ' ' + date.toLocaleDateString('en-US', { month: 'long' });
            const tempC = day.day.avgtemp_c;
            const tempF = (tempC * 9/5) + 32;

            if (index === 0) {
                output += `
                    <div class="col-lg-4 py-3">
                        <div class="forecast-box first-day bg-light p-4">
                            <div class="w-date text-center">
                               <h6>${dayName}</h6> 
                               <h6>${dayMonth}</h6>
                            </div>
                            <h4 class="py-2">${locationName}</h4>
                            <div class="temp">
                                <h1>${tempC}°C </h1>
                           </div>
                            <div class="icon-text">
                             <img src="${day.day.condition.icon}" alt="Weather icon"> 
                             <p>${day.day.condition.text}</p> 
                            </div>
                            <div class="statics py-2">
                               <span><img src="/images/umbrella.png" alt="">20%</span>
                               <span><img src="/images/wind.png" alt="">18km/hr</span>
                               <span><img src="/images/compass.png" alt="">East</span>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                output += `
                    <div class="col-lg-4 py-3">
                        <div class="forecast-box other-day bg-light p-4 text-center">
                            <div class="w-date">
                               <h6>${dayName}</h6> 
                               <h6>${dayMonth}</h6>
                            </div>
                            <img src="${day.day.condition.icon}" alt="Weather icon" class="pt-5">
                            <div class="temp py-2">
                                <h3>${tempC}°C </h3>
                                <h6>${tempF.toFixed(1)}°F</h6>
                            </div>
                            <p class="condition">${day.day.condition.text}</p>
                        </div>
                    </div>
                `;
            }
        });

        output += '</div></div>';
        forecastTable.innerHTML = output;
    }

    searchInput.addEventListener("input", function() {
        const city = searchInput.value;
        if (city) {
            getWeatherByCity(city);
        }
    });
});
