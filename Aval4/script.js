
if("geolocation" in navigator){
        let mapa;
        let endereco = document.getElementById('endereco');
        let distancia = document.getElementById('distancia');
        let latitude = document.getElementById('latitude');
        let longitude = document.getElementById('longitude');
        let casa = { 
            lat: -23.69052, 
            lng: -46.65896
        };


        navigator.geolocation.watchPosition( (position) => {
            let request = new XMLHttpRequest();
            let posicao = {
                lat: position.coords.latitude, 
                lng: position.coords.longitude
            };
            latitude.innerText = posicao.lat;
            longitude.innerText = posicao.lng;
            let pontosDistancia = getDistanceBetweenTwoPoints(posicao, casa);
            distancia.innerText = `Distância da sua casa ${pontosDistancia.toFixed(3)}m`;
        
            console.log(pontosDistancia);
            request.open("GET", "http://dev.virtualearth.net/REST/v1/Locations/" + posicao.lat + ',' + posicao.lng + "?key=AqXl2BNPTyJh84_liXdJHjrJt9T3sQokKI8AX-n5-JAvoFuEBLvHUSRnMEmhmYKn", true);
            request.addEventListener("readystatechange", function(){
                if(request.status == 200 && request.readyState == 4){
                    let responseJSON = JSON.parse(request.responseText);
                    endereco.innerText = responseJSON.resourceSets[0].resources[0].name;
                }
            });
            request.send();
            
            iniciaMapa(posicao.lat, posicao.lng);

        },  function(error){
                console.log('error', error.message);
        });
}



function getDistanceBetweenTwoPoints(cord1, cord2) {
    if (cord1.lat == cord2.lat && cord1.lng == cord2.lng)
        return 0;

    const radlat1  = (Math.PI * cord1.lat) / 180;
    const radlat2  = (Math.PI * cord2.lat) / 180;
    const theta    = cord1.lng - cord2.lng;
    const radtheta = (Math.PI * theta) / 180;

    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

    if (dist > 1)
        dist = 1;

    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344;

    return dist;
}

function iniciaMapa(lat, lng) {
    let navigationBarMode = Microsoft.Maps.NavigationBarMode;
    let config = {
        credentials: 'AqXl2BNPTyJh84_liXdJHjrJt9T3sQokKI8AX-n5-JAvoFuEBLvHUSRnMEmhmYKn',
        center: new Microsoft.Maps.Location(lat, lng),
        zoom: 12,
        navigationBarMode: navigationBarMode.compact,
        supportedMapTypes: [
            Microsoft.Maps.MapTypeId.road, 
            Microsoft.Maps.MapTypeId.aerial, 
            Microsoft.Maps.MapTypeId.grayscale, 
            Microsoft.Maps.MapTypeId.canvasLight
        ]
    };
    mapa = new Microsoft.Maps.Map('#mapa', config);

    let ponto = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(lat, lng), {
        icon: 'gps.png',
    });
    
    let layer = new Microsoft.Maps.Layer();
    layer.add(ponto);
    mapa.layers.insert(layer);
}
