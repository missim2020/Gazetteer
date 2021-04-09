//import {capital} from './map.js';

//const capital = require('./module/map');

// const getExchangeRates = exchangeRates();

// function exchangeRates() {
//   return $.ajax({
//     url: "resources/PHP/exchangeRates.php",
//     type: "POST",
//     dataType: "json",
//     // data: {
//     //   capital: capital

//     // },

//     success: function (result) {
//       console.log(result);

//       if (result.status.name == "ok") {
//         //$('#exchange').html(JSON.stringify(result['data'], null, 2));

//         $("#date").html(result.data.date);
//         //$("#exchange-rates").html(result.data.rates);
//         //console.log(result.data.rates)

//         let html = "";
//         for (let rate in result.data.rates) {
//           html += "<p>";

//           html += `${rate}: ${result.data.rates[rate]}`;
//           html += "</p>";
           
//         }
//         $("#exchange-rates").html(html);
//       }
     
//     },

//     error: function (jqXHR, textStatus, errorThrown) {
//       console.log(jqXHR);
//       console.log(textStatus);
//       console.log(errorThrown);
//     },
//   });
// }

function main (){
  getWeather().then(weatherdata => {
    applyWeather(weatherdata)
  })
}

async function main (){
  const weatherData = await getWeather()
}

function getWeather(capital, lat, long) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "resources/PHP/openweather.php",
      type: "POST",
      dataType: "json",
      data: {
        capital: capital,
      },
  
      success: function (result) { 
        if (result.status.name == "ok") {
          resolve(result.data)
        } else {
          reject('go away!')
        }
      },
  
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  
  })
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
        return 
        // $("#city").html(result.data.city.name);
        // $("#weatherIcon").html(
        //   getWeatherIcon(result.data.list[0].weather[0].id)
        // );
        // $("#description").html(result.data.list[0].weather[0].description);
        // $("#temp").html(result.data.list[0].main.temp + "<small> ℃</small>");
        // $("#pressure").html(result.data.list[0].main.pressure + " hPa");
        // $("#humidity").html(result.data.list[0].main.humidity + " %");
        // $("#wind_speed").html(result.data.list[0].wind.speed + " meter/sec");
        // $("#clouds").html(result.data.list[0].clouds.all + " %");

        // let html = "";
        // for (let i = 8; i < result.data.cnt; i += 8) {
        //   html += "<tr>";
        //   html += "<td>";
        //   html += result.data.list[i].dt_txt;
        //   html += "</td>";
        //   html += "<td>";
        //   html += result.data.list[i].weather[0].description;
        //   html += "</td>";
        //   html += "<td>";
        //   html += result.data.list[i].main.temp;
        //   html += "℃";
        //   html += "</td>";
        //   html += "</tr>";
        // }
        // $("#forecast").html(html);
      }
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });

  // function getWeatherIcon(iconId) {
  //   var icon = "";
  //   if (iconId >= 200 && iconId < 300) {
  //     src = "storm.png";
  //   } else if (iconId >= 300 && iconId < 400) {
  //     icon = "drizzle.png";
  //   } else if (iconId >= 500 && iconId < 600) {
  //     icon = "rainy.png";
  //   } else if (iconId >= 600 && iconId < 700) {
  //     icon = "snowflake.png";
  //   } else if (iconId >= 700 && iconId < 800) {
  //     icon = "atmosphere.png";
  //   } else if (iconId == 800) {
  //     icon = "sun.png";
  //   } else if (iconId > 800 && iconId <= 802) {
  //     icon = "clouds-and-sun.png";
  //   } else if (iconId >= 803 && iconId <= 804) {
  //     icon = "cloud.png";
  //   }
  //   document.getElementById("icon").src = "images/" + icon;
  // }
}

// const getWeather = weather();






var testFunc = (str) => console.log(str)