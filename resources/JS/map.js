let map;
let homeLatitude;
let homeLongitude;
let countries;
let bordersToDisplay;
let latlng;
let geojson;
let markerCluster;
let options;

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

function listOfCountries() {
  $.getJSON("resources/PHP/listOfCountries.php", function (data) {
    //console.log(data)
    const countriesList = document.getElementById("countries");
    options = "";

    data.map(function (feature) {
      //console.log(feature.properties.iso_a2)
      if (options == 0) {
        options += `<option selected="true" disabled>Choose a Country</option>`;
      } else {
        options += `<option value="${feature.code}">${feature.name}</option>`;
      }
    });

    countriesList.innerHTML = options;

    var firstOption = $("#countries option:first");
    var nextOptions = $("#countries option:not(:first)").sort(function (a, b) {
      return a.text == b.text ? 0 : a.text < b.text ? -1 : 1;
    });
    $("#countries").html(nextOptions).prepend(firstOption);
  });

  // $.getJSON("resources/PHP/borders.php", function (data) {
  //   const countriesList = document.getElementById("countries");
  //   options = "";

  //   data.features.map(function (feature) {
  //     //console.log(feature.properties.iso_a2)
  //     if (options == 0) {
  //       options += `<option selected="true" disabled>Choose a Country</option>`;
  //     } else {
  //       options += `<option value="${feature.properties.iso_a2}">${feature.properties.name}</option>`;
  //     }
  //   });

  //   countriesList.innerHTML = options;

  //   var firstOption = $("#countries option:first");
  //   var nextOptions = $("#countries option:not(:first)").sort(function (a, b) {
  //     return a.text == b.text ? 0 : a.text < b.text ? -1 : 1;
  //   });
  //   $("#countries").html(nextOptions).prepend(firstOption);
  // });
}

function initialize(countriesData) {
  countries = countriesData;
}

function displayCountryInfo(countryByAlpha2Code) {
  let countryData = countries.find(
    (country) => country.alpha2Code === countryByAlpha2Code
  );
  //console.log(countryData);
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

  return {
    lat: countryData.latlng[0],
    lng: countryData.latlng[1],
    capital: countryData.capital,
    currency: countryData.currencies[0].code,
  };
}

//====show borders of selected country===============================

// var value
// let selectedCountry
let value;

//console.log(value)
function handleCountryChange(selectedCountryCode) {
  value = $("#countries").val();

  $.ajax({
    url: "resources/PHP/borders.php",
    type: "POST",
    //dataType:'json',
    data: {
      value: value,
    },
    success: function (country) {
      //console.log(country)
    
      bordersToDisplay = L.geoJSON(JSON.parse(country), {
        
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
//debugger
      bordersToDisplay.addTo(map);
      const { currency, capital, lat, lng } = displayCountryInfo(
        selectedCountryCode
      );
      //weather(capital)
      wikipedia(lat, lng);
      //exchangeRates(currency)
    },
  });

  // $.getJSON("resources/PHP/borders.php", function (data) {
  //    selectedCountry = data.features.filter((country) => {
  //     return country.properties.iso_a2 === selectedCountryCode;

  //   });

  //   console.log(selectedCountry)
  //   debugger

  //   bordersToDisplay = L.geoJSON(selectedCountry, {
  //     style: function () {
  //       return {
  //         color: "white",
  //         fillColor: "green",
  //       };
  //     },
  //     onEachFeature: function (_, layer) {
  //       map.fitBounds(layer.getBounds()); //zoom selected country
  //     },
  //   });

  //   bordersToDisplay.addTo(map);
  //   const { currency, capital, lat, lng } = displayCountryInfo(selectedCountryCode);
  //   //weather(capital)
  //   wikipedia(lat, lng);
  //   //exchangeRates(currency)
  // });
}

//
document.getElementById("countries").addEventListener("change", (e) => {
  //geojson.resetStyle();
  if (bordersToDisplay) {
    bordersToDisplay.clearLayers();
    handleCountryChange(e.target.value);
  } else {
    handleCountryChange(e.target.value);
    bordersToDisplay.addTo(map);
  }
});

//======highlighting the country==================================

// function highlightingCountry() {

//   $.getJSON("resources/PHP/borders.php", function (data) {

//     geojson = L.geoJSON(data, {
//       style: function () {
//         return {
//           color: "transparent",
//           fillColor: "transparent",
//         };
//       },

//       onEachFeature: function (_, layer) {
//         layer.on({
//           mousedown: onCountryClick,
//         });
//       },
//     }).addTo(map);
//   });
// }




function highlightingCountry() {

let kuku = document.getElementById('countries');
  let mumu=kuku.value;
  console.log(mumu)

  // //value = $("#countries").val();
  // $.ajax({
  //   //url: "resources/PHP/borders.php",
  //   url: "resources/PHP/highlightedCountryBorders.php",
  //   type: "POST",
  //   //dataType:'json',
  //   data: {
  //     values: values,
  //   },
  //   success: function (countries) {
  //     console.log(countries)
       
  //   // success: function (countries) {
  //   //   console.log(countries)

  $.getJSON("resources/PHP/highlightedCountryBorders.php", function (data) {

    geojson = L.geoJSON(data, {
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
    });
  //});
};

let clickedCountryName;
function onCountryClick(e) {
  

  

  geojson.resetStyle();
  bordersToDisplay.clearLayers();
  //clickedCountryName = e.target.value;
  clickedCountryName = e.target.feature.properties.iso_a2;
  document.getElementById("countries").value = clickedCountryName;
  
  
  console.log(clickedCountryName)
  // showModal();

  let layer = e.target;

  layer.setStyle({
    weight: 2,
    color: "#00B6BC",
    fillColor: "#71D5E4",
  });

  const { currency, capital, lat, lng } = displayCountryInfo(
    clickedCountryName
  );
  //exchangeRates(currency);
  wikipedia(lat, lng);
  //weather(capital);

  if (markerCluster) {
    markerCluster.clearLayers();
    markerClusters();
  } else {
    markerClusters();
  }
}

//==== wikipedia link =========================================

function wikipedia(lat, lng) {
  $.ajax({
    url: "resources/PHP/wikipedia.php",
    type: "POST",
    dataType: "json",
    data: {
      lat,
      lng,
    },

    success: function (result) {
      //console.log(result);

      if (result.status.name == "ok") {
        const countryInfo = result.data[0];
        $("#summary").html(countryInfo ? countryInfo.summary : "-");
        $("#link")
          .html(countryInfo ? countryInfo.wikipediaUrl : "-")
          .attr(
            "href",
            countryInfo ? "https://" + countryInfo.wikipediaUrL : "#"
          );
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

function weather(capital) {
  $.ajax({
    url: "resources/PHP/openweather.php",
    type: "POST",
    dataType: "json",
    data: {
      capital,
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

function exchangeRates(currency) {
  $.ajax({
    url: "resources/PHP/exchangeRates.php",
    type: "POST",
    dataType: "json",
    data: {
      base: currency,
    },

    success: function (result) {
      //console.log(result);

      if (result.status.name == "ok") {
        $("#currencyName").html(currency);
        $("#date").html(result.data.date);

        let html = "";
        for (let rate in result.data.rates) {
          html += "<tr>";
          html += "<td>";
          html += rate;
          html += "</td>";
          html += "<td>";
          html += result.data.rates[rate];
          html += "</td>";
          html += "</tr>";
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

//=================================================================

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
        let homeCountry = result.data.geonames[0].countryCode;

        //console.log(result);
        listOfCountries();

        fetch("resources/PHP/getCountryInfo.php")
          .then((res) => res.json())
          .then((result) => {
            initialize(result.data);
            //console.log(data)

            document.getElementById("countries").value = homeCountry;

            const { currency, capital, lat, lng } = displayCountryInfo(
              homeCountry
            );
            wikipedia(lat, lng);
            //weather(capital);
            //exchangeRates(currency);
            //handleCountryChange(homeCountry)

            if (bordersToDisplay) {
              bordersToDisplay.clearLayers();
              handleCountryChange(homeCountry);
            } else {
              handleCountryChange(homeCountry);
              //bordersToDisplay.addTo(map);
            }

            if (markerCluster) {
              markerCluster.clearLayers();
              markerClusters(homeCountry);
            } else {
              markerClusters();
            }
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
});
// Get the modal
var modal = document.getElementById("tallModal");
var modal2 = document.getElementById("tallModal2");
var modal3 = document.getElementById("tallModal3");
var body = document.querySelector("body");

// Get the button that opens the modal
var btn1 = document.getElementById("btn1");
var btn2 = document.getElementById("btn2");
var btn3 = document.getElementById("btn3");

// $('#tallModal').on('shown.bs.modal', function (e) {
//   $('body').removeClass('modal-open');
//   $('#tallModal2').removeAttr("style").hide();
//   $('#tallModal3').removeAttr("style").hide();

//   //$('#tallModal2').addClass('modal-open');
// })

// $('#tallModal2').on('shown.bs.modal', function (e) {
//   $('body').removeClass('modal-open');
//   $('#tallModal').removeAttr("style").hide();
//   $('#tallModal3').removeAttr("style").hide();

//   //$('#tallModal2').addClass('modal-open');
// })

// $('#tallModal3').on('shown.bs.modal', function (e) {
//   $('body').removeClass('modal-open');
//   //$('#tallModal2').addClass('modal-open');
//   $('#tallModal').removeAttr("style").hide();
//   $('#tallModal2').removeAttr("style").hide();
// })

// $('#allModal').on('hidden.bs.modal', function (e) {
//   $('#tallModal2').removeClass('modal-open');
// })

btn1.onclick = function () {
  // modal.style.display = "block";
  modal2.style.display = "none";
  // modal2.classList.remove = "show";
  modal3.style.display = "none";
};

btn2.onclick = function () {
  // modal2.style.display = "block";
  modal.style.display = "none";
  // body.classList.remove("mumu");
  modal3.style.display = "none";
};

btn3.onclick = function () {
  // modal3.style.display = "block";
  modal.style.display = "none";
  modal2.style.display = "none";
};

//showModal();
//hideLoadingModal();

$("#countries").change(function () {
  //exchangeRates();
  //wikipedia();
  //weather();
  if (markerCluster) {
    markerCluster.clearLayers();
    markerClusters();
  } else {
    markerClusters();
  }
});

//===================================================================

function showLocation(location) {
  latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);
  homeLatitude = location.coords.latitude;
  homeLongitude = location.coords.longitude;

  map = L.map("map", {
    zoomControl: false,
  }).setView(latlng, 7);

  setMap();
  highlightingCountry();
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
//=================marker Clusters=================

function markerClusters() {
  let icon = L.icon({
    iconUrl: "images/icon1.png",
    iconSize: [40, 40],
  });

  markerCluster = L.markerClusterGroup();

  let sel = document.getElementById("countries");
  let text = sel.options[sel.selectedIndex].text;
  console.log(text)

  $.ajax({
    url: "resources/PHP/airports.php",
    type: "POST",
    //dataType:'json',
    data: {
      text: text,
    },
    success: function(airports_list) {
      //console.log(airports_list)
      airports_list=JSON.parse(airports_list)
  for (var i = 0; i < airports_list.length; i++) {
    //if (airport[i].country == text) {
      var popup = airports_list[i].name + "<br/><b>City:</b> " + airports_list[i].city;
  //console.log(airports_list[i].name)
  //debugger
      let m = L.marker([airports_list[i].lat, airports_list[i].lng], {
        icon: icon,
      }).bindPopup(popup);
     
      markerCluster.addLayer(m);
    }

    map.addLayer(markerCluster);
    
  }
  //}
 
});

};











//   $.getJSON("resources/PHP/airports.php", function (data) {
//     //console.log(data)
//     for (var i = 0; i < data.length; i++) {
//       if (data[i].country == text) {
//         var popup = data[i].name + "<br/><b>City:</b> " + data[i].city;

//         let m = L.marker([data[i].lat, data[i].lng], {
//           icon: icon,
//         }).bindPopup(popup);

//         markerCluster.addLayer(m);
//       }

//       map.addLayer(markerCluster);
//     }
//   });
// }
