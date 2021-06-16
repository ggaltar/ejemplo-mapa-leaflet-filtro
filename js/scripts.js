// Mapa Leaflet
var mapa = L.map('mapid').setView([9.5, -84.10], 8);


// Definición de capas base
var capa_osm = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', 
  {
    maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(mapa);

// Conjunto de capas base
var capas_base = {
  "OSM": capa_osm
};	    


// Grupo de capas
var grupoPrimates = L.layerGroup().addTo(mapa);


// Control de capas
control_capas = L.control.layers(capas_base).addTo(mapa);	


// Control de escala
L.control.scale().addTo(mapa);


// Configuración de los marcadores
var MarkerOptions = {
  radius: 8,
  fillColor: "#ff7800",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};


// Color de los puntos
function colorPuntos(d) { 
	return d == "Ateles geoffroyi" ? '#FF0000' : 
	d == "Alouatta palliata" ? '#000000' : 
	d == "Saimiri oerstedii" ? '#D17656' : 
	d == "Cebus capucinus" ? '#FFFFFF' :
		'#0000FF'; 
};


// Estilo
function especie_registros (feature) {
		return{
 			radius: 7,
			fillColor: colorPuntos(feature.properties.species), 
			color: colorPuntos(feature.properties.species), 
			weight: 1,
			opacity : 1,
 			fillOpacity : 0.8
	};
};


// Ventana emergente
function popup_registros (feature, layer) {
layer.bindPopup("<div style=text-align:center><h3>"+feature.properties.species+
  "<h3></div><hr><table><tr><td>Provincia: "+feature.properties.stateProvince+
  "</td></tr><tr><td>Fecha: "+feature.properties.eventDate+
  "</td></tr></table>",
{minWidth: 150, maxWidth: 200});				
	};


// Función para seleccionar registros
function especieSelect() {
  var miSelect = document.getElementById("especie").value;

	
  $.getJSON("https://tpb729-desarrollosigweb-2021.github.io/datos/gbif/primates-cr-wgs84.geojson", 

    function(geodata) {
      // Capa de registros individuales
      var capa_carnivora = L.geoJson(geodata, {
      pointToLayer: function (feature, latlng) {
                      return L.circleMarker(latlng, MarkerOptions);
                    },
	  		        filter: function(feature, layer) {	
				  			  if(miSelect != "TODAS")		
							    return (feature.properties.species == miSelect ); 
							  else
							    return true;
							  },	
      style: especie_registros,
      onEachFeature: popup_registros
    });


    grupoPrimates.clearLayers();
    grupoPrimates.addLayer(capa_carnivora);
    control_capas.addOverlay(capa_carnivora, 'Registros individuales de primates');
  });	
};
