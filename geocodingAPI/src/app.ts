import axios from 'axios';

const form = document.querySelector('form'); 
const addressInput = document.getElementById('address') as HTMLInputElement;

const GOOGLE_API_KEY = 'AIzaSyA9jwpDqxuUBOiUEE3l2oCuaYE6L0ClAXk';

declare var google: any;

type GoogleGeocodingResponse = {
    results: { geometry: { location: { lat: number, lng: number } } }[];
    status: 'OK' | 'ZERO_RESULTS';
}

function searchAddressHandler(event: Event) {
    event.preventDefault();
    const enteredAddress = addressInput.value;

    try {
        axios.get<GoogleGeocodingResponse>(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enteredAddress)}&key=${GOOGLE_API_KEY}`)
            .then(response => {
                if (response.data.status !== 'OK') {
                    throw new Error('Could not find a location');
                }
                const coordinate = response.data.results[0].geometry.location;

                const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
                    center: coordinate,
                    zoom: 10
                });

                new google.maps.Marker({ position: coordinate, map: map });
            })
            .catch(err => { 
                alert(err.message);
                console.log(err);
            });
    } catch (err) { 
        alert('Something went wrong!');
        console.error(err);
    }
}
form?.addEventListener('submit', searchAddressHandler);
