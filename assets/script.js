document.addEventListener('DOMContentLoaded', function () {
    let searchForm = document.getElementById('search-form');
    let ipInput = document.getElementById('ip');
    let map = L.map('map').setView([0, 0], 13);
    let ipData = document.getElementById('stuff');
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  
    function handleSearch(event) {
        event.preventDefault();
        var userinput = ipInput.value;
  
        let ipAPI = `https://geo.ipify.org/api/v2/country,city?apiKey=at_UEFQ8qmFjNrSXUQLcz0hMaXHzaonF&ipAddress=${userinput}`;
  
        fetch(ipAPI)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Invalid IP or IP not found');
                }
                return response.json();
            })
            .then(function (data) {
                let lat = data.location.lat;
                let lon = data.location.lng;
                let ipAddress = data.ip;
                let location = data.location.city + ', ' + data.location.region + ', ' + data.location.postalCode;
                let isp = data.isp;


                ipData.innerHTML = `
                <div class="col-sm-6">
                <div class="card">
                  <div class="card-body">
                    <p class="card-title"><strong class='hello'>IP:</strong> ${ipAddress}</p>
                    <p class="card-text"><strong class='hello'>Location:</strong> ${location}</p>
                    <p class="card-text"><strong class='hello'>ISP:</strong> ${isp}</p>
                  </div>
                </div>
              </div>
              `
                // Update the map view to the new lat and lon
                map.setView([lat, lon], 13);

                // Clear existing markers from the map
                map.eachLayer(function (layer) {
                    if (layer instanceof L.Marker) {
                        map.removeLayer(layer);
                    }
                });

                // Create a marker at the new lat and lon
                L.marker([lat, lon]).addTo(map)
                    .bindPopup(`IP Address: ${userinput}<br>Location: ${data.location.city}, ${data.location.country}`);
            })
            .catch(function (error) {
                console.error(error);
            });

    }
  
    searchForm.addEventListener('submit', handleSearch);
});
