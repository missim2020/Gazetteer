//=======preloader====================================
$(window).on("load", function () {
  $("#preloader").delay(2000).fadeOut("slow");
  $("#overlayer").delay(2000).fadeOut("slow");
});

//=========================================================

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

//====load map with your current location====================

navigator.geolocation.getCurrentPosition(function (location) {
  var latlng = new L.LatLng(
    location.coords.latitude,
    location.coords.longitude
  );
  homeLatitude = location.coords.latitude;
  homeLongitude = location.coords.longitude;

  map = L.map("map").setView(latlng, 7);

  const geoWorld = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC",
      maxZoom: 16,
    }
  );
  geoWorld.addTo(map);

  const osm = L.tileLayer(
    "https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=d68d08608ba94b76bfb4e2b1ac603e92",
    {
      attribution:
        '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      apikey: "d68d08608ba94b76bfb4e2b1ac603e92>",
      maxZoom: 22,
    }
  );

  const night = L.tileLayer(
    "https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}",
    {
      attribution:
        'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
      bounds: [
        [-85.0511287776, -179.999999975],
        [85.0511287776, 179.999999975],
      ],
      minZoom: 1,
      maxZoom: 8,
      format: "jpg",
      time: "",
      tilematrixset: "GoogleMapsCompatible_Level",
    }
  );

  const googleStreets = L.tileLayer(
    "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }
  );

  const googleSat = L.tileLayer(
    "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
    {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }
  );

  //============layer controller=======================================

  const baseMaps = {
    osm: osm,
    GeoWorld: geoWorld,
    Night: night,
    "Google Streets": googleStreets,
    "Google Satelite": googleSat,
  };

  let homeIcon = L.icon({
    iconUrl: "images/home.png",
    iconSize: [40, 40],
  });

  L.control.layers(baseMaps).addTo(map);
  L.marker(latlng, { icon: homeIcon }).addTo(map);

  // ===Info about the country ===========================
  
  const countriesList = document.getElementById("countries");

  function initialize(countriesData) {
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
    document.getElementById(
      "languages"
    ).innerHTML = countryData.languages
      .filter((l) => l.name)
      .map((l) => l.name);

    lat = countryData.latlng[0];
    lng = countryData.latlng[1];
    capital = countryData.capital;
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

  //======highlighting country==================================

  let geojson = L.geoJSON(borders, {
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

  function onCountryClick(e) {
    geojson.resetStyle();
    bordersToDisplay.clearLayers();
    let clickedCountryName = e.target.feature.properties.iso_a2;

    let layer = e.target;

    layer.setStyle({
      weight: 2,
      color: "#00B6BC",
      fillColor: "#71D5E4",
    });

    displayCountryInfo(clickedCountryName);
    exchangeRates();
    wikipedia(clickedCountryName);
    weather(clickedCountryName);

    layer.bindPopup("<h3>" + countryData.name + "</h3>");
  }

  //=====================================================================

  // wikipedia link

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

  //=====================================================================

  // Weather

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

    function getWeatherIcon(iconId) {
      var icon = "";
      if (iconId >= 200 && iconId < 300) {
        src = "storm.png";
      } else if (iconId >= 300 && iconId < 400) {
        icon = "drizzle.png";
      } else if (iconId >= 500 && iconId < 600) {
        icon = "rainy.png";
      } else if (iconId >= 600 && iconId < 700) {
        icon = "snowflake.png";
      } else if (iconId >= 700 && iconId < 800) {
        icon = "atmosphere.png";
      } else if (iconId == 800) {
        icon = "sun.png";
      } else if (iconId > 800 && iconId <= 802) {
        icon = "clouds-and-sun.png";
      } else if (iconId >= 803 && iconId <= 804) {
        icon = "cloud.png";
      }
      document.getElementById("icon").src = "images/" + icon;
    }
  }

  //===================================================================

  //exchange rates

  function exchangeRates() {
    $.ajax({
      url: "resources/PHP/exchangeRates.php",
      type: "POST",
      dataType: "json",
      success: function (result) {
        //console.log(result);

        if (result.status.name == "ok") {
          $("#date").html(result.data.date);

          let html = "";
          for (let rate in result.data.rates) {
            html += "<p>";

            html += `${rate}: ${result.data.rates[rate]}`;
            html += "</p>";
          }
          $("#exchange-rates").html(html);
        }
      },

      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  }

  //===============================================================

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

          fetch("https://restcountries.eu/rest/v2/all")
            .then((res) => res.json())
            .then((data) => {
              initialize(data);

              document.getElementById("countries").value = homeCountry;

              displayCountryInfo(homeCountry);
              wikipedia();
              
              weather();
              
              handleCountryChange(homeCountry);
              exchangeRates();
              
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
  $(document).ready(onLoad);

  $("#countries").change(function () {
    exchangeRates();
    wikipedia();
    weather();
  });
});
