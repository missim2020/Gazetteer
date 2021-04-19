let map;
let homeLatitude;
let homeLongitude;
let countries;
let lat;
let lng;
let capital;
let bordersToDisplay;
let homeCountry;
let countryData;
let latlng;
let countriesList;
let geojson;


//====get location ==================================
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showLocation, showError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

getLocation();

// ===Info about the country ===========================

function initialize(countriesData) {
  countriesList = document.getElementById("countries");

  countries = countriesData;

  let options = "";

  countries.forEach(function (country) {
    if (options == 0) {
      options += `<option selected="true" disabled>Choose a Country</option>`;
    } else {
      options += `<option value="${country.alpha2Code}">${country.name}</option>`;
    }
  });

  countriesList.innerHTML = options;
}

function displayCountryInfo(countryByAlpha2Code) {
  countryData = countries.find(
    (country) => country.alpha2Code === countryByAlpha2Code
  );
  document.querySelector("#flag-container img").src = countryData.flag;
  document.querySelector(
    "#flag-container img"
  ).alt = `Flag of ${countryData.name}`;
  document.getElementById("country-name").innerHTML = countryData.name;
  document.getElementById("capital").innerHTML = countryData.capital;
  document.getElementById(
    "dialing-code"
  ).innerHTML = `+${countryData.callingCodes[0]}`;
  document.getElementById(
    "population"
  ).innerHTML = countryData.population.toLocaleString("en-US");
  document.getElementById("currencies").innerHTML = countryData.currencies
    .filter((c) => c.name)
    .map((c) => `${c.name} (${c.code})`)
    .join(", ");
  document.getElementById("region").innerHTML = countryData.region;

  document.getElementById("area").innerHTML = `${countryData.area} sq.km`;
  document.getElementById("timeZone").innerHTML = countryData.timezones;
  document.getElementById("borders").innerHTML = countryData.borders;
  document.getElementById("languages").innerHTML = countryData.languages
    .filter((l) => l.name)
    .map((l) => l.name);

  lat = countryData.latlng[0];
  lng = countryData.latlng[1];
  capital = countryData.capital;
}

//======highlighting the country==================================
function highlightingCountry() {
  geojson = L.geoJSON(borders, {
    style: function () {
      return {
        color: "transparent",
        fillColor: "transparent",
      };
    },

    onEachFeature: function (_, layer) {
      layer.on({
        mousedown: onCountryClick,
      });
    },
  }).addTo(map);
}

function onCountryClick(e) {
  geojson.resetStyle();
  bordersToDisplay.clearLayers();
  let clickedCountryName = e.target.feature.properties.iso_a2;

  document.getElementById("countries").value = clickedCountryName;
  showModal();

  let layer = e.target;

  layer.setStyle({
    weight: 2,
    color: "#00B6BC",
    fillColor: "#71D5E4",
  });

  displayCountryInfo(clickedCountryName);
  //exchangeRates();
  wikipedia(clickedCountryName);
  weather(clickedCountryName);

  //layer.bindPopup("<h3>" + countryData.name + "</h3>");
}

//====show borders of selected country===============================

function handleCountryChange(selectedCountryCode) {
  let selectedCountry = borders.features.filter((country) => {
    return country.properties.iso_a2 === selectedCountryCode;
  });

  bordersToDisplay = L.geoJSON(selectedCountry, {
    style: function () {
      return {
        color: "white",
        fillColor: "green",
      };
    },
    onEachFeature: function (_, layer) {
      map.fitBounds(layer.getBounds()); //zoom selected country
    },
  });

  bordersToDisplay.addTo(map);
  displayCountryInfo(selectedCountryCode);
}

document.getElementById("countries").addEventListener("change", (e) => {
  geojson.resetStyle();
  if (bordersToDisplay) {
    bordersToDisplay.clearLayers();
    handleCountryChange(e.target.value);
  } else {
    handleCountryChange(e.target.value);
    bordersToDisplay.addTo(map);
  }
});

//==== wikipedia link =========================================

function wikipedia() {
  $.ajax({
    url: "resources/PHP/wikipedia.php",
    type: "POST",
    dataType: "json",
    data: {
      lat: lat,
      lng: lng,
    },

    success: function (result) {
      //console.log(result);

      if (result.status.name == "ok") {
        $("#summary").html(result.data[0].summary);
        $("#link")
          .html(result.data[0].wikipediaUrl)
          .attr("href", "https://" + result.data[0].wikipediaUrl);
      }
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

// ==== Weather =========================================

function weather() {
  $.ajax({
    url: "resources/PHP/openweather.php",
    type: "POST",
    dataType: "json",
    data: {
      capital: capital,
    },

    success: function (result) {
      //console.log(result);

      if (result.status.name == "ok") {
        $("#city").html(result.data.city.name);
        $("#weatherIcon").html(
          getWeatherIcon(result.data.list[0].weather[0].id)
        );
        $("#description").html(result.data.list[0].weather[0].description);
        $("#temp").html(result.data.list[0].main.temp + "<small> ℃</small>");
        $("#pressure").html(result.data.list[0].main.pressure + " hPa");
        $("#humidity").html(result.data.list[0].main.humidity + " %");
        $("#wind_speed").html(result.data.list[0].wind.speed + " meter/sec");
        $("#clouds").html(result.data.list[0].clouds.all + " %");

        let html = "";
        for (let i = 8; i < result.data.cnt; i += 8) {
          html += "<tr>";
          html += "<td>";
          html += result.data.list[i].dt_txt;
          html += "</td>";
          html += "<td>";
          html += result.data.list[i].weather[0].description;
          html += "</td>";
          html += "<td>";
          html += result.data.list[i].main.temp;
          html += "℃";
          html += "</td>";
          html += "</tr>";
        }
        $("#forecast").html(html);
      }
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });

  getWeatherIcon();
}
//==== exchange rates =============================================

//   function exchangeRates() {
//     $.ajax({
//       //url: "resources/PHP/exchangeRates.php",
//       type: "POST",
//       dataType: "json",
//       success: function (result) {
//         //console.log(result);

//         if (result.status.name == "ok") {
//           $("#date").html(result.data.date);

//           let html = "";
//           for (let rate in result.data.rates) {
//             html += "<p>";

//             html += `${rate}: ${result.data.rates[rate]}`;
//             html += "</p>";
//           }
//           $("#exchange-rates").html(html);
//         }
//       },

//       error: function (jqXHR, textStatus, errorThrown) {
//         console.log(jqXHR);
//         console.log(textStatus);
//         console.log(errorThrown);
//       },
//     });
//   }

//   //===============================================================

function onLoad() {
  $.ajax({
    url: "resources/PHP/findPlaceNearby.php",
    type: "GET",
    dataType: "json",
    data: {
      homeLatitude: homeLatitude,
      homeLongitude: homeLongitude,
    },

    success: function (result) {
      if (result.status.name == "ok") {
        homeCountry = result.data.geonames[0].countryCode;

        console.log(result);

        fetch("https://restcountries.eu/rest/v2/all")
          .then((res) => res.json())
          .then((data) => {
            initialize(data);

            document.getElementById("countries").value = homeCountry;

            displayCountryInfo(homeCountry);
            wikipedia();
            weather();
            handleCountryChange(homeCountry);
            //exchangeRates();
          })
          .catch((err) => console.log("Error:", err));
      }
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

//======================================================================
//$(document).ready(onLoad);

$(document).ready(function () {
  preloader();

  onLoad();
  //getLocation();
  showModal();
});

$("#countries").change(function () {
  //exchangeRates();
  wikipedia();
  weather();
});

//===================================================================

function showLocation(location) {
  //navigator.geolocation.getCurrentPosition(function (location) {
  latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);
  homeLatitude = location.coords.latitude;
  homeLongitude = location.coords.longitude;

  //map = L.map("map")

  map = L.map("map", {
    zoomControl: false,
  }).setView(latlng, 7);

  setMap();

  //displayCountryInfo()
  //handleCountryChange()
  highlightingCountry();
  //onCountryClick()
  onLoad();
}

function showError(error) {
  if (error.PERMISSION_DENIED) {
    homeCountry = "GB";
    latlng = [51.5482, -0.0763];
    homeLatitude = 51.5482;
    homeLongitude = -0.0763;

    map = L.map("map", {
      zoomControl: false,
    });

    setMap();
    highlightingCountry();
    onLoad();

  } else if (error.POSITION_UNAVAILABLE) {
    alert("Location information is unavailable.");
  } else if (error.TIMEOUT) {
    alert("The request to get user location timed out.");
  } else {
    alert("An unknown error occurred.");
  }
}

// getLocation();
//=================marker Clusters=================

// let icon = L.icon({
//   iconUrl: "images/icon1.png",
//   iconSize: [20, 20],
// });

// //let markerClusters = L.markerClusterGroup();
 
// for ( var i = 0; i < markers.length; ++i )
// {
//   // var popup = markers[i].name +
//   //             '<br/>' + markers[i].city +
//   //             '<br/><b>IATA/FAA:</b> ' + markers[i].iata_faa +
//   //             '<br/><b>ICAO:</b> ' + markers[i].icao +
//   //             '<br/><b>Altitude:</b> ' + Math.round( markers[i].alt * 0.3048 ) + ' m' +
//   //             '<br/><b>Timezone:</b> ' + markers[i].tz;
 
//   var m = L.marker( [markers[i].latitude_deg, markers[i].longitude_deg], {icon: icon} )
//                   //.bindPopup( popup );
 
//   //markerClusters.addLayer( m );
// }
 
// //map.addLayer( markerClusters );