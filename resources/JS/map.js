//=======preloader====================================
$(window).on("load", function () {
  $("#preloader").delay(2000).fadeOut("slow");
  $("#overlayer").delay(2000).fadeOut("slow");
});

//=========================================================

//load map with your current location

let map;
let homeLatitude;
let homeLongitude;

navigator.geolocation.getCurrentPosition(function (location) {
  var latlng = new L.LatLng(
    location.coords.latitude,
    location.coords.longitude
  );

  let homeLatitude = location.coords.latitude;
  let homeLongitude = location.coords.longitude;

  map = L.map("map").setView(latlng, 7);

  // let southWest = L.latLng(-90, -180),
  //         northEast = L.latLng(90, 180),
  //         bounds = L.latLngBounds(southWest, northEast);

  // let map = L.map('map', {
  //     attributionControl: false,
  //     maxZoom: 15,
  //     minZoom: 1,
  //     center: bounds.getCenter(),
  //     zoom: 3,
  //     maxBounds: bounds,
  //     maxBoundsViscosity: 0.0
  // });

  const osm = L.tileLayer(
    "https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=d68d08608ba94b76bfb4e2b1ac603e92",
    {
      attribution:
        '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      apikey: "d68d08608ba94b76bfb4e2b1ac603e92>",
      maxZoom: 22,
    }
  );
  osm.addTo(map);

  const geoWorld = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC",
      maxZoom: 16,
    }
  );
  //geoWorld.addTo(map);

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
  //night.addTo(map);

  const googleStreets = L.tileLayer(
    "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }
  );

  //googleStreets.addTo(map);

  const googleSat = L.tileLayer(
    "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
    {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }
  );
  //googleSat.addTo(map);

  //layer controller

  const baseMaps = {
    osm: osm,
    GeoWorld: geoWorld,
    Night: night,
    "Google Streets": googleStreets,
    "Google Satelite": googleSat,
  };

  // var clouds = L.OWM.clouds({showLegend: false, opacity: 0.5, appId: '7d7aba67b5e4defaefe042a6bd4c3753'});
  // var city = L.OWM.current({intervall: 15, lang: 'de'});

  //var overlayMaps = { "Clouds": weather };

  //L.control.layers(baseMaps, overlayMaps).addTo(map);

  let homeIcon = L.icon({
    iconUrl: "images/home.png",
    iconSize: [40, 40],
  });

  L.control.layers(baseMaps).addTo(map);
  L.marker(latlng, { icon: homeIcon }).addTo(map);
  // console.log(map);
  // L.geoJSON(borders).addTo(map);

  //  });

  // var geojsonLayer = new L.GeoJSON.AJAX("countryBorders.geo.json");
  // geojsonLayer.addTo(map);

  // let geojson = L.geoJSON(borders, {
  //   style: function (feature) {
  //     return {
  //       color: "white",
  //       fillColor: "green",
  //     };
  //   },
  //   onEachFeature: function (feature, layer) {
  //     layer.on({
  //       //click:onCountryClick,
  //       mouseover: onCountryHighLight,
  //       mouseout: onCountryMouseOut,
  //     });
  //   },

  //   //layer.bindPopup(`<b>Name:</b>`+feature.properties.name)

  //   // style:{
  //   //   color:'red',
  //   // }
  // }).addTo(map);

  // function onCountryHighLight(e) {
  //   var layer = e.target;

  //   layer.setStyle({
  //     weight: 2,
  //     color: "#666",
  //     dashArray: "",
  //     fillColor: "red",
  //   });

  //   if (!L.Browser.ie && !L.Browser.opera) {
  //     layer.bringToFront();
  //   }

  //   var countryName = e.target.feature.properties.name;
  //   var countryCode = e.target.feature.properties.iso_a2;
  // }

  // Global Variables
  const countriesList = document.getElementById("countries");
  let countries; // will contain "fetched" data
  let lat;
  let lng;
  let capital;

  //let kuku;
  // Event Listeners
  // countriesList.addEventListener("change", event => displayCountryInfo(event.target.value));

  // countriesList.addEventListener("change", newCountrySelection);

  // function newCountrySelection(event) {
  //   displayCountryInfo(event.target.value);
  // }

  // fetch("https://restcountries.eu/rest/v2/all")
  // .then(function(res){
  //   // console.log(res);
  //   return res.json();
  // })
  // .then(function(data){
  //   // console.log(data);
  //   initialize(data);
  // })
  // .catch(function(err){
  //   console.log("Error:", err);
  // });

  fetch("https://restcountries.eu/rest/v2/all")
    .then((res) => res.json())
    .then((data) => initialize(data))
    .catch((err) => console.log("Error:", err));

  function initialize(countriesData) {
    countries = countriesData;
    let options = "";
    // for(let i=0; i<countries.length; i++) {
    //   options += `<option value="${countries[i].alpha3Code}">${countries[i].name}</option>`;
    //   // options += `<option value="${countries[i].alpha3Code}">${countries[i].name} (+${countries[i].callingCodes[0]})</option>`;
    // }
    // countries.forEach(
    //   (country) =>
    //     (options += `<option value="${country.alpha3Code}">${country.name}</option>`)
    // );

    countries.forEach(function (country) {
      if (options == 0) {
        options += `<option selected="true" disabled>Choose a Country</option>`;
      } else {
        options += `<option value="${country.alpha2Code}">${country.name}</option>`;
      }
    });

    // document.getElementById("countries").innerHTML = options;
    // document.querySelector("#countries").innerHTML = options;
    countriesList.innerHTML = options;
    //console.log(countriesList);
    //console.log(countriesList.value);
    // console.log(countriesList.length);
    // console.log(countriesList.selectedIndex);
    // console.log(countriesList[10]);
    // console.log(countriesList[10].value);
    // console.log(countriesList[10].text);
    //countriesList.selectedIndex = Math.floor(Math.random()*countriesList.length);
    // displayCountryInfo(countriesList[countriesList.selectedIndex].value);
  }

  function displayCountryInfo(countryByAlpha3Code) {
    const countryData = countries.find(
      (country) => country.alpha2Code === countryByAlpha3Code
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

  //show borders of selected country
  let bordersToDisplay;
  function handleCountryChange(event) {
    const selectedCountryCode = event.target.value;

    // const selectedCountry = borders.features.find((country) => {
    //   return country.properties.iso_a3=== selectedCountryCode;
    // });

    const selectedCountry = borders.features.filter((country) => {
      return country.properties.iso_a2 === selectedCountryCode;
    });

    // const selectedCountryBorders = {
    //   type: "FeatureCollection",
    //   features: [selectedCountry],
    // };
    bordersToDisplay = L.geoJSON(selectedCountry, {
      //const bordersToDisplay = L.geoJSON(selectedCountryBorders, {
      style: function () {
        return {
          color: "white",
          fillColor: "green",
        };
      },
      onEachFeature: function (_, layer) {
        map.fitBounds(layer.getBounds()); //zoom selected country

        // layer.on({
        //   //click:onCountryClick,
        //   //mouseover: onCountryHighLight,
        //   //mouseout: onCountryMouseOut,
        // });
      },
    });
    // if (bordersToDisplay){
    //   map.removeLayer(bordersToDisplay)
    // }else{

    bordersToDisplay.addTo(map);

    // function onCountryMouseOut(e) {
    //   bordersToDisplay.resetStyle(e.target);
    //   //	$("#countryHighlighted").text("No selection");

    //   var countryName = e.target.feature.properties.name;
    //   var countryCode = e.target.feature.properties.iso_a2;
    //   //callback when mouse exits a country polygon goes here, for additional actions
    // }

    // REST API - Info about the selected country

    displayCountryInfo(selectedCountryCode);
  }

  document.getElementById("countries").addEventListener("change", (e) => {
    //handleCountryChange(e);

    if (bordersToDisplay) {
      bordersToDisplay.clearLayers();
      handleCountryChange(e);
    } else {
      handleCountryChange(e);
      bordersToDisplay.addTo(map);
    }

    //bordersToDisplay.resetStyle()
  });

  //=====================================================================

  // wikipedia link

  $("#countries").change(function () {
    $.ajax({
      url: "resources/PHP/wikipedia.php",
      type: "POST",
      dataType: "json",
      data: {
        lat: lat,
        lng: lng,
      },

      success: function (result) {
        console.log(result);

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
  });
  //=====================================================================

  // Weather

  $("#countries").change(function () {
    $.ajax({
      url: "resources/PHP/openweather.php",
      type: "POST",
      dataType: "json",
      data: {
        capital: capital,
      },

      success: function (result) {
        console.log(result);

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
  });
  //===================================================================

  //exchange rates

  $("#countries").change(function () {
    $.ajax({
      url: "resources/PHP/exchangeRates.php",
      type: "POST",
      dataType: "json",
      // data: {
      //   capital: capital

      // },

      success: function (result) {
        console.log(result);

        if (result.status.name == "ok") {
          //$('#exchange').html(JSON.stringify(result['data'], null, 2));

          $("#date").html(result.data.date);
          //$("#exchange-rates").html(result.data.rates);
          //console.log(result.data.rates)

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
  });
  //===============================================================
  let homeCountry;
  $(document).ready(function() {
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
          console.log(homeCountry);

          //document.getElementById("countries").value=homeCountry;

          // $(function(){
          document.getElementById("countries").value=homeCountry;
          displayCountryInfo(homeCountry)
          // })

          //$('#countries').val('GB')
        }

        //document.getElementById('countries').value=homeCountry;
      },

      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  })
});
