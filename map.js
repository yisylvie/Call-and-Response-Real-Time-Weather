var leaflet = L.map('leaflet', {
    minZoom: 2.2,
    maxZoom: 2.2,
    zoomControl: false,
    dragging: false
}).setView([40, 0], 2.2);

var CartoDB_DarkMatterNoLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
}).addTo(leaflet);

var invisibleMap = L.map('invisibleMap', {
    minZoom: 2.2,
    maxZoom: 2.2,
    zoomControl: false,
    dragging: false
}).setView([40, 0], 2.2);
