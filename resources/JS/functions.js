//===preloader================================
function preloader() {
  $("#preloader").delay(2000).fadeOut("slow");
  $("#overlayer").delay(2000).fadeOut("slow");
}

//===Set the Map=============================================

function setMap() {
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

  L.control
    .zoom({
      position: "bottomright",
    })
    .addTo(map);


  }

  




//============================weather icon======================

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
//======== put marker clusters =============================================
function putMarkerCluster() {
  if (markerCluster) {
    markerCluster.clearLayers();
    markerClusters();
  } //else {
  //markerClusters();
  //}
}

//=====  modals ==========================================================

var modal = document.getElementById("tallModal");
var modal2 = document.getElementById("tallModal2");
var modal3 = document.getElementById("tallModal3");
var modal4 = document.getElementById("tallModal4");


var btn1 = document.getElementById("btn1");
var btn2 = document.getElementById("btn2");
var btn3 = document.getElementById("btn3");
var btn4 = document.getElementById("btn4");

btn1.onclick = function () {
  modal2.style.display = "none";
  modal3.style.display = "none";
  modal4.style.display = "none";

  $("body").removeClass("modal-open");
  $(".modal-backdrop").remove();
};

btn2.onclick = function () {
  modal.style.display = "none";
  modal3.style.display = "none";
  modal4.style.display = "none";

  $("body").removeClass("modal-open");
  $(".modal-backdrop").remove();
};

btn3.onclick = function () {
  modal.style.display = "none";
  modal2.style.display = "none";
  modal4.style.display = "none";


  $("body").removeClass("modal-open");
  $(".modal-backdrop").remove();
};

btn4.onclick = function () {
  modal.style.display = "none";
  modal2.style.display = "none";
  modal3.style.display = "none";


  $("body").removeClass("modal-open");
  $(".modal-backdrop").remove();
};


//===============================================================
