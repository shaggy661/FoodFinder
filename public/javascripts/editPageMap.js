mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: restaurant.geometry.coordinates,
    zoom: 10
});

map.addControl(new mapboxgl.NavigationControl());

let newMarker = new mapboxgl.Marker()
    .setLngLat(restaurant.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${restaurant.title}</h3><p>${restaurant.location}</p>`
            )
    )
    .addTo(map);

    let coordinates = 'random';
    alert(coordinates);

    map.on('click', (e) => {
        if(newMarker){
            newMarker.remove();
        }
        coordinates = e.lngLat;
        
        newMarker = new mapboxgl.Marker()
            .setLngLat(coordinates)
            .setPopup(
                new mapboxgl.Popup({ offset: 25 })
                    .setHTML(
                        `<h3>${restaurant.title}</h3><p>${restaurant.location}</p>`
                    )
            )
            .addTo(map);    
    })

    // work in progress thelw na parw to lnglat ap to neo marker kai na to balw sto edit page sti forma